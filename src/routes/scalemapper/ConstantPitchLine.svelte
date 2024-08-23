<script lang="ts">

    import type { edge, system } from './lattice_math';
    import { angle, apply_lattice_transform, edge_at_coords } from './lattice_math';

    export let s:system
    export let s_target:system
    export let s_tune:system
    export let tune_target:boolean
    export let dual:boolean
    export let constant_pitch_angle:number
    export let edge_length:number
    export let s_offset:system = {a:0,b:0}
    export let label:string = '440Hz'
    
    $: lts = -1/Math.tan((angle(0,1,s_tune.b,s_tune.a) + constant_pitch_angle)/180*Math.PI);
    /// export function edge_at_coords(c1:nodecoord, c2:nodecoord, s:system, scale:number, col:string):edge{


    let line:edge
    // = edge_at_coords({aa:-lts, bb:-1}, {aa:lts, bb:1}, s_tune, 50, 'black');
    
    function update_line(lts:number, s:system, s_target:system|undefined, dual:boolean, tune_target:boolean) {

        line = edge_at_coords({aa:s_offset.a + lts, bb:s_offset.b - 1}, {aa:s_offset.a - lts, bb:s_offset.b + 1}, s_tune, edge_length, 'black');
        if(s_target && !tune_target){
            apply_lattice_transform([line], s, s_target, edge_length, dual);
        }

        console.log('line', line)
    }
    $: update_line(lts, s, s_target, dual, tune_target);
    $: midx = (line.p1.x + line.p2.x)/2;
    $: midy = (line.p1.y + line.p2.y)/2;
    $: dx = 100*(line.p2.x - line.p1.x)/Math.sqrt((line.p2.x-line.p1.x)**2+(line.p2.y-line.p1.y)**2);
    $: dy = 100*(line.p2.y - line.p1.y)/Math.sqrt((line.p2.x-line.p1.x)**2+(line.p2.y-line.p1.y)**2);


</script>

<line x1={midx+dx} y1={midy+dy} x2={midx-dx} y2={midy-dy} stroke="{line.col}" stroke-width="2"/>
<text 
    x={midx-1.2*(dx)} 
    y={midy-1.2*(dy)} 
    fill="black" 
    font-size="16" 
    text-anchor="middle" 
    dominant-baseline="middle"
>
    {label}
</text>
