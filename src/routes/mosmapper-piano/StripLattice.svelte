<script lang='ts'>
    import LatticeNode from './LatticeNode.svelte';

    import type { node, system, affine_transform, nodecoord } from './lattice_math';
    import {node_at_coord} from './lattice_math';

    export let s:system = {a:1,b:1};
    export let edge_length=50;
    export let color = '#A0A0A0';
    export let nodes:nodecoord[] = [];

    let _nodes:node[] = [];

    export let affine_t:affine_transform = {m11:1,m12:0,m21:0,m22:1,dx:0,dy:0};
    
    // generate lattice nodes, 0 <= x <= a, 0 <= y <= b
    function update(s:system, edge_length:number, nodecolor:string, affine_t:affine_transform, nodes:nodecoord[]) {
        
        _nodes = nodes.map(n => {
            return node_at_coord(n, s, edge_length, nodecolor, affine_t);
        });
    }
    $: update(s, edge_length, color, affine_t, nodes);


</script>

{#each _nodes as n}
    <LatticeNode 
        node={n}
        color="{n.col}" 
        text="{n.text}"
    />
{/each}
