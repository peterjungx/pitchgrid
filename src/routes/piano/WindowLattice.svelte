<script lang='ts'>
    import LatticeNode from './LatticeNode.svelte';
    import PianoKeyboard from './PianoKeyboard.svelte';
    import PitchIndicator from './PitchIndicator.svelte';

    //import type { nodecoord, node, system, affine_transform } from './lattice_math';
    //import {prepare_default_lattice} from './lattice_math';
    //import {apply_lattice_transform, node_at_coord, calc_generator_coord} from './lattice_math';
    //import type {TuningData} from '$lib/consistent_tuning';
    import type { node, nodeinfo, edge } from './types';

    import {sx, type AffineTransform, type MOS} from 'scalatrix';

    export let mos:MOS;
    export let affine_t:AffineTransform;
    export let display_width:number;
    export let key_std_width:number;
    export let steps:number;
    export let base_freq:number;
    export let offset:number;

    export let root_midi:number = 60;
    export let num_nodes:number = 128;

    export let pitch_label_cents = true;

    $: mos_scale_factor = mos.n / Math.round(steps);
    $: mos_offset = (offset-.5) / Math.round(steps);


    let nodes:node[] = [];
    let nodeinfos:nodeinfo[] = [];
    let scale_edges:edge[] = [];

    // generate lattice nodes, 0 <= x <= a, 0 <= y <= b
    function update(
        mos:MOS, 
        base_freq:number,
        mos_offset:number,
        strip_width:number
    
    ) {

        let base_notes = mos.base_scale.getNodes();
        let base_note_dic = new Map();
        for (let i=0; i<base_notes.size()-1; i++) {
            let n = base_notes.get(i);
            if (n == undefined) continue;
            base_note_dic.set(`${n.natural_coord.x},${n.natural_coord.y}`, n);
        }

        let squeezed_affine = mos.impliedAffine;
        let mos_to_stretched_affine = new sx.AffineTransform(mos.equave,0,0, mos_scale_factor, 0, 0);
        squeezed_affine = mos_to_stretched_affine.applyAffine(squeezed_affine);
        squeezed_affine.ty = mos_offset;
        let strip = sx.Scale.fromAffine(squeezed_affine, base_freq, num_nodes, root_midi);
        let strip_nodes = strip.getNodes();
        nodes = [];
        nodeinfos = [];
        for (let i=0; i<strip_nodes.size(); i++) {
            let scalenode = strip_nodes.get(i);
            if (scalenode == undefined) continue;

            let on_scale = mos.nodeInScale(scalenode.natural_coord);
            let n:node = {
                c: scalenode.natural_coord,
                p: affine_t.apply(scalenode.natural_coord),
                col: on_scale ? "#FFB319" : '#808080',
                text: ''
            };
            nodes.push(n);

            let midi = i;
            let key_color = [1,3,6,8,10].includes(midi % 12) ? 'black' : 'white';
            let is_western = (mos.a == 2 && mos.b == 5) || (mos.a == 5 && mos.b == 2);
            let note_label = is_western ? mos.nodeLabelLetter(scalenode.natural_coord) : mos.nodeLabelDigit(scalenode.natural_coord);

            let midi_label = midi>=0&&midi<128?midi.toString():'';
            let pitch_freq = scalenode.pitch;
            let pitch_ct = 1200*Math.log2(pitch_freq/base_freq);
            let pitch_label = pitch_label_cents?`${pitch_ct.toFixed(1)}ct` :  `${(pitch_freq).toFixed(1)}Hz`;
            let is_root = scalenode.natural_coord.x * mos.b - scalenode.natural_coord.y * mos.a == 0;

            
            let on_screen = n.p.x >= 0 && n.p.x <= display_width;

            nodeinfos.push( {
                n, 
                midi, 
                key_color, 
                note_label, 
                midi_label, 
                pitch_freq, 
                pitch_ct, 
                pitch_label, 
                on_scale, 
                on_screen,
                is_root
            } );
        }

        strip_nodes.delete();
        base_notes.delete();
        base_note_dic.clear();
        strip.delete();
        mos_to_stretched_affine.delete();
        squeezed_affine.delete();
        
    }
    $: update(mos, base_freq, mos_offset, steps);


    function handleNodeClick(event:CustomEvent) {
        let n = event.detail.node;
        console.log('node clicked', n);
    }

</script>


<PianoKeyboard 
    key_std_width ={key_std_width}
    nodeinfos={nodeinfos}
    y_offset={380}
    height={200}

/>

{#each nodeinfos as ni}
    {#if ni.on_screen}
        <LatticeNode 
            node={ni.n}
            color="{ni.n.col}" 
            text="{ni.n.text}"

            on:nodeClick={handleNodeClick}
        />
    {/if}
{/each}


<PitchIndicator 
    mos={mos}
    steps={steps}
    affine_t={affine_t}
    nodeinfos={nodeinfos}
    octave={1} 
    base_freq={base_freq}
/>

