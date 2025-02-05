<script lang='ts'>
    import PianoKey from './PianoKey.svelte';
    import type { node } from './lattice_math';

    export let window_nodes:node[];
    export let y_offset = 200;
    export let start_midi:number = 60;
    export let height = 100;

    let margin = 0.3;

    type PianoKey = {
        x_pitch:number,
        y_pitch:number,
        midi:number,
        color:string,
        text:string,
        x_eq:number,
        on_scale?:boolean
    }
    let _keys:PianoKey[] = [];
    let scale = 1;
    let height_factor = 1;

    let correction_strip_height = 0.4;
    let correction_strip_y_offset = 0.3; // from below

    

    function update_nodes(window_nodes:node[], height:number, start_midi:number) {
        let keys:PianoKey[] = [];
        let nodes = window_nodes.sort((a,b)=>a.p.x-b.p.x);
        let x_min = nodes[0].p.x;
        let x_max = nodes[nodes.length-1].p.x;

        scale = (x_max - x_min)/(nodes.length-1)*12/84;
        height_factor = height/68/scale;
        
        for (let i=0; i<nodes.length; i++) {
            let x_pitch = nodes[i].p.x;
            let y_pitch = nodes[i].p.y;
            let on_scale = nodes[i].on_scale;
            let midi = start_midi + i;
            let color = midi % 12 == 1 || midi % 12 == 3 || midi % 12 == 6 || midi % 12 == 8 || midi % 12 == 10 ? 
                'black'
                : 
                'white';
            let text = midi.toString();
            let x_eq = i/(nodes.length-1) * (x_max-x_min) + x_min;
            
            keys.push({x_pitch, y_pitch, midi, color, text, x_eq, on_scale});
        }
        _keys = keys;

    }
    $: update_nodes(window_nodes, height, start_midi);

    //function update_midi(start_midi:number){
    //    for (let i=0; i<_keys.length; i++) {
    //        _keys[i].midi = start_midi + i;
    //    }
    //    console.log('midi updated');
    //}
    //$: update_midi(start_midi);

    // stroke={k.on_scale?"#FFB319":'#404040'} 
</script>

{#each _keys as k}
    <g transform="translate({k.x_eq},{y_offset})">
        <PianoKey
            bind:midi_note_number={k.midi}
            bind:scale
            color={k.color}
            opacity={k.on_scale?1:0.3}
            margin={margin}
            bind:height_factor
        />
    </g>
    <path 
        d="M{k.x_eq},{y_offset} l0,{-y_offset*correction_strip_y_offset} l{k.x_pitch-k.x_eq},{-y_offset*correction_strip_height} L{k.x_pitch},{k.y_pitch}" 
        fill="none" 
        stroke={k.color}
        stroke-width="2"  
        opacity={k.on_scale?1:0.5}
    /><!--
    <circle 
        cx="{k.x_eq}" 
        cy="{y_offset}" 
        r="{9}" 
        fill={k.color} 
        opacity={k.on_scale?1:0.3} 
    />
    -->
    <circle 
        cx="{k.x_pitch}" 
        cy="{k.y_pitch}" 
        r="{12}" 
        fill={k.color} 
        opacity={k.on_scale?1:0.5} 
    />    

{/each}



