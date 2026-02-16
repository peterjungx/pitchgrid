/**
 * Synth engine for pre-configured metronome sounds
 */
class SynthEngine {
  private audioContext: AudioContext;
  private masterGain: GainNode;
  private frequency: number;
  private oscillatorType: OscillatorType;
  private attack: number;
  private decay: number;
  private release: number;
  private duration: number;

  constructor(audioContext: AudioContext, masterGain: GainNode, config: {
    type: OscillatorType;
    frequency: number;
    attack: number;
    decay: number;
    release: number;
    duration: number;
  }) {
    this.audioContext = audioContext;
    this.masterGain = masterGain;
    this.frequency = config.frequency;
    this.oscillatorType = config.type;
    this.attack = config.attack;
    this.decay = config.decay;
    this.release = config.release;
    this.duration = config.duration;
  }

  play(volume: number = 0.5) {
    if (!this.audioContext || !this.masterGain) return;

    const startTime = this.audioContext.currentTime;

    const oscillator = this.audioContext.createOscillator();
    const envelope = this.audioContext.createGain();

    oscillator.type = this.oscillatorType;
    oscillator.frequency.setValueAtTime(this.frequency, startTime);

    envelope.gain.setValueAtTime(0, startTime);
    envelope.gain.linearRampToValueAtTime(volume, startTime + this.attack);
    envelope.gain.exponentialRampToValueAtTime(0.001, startTime + this.duration);
    envelope.gain.linearRampToValueAtTime(0, startTime + this.duration + this.release);

    oscillator.connect(envelope);
    envelope.connect(this.masterGain);

    oscillator.start(startTime);
    oscillator.stop(startTime + this.duration + this.release);

    setTimeout(() => {
      oscillator.disconnect();
      envelope.disconnect();
    }, (this.duration + this.release + 0.01) * 1000);
  }

  dispose() {
    // Nothing to clean up per-engine; context is managed by AudioEngine
  }
}

const SYNTH_CONFIGS = [
  { type: 'sine' as OscillatorType, frequency: 2000, attack: 0.005, decay: 0.01, release: 0.005, duration: 0.05 },
  { type: 'triangle' as OscillatorType, frequency: 1000, attack: 0.005, decay: 0.01, release: 0.005, duration: 0.05 },
  { type: 'sine' as OscillatorType, frequency: 600, attack: 0.005, decay: 0.01, release: 0.005, duration: 0.05 },
  { type: 'triangle' as OscillatorType, frequency: 700, attack: 0.005, decay: 0.01, release: 0.005, duration: 0.05 },
  { type: 'sine' as OscillatorType, frequency: 1500, attack: 0.005, decay: 0.01, release: 0.005, duration: 0.05 },
  { type: 'triangle' as OscillatorType, frequency: 900, attack: 0.005, decay: 0.01, release: 0.005, duration: 0.05 }
];

/**
 * Audio engine for the Helix Metronome using Web Audio API.
 * AudioContext is created lazily on first user gesture (resume call)
 * to comply with iOS/Safari autoplay policies.
 */
export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private synthEngines: SynthEngine[] = [];

  private ensureContext(): boolean {
    if (this.audioContext) return true;
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.gainNode.gain.value = 0.3;
      this.synthEngines = SYNTH_CONFIGS.map(config =>
        new SynthEngine(this.audioContext!, this.gainNode!, config)
      );
      return true;
    } catch (error) {
      console.error('Failed to create AudioContext:', error);
      return false;
    }
  }

  /**
   * Resume (and lazily create) audio context.
   * Must be called from a user gesture handler.
   */
  async resume() {
    this.ensureContext();
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  get isReady(): boolean {
    return this.audioContext !== null && this.audioContext.state === 'running';
  }

  /**
   * Play a metronome tick using pre-configured synth engine
   */
  playTick(soundIndex: number, delay: number = 0, volume: number = 0.5) {
    if (!this.audioContext || soundIndex < 0 || soundIndex >= this.synthEngines.length) return;

    if (delay > 0) {
      setTimeout(() => {
        this.synthEngines[soundIndex].play(volume);
      }, delay * 1000);
    } else {
      this.synthEngines[soundIndex].play(volume);
    }
  }

  stop() {
    if (this.gainNode) {
      this.gainNode.gain.value = 0;
    }
  }

  dispose() {
    this.synthEngines.forEach(engine => engine.dispose());
    this.synthEngines = [];

    if (this.gainNode) {
      this.gainNode.disconnect();
    }

    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
    this.audioContext = null;
    this.gainNode = null;
  }
}
