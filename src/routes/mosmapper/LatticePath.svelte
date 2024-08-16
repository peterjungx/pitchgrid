<script lang='ts'>
    import type { system, node, edge } from './lattice_math';
    import {prepare_scale, apply_lattice_transform} from './lattice_math';
    import Node from './Node.svelte';

    export let s:system = {a:1,b:1};
    export let edge_length=50;
    export let path:any[]=[{x:0,y:0,label:'1'}, {x:1,y:1,label:'2'}];
    export let color = 'cyan';
    export let s_target:system|undefined = undefined;
    export let dual:boolean = false;


    // generate lattice nodes, 0 <= x <= a, 0 <= y <= b
    let _nodes:node[] = [];
    let _edges:edge[] = [];

    function update(s:system, edge_length:number, path:any[], s_target:system|undefined, color:string, dual:boolean) {
        let labels = (s.a==2&&s.b==5)?['C','D','E','F','G', 'A','B','C']:undefined;
        let {nodes, edges} = prepare_scale(path, s, edge_length, color, labels);
        if (s_target) {
            apply_lattice_transform(nodes, s, s_target, edge_length, dual);
            apply_lattice_transform(edges, s, s_target, edge_length, dual);
        }
        _nodes = nodes;
        _edges = edges;
    }
    $: update(s, edge_length, path, s_target, color, dual);


</script>


{#each _edges as e}
    <line x1={e.p1.x} y1={e.p1.y} x2={e.p2.x} y2={e.p2.y} stroke="{e.col}" stroke-width="3"/>
{/each}

{#each _nodes as n}
    <Node 
        x={n.p.x} 
        y={n.p.y} 
        color="{n.col}" 
        text="{n.text}"
    />
{/each}