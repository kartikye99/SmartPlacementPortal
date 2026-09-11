import { buildUrl } from '../api';

const INPUT_SAMPLE_RATE = 16000;
const OUTPUT_SAMPLE_RATE = 24000;

const toWebSocketUrl = () => {
  const httpUrl = new URL(buildUrl('/interviews/live'), window.location.origin);
  httpUrl.protocol = httpUrl.protocol === 'https:' ? 'wss:' : 'ws:';
  return httpUrl.toString();
};

const resample = (input, sourceRate, targetRate) => {
  if (sourceRate === targetRate) return input;
  const ratio = sourceRate / targetRate;
  const length = Math.max(1, Math.round(input.length / ratio));
  const output = new Float32Array(length);
  for (let index = 0; index < length; index += 1) {
    const sourceIndex = index * ratio;
    const left = Math.floor(sourceIndex);
    const right = Math.min(left + 1, input.length - 1);
    const fraction = sourceIndex - left;
    output[index] = input[left] * (1 - fraction) + input[right] * fraction;
  }
  return output;
};

const floatToPcm16 = (samples) => {
  const buffer = new ArrayBuffer(samples.length * 2);
  const view = new DataView(buffer);
  samples.forEach((sample, index) => {
    const clamped = Math.max(-1, Math.min(1, sample));
    view.setInt16(index * 2, clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff, true);
  });
  return buffer;
};

export class GeminiLiveVoiceProvider {
  constructor() {
    this.socket = null;
    this.captureStream = null;
    this.captureContext = null;
    this.captureSource = null;
    this.captureProcessor = null;
    this.captureSink = null;
    this.playbackContext = null;
    this.playbackSources = new Set();
    this.nextPlaybackTime = 0;
    this.callbacks = {};
    this.state = 'idle';
    this._isListening = false;
    this._isSpeaking = false;
    this._muted = false;
    this.pendingTurnResolvers = [];
  }

  isSupported() {
    return typeof window !== 'undefined' && Boolean(window.WebSocket && window.AudioContext && navigator.mediaDevices?.getUserMedia);
  }

  isConnected() {
    return this.socket?.readyState === WebSocket.OPEN && ['ready', 'listening', 'thinking', 'speaking'].includes(this.state);
  }

  connect(interviewId, callbacks = {}) {
    if (!this.isSupported()) return Promise.reject(new Error('Live audio is not supported in this browser.'));
    this.callbacks = callbacks;
    this.socket = new WebSocket(toWebSocketUrl());
    this.socket.binaryType = 'arraybuffer';
    this._setState('connecting');

    return new Promise((resolve, reject) => {
      let settled = false;
      const fail = (error) => {
        if (!settled) {
          settled = true;
          reject(error);
        }
      };

      this.socket.onopen = () => {
        const token = localStorage.getItem('spp_token');
        if (!token) {
          fail(new Error('Your session has expired. Please sign in again.'));
          this.socket.close();
          return;
        }
        this.socket.send(JSON.stringify({ type: 'auth', token, interviewId }));
      };

      this.socket.onmessage = async (event) => {
        if (event.data instanceof ArrayBuffer) {
          await this._playPcm(event.data);
          return;
        }

        let message;
        try { message = JSON.parse(event.data); } catch { return; }

        if (message.type === 'status') {
          this._setState(message.state);
          if (message.state === 'ready' && !settled) {
            settled = true;
            resolve();
          }
        } else if (message.type === 'input-transcript') {
          this.callbacks.onInputTranscript?.(message.text, message.final);
        } else if (message.type === 'output-transcript') {
          this.callbacks.onOutputTranscript?.(message.text, message.final);
        } else if (message.type === 'transcript') {
          this.callbacks.onTranscript?.(message.transcript);
        } else if (message.type === 'turn-complete') {
          this._resolvePendingTurns();
          this.callbacks.onTurnComplete?.();
        } else if (message.type === 'interrupted') {
          this.stopSpeaking();
          this.callbacks.onInterrupted?.();
        } else if (message.type === 'error') {
          const error = new Error(message.message || 'Gemini Live failed.');
          error.code = message.code;
          this.callbacks.onError?.(error);
          fail(error);
        }
      };

      this.socket.onerror = () => {
        const error = new Error('Could not connect to the live interview service.');
        this.callbacks.onError?.(error);
        fail(error);
      };

      this.socket.onclose = (event) => {
        this._setState('disconnected');
        this.callbacks.onClose?.(event);
        if (!settled) fail(new Error(event.reason || 'Live interview connection closed.'));
      };
    });
  }

