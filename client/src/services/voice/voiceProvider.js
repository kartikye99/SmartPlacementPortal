/**
 * Base Voice Provider Interface
 * Allows switching between native Web Speech API, Gemini Live API, or external Realtime WebSockets.
 */
export class BaseVoiceProvider {
  constructor() {
    if (new.target === BaseVoiceProvider) {
      throw new TypeError('Cannot construct BaseVoiceProvider instances directly.');
    }
  }

  isSupported() {
    return false;
  }

  listen(_callbacks) {
    throw new Error('Method "listen" must be implemented.');
  }

  stopListening() {
    throw new Error('Method "stopListening" must be implemented.');
  }

  speak(_text, _callbacks) {
    throw new Error('Method "speak" must be implemented.');
  }

  stopSpeaking() {
    throw new Error('Method "stopSpeaking" must be implemented.');
  }

  isListening() {
    return false;
  }

  isSpeaking() {
    return false;
  }
}

/**
 * Web Speech API Implementation (Standard, zero-external-dependency, out of the box)
 */
export class WebSpeechVoiceProvider extends BaseVoiceProvider {
  constructor() {
    super();
    this.recognition = null;
    this.synthesis = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this._isListening = false;
    this._isSpeaking = false;

    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
      }
    }
  }

  isSupported() {
    return !!(this.recognition && this.synthesis);
  }

  isSpeechRecognitionSupported() {
    return !!this.recognition;
  }

  isSpeechSynthesisSupported() {
    return !!this.synthesis;
  }

  listen({ onStart, onResult, onError, onEnd }) {
    if (!this.recognition) {
      if (onError) onError(new Error('Speech recognition is not supported in this browser. You can type your answers in Text Mode.'));
      return;
    }

    try {
      this.recognition.onstart = () => {
        this._isListening = true;
        if (onStart) onStart();
      };

      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (onResult) {
          onResult({
            transcript: finalTranscript || interimTranscript,
            isFinal: !!finalTranscript,
          });
        }
      };

      this.recognition.onerror = (event) => {
        this._isListening = false;
        if (onError) onError(event);
      };

      this.recognition.onend = () => {
        this._isListening = false;
        if (onEnd) onEnd();
      };

      this.recognition.start();
    } catch (err) {
      this._isListening = false;
      if (onError) onError(err);
    }
  }

  stopListening() {
    if (this.recognition && this._isListening) {
      try {
        this.recognition.stop();
      } catch {
        // Ignore if already stopped
      }
      this._isListening = false;
    }
  }

  speak(text, { onStart, onEnd, onError } = {}) {
    if (!this.synthesis) {
      if (onError) onError(new Error('Speech synthesis is not supported.'));
      return;
    }

    this.stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';

    // Pick natural voice if available
    const voices = this.synthesis.getVoices();
    const naturalVoice = voices.find(
      (v) => (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha')) && v.lang.startsWith('en')
    );
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onstart = () => {
      this._isSpeaking = true;
      if (onStart) onStart();
    };

    utterance.onend = () => {
      this._isSpeaking = false;
      if (onEnd) onEnd();
    };

    utterance.onerror = (event) => {
      this._isSpeaking = false;
      if (onError) onError(event);
    };

    this.synthesis.speak(utterance);
  }

  stopSpeaking() {
    if (this.synthesis) {
      try {
        this.synthesis.cancel();
      } catch {
        // Ignore
      }
      this._isSpeaking = false;
    }
  }

  isListening() {
    return this._isListening;
  }

  isSpeaking() {
    return this._isSpeaking;
  }
}

/**
 * Factory to retrieve configured VoiceProvider
 * Easily extendable to 'gemini-live', 'websocket-realtime', etc.
 */
let currentProvider = null;

export const getVoiceProvider = (type = 'webspeech') => {
  if (!currentProvider) {
    switch (type) {
      case 'webspeech':
      default:
        currentProvider = new WebSpeechVoiceProvider();
        break;
    }
  }
  return currentProvider;
};
