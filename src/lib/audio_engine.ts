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
  playTick(soundIndex: number, delay: number = 0, volume: number = 0.5) {
    if (!this.isInitialized || !this.audioContext || !this.gainNode) return;

    const startTime = this.audioContext.currentTime + delay;

    switch (soundIndex % 6) {
      case 0:
        this.playSineTick(startTime, 1200, volume);
        break;
      case 1:
        this.playTriangleTick(startTime, 1000, volume);
        break;
      case 2:
        this.playSineTick(startTime, 800, volume);
        break;
      case 3:
        this.playTriangleTick(startTime, 700, volume);
        break;
      case 4:
        this.playSineTick(startTime, 1100, volume);
        break;
      case 5:
        this.playTriangleTick(startTime, 900, volume);
        break;
    }
  }

  private playSineTick(startTime: number, freq: number = 1000, volume: number = 0.5) {
    if (!this.audioContext || !this.gainNode) return;

    const oscillator = this.audioContext.createOscillator();
    const envelope = this.audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(1000, startTime); // 1kHz

    envelope.gain.setValueAtTime(0, startTime);
    envelope.gain.linearRampToValueAtTime(volume + 0.001, startTime + 0.005);
    envelope.gain.exponentialRampToValueAtTime(0.001, startTime + 0.05);
    envelope.gain.linearRampToValueAtTime(0, startTime + 0.055);

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
    envelope.gain.linearRampToValueAtTime(0, startTime + 0.055);

    oscillator.connect(envelope);
    envelope.connect(this.gainNode);

    oscillator.start(startTime);
    oscillator.stop(startTime + 0.08);
  }

  private playTriangleTick(startTime: number, freq: number = 1200, volume: number = 0.6) {
    if (!this.audioContext || !this.gainNode) return;

    const oscillator = this.audioContext.createOscillator();
    const envelope = this.audioContext.createGain();

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(freq, startTime);

    envelope.gain.setValueAtTime(0, startTime);
    envelope.gain.linearRampToValueAtTime(volume, startTime + 0.005);
    envelope.gain.exponentialRampToValueAtTime(0.001, startTime + 0.05);
    envelope.gain.linearRampToValueAtTime(0, startTime + 0.055);

    oscillator.connect(envelope);
    envelope.connect(this.gainNode);

    oscillator.start(startTime);
    oscillator.stop(startTime + 0.12);
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
