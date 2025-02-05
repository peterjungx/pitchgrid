<script lang='ts'>
    import LatticeNode from './LatticeNode.svelte';

    import type { node, edge, rect, system, affine_transform } from './lattice_math';
    //import {prepare_default_lattice} from './lattice_math';
    import {prepare_default_lattice, apply_lattice_transform} from './lattice_math';

    export let s:system = {a:1,b:1};
    export let edge_length=50;
    export let show_rects = false;

    export let color = '#A0A0A0';
    export let areacolor = 'white';
    export let s_target:system|undefined = undefined;
    export let dual:boolean = false;

    let _nodes:node[] = [];
    let _edges:edge[] = [];
    let _rects:rect[] = [];

    export let affine_t:affine_transform = {m11:1,m12:0,m21:0,m22:1,dx:0,dy:0};
    

    // generate lattice nodes, 0 <= x <= a, 0 <= y <= b
    function update(s:system, s_target:system|undefined, edge_length:number, lattice_basecolor:string, lattice_rectcolor:string, dual:boolean, affine_t:affine_transform) {
        let {nodes,edges,rects} = prepare_default_lattice(s, edge_length, lattice_basecolor, lattice_rectcolor, affine_t);
        if (s_target) {
            apply_lattice_transform(nodes, s, s_target, edge_length, dual, affine_t);
            apply_lattice_transform(edges, s, s_target, edge_length, dual, affine_t);
            apply_lattice_transform(rects, s, s_target, edge_length, dual, affine_t);
        }
        _nodes = nodes;
        _edges = edges;
        _rects = rects;
    }

    $: update(s, s_target, edge_length, color, areacolor, dual, affine_t);


</script>

{#if show_rects}
    {#each _rects as r}
        <polygon 
            points="{r.p1.x},{r.p1.y} {r.p2.x},{r.p2.y} {r.p3.x},{r.p3.y} {r.p4.x},{r.p4.y}" 
            fill="{r.col}"
            fill-opacity="{0.5}"
        />
    {/each}
{/if}


{#each _edges as e}
    <line 
        x1={e.p1.x} 
        y1={e.p1.y} 
        x2={e.p2.x} 
        y2={e.p2.y} 
        stroke="{color}" 
        stroke-width="2"
        opacity="{s_target?0.5:1}"
    />
{/each}

{#each _nodes as n}
    <LatticeNode 
        node={n}
        color="{n.col}" 
        text="{n.text}"
    />
{/each}
