<script lang='ts'>
    import LatticeNode from './LatticeNode.svelte';

    import type { node, edge, rect, system, affine_transform } from './lattice_math';

    export let window_nodes:node[];
    export let y_offset = 200;
    export let start_midi:number = 60;

    let margin = 2;

    type PianoKey = {
        x_pitch:number,
        x_piano_center:number,
        midi:number,
        color:string,
        text:string,
        x?:number,
        y?:number,
        width?:number,
        height?:number,
        x_center?:number,
        x_eq?:number,
    }
    let _keys:PianoKey[] = [];
    
    function next_key_centerX_offset(midi:number) {
        switch (midi % 12) {
            case 4:
            case 11:
                return 2.4;
            case 0:
            case 3:
                return 1.0;
            case 1:
            case 2:
                return 1.4;
            case 7:
            case 8:
                return 1.2;
            case 5:
            case 10:
                return 0.8;
            case 6:
            case 9:
                return 1.6;
        }
        return 1.0;
    }

    // generate lattice nodes, 0 <= x <= a, 0 <= y <= b
    function update(nodes:node[], y_offset:number) {
        let keys:PianoKey[] = [];
        let x_coords = nodes.map(n=>n.p.x).sort((a,b)=>a-b);
        let x_min = x_coords[0];
        let x_max = x_coords[x_coords.length-1];
        let x_piano_center_offset = 0.0;
        
        for (let i=0; i<x_coords.length; i++) {
            let x_pitch = x_coords[i];
            let midi = start_midi + i;
            let color = midi % 12 == 1 || midi % 12 == 3 || midi % 12 == 6 || midi % 12 == 8 || midi % 12 == 10 ? 'black' : 'white';
            let text = midi.toString();
            let x_piano_center = x_piano_center_offset;
            
            keys.push({x_pitch, x_piano_center, midi, color, text});
            x_piano_center_offset += next_key_centerX_offset(midi);
        }

        let white_keys = keys.filter(k=>k.color=='white');
        let num_white = white_keys.length;
        
        let key_offset = (x_max-x_min)/(keys[keys.length-1].x_piano_center - keys[0].x_piano_center);
        let x_piano_width = keys[keys.length-1].x_piano_center - keys[0].x_piano_center;
        let white_key_width = 2.4 * key_offset;
        let white_key_height = white_key_width*13.5/2.4;
        let black_key_width = white_key_width*1.4/2.4;
        let black_key_height = white_key_height*8.5/13.5;
        
        for (let i=0; i<x_coords.length; i++) {
            let k = keys[i];
            k.x_center = x_min + k.x_piano_center / x_piano_width * (x_max-x_min);
            k.y = y_offset + margin;
            k.x_eq = i/(keys.length-1) * (x_max-x_min) + x_min;
            if (k.color == 'white') {
                k.x = k.x_center - white_key_width/2 + margin;
                k.width = white_key_width - 2*margin;
                k.height = white_key_height - 2*margin;
            } else {
                k.x = k.x_center - black_key_width/2 + margin;
                k.width = black_key_width - 2*margin;
                k.height = black_key_height - 2*margin;
            }
            //key_offset += white_key_width * next_key_centerX_offset(k.midi)/2.4;
        }
        _keys = keys;

    }

    $: update(window_nodes, y_offset);


</script>

{#each _keys as k}
    {#if k.color == 'white'}
        <rect x="{k.x}" y="{k.y}" width="{k.width}" height="{k.height}" fill="lightgray" rx="{5}" ry="{5}"/>
    {/if}
{/each}
{#each _keys as k}
    {#if k.color == 'black'}
        <rect x="{k.x}" y="{k.y}" width="{k.width}" height="{k.height}" fill="darkgray" rx="{5}" ry="{5}"/>
    {/if}
{/each}
{#each _keys as k}
    <circle cx="{k.x_eq}" cy="{y_offset+margin}" r="{6}" fill="black"/>
{/each}


