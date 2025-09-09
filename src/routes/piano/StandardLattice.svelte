<script lang='ts'>
    import LatticeNode from './LatticeNode.svelte';

    import {type AffineTransform, type Vector2i, type Vector2d} from '$lib/scalatrix';

    export let sx: any;

    export let s:Vector2i = {x:1,y:1};
    export let show_rects = false;
    export let color = '#A0A0A0';
    export let areacolor = 'white';
    export let affine_t:AffineTransform;

    type node = {
        c:Vector2i,
        p:Vector2d,
        col:string,
        text:string
    }
    type edge = {
        p1:Vector2d,
        p2:Vector2d,
        col:string
    }
    type rect = {
        p1:Vector2d,
        p2:Vector2d,
        p3:Vector2d,
        p4:Vector2d,
        col:string
    }

    let _nodes:node[] = [];
    let _edges:edge[] = [];
    let _rects:rect[] = [];

    

    // generate lattice nodes, 0 <= x <= a, 0 <= y <= b
    function update(s:Vector2i, node_col:string, edge_col:string, rect_col:string, affine_t:AffineTransform) {
        _nodes = [];
        _edges = [];
        _rects = [];
        //console.log('update', s.x, s.y, affine_t.a, affine_t.b, affine_t.c, affine_t.d, affine_t.tx, affine_t.ty);
        for (let a=0; a<=s.x; a++){
            for (let b=0; b<=s.y; b++){
                let c:Vector2i = {x:a, y:b};
                _nodes.push({
                    c: c,
                    p: affine_t.apply(c),
                    col: node_col,
                    text: `${a},${b}`
                });

                if (a < s.x) {
                    _edges.push({
                        p1: affine_t.apply({x:a, y:b}),
                        p2: affine_t.apply({x:a+1, y:b}),
                        col: edge_col
                    });
                }
                if (b < s.y) {
                    _edges.push({
                        p1: affine_t.apply({x:a, y:b}),
                        p2: affine_t.apply({x:a, y:b+1}),
                        col: edge_col
                    });
                }
                if (show_rects && a < s.x && b < s.y) {
                    if ( (s.x * b - s.y * (a+1)) * (s.x * (b+1) - s.y * a) <= 0) {

                        _rects.push({
                            p1: affine_t.apply({x:a, y:b}),
                            p2: affine_t.apply({x:a+1, y:b}),
                            p3: affine_t.apply({x:a+1, y:b+1}),
                            p4: affine_t.apply({x:a, y:b+1}),
                            col: rect_col
                        });
                    }
                }
            }
        }

    }

    $: update(s, color, color, areacolor, affine_t);


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
        opacity="{false?0.5:1}"
    />
{/each}

{#each _nodes as n}
    <LatticeNode 
        node={n}
        color="{n.col}" 
        text="{n.text}"
    />
{/each}
