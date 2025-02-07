<script lang='ts'>
    import type { system, node, edge, MappedScaleDisplayData, affine_transform } from './lattice_math';
    import {prepare_scale, apply_lattice_transform, calc_scale_target_labels, apply_affine} from './lattice_math';
    import LatticePathNode from './LatticePathNode.svelte';
    import type {TuningData} from '$lib/consistent_tuning';

    export let display_data:MappedScaleDisplayData;
    export let tuning_data:TuningData;
    export let scale:any[]=[{x:0,y:0,label:'1'}, {x:1,y:1,label:'2'}];
    export let color = 'cyan';
    export let showConstantPitchLines = true;
    export let within_target = false;
    export let variant = 1;
    export let show_alt_text = false;
    export let show_text = true;
    export let oct_above = 0;
    export let oct_below = 0;

    export let affine_t:affine_transform = {m11:1,m12:0,m21:0,m22:1,dx:0,dy:0};

    let enh_angle = tuning_data.tuning.direction_of_enharmonic_equivalence();
    let enh_angle_norm = 2*(1-enh_angle/Math.PI);

    // generate lattice nodes, 0 <= x <= a, 0 <= y <= b
    let _nodes:node[] = [];
    let _edges:edge[] = [];

    const repeat = (a:string[], n:number) => Array(n).fill(a).flat(1)

    function update(s:system, edge_length:number, scale:any[], s_target:system, color:string, dual:boolean, affine_t:affine_transform) {

        enh_angle = tuning_data.tuning.direction_of_enharmonic_equivalence();
        enh_angle_norm = 2*(1-enh_angle/Math.PI);
        let dimension_a_is_sharp = enh_angle_norm > .5;

        

        let label_s = within_target ? s_target : s;

        let labels = (label_s.a==2&&label_s.b==5&&dimension_a_is_sharp)?repeat(['C','D','E','F','G', 'A','B'], 1+oct_below+oct_above).concat(['C']):undefined;


        let sys = within_target ? s_target : s;
        let {nodes, edges} = prepare_scale(scale, sys, edge_length, color, labels, oct_below, oct_above);
        if (!within_target) {
            apply_lattice_transform(nodes, s, s_target, edge_length, dual, affine_t);
            calc_scale_target_labels(nodes,s_target);
            apply_lattice_transform(edges, s, s_target, edge_length, dual, affine_t);
        }else{
            nodes.forEach(n=>{
                n.p = apply_affine(affine_t, n.p);
            })
            edges.forEach(e=>{
                e.p1 = apply_affine(affine_t, e.p1);
                e.p2 = apply_affine(affine_t, e.p2);
            })
            //apply_lattice_transform(nodes, s, s, edge_length, dual, affine_t);
            //calc_scale_target_labels(nodes,s);
            //apply_lattice_transform(edges, s, s, edge_length, dual, affine_t);
        }
        _nodes = nodes;
        _edges = edges;

    }
    $: update(display_data.s, display_data.edge_length, scale, display_data.s_target, color, display_data.dual, affine_t);

</script>


{#each _edges as e}
    <line x1={e.p1.x} y1={e.p1.y} x2={e.p2.x} y2={e.p2.y} stroke="{e.col}" stroke-width="5"/>
{/each}

{#each _nodes as n}
    <LatticePathNode 
        bind:node={n}
        bind:tuning_data
        bind:display_data 
        bind:constant_pitch_angle={enh_angle}
        bind:color="{n.col}" 
        bind:affine_t
        variant={variant}
        show_alt_text={show_alt_text}
        show_text={show_text}
        text="{n.text}"
        alt_text="{n.alt_text}"
        showConstantPitchLine={showConstantPitchLines}
    />
{/each}