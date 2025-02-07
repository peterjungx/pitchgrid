import type { node } from './lattice_math';

export type nodeinfo = {
    n:node,
    midi:number,
    key_color:string,
    note_label:string,
    midi_label:string,
    pitch_label:string,
    pitch_freq:number,
    on_scale?:boolean,
    is_root:boolean,
}
