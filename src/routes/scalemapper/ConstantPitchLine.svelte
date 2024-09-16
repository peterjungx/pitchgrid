<script lang="ts">

    import type { edge, system, node, MappedScaleDisplayData } from './lattice_math';
    import { angle, apply_lattice_transform, edge_at_coords } from './lattice_math';
    import type { TuningData } from '$lib/consistent_tuning';
    import {ConsistentTuning, cont_frac} from '$lib/consistent_tuning';
    import { abs, e } from 'mathjs';

    export let node:node;
    export let tuning_data:TuningData
    export let display_data:MappedScaleDisplayData
    export let constant_pitch_angle:number


    let freq:number;
    let label:string = '';

    $: b_enh = Math.cos(constant_pitch_angle);
    $: a_enh = Math.sin(constant_pitch_angle);
    
    //$: lts = -1/Math.tan((angle(0,1,display_data.s_tune.b,display_data.s_tune.a) + constant_pitch_angle)/180*Math.PI);
    /// export function edge_at_coords(c1:nodecoord, c2:nodecoord, s:system, scale:number, col:string):edge{

    let line:edge
    
    let display_freq:boolean = false;

    function update_line(
        node:node, 
        a_enh:number, 
        b_enh:number, 
        s_tune:system, 
        s_target:system, 
        dual:boolean, 
        tune_target:boolean,
        base_freq:number,
        tuning:ConsistentTuning
    ) {

        let n:node = {c:node.c, p:node.p, col:node.col, text:node.text};
        let freq_ratio:number;
        if(!tune_target){
            apply_lattice_transform([n], s_target, s_tune, display_data.edge_length, dual);
            freq_ratio = tuning.coord_to_freq(n.c.aa, n.c.bb);
            //console.log(`node tgt (${node.c.aa},${node.c.bb}), node tune (${n.c.aa},${n.c.bb}), freq=${freq}`);
            line = edge_at_coords({aa:n.c.aa + a_enh, bb:n.c.bb + b_enh}, {aa:n.c.aa - a_enh, bb:n.c.bb - b_enh}, display_data.s_tune, display_data.edge_length, 'black');
            apply_lattice_transform([line], s_tune, s_target, display_data.edge_length, dual);
        }else{
            freq_ratio = tuning.coord_to_freq(n.c.aa, n.c.bb);
            //console.log(`node tgt (${node.c.aa},${node.c.bb}), node tune (${n.c.aa},${n.c.bb}), freq=${freq}`);
            line = edge_at_coords({aa:n.c.aa + a_enh, bb:n.c.bb + b_enh}, {aa:n.c.aa - a_enh, bb:n.c.bb - b_enh}, display_data.s_tune, display_data.edge_length, 'black');
        }

        let freq = base_freq * freq_ratio;
        
        let f_cf = cont_frac(freq_ratio, 0.05)
        //label = `${f_cf.num}/${f_cf.den}${f_cf.err>0?"":"+"}${(1200*(Math.log2(freq_ratio)-Math.log2(f_cf.num/f_cf.den)))}ct`;
        let ct_deviation = 1200*(Math.log2(freq_ratio)-Math.log2(f_cf.num/f_cf.den));
        if (abs(ct_deviation) < 0.5){
            label = `${f_cf.num}/${f_cf.den}`;
        }else{
            label = `${f_cf.num}/${f_cf.den}${f_cf.err>0?"":"+"}${ct_deviation.toFixed(0)}ct`;
        }
        if (display_freq){
            label += ` (${freq.toFixed(1)}Hz)`;
        }else{
            label += ` (${(1200*Math.log2(freq_ratio)).toFixed(0)}ct)`;
        }
        


    }
    $: update_line(
        node, 
        a_enh, 
        b_enh, 
        display_data.s, 
        display_data.s_target, 
        display_data.dual, 
        display_data.tune_target,
        tuning_data.base_freq,
        tuning_data.tuning
    );
    $: midx = (line.p1.x + line.p2.x)/2;
    $: midy = (line.p1.y + line.p2.y)/2;
    $: linelen = Math.sqrt((line.p2.x-line.p1.x)**2+(line.p2.y-line.p1.y)**2)
    $: unit_dx = display_data.edge_length/linelen * (line.p2.x > line.p1.x? line.p2.x - line.p1.x : line.p1.x - line.p2.x)
    $: unit_dy = display_data.edge_length/linelen * (line.p2.x > line.p1.x? line.p2.y - line.p1.y : line.p1.y - line.p2.y)
    $: dx = (2+display_data.s_target.a - node.c.aa)*unit_dx;
    $: dy = (2+display_data.s_target.a - node.c.aa)*unit_dy;
    $: node_is_root = (node.c.aa==0 && node.c.bb==0) || (node.c.aa==display_data.s_target.a && node.c.bb==display_data.s_target.b);


</script>

<line 
    x1={midx+dx} 
    y1={midy+dy} 
    x2={midx-(node_is_root?2*unit_dx:0)} 
    y2={midy-(node_is_root?2*unit_dy:0)} 
    stroke={node_is_root?"rgb(21,170,191)":"#FFB319"} 
    stroke-width="2"
/>
<text 
    x={midx+(dx)+2} 
    y={midy+(dy)+2} 
    fill={node_is_root?"rgb(21,170,191)":"#FFB319"} 
    font-size="16" 
    text-anchor="left" 
    dominant-baseline="bottom"
>
    {label}
</text>
