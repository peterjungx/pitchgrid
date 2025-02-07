<script lang='ts'>
    import LatticeNode from './LatticeNode.svelte';

    import type { node, edge, rect, system, affine_transform } from './lattice_math';
    //import {prepare_default_lattice} from './lattice_math';
    import {prepare_full_lattice, apply_lattice_transform} from './lattice_math';

    export let s:system = {a:1,b:1};
    export let edge_length=50;
    export let color = '#A0A0A0';
    export let xmin:number;
    export let xmax:number;
    export let ymin:number;
    export let ymax:number;

    let _nodes:node[] = [];
    let _edges:edge[] = [];

    export let affine_t:affine_transform = {m11:1,m12:0,m21:0,m22:1,dx:0,dy:0};
    

    // generate lattice nodes, 0 <= x <= a, 0 <= y <= b
    function update(s:system, edge_length:number, lattice_basecolor:string, affine_t:affine_transform, xmin:number, xmax:number, ymin:number, ymax:number) {
        let {nodes,edges} = prepare_full_lattice(s, edge_length, lattice_basecolor, lattice_basecolor, affine_t, xmin, xmax, ymin, ymax);
        _nodes = nodes;
        _edges = edges;
    }

    $: update(s, edge_length, color, affine_t, xmin, xmax, ymin, ymax);


</script>

{#each _edges as e}
    <line 
        x1={e.p1.x} 
        y1={e.p1.y} 
        x2={e.p2.x} 
        y2={e.p2.y} 
        stroke="{color}" 
        stroke-width="2"
        opacity="{0.5}"
    />
{/each}

{#each _nodes as n}
    <LatticeNode 
        node={n}
        color="{n.col}" 
        text="{n.text}"
    />
{/each}
