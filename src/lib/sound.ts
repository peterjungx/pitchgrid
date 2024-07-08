

export class Player{
    audioContext?: AudioContext;
    samples?: {
        C1: AudioBuffer;
        C2: AudioBuffer;
        C3: AudioBuffer;
        C4: AudioBuffer;
        C5: AudioBuffer;
        C6: AudioBuffer;
        C7: AudioBuffer;
        C8: AudioBuffer;
    };
    playingSources: { [key: number]: any } = {};

    constructor(){
        this.audioContext = this.getCrossBrowserAudioContext();

        const fileNames = ["C1v10", "C2v10", "C3v10", "C4v10", "C5v10", "C6v10", "C7v10", "C8v10"];

        Promise.all(
          fileNames.map((fileName) =>
            this.loadSample(
              `audio/${fileName}.wav`
            )
          )
        ).then((audioBuffers) => {
          const [C1, C2, C3, C4, C5, C6, C7, C8] = audioBuffers;
          this.samples = { C1, C2, C3, C4, C5, C6, C7, C8 };
        });

    }

    getCrossBrowserAudioContext(): AudioContext | undefined {
        const AudioCrossBrowserContext = 
            window.AudioContext || 
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            // @ts-ignore
            ((window as any).webkitAudioContext as AudioContext);
        if (!AudioCrossBrowserContext) {
            return;
        }
        return new AudioCrossBrowserContext();
    }

    loadSample(url: string): Promise<AudioBuffer> {
        return fetch(url)
          .then((response) => response.arrayBuffer())
          .then((buffer) => this.audioContext!.decodeAudioData(buffer));
    }

    private getBestSampleForFrequency(frequency: number):
         [adjustedNoteValue: number, sample: AudioBuffer] {

        if (frequency < 27.50 ) {
            frequency = 27.50;
        }
        if (frequency > 5587.65) {
            frequency = 5587.65;
        }
        
        const c8_freq = 4186.01;
        
        
        let adjustedOctave = 8 + Math.round(Math.log2(frequency/ c8_freq));
        let adjustedNoteValue = Math.log2(frequency / c8_freq*Math.pow(2, 8-adjustedOctave)) * 12 ;
    
        type SampleName = keyof typeof this.samples;
    
        return [
          adjustedNoteValue,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.samples![`C${adjustedOctave}` as SampleName],
        ];
    }

    private playTone(noteValue: number, sample: AudioBuffer) {
        if (!this.audioContext) {
          return;
        }

        const source = this.audioContext!.createBufferSource();
        // use the best C note sample based on the octave and note value
        source.buffer = sample;
    
        // use the note value to calculate how many cents to detune the note
        source.detune.value = noteValue * 100;
    
        source.connect(this.audioContext!.destination);
        source.start(0);

        return source;
        
    }

    playNote(frequency: number) {
        if (!this.audioContext || !this.samples) {
          return;
        }
    
        let source = this.playTone(...this.getBestSampleForFrequency(frequency));
        this.playingSources[frequency] = source;
        
        
      }
    stopNote(frequency:number){
        if (!this.audioContext || !this.samples) {
            return;
        }
        this.playingSources[frequency].stop();
        delete this.playingSources[frequency];
      }

}