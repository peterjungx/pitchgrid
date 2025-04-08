<script lang='ts'>
    import LatticeNode from './LatticeNode.svelte';
    import {sx} from 'scalatrix';
    import type {MOS, AffineTransform, Vector2i} from 'scalatrix';  
    import type {node, edge} from './types';

    //import type { node, edge, rect, system, affine_transform } from './lattice_math';
    //import {prepare_default_lattice} from './lattice_math';
    //import {prepare_full_lattice, apply_lattice_transform} from './lattice_math';


    export let G_s:number;
    export let mos:MOS;
    export let affine_t:AffineTransform;
    export let color = '#C0C0C0';
    export let display_width:number;
    export let key_std_width:number;
    export let strip_width:number;
    export let base_freq:number;
    export let offset:number;

    $: num_nodes_in_strip = display_width/key_std_width + 2;
    $: num_nodes_per_period =  strip_width + 2 * (mos.n-1);
    $: num_nodes = num_nodes_in_strip * num_nodes_per_period/strip_width;
    $: mos_scale_factor = mos.n / strip_width;
    $: strip_scale_factor = num_nodes_in_strip / num_nodes;
    $: mos_offset = (offset-.5 + mos.n-1) / num_nodes_per_period ;
    $: origin_node_pos = Math.floor(num_nodes/2*(1 - strip_width/num_nodes_in_strip));


    let nodes:node[] = [];
    let edges:edge[] = [];


    function update(G_s:number, mos:MOS, nodecolor:string, edgecolor:string, affine_t:any, num_nodes:number, origin_node_pos:number) {
        if (num_nodes==0) return;

        nodes = [];
        edges = [];

        let squeezed_affine = mos.impliedAffine;
        //console.log('squeezed_affine offset', display_width, num_nodes_in_strip, squeezed_affine.tx, squeezed_affine.ty, strip_scale_factor, mos_scale_factor);
        

        let mos_to_stretched_affine = new sx.AffineTransform(1,0,0, strip_scale_factor*mos_scale_factor, 0, 0);
        squeezed_affine = mos_to_stretched_affine.applyAffine(squeezed_affine);
        squeezed_affine.ty = mos_offset;
        //squeezed_affine.ty += ratio / (1+2*ratio); // stretch y by 1/ratio + 2
        // stretch y by 1/ratio + 2
    
        let scale = sx.Scale.fromAffine(squeezed_affine, base_freq, num_nodes, origin_node_pos);
        let scale_nodes = scale.getNodes();
        for (let i=0; i<scale_nodes.size(); i++) {
            let n = scale_nodes.get(i);
            if (n == undefined) continue;
            nodes.push({
                c: n.natural_coord, 
                p: affine_t.apply(n.natural_coord), 
                col: nodecolor, 
                text: ''
            });
        }

        // generate edges. create dict of node natural coordinates
        let node_dict = new Map();
        for (let i=0; i<nodes.length; i++) {
            let n = nodes[i];
            node_dict.set(`${n.c.x},${n.c.y}`, n);
        }
        for (let i=0; i<nodes.length; i++) {
            let n = nodes[i];
            let c = n.c;
            let n2 = node_dict.get(`${c.x+1},${c.y}`);
            if (n2 != undefined) {
                edges.push({
                    p1: n.p, 
                    p2: n2.p, 
                    col: edgecolor
                });
            }
            n2 = node_dict.get(`${c.x},${c.y+1}`);
            if (n2 != undefined) {
                edges.push({
                    p1: n.p, 
                    p2: n2.p, 
                    col: edgecolor
                });
            }
        }

        mos_to_stretched_affine.delete();
        scale_nodes.delete();
        scale.delete();
        squeezed_affine.delete();
        node_dict.clear();

    }
    $: update(G_s, mos, color, color, affine_t, num_nodes, origin_node_pos);


</script>

{#each edges as e}
    <line 
        x1={e.p1.x} 
        y1={e.p1.y} 
        x2={e.p2.x} 
        y2={e.p2.y} 
        stroke="{e.col}" 
        stroke-width="2"
        opacity="{0.5}"
    />
{/each}

{#each nodes as n}
    <LatticeNode 
        node={n}
        color="{n.col}" 
        text="{n.text}"
        size={6}
    />
{/each}
