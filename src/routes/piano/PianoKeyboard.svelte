<script lang='ts'>
    import PianoKey from './PianoKey.svelte';
    import type { nodeinfo } from './types';
    //import type {TuningData} from '$lib/consistent_tuning';
    

    export let key_std_width:number;
    export let nodeinfos:nodeinfo[];
    export let y_offset;
    export let height = 100;

    //export let tuning_data:TuningData;

    let margin = 0.3;


    type PianoKey = {
        x_pitch:number,
        y_pitch:number,
        x_eq:number,
        nodeinfo:nodeinfo
    }
    let _keys:PianoKey[] = [];
    let scale:number;
    let height_factor:number;

    let correction_strip_height = 30;
    let correction_strip_y_offset = 30; // from below


    function update_keys(nodeinfos:nodeinfo[], height:number) {

        console.log('update_keys');
        let keys:PianoKey[] = [];
        
        let x_min = nodeinfos[0].n.p.x;
        let x_max = nodeinfos[nodeinfos.length-1].n.p.x;

        scale = (x_max - x_min)/(nodeinfos.length-1)*12/84;
        height_factor = 1.3 * height/68/scale;
        
        for (let i=0; i<nodeinfos.length; i++) {
            let ni = nodeinfos[i];
            let n = ni.n;
            let x_pitch = ni.n.p.x;
            let y_pitch = ni.n.p.y;
            let x_eq = i/(nodeinfos.length-1) * (x_max-x_min) + x_min;
            keys.push({x_pitch, y_pitch, x_eq, nodeinfo:ni});
        }
        _keys = keys;

    }
    $: update_keys(nodeinfos, height);
    // stroke={k.on_scale?"#FFB319":'#404040'} 
</script>

{#each _keys as k}

    <g transform="translate({k.x_eq},{y_offset})">
        <PianoKey
            bind:midi_note_number={k.nodeinfo.midi}
            bind:scale
            color={k.nodeinfo.key_color}
            opacity={k.nodeinfo.on_scale?1:0.5}
            margin={margin}
            bind:height_factor
            note_label={k.nodeinfo.note_label}
            midi_label={k.nodeinfo.midi_label}
            pitch_label={k.nodeinfo.pitch_label}
            is_root={k.nodeinfo.is_root}
        />
    </g>
    <path 
        d="M{k.x_eq},{y_offset} l0,{-correction_strip_y_offset} l{k.x_pitch-k.x_eq},{-correction_strip_height} L{k.x_pitch},{k.y_pitch}" 
        fill="none" 
        stroke={k.nodeinfo.is_root?'#FFB319':k.nodeinfo.key_color}
        stroke-width="2"  
        opacity={k.nodeinfo.on_scale?1:0.5}
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
        fill={k.nodeinfo.key_color} 
        opacity={k.nodeinfo.on_scale?1:0.5} 
    />    

{/each}



