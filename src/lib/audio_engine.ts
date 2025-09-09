/**
 * Synth engine for pre-configured metronome sounds
 */
class SynthEngine {
  private oscillator: OscillatorNode | null = null;
  private envelope: GainNode | null = null;
  private audioContext: AudioContext;
  private masterGain: GainNode;
  private isPlaying = false;

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

    // Store configuration
    this.frequency = config.frequency;
    this.oscillatorType = config.type;
    this.attack = config.attack;
    this.decay = config.decay;
    this.release = config.release;
    this.duration = config.duration;

    // Pre-configure oscillator (for reference)
    this.oscillator = audioContext.createOscillator();
    this.oscillator.type = config.type;
    this.oscillator.frequency.setValueAtTime(config.frequency, audioContext.currentTime);

    // Pre-configure envelope
    this.envelope = audioContext.createGain();
    this.envelope.gain.setValueAtTime(0, audioContext.currentTime);

    // Connect: oscillator -> envelope -> masterGain
    this.oscillator.connect(this.envelope);
    this.envelope.connect(masterGain);
  }

  private attack: number;
  private decay: number;
  private release: number;
  private duration: number;
  private frequency: number;
  private oscillatorType: OscillatorType;

  play(volume: number = 0.5) {
    if (!this.audioContext || !this.masterGain) return;

    const startTime = this.audioContext.currentTime;

    // Create new oscillator and envelope for each play
    const oscillator = this.audioContext.createOscillator();
    const envelope = this.audioContext.createGain();

    // Configure oscillator with stored settings
    oscillator.type = this.oscillatorType;
    oscillator.frequency.setValueAtTime(this.frequency, startTime);

    // Configure envelope (simple attack-decay-release)
    envelope.gain.setValueAtTime(0, startTime);
    envelope.gain.linearRampToValueAtTime(volume, startTime + this.attack);
    envelope.gain.exponentialRampToValueAtTime(0.001, startTime + this.duration);
    envelope.gain.linearRampToValueAtTime(0, startTime + this.duration + this.release);

    // Connect: oscillator -> envelope -> masterGain
    oscillator.connect(envelope);
    envelope.connect(this.masterGain);

    // Start and stop oscillator
    oscillator.start(startTime);
    oscillator.stop(startTime + this.duration + this.release);

    // Clean up after sound completes
    setTimeout(() => {
      oscillator.disconnect();
      envelope.disconnect();
    }, (this.duration + this.release + 0.01) * 1000);
  }

  dispose() {
    if (this.oscillator) {
      try {
        this.oscillator.stop();
      } catch (e) {
        // Already stopped
      }
      this.oscillator.disconnect();
    }
    if (this.envelope) {
      this.envelope.disconnect();
    }
  }
}

/**
 * Audio engine for the Helix Metronome using Web Audio API
 */
export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private isInitialized = false;
  private synthEngines: SynthEngine[] = [];

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

      // Pre-configure 6 synth engines
      this.initializeSynthEngines();
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  }

  private initializeSynthEngines() {
    if (!this.audioContext || !this.gainNode) return;

    // Configuration for each of the 6 synth engines
    const configs = [
      { type: 'sine' as OscillatorType, frequency: 2000, attack: 0.005, decay: 0.01, release: 0.005, duration: 0.05 },
      { type: 'triangle' as OscillatorType, frequency: 1000, attack: 0.005, decay: 0.01, release: 0.005, duration: 0.05 },
      { type: 'sine' as OscillatorType, frequency: 600, attack: 0.005, decay: 0.01, release: 0.005, duration: 0.05 },
      { type: 'triangle' as OscillatorType, frequency: 700, attack: 0.005, decay: 0.01, release: 0.005, duration: 0.05 },
      { type: 'sine' as OscillatorType, frequency: 1500, attack: 0.005, decay: 0.01, release: 0.005, duration: 0.05 },
      { type: 'triangle' as OscillatorType, frequency: 900, attack: 0.005, decay: 0.01, release: 0.005, duration: 0.05 }
    ];

    this.synthEngines = configs.map(config =>
      new SynthEngine(this.audioContext!, this.gainNode!, config)
    );
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
   * Play a metronome tick using pre-configured synth engine
   * @param soundIndex Index of the sound (0-5)
   * @param delay Delay in seconds before playing (not used in new implementation)
   * @param volume Volume level (0-1)
   */
  playTick(soundIndex: number, delay: number = 0, volume: number = 0.5) {
    if (!this.isInitialized || soundIndex < 0 || soundIndex >= this.synthEngines.length) return;

    // For delayed playback, we could implement a timeout here, but for now
    // we'll play immediately since the scheduling is handled at a higher level
    if (delay > 0) {
      setTimeout(() => {
        this.synthEngines[soundIndex].play(volume);
      }, delay * 1000);
    } else {
      this.synthEngines[soundIndex].play(volume);
    }
  }

  /**
   * Stop all audio and dispose of synth engines
   */
  stop() {
    if (this.gainNode) {
      this.gainNode.gain.value = 0;
    }
  }

  /**
   * Dispose of all synth engines and clean up resources
   */
  dispose() {
    this.synthEngines.forEach(engine => engine.dispose());
    this.synthEngines = [];

    if (this.gainNode) {
      this.gainNode.disconnect();
    }

    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
  }
}