  async startListening() {
    if (!this.isConnected() || this._isListening) return;
    this.stopSpeaking();
    this.captureStream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true, channelCount: 1 },
    });
    this.captureContext = new AudioContext({ latencyHint: 'interactive' });
    await this.captureContext.resume();
    this.captureSource = this.captureContext.createMediaStreamSource(this.captureStream);
    this.captureProcessor = this.captureContext.createScriptProcessor(4096, 1, 1);
    this.captureSink = this.captureContext.createGain();
    this.captureSink.gain.value = 0;
    this.captureProcessor.onaudioprocess = (event) => {
      if (!this._isListening || this.socket?.readyState !== WebSocket.OPEN) return;
      const input = event.inputBuffer.getChannelData(0);
      const downsampled = resample(input, this.captureContext.sampleRate, INPUT_SAMPLE_RATE);
      this.socket.send(floatToPcm16(downsampled));
    };
    this.captureSource.connect(this.captureProcessor);
    this.captureProcessor.connect(this.captureSink);
    this.captureSink.connect(this.captureContext.destination);
    this._isListening = true;
    this._setState('listening');
    this.callbacks.onListeningStart?.();
  }

  stopListening() {
    if (!this._isListening) return;
    this._isListening = false;
    if (this.captureProcessor) this.captureProcessor.onaudioprocess = null;
    this.captureSource?.disconnect();
    this.captureProcessor?.disconnect();
    this.captureSink?.disconnect();
    this.captureStream?.getTracks().forEach((track) => track.stop());
    this.captureContext?.close().catch(() => {});
    this.captureStream = null;
    this.captureContext = null;
    this.captureSource = null;
    this.captureProcessor = null;
    this.captureSink = null;
    if (this.socket?.readyState === WebSocket.OPEN) this.socket.send(JSON.stringify({ type: 'audio-end' }));
    this._setState('thinking');
    this.callbacks.onListeningEnd?.();
  }

  sendText(text) {
    const value = text?.trim();
    if (!value || this.socket?.readyState !== WebSocket.OPEN) return false;
    this.socket.send(JSON.stringify({ type: 'text', text: value }));
    this._setState('thinking');
    return true;
  }

  setMuted(muted) {
    this._muted = Boolean(muted);
    if (this._muted) this.stopSpeaking();
  }

  stopSpeaking() {
    this.playbackSources.forEach((source) => {
      try { source.stop(); } catch { /* source already ended */ }
    });
    this.playbackSources.clear();
    this.nextPlaybackTime = this.playbackContext?.currentTime || 0;
    if (this._isSpeaking) {
      this._isSpeaking = false;
      this.callbacks.onSpeakingEnd?.();
    }
  }

  waitForTurn(timeoutMs = 3500) {
    if (!['thinking', 'speaking'].includes(this.state)) return Promise.resolve();
    return new Promise((resolve) => {
      const timeout = setTimeout(resolve, timeoutMs);
      this.pendingTurnResolvers.push(() => { clearTimeout(timeout); resolve(); });
    });
  }

  async close({ waitForTurn = false } = {}) {
    this.stopListening();
    if (waitForTurn) await this.waitForTurn();
    this.stopSpeaking();
    if (this.socket && this.socket.readyState < WebSocket.CLOSING) this.socket.close(1000, 'Interview ended');
    this.socket = null;
    if (this.playbackContext) await this.playbackContext.close().catch(() => {});
    this.playbackContext = null;
    this._setState('closed');
  }

  async _playPcm(arrayBuffer) {
    if (this._muted || arrayBuffer.byteLength < 2) return;
    if (!this.playbackContext) this.playbackContext = new AudioContext({ latencyHint: 'interactive' });
    await this.playbackContext.resume();
    const view = new DataView(arrayBuffer);
    const sampleCount = Math.floor(arrayBuffer.byteLength / 2);
    const audioBuffer = this.playbackContext.createBuffer(1, sampleCount, OUTPUT_SAMPLE_RATE);
    const channel = audioBuffer.getChannelData(0);
    for (let index = 0; index < sampleCount; index += 1) channel[index] = view.getInt16(index * 2, true) / 32768;

    const source = this.playbackContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.playbackContext.destination);
    const startAt = Math.max(this.playbackContext.currentTime + 0.02, this.nextPlaybackTime);
    this.nextPlaybackTime = startAt + audioBuffer.duration;
    this.playbackSources.add(source);
    if (!this._isSpeaking) {
      this._isSpeaking = true;
      this._setState('speaking');
      this.callbacks.onSpeakingStart?.();
    }
    source.onended = () => {
      this.playbackSources.delete(source);
      if (this.playbackSources.size === 0) {
        this._isSpeaking = false;
        this.callbacks.onSpeakingEnd?.();
      }
    };
    source.start(startAt);
  }

  _setState(state) {
    this.state = state;
    this.callbacks.onStatus?.(state);
  }

  _resolvePendingTurns() {
    this.pendingTurnResolvers.splice(0).forEach((resolve) => resolve());
  }
}
