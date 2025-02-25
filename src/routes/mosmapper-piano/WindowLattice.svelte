<script lang='ts'>
    import LatticeNode from './LatticeNode.svelte';
    import PianoKeyboard from './PianoKeyboard.svelte';
    import PitchIndicator from './PitchIndicator.svelte';

    import type { nodecoord, node, system, affine_transform } from './lattice_math';
    //import {prepare_default_lattice} from './lattice_math';
    import {apply_lattice_transform, node_at_coord, calc_generator_coord} from './lattice_math';
    import type {TuningData} from '$lib/consistent_tuning';
    import type { nodeinfo } from './types';

    export let s:system = {a:1,b:1};
    export let edge_length=50;
    export let color = 'green';
    export let affine_t:affine_transform = {m11:1,m12:0,m21:0,m22:1,dx:0,dy:0};
    export let tuning_data:TuningData;
    export let window_width = 12;
    export let window_offset = 1;
    export let root_midi = 60;
    export let scale:nodecoord[] = [];
    export let oct_above = 1;
    export let oct_below = 1;
    export let octave = 1;
    
    export let pitch_label_cents = true;

    let generator_coord = {aa:1, bb:3};
    function update_generator_coord(s:system){
        
        generator_coord = calc_generator_coord(s);
    }
    $: update_generator_coord(s);

    let node_coords_for_window:nodecoord[] = [];
    function generate_node_coords_for_window(window_width:number, window_offset:number, s:system, g:nodecoord){

        

        let node_coords:nodecoord[] = [];
        //let x = 0;
        //node_coords.push();
        //for (let i=1-window_offset;i<window_width-window_offset+1;i++){
        //    let y = Math.floor(G*(i));
        //    node_coords.push({aa:i*g.aa - y*s.a, bb:i*g.bb - y*s.b});
        //}
        //node_coords.push({aa:s.a, bb:s.b});
        //console.log('node_coords', node_coords);

        for (let i=1-window_offset;i<window_width-window_offset+1;i++){
            let c:nodecoord = {aa:i * g.aa, bb:i * g.bb};
            while(tuning_data.tuning.coord_to_freq(c.aa, c.bb) < 1){
                c.aa += s.a;
                c.bb += s.b;
            }
            let octave = tuning_data.tuning.coord_to_freq(s.a, s.b);
            while(tuning_data.tuning.coord_to_freq(c.aa, c.bb) > octave){
                c.aa -= s.a;
                c.bb -= s.b;
            }
            node_coords.push(c);

            for (let i = 1; i < oct_below+1; i++){
                node_coords.push({aa:c.aa - i*s.a, bb:c.bb - i*s.b});
            }
            for (let i = 1; i < oct_above+1; i++){
                node_coords.push({aa:c.aa + i*s.a, bb:c.bb + i*s.b});
            }

        }

        node_coords.push({aa:(1+oct_above)*s.a, bb:(1+oct_above)*s.b});

        node_coords_for_window = node_coords;
    }
    $: generate_node_coords_for_window(window_width, window_offset, s, generator_coord);




    function prepare_window_nodes(s:system, edge_length:number, affine_t:affine_transform):node[] {
        let nodes:node[] = [];
        // nodes
        node_coords_for_window.forEach (c => {
            // determine if node is on scale
            let on_scale = scale.some(e=>e.aa==c.aa && e.bb==c.bb);
            let n:node = node_at_coord(c, s, edge_length, on_scale? '#FFB319':'gray', affine_t);
            n.on_scale = on_scale;
            nodes.push(n);
        });
        return nodes;
    }

    const letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    function note_label_letter(dia:number, s:system){
        let dia_mod = (dia+2) % (s.a + s.b);
        let letter = letters[dia_mod];
        return letter;
    }

    let _nodeinfos:nodeinfo[] = [];
    // generate lattice nodes, 0 <= x <= a, 0 <= y <= b
    function update(
        s:system, 
        edge_length:number, 
        lattice_basecolor:string,  
        affine_t:affine_transform,
        window_width:number,
        window_offset:number,
        base_freq:number
    
    ) {

        console.log('UPDATE bf', base_freq);
        let nodes = prepare_window_nodes(s, edge_length, affine_t);
        //if (s_target) {
        //    apply_lattice_transform(nodes, s, s_target, edge_length, false, affine_t);
        //}

        let dimension_a_is_large = 2*(1-tuning_data.tuning.direction_of_enharmonic_equivalence()/Math.PI) > 0.5;
        nodes.sort((a,b)=>a.p.x-b.p.x);

        let root_index = nodes.findIndex(n=>n.c.aa==0&&n.c.bb==0);
        let note_labels_letters = (s.a==2&&s.b==5&&dimension_a_is_large)
        _nodeinfos = nodes.map((n,i) => {
            let midi = root_midi + i - root_index;
            let key_color = [1,3,6,8,10].includes((midi+144) % 12) ? 'black' : 'white';
            let diatonic_step = (n.c.aa + n.c.bb + 50*(s.a + s.b)) % (s.a + s.b);
            let accidental_identifier = Math.floor((n.c.aa*s.b - n.c.bb*s.a-2)/ (s.a + s.b)+1) * (dimension_a_is_large ? -1 : 1);
            let accidental = accidental_identifier>0?'#'.repeat(accidental_identifier):accidental_identifier<0?'b'.repeat(-accidental_identifier):'';
            let note_label = (note_labels_letters?note_label_letter(diatonic_step, s):(diatonic_step+1).toString()) + accidental;
            let midi_label = midi>=0&&midi<128?midi.toString():'';
            let pitch_freq = base_freq * tuning_data.tuning.coord_to_freq(n.c.aa, n.c.bb);
            let pitch_ct = 1200*Math.log2(pitch_freq/base_freq);
            let pitch_label = pitch_label_cents?`${pitch_ct.toFixed(1)}ct` :  `${(pitch_freq).toFixed(1)}Hz`;
            let is_root = n.c.aa%s.a==0 && n.c.bb%s.b==0 && n.c.aa/s.a == n.c.bb/s.b;
            return {n, midi, key_color, note_label, midi_label, pitch_freq, pitch_ct, pitch_label, on_scale:n.on_scale, is_root};
        });
        
    }
    $: update(s, edge_length, color, affine_t, window_width, window_offset, tuning_data.base_freq);


</script>

<PianoKeyboard 
    
    nodeinfos={_nodeinfos}
    y_offset={60}
    root_midi={root_midi}
    height={200}

/>

{#each _nodeinfos as ni}
    <LatticeNode 
        node={ni.n}
        color="{ni.n.col}" 
        text="{ni.n.text}"
    />
{/each}


<PitchIndicator 
    window_width={window_width}
    affine_t={affine_t}
    tuning_data={tuning_data}
    s={s}
    nodeinfos={_nodeinfos}
    octave={octave} 
/>

