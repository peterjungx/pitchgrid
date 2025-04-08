<script lang='ts'>
    import {sx, type AffineTransform, type MOS} from 'scalatrix';
    import type {node, edge} from './types';

    export let color = 'cyan';
    export let mos:MOS;
    export let affine_t:AffineTransform;
    export let screen_width:number;

    let nodes:node[] = [];
    let edges:edge[] = [];

    function update(mos:MOS, affine_t:AffineTransform) {
        nodes = [];
        edges = [];

        let scale = mos.generateScaleFromMOS(1, 128, 60);
        let scale_nodes = scale.getNodes();
        for (let i=0; i<scale_nodes.size(); i++) {
            let n = scale_nodes.get(i);
            if (n == undefined) continue;
            nodes.push({
                c: n.natural_coord,
                p: affine_t.apply(n.natural_coord),
                col: color,
                text: '',
            });
        }
        for (let i=0; i<nodes.length-1; i++) {
            let n = nodes[i];
            let n2 = nodes[i+1];
            edges.push({
                p1: n.p,
                p2: n2.p,
                col: color
            });
        }
        scale_nodes.delete();
        scale.delete();

    }
    $: update(mos, affine_t);

</script>


{#each edges as e}
    {#if (e.p1.x < screen_width || e.p2.x < screen_width) && (e.p1.x > 0 || e.p2.x > 0) }
        <line x1={e.p1.x} y1={e.p1.y} x2={e.p2.x} y2={e.p2.y} stroke="{e.col}" stroke-width="5"/>
    {/if}
{/each}

{#each nodes as n}
    {#if n.p.x < screen_width && n.p.x > 0}
        <circle cx={n.p.x} cy={n.p.y} r="12" fill="{n.col}" />
    {/if}
    
{/each}