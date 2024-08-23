<script lang='ts'>
    import Node from './Node.svelte';

    import type { node, edge, rect, system } from './lattice_math';
    //import {prepare_default_lattice} from './lattice_math';
    import {prepare_default_lattice, apply_lattice_transform} from './lattice_math';

    export let s:system = {a:1,b:1};
    export let edge_length=50;
    export let show_rects = false;

    export let color = 'lightgray';
    export let areacolor = 'white';
    export let s_target:system|undefined = undefined;
    export let dual:boolean = false;

    let _nodes:node[] = [];
    let _edges:edge[] = [];
    let _rects:rect[] = [];

    // generate lattice nodes, 0 <= x <= a, 0 <= y <= b
    function update(s:system, s_target:system|undefined, edge_length:number, lattice_basecolor:string, lattice_rectcolor:string, dual:boolean) {
        let {nodes,edges,rects} = prepare_default_lattice(s, edge_length, lattice_basecolor, lattice_rectcolor);
        if (s_target) {
            apply_lattice_transform(nodes, s, s_target, edge_length, dual);
            apply_lattice_transform(edges, s, s_target, edge_length, dual);
            apply_lattice_transform(rects, s, s_target, edge_length, dual);
        }
        _nodes = nodes;
        _edges = edges;
        _rects = rects;
    }

    $: update(s, s_target, edge_length, color, areacolor, dual);


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
    <Node 
        x={n.p.x} 
        y={n.p.y} 
        color="{n.col}" 
        text="{n.text}"
    />
{/each}
