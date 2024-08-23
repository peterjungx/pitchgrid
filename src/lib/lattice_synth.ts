import { ConsistentTuning } from '$lib/consistent_tuning';
import { NoteToMPE } from '$lib/note_to_mpe';

import JZZ from 'jzz';
import Tiny from 'jzz-synth-tiny';
Tiny(JZZ);


export class LatticeSynth {
    synth:any
    note_to_mpe:NoteToMPE
    freq_A4 = 440;

    constructor(tuning:ConsistentTuning){
        JZZ.synth.Tiny.register('Web Audio');
        this.synth = JZZ.synth.Tiny()
        this.note_to_mpe = new NoteToMPE(tuning)
    }

    play_note(d:number, s:number, velocity:number){
        let [mpe, _] = this.note_to_mpe.noteCoordsToMPE(this.note_to_mpe, {d:d, s:s}, velocity, this.freq_A4)
        //pressed_note_coords = pressed_notes
        //console.log('note', {d:d, s:s}, 'velocity', velocity, 'mpe', mpe)
        mpe.forEach((msg) => {
            this.synth.send(msg);
        })
    }

    panic(){
        this.synth.allNotesOff()
    }
}
