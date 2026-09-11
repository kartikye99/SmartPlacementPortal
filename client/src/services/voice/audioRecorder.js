/**
 * Audio Recording Service for Mock Interviews
 * Manages client-side audio recording with explicit user consent.
 */
export class AudioRecorder {
  constructor() {
    this.mediaRecorder = null;
    this.stream = null;
    this.audioChunks = [];
    this.startTime = null;
    this._isRecording = false;
  }

  isSupported() {
    return (
      typeof window !== 'undefined' &&
      !!(window.navigator?.mediaDevices?.getUserMedia && window.MediaRecorder)
    );
  }

  async start() {
    if (!this.isSupported()) {
      throw new Error('Audio recording is not supported in this browser environment.');
    }

    this.audioChunks = [];
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    // Choose optimal mime type
    let mimeType = 'audio/webm';
    if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
      mimeType = 'audio/webm;codecs=opus';
    } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
      mimeType = 'audio/ogg;codecs=opus';
    }

    this.mediaRecorder = new MediaRecorder(this.stream, { mimeType });

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    this.mediaRecorder.start(250); // Slice every 250ms
    this.startTime = Date.now();
    this._isRecording = true;
  }

  stop() {
    return new Promise((resolve) => {
      if (!this.mediaRecorder || !this._isRecording) {
        resolve(null);
        return;
      }

      this.mediaRecorder.onstop = () => {
        const mimeType = this.mediaRecorder.mimeType || 'audio/webm';
        const blob = new Blob(this.audioChunks, { type: mimeType });
        const url = URL.createObjectURL(blob);
        const duration = this.startTime ? Math.round((Date.now() - this.startTime) / 1000) : 0;

        // Stop all tracks to turn off hardware microphone indicator
        if (this.stream) {
          this.stream.getTracks().forEach((track) => track.stop());
          this.stream = null;
        }

        this._isRecording = false;
        resolve({ blob, url, duration });
      };

      try {
        this.mediaRecorder.stop();
      } catch {
        resolve(null);
      }
    });
  }

  isRecording() {
    return this._isRecording;
  }

  cleanup() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    this._isRecording = false;
  }
}
