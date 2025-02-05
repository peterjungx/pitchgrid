<script lang='ts'>
    import LatticeNode from './LatticeNode.svelte';
    import PianoKeyboard from './PianoKeyboard.svelte';

    import type { nodecoord, node, system, affine_transform } from './lattice_math';
    //import {prepare_default_lattice} from './lattice_math';
    import {apply_lattice_transform, node_at_coord} from './lattice_math';
    import type {TuningData} from '$lib/consistent_tuning';
    export let s:system = {a:1,b:1};
    export let edge_length=50;
    export let color = 'green';
    export let s_target:system|undefined = undefined;
    export let dual:boolean = false;
    export let affine_t:affine_transform = {m11:1,m12:0,m21:0,m22:1,dx:0,dy:0};
    export let tuning_data:TuningData;
    export let window_width = 12;
    export let window_offset = 1;
    export let start_midi = 60;
    export let scale:nodecoord[] = [];
    let _nodes:node[] = [];


    let generator_coord = {aa:1, bb:3};
    function update_generator_coord(s:system){
        let a = s.a;
        let b = s.b;
        let transform_invs = [];
        while (a!=1 || b!=1){
            if (a>b){
                a=a-b;
                transform_invs.push('g');
            }else{
                b=b-a;
                transform_invs.push('f');
            }
        }
        a=0;
        b=1;
        while(transform_invs.length>0){
            let t = transform_invs.pop();
            if (t=='g'){
                a=a+b;
            }else{
                b=a+b;
            }
        }
        generator_coord = {aa:a, bb:b};
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
        }
        node_coords.push({aa:s.a, bb:s.b});
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

    // generate lattice nodes, 0 <= x <= a, 0 <= y <= b
    function update(
        s:system, 
        s_target:system|undefined, 
        edge_length:number, 
        lattice_basecolor:string,  
        dual:boolean, 
        affine_t:affine_transform,
        window_width:number,
        window_offset:number
    
    ) {
        let nodes = prepare_window_nodes(s, edge_length, affine_t);
        if (s_target) {
            apply_lattice_transform(nodes, s, s_target, edge_length, dual, affine_t);
        }
        _nodes = nodes;
    }
    $: update(s, s_target, edge_length, color, dual, affine_t, window_width, window_offset);


</script>

<PianoKeyboard 
    window_nodes={_nodes}
    y_offset={60}
    start_midi={start_midi}
    height={200}
/>

{#each _nodes as n}
    <LatticeNode 
        node={n}
        color="{n.col}" 
        text="{n.text}"
    />
{/each}

