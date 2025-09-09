/**
 * Audio engine for the Helix Metronome using Web Audio API
 */

export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private isInitialized = false;

  constructor() {
    this.initializeAudio();
  }

  private async initializeAudio() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.gainNode.gain.value = 0.3; // Moderate volume
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  }

  /**
   * Resume audio context (required for user interaction)
   */
  async resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  /**
   * Generate and play a metronome tick sound
   * @param soundIndex Index of the sound (0-3)
   * @param delay Delay in seconds before playing
   */
  playTick(soundIndex: number, delay: number = 0) {
    if (!this.isInitialized || !this.audioContext || !this.gainNode) return;

    const startTime = this.audioContext.currentTime + delay;

    switch (soundIndex % 6) {
      case 0:
        this.playSineTick(startTime);
        break;
      case 1:
        this.playSquareTick(startTime);
        break;
      case 2:
        this.playTriangleTick(startTime);
        break;
      case 3:
        this.playNoiseTick(startTime);
        break;
      case 4:
        this.playSquareTick(startTime, 1100);
        break;
      case 5:
        this.playSquareTick(startTime, 900);
        break;
    }
  }

  private playSineTick(startTime: number) {
    if (!this.audioContext || !this.gainNode) return;

    const oscillator = this.audioContext.createOscillator();
    const envelope = this.audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(1000, startTime); // 1kHz

    envelope.gain.setValueAtTime(0, startTime);
    envelope.gain.linearRampToValueAtTime(0.5, startTime + 0.005);
    envelope.gain.exponentialRampToValueAtTime(0.001, startTime + 0.05);

    oscillator.connect(envelope);
    envelope.connect(this.gainNode);

    oscillator.start(startTime);
    oscillator.stop(startTime + 0.1);
  }

  private playSquareTick(startTime: number, freq: number = 800) {
    if (!this.audioContext || !this.gainNode) return;

    const oscillator = this.audioContext.createOscillator();
    const envelope = this.audioContext.createGain();

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(freq, startTime); // 800Hz

    envelope.gain.setValueAtTime(0, startTime);
    envelope.gain.linearRampToValueAtTime(0.4, startTime + 0.005);
    envelope.gain.exponentialRampToValueAtTime(0.001, startTime + 0.05);

    oscillator.connect(envelope);
    envelope.connect(this.gainNode);

    oscillator.start(startTime);
    oscillator.stop(startTime + 0.08);
  }

  private playTriangleTick(startTime: number) {
    if (!this.audioContext || !this.gainNode) return;

    const oscillator = this.audioContext.createOscillator();
    const envelope = this.audioContext.createGain();

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(1200, startTime); // 1.2kHz

    envelope.gain.setValueAtTime(0, startTime);
    envelope.gain.linearRampToValueAtTime(0.6, startTime + 0.005);
    envelope.gain.exponentialRampToValueAtTime(0.001, startTime + 0.05);

    oscillator.connect(envelope);
    envelope.connect(this.gainNode);

    oscillator.start(startTime);
    oscillator.stop(startTime + 0.12);
  }

  private playNoiseTick(startTime: number) {
    if (!this.audioContext || !this.gainNode) return;

    const bufferSize = this.audioContext.sampleRate * 0.05; // 50ms
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate white noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }

    const source = this.audioContext.createBufferSource();
    const envelope = this.audioContext.createGain();

    source.buffer = buffer;

    envelope.gain.setValueAtTime(0, startTime);
    envelope.gain.linearRampToValueAtTime(0.3, startTime + 0.005);
    envelope.gain.exponentialRampToValueAtTime(0.001, startTime + 0.05);

    source.connect(envelope);
    envelope.connect(this.gainNode);

    source.start(startTime);
  }

  /**
   * Schedule multiple ticks for local playheads
   * @param tickTimes Array of {time: number, playheadIndex: number} for each tick to play
   * @param currentTime Current audio time
   */
  scheduleTicks(tickTimes: { time: number; playheadIndex: number }[], currentTime: number) {
    if (!this.isInitialized) return;

    tickTimes.forEach(({ time, playheadIndex }) => {
      const delay = Math.max(0, time - currentTime);
      if (delay < 1) { // Only schedule ticks within 1 second
        this.playTick(playheadIndex % 6, delay);
      }
    });
  }

  /**
   * Stop all audio
   */
  stop() {
    if (this.gainNode) {
      this.gainNode.gain.value = 0;
    }
  }
}
