import { writable } from 'svelte/store';

export interface MidiPort {
  id: string;
  name: string;
}

export interface MidiState {
  available: boolean;
  outputs: MidiPort[];
  selectedOutputId: string | null;
}

export const midiStore = writable<MidiState>({
  available: false,
  outputs: [],
  selectedOutputId: null,
});

export class MidiEngine {
  private midiAccess: MIDIAccess | null = null;
  private selectedOutput: MIDIOutput | null = null;

  async init(): Promise<boolean> {
    try {
      this.midiAccess = await navigator.requestMIDIAccess();
      this.updateOutputs();
      this.midiAccess.onstatechange = () => {
        this.updateOutputs();
      };
      return true;
    } catch {
      return false;
    }
  }

  private updateOutputs() {
    if (!this.midiAccess) return;
    const outputs: MidiPort[] = [];
    this.midiAccess.outputs.forEach(output => {
      outputs.push({ id: output.id, name: output.name || output.id });
    });

    // Check if selected output is still present
    let selectedId: string | null = null;
    midiStore.subscribe(s => selectedId = s.selectedOutputId)();
    if (selectedId && !outputs.find(o => o.id === selectedId)) {
      this.selectedOutput = null;
      selectedId = null;
    }

    midiStore.set({
      available: true,
      outputs,
      selectedOutputId: selectedId,
    });
  }

  selectOutput(id: string | null) {
    if (!id || !this.midiAccess) {
      this.selectedOutput = null;
      midiStore.update(s => ({ ...s, selectedOutputId: null }));
      return;
    }
    this.selectedOutput = this.midiAccess.outputs.get(id) || null;
    midiStore.update(s => ({ ...s, selectedOutputId: this.selectedOutput ? id : null }));
  }

  get hasOutput(): boolean {
    return this.selectedOutput !== null;
  }

  sendNoteOn(soundId: number, volume: number) {
    if (!this.selectedOutput) return;
    const note = 60 + soundId;
    const velocity = Math.max(1, Math.min(127, Math.round(volume * 127)));
    this.selectedOutput.send([0x90, note, velocity]);
  }

  sendNoteOff(soundId: number) {
    if (!this.selectedOutput) return;
    const note = 60 + soundId;
    this.selectedOutput.send([0x80, note, 0]);
  }

  dispose() {
    this.selectedOutput = null;
    this.midiAccess = null;
  }
}
