import type { Vector2i, Vector2d } from 'scalatrix';

export type node = {
    c: Vector2i,
    p: Vector2d,
    col:string,
    text:string
};
export type edge = {
    p1:Vector2d, 
    p2:Vector2d, 
    col:string
};
export type nodeinfo = {
    n:node,
    midi:number,
    key_color:string,
    note_label:string,
    midi_label:string,
    pitch_label:string,
    pitch_ct:number,
    pitch_freq:number,
    on_scale:boolean,
    on_screen:boolean,
    is_root:boolean,
}


