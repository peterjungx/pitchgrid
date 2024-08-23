/*

Converts a note to MPE format according to temperament.

*/

import { ConsistentTuning } from "./consistent_tuning";

interface NoteCoords{
    d: number;
    s: number;
}
interface PlayingNote{
    channel: number;
    coords: NoteCoords;
}

function str(c:NoteCoords):string{
    return `${c.d}|${c.s}`;
}
function coo(st:string):NoteCoords{
    let [d,s] = st.split('|');
    return {d:parseInt(d), s:parseInt(s)};
}

export class NoteToMPE {
    baseNoteMidiNumber: number;
    projectionOffset: number = 1; // 1=all black keys are b, 6=all black keys are #
    playingNotes:Map<string,PlayingNote>;
    playingChannels:Set<number>;
    pitchBendRange = 2;
    temperament: ConsistentTuning;

    constructor(temperament:ConsistentTuning, baseNoteMidiNumber: number = 60, offset: number = 4, pitchBendRange: number = 2) {
        this.temperament = temperament;
        this.baseNoteMidiNumber = baseNoteMidiNumber;
        this.projectionOffset = offset;
        this.playingNotes = new Map();
        this.playingChannels = new Set();
        this.pitchBendRange = pitchBendRange;

        //console.log(this.playingNotes, this.playingChannels)
    }

    noteToMPE(it:NoteToMPE, note: number, velocity: number, base_freq_A4:number) : any[] {
        let coords = it.reverseProjection(it, note);
        return it.noteCoordsToMPE(it, coords, velocity, base_freq_A4);
    }

    noteCoordsToMPE(it:NoteToMPE, coords:NoteCoords, velocity:number, base_freq_A4:number=440) : [any[], any[]] {
        let mpe:any[] = [];
        let channel:number|undefined = undefined;

        let freq = base_freq_A4/440 * it.temperament.coord_to_freq(coords.d, coords.s);
        let exact_midi_note_number = it.baseNoteMidiNumber + 12*Math.log2(freq);
        let note = Math.round(exact_midi_note_number);

        if (velocity === 0){
            if (it.playingNotes.has(str(coords))){
                channel = it.playingNotes.get(str(coords))!.channel;
                it.playingNotes.delete(str(coords));
                it.playingChannels.delete(channel);
                mpe.push([0x80 + channel, note, 0]);
            }
            return [mpe, Array.from(it.playingNotes.values()).map(x => x.coords)];
        }
        if (it.playingNotes.has(str(coords))){
            channel = it.playingNotes.get(str(coords))!.channel;
            mpe.push([0x80 + channel, note, 0]);
        }else{
            channel = 1;
            while (it.playingChannels.has(channel)){
                channel++;
            }
            if (channel > 15){
                return [mpe, Array.from(it.playingNotes.values()).map(x => x.coords)];
            }
            it.playingChannels.add(channel);
            it.playingNotes.set(str(coords), {channel:channel, coords:coords});
        }

        //console.log(note, exact_midi_note_number, freq);
        let pitchBend = Math.min(Math.round(8192*(exact_midi_note_number - note)/it.pitchBendRange) + 8192, 16383);

        //console.log('xx', it.temperament.coord_to_freq(coords.d, coords.s), note, exact_midi_note_number, pitchBend)

        let noteOn = 0x90 + channel;
        let pitchBendLSB = pitchBend % 128;
        let pitchBendMSB = pitchBend >> 7;
        mpe.push([0xe0 + channel, pitchBendLSB, pitchBendMSB]);
        mpe.push([noteOn, note, velocity]);

        return [mpe, Array.from(it.playingNotes.values()).map(x => x.coords)];
    }

    reverseProjection(it:NoteToMPE, note:number) : NoteCoords{
        // map midi note number to d and s
        let s = note - it.baseNoteMidiNumber;
        let d = Math.floor((s*7+7-it.projectionOffset)/12+0.001);
        //console.log('reverseProjection',note,'->',d,s);
        return {d:d, s:s};
    }


}