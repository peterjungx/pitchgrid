<script lang='ts'>
    import Lattice from './Lattice.svelte';
    import LatticePath from './LatticePath.svelte';
    import WindowLattice from './WindowLattice.svelte';
    import FullsizeLattice from './FullsizeLattice.svelte';
    import StripLattice from './StripLattice.svelte';
    import { Grid, Space,  Button } from '@svelteuidev/core';
    import Slider from '$lib/components/Slider.svelte';

    import { angle, calc_scale } from './lattice_math';
    import type {system, MappedScaleDisplayData} from './lattice_math';

    import {ConsistentTuning} from '$lib/consistent_tuning';
    import type {TuningData} from '$lib/consistent_tuning';

    

    let w=0, h=0;
    $: centerX = w/2;
    $: centerY = h/2;

    //type coord = {x:number, y:number};
    //// find affine transform that maps p1_src to p1_tgt, p2_src to p2_tgt, p3_src to p3_tgt
    //function solve_affine_t(p1_src:coord, p2_src:coord, p3_src:coord, p1_tgt:coord, p2_tgt:coord, p3_tgt:coord){
    //    let m = [
    //        [p1_src.x, p1_src.y, 1, 0, 0, 0],
    //        [0, 0, 0, p1_src.x, p1_src.y, 1],
    //        [p2_src.x, p2_src.y, 1, 0, 0, 0],
    //        [0, 0, 0, p2_src.x, p2_src.y, 1],
    //        [p3_src.x, p3_src.y, 1, 0, 0, 0],
    //        [0, 0, 0, p3_src.x, p3_src.y, 1],
    //    ];
    //    //let sol = multiply(inv(m), [[p1_tgt.x], [p1_tgt.y], [p2_tgt.x], [p2_tgt.y], [p3_tgt.x], [p3_tgt.y]]);
    //    let sol = multiply(inv(m), [p1_tgt.x, p1_tgt.y, p2_tgt.x, p2_tgt.y, p3_tgt.x, p3_tgt.y]);
    //    
    //    let res = {
    //        //m11:sol[0][0], m12:sol[1][0], m21:sol[3][0], m22:sol[4][0], dx:sol[2][0] ,dy:sol[5][0]
    //        m11:sol[0], m12:sol[1], m21:sol[3], m22:sol[4], dx:sol[2] ,dy:sol[5]
    //    };
    //    console.log(res);
    //    return res
    //}
    //let generator_coord = {aa:1, bb:3};
    //function update_generator_coord(s:system){
    //    generator_coord = calc_generator_coord(s);
    //}
    //$: update_generator_coord(display_data.s);
    //$: aff = solve_affine_t({x:0, y:0}, {x:display_data.s.a, y:display_data.s.b}, {x:generator_coord.aa,y:generator_coord.bb}, {x:0, y:0}, {x:x_scale_factor, y:0}, {x:G*x_scale_factor, y:0.05*y_scale_factor});

    let display_data:MappedScaleDisplayData = {
        s: {a:2,b:5},
        s_target: {a:2,b:5},
        s_tune: {a:2,b:5},
        tune_target: false,
        dual: false,
        edge_length: 50,
    }

    let G = .6052;
    let depth = 3;

    let window_width = 12;
    let window_offset = 4;
    let y_scale_factor = 15;
    let x_scale_factor = 6;


    //function check_node_in_window(s:system, node:nodecoord){
    //    let node_offset = s.a * node.bb - s.b * node.aa
    //    return node_offset + window_offset >= 1 && node_offset + window_offset <= window_width;
    //}
    function update_mode(window_offset:number, window_width:number, s:system){
        if (window_offset > window_width){
            window_offset = window_width;
        }
        let min_node_offset_mode = 1 - mode;
        let max_node_offset_mode = s.a+s.b - mode;
        if (min_node_offset_mode <= -window_offset){
            mode --;
        }if (max_node_offset_mode > window_width - window_offset){
            mode ++;
        }
    }
    $: update_mode(Math.round(window_offset), window_width, display_data.s);


    function calc_G_from_angle(angle:number, a:number, b:number){
        let alpha = angle-Math.atan2(a, b)
        let d = 0;
        while (!(a==1 && b==1)){
            if (a>b){
                a=a-b;
                alpha = Math.atan2(Math.tan(alpha)+1, 1);
            }else{
                b=b-a;
                alpha = Math.atan2(1, 1/Math.tan(alpha)+1);
            }
            d++;
        }
        G = 2*alpha/Math.PI;
        depth = d;
    }
    function on_G_change(_G:number){
        //if(freeze_mapping){
        //    G_s = (_G*Math.PI/2 + Math.atan2(display_data.s.a,display_data.s.b));
        //    return;
        //}

        let alpha = _G*Math.PI/2;
        let a = 1;
        let b = 1;
        for (let d=0;d<depth;d++){
            if (alpha>Math.PI/4){
                // g
                a=a+b;
                alpha = Math.atan2(Math.tan(alpha)-1, 1);
            }else{
                // f
                b=a+b;
                alpha = Math.atan2(1, 1/Math.tan(alpha)-1);
            }
        }
        G_s = (alpha+Math.atan2(a,b));
        if(!freeze_mapping){
            display_data.s_tune.a = display_data.s.a = display_data.s_target.a = a;
            display_data.s_tune.b = display_data.s.b = display_data.s_target.b = b;
        }
        //display_data.s_tune.a = display_data.s.a = display_data.s_target.a = a;
        //display_data.s_tune.b = display_data.s.b = display_data.s_target.b = b;
    }
    $:on_G_change(G);
    $:calc_G_from_angle(G_s, display_data.s.a, display_data.s.b);

    $: a_angle = Math.atan2(display_data.s_target.b, display_data.s_target.a);
    let a_scale = x_scale_factor*window_width/12/Math.sqrt(display_data.s_target.b**2 + display_data.s_target.a**2);
    function update_a_scale(s:system, x_scale_factor:number, window_width:number){
        a_scale = x_scale_factor*window_width/12/Math.sqrt(s.b**2 + s.a**2);
    };
    $: update_a_scale(display_data.s_target, x_scale_factor, window_width);

    let a_skew_x = Math.tan((Math.PI/2-angle(display_data.s_target.a, display_data.s_target.b, -2, 1)))+0.00001;
    function update_a_skew_x(G_s:number){
        a_skew_x = Math.tan((Math.PI/2-G_s))+0.00001;
    };
    $: update_a_skew_x(G_s); 
    $:a_scale_y = y_scale_factor/(x_scale_factor*(window_width/12)**2)* (display_data.s_target.a**2 + display_data.s_target.b**2) / display_data.edge_length;
    $: a_dx = 0;
    $: a_dy = -window_offset/(window_width/12)*y_scale_factor;
    $: a_A = a_scale * Math.cos(a_angle);
    $: a_B = a_scale * Math.sin(-a_angle);
    $: a_C = a_scale * Math.sin(a_angle);
    $: a_D = a_scale * Math.cos(a_angle);

    $: affine_t = {
        m11:a_A + a_C*a_skew_x,
        m12:a_B + a_D*a_skew_x,
        m21:a_C * a_scale_y,
        m22:a_D * a_scale_y ,
        dx:a_dx,
        dy:a_dy
    };

    let octave = 2;
    let base_tune = 0;
    function update_base_tune(base_tune:number){
        tuning_data.base_freq = 440/2**(9/12+base_tune);
    }
    $: update_base_tune(base_tune);
    let tuning_data:TuningData = {
        base_freq: 440/2**(9/12+base_tune),
        tuning: new ConsistentTuning(display_data.s_tune.a, display_data.s_tune.b, octave, 1, 0, octave**(1/(display_data.s_tune.a+2*display_data.s_tune.b))),
    }
    let mode = 2;

    //const cmajor_scale = calc_scale({a:2,b:5}, 1);

    let oct_below = 2;
    let oct_above = 2;
    $: scale = calc_scale(display_data.s, mode-1, oct_below, oct_above);
    $: scale_base = calc_scale(display_data.s, mode-1);


    let G_s = angle(display_data.s_tune.a, display_data.s_tune.b, -2, 1); // degrees relative to octave direction in the tuning system used.

    let octave_freq = tuning_data.base_freq * tuning_data.tuning.coord_to_freq(display_data.s_tune.a, display_data.s_tune.b);
    let calcdfreq = tuning_data.base_freq * tuning_data.tuning.coord_to_freq(1,0);

    function update_on_tuning_param_change(octave:number, G_s:number, s_tune:system) {
        let large_to_small = -1/Math.tan((angle(0,1,s_tune.b,s_tune.a) + G_s));
        let a_cent = 1200 / (s_tune.a+large_to_small*s_tune.b);
        let a_freq_ratio = octave**(a_cent/1200);
        tuning_data.tuning.setup(s_tune.a, s_tune.b, octave, 1, 0, a_freq_ratio);
        tuning_data = tuning_data;
        octave_freq = tuning_data.base_freq * tuning_data.tuning.coord_to_freq(s_tune.a, s_tune.b)
        
        scale = scale;
        calcdfreq = tuning_data.base_freq * tuning_data.tuning.coord_to_freq(0,1);

    }
    $: update_on_tuning_param_change(octave, G_s, display_data.s_tune);

    let Down = ()=>{
        let a = display_data.s.a;
        let b = display_data.s.b;
        let alpha = G_s-Math.atan2(a, b)
        let t = Math.tan(alpha);
        if (alpha>Math.PI/4){
            // g
            a=a+b;
            G_s = (Math.atan2(t-1, 1)+Math.atan2(a, b));
        }else{
            // f
            b=a+b;
            G_s = (Math.atan2(1, 1/t-1)+Math.atan2(a, b));
        }
        display_data.s_tune.a = display_data.s.a = display_data.s_target.a = a; 
        display_data.s_tune.b = display_data.s.b = display_data.s_target.b = b;


    };
    let Up = ()=>{
        if (display_data.s.a==1 && display_data.s.b==1){
            return;
        }

        let a = display_data.s.a;
        let b = display_data.s.b;
        let alpha = G_s-Math.atan2(a, b)
        let t = Math.tan(alpha);

        if (a>b){
            // g^-1
            a=a-b;
            G_s = (Math.atan2(t+1, 1)+Math.atan2(a, b));
        }else{
            // f^-1
            b=b-a;
            G_s = (Math.atan2(1, 1/t+1)+Math.atan2(a, b));
        }
        display_data.s_tune.a = display_data.s.a = display_data.s_target.a = a;
        display_data.s_tune.b = display_data.s.b = display_data.s_target.b = b;
    };

    $:cpa_slider_min = Math.atan2(display_data.s_target.a, display_data.s_target.b);
    $:cpa_slider_max = Math.atan2(display_data.s_target.a, display_data.s_target.b)+Math.PI/2;
    


    let start_midi = 60;


    import {get_nodes_for_midi_in_strip} from './lattice_math';
    import ConstantPitchLine from './ConstantPitchLine.svelte';
    let nodes_for_midi_in_strip:any[] = [];
    function update_nodes_for_midi_in_strip(s:system, tuning:ConsistentTuning, min_det:number=-5, max_det:number=6, midi_offset:number=60){
        nodes_for_midi_in_strip = get_nodes_for_midi_in_strip(s, tuning, min_det, max_det, midi_offset);
        //console.log('nodes_for_midi_in_strip', nodes_for_midi_in_strip);
    }
    $: update_nodes_for_midi_in_strip(display_data.s, tuning_data.tuning, 1-Math.round(window_offset), window_width-Math.round(window_offset), start_midi);

    let freeze_mapping:boolean = false;

</script>

<style>
    .container {
        position: absolute;
        overflow:hidden;
        left:0px;
        right:0px;
        top:100px;
        bottom:0px;
        /*border: 1px solid red;*/
        /*background-color: #FFB319;*/
        background-color: #B8DFD8;
    }
    
</style>

<Grid cols={12}>

    <Grid.Col span={1}>
        <!--
        <Space h={5}/>
        level={depth}
        <Space h={5}/>
        a={display_data.s.a} b={display_data.s.b}
        <Space h={5}/>
        mode={mode}
        -->
        <!--<Space h={5}/>
        g=({generator_coord.aa}, {generator_coord.bb})-->
    </Grid.Col>
    <Grid.Col span={2}>
        <Space h={10}/>
        <Button 
            size="sm" 
            on:click={Down}
            disabled={freeze_mapping}
        >+</Button>
        <Space h={5}/>
        <Button
            size="sm" 
            on:click={Up}
            disabled={freeze_mapping}
        >-</Button>
    </Grid.Col>
    <Grid.Col span={2}>
        <Space h={5}/>
        base {base_tune.toFixed(3)}
        <Slider bind:value={base_tune} min={-1} max={1} step={0.0001} />
        stretch {octave.toFixed(3)}
        <Slider bind:value={octave} min={0.2} max={4.5} step={0.0001} />
    </Grid.Col>
    <Grid.Col span={2}>
        <Space h={5}/>
        angle coarse {G.toFixed(3)}
        <Slider bind:value={G} min={0} max={1} step={0.0001}/>
        angle fine {G_s.toFixed(3)}
        <Slider bind:value={G_s} bind:min={cpa_slider_min} bind:max={cpa_slider_max} step={0.001} />
        <Space h={5}/>
    </Grid.Col>
    <Grid.Col span={2}>
        <Space h={5}/>
        period {window_width}
        <Slider bind:value={window_width} min={2} max={36} step={1} disabled={freeze_mapping}/>
        offset {Math.round(window_offset)}
        <Slider bind:value={window_offset} min={1} bind:max={window_width} step={0.1} disabled={freeze_mapping} />
    </Grid.Col>
    <Grid.Col span={2}>
        <!--start midi {start_midi}
        <Slider bind:value={start_midi} min={30} max={90} step={1}/>
        <Space h={15}/>
        <Checkbox bind:checked={freeze_mapping} label="freeze mapping" />-->
    </Grid.Col>

    <Grid.Col span={2}>
        <!--x_scale_factor {x_scale_factor.toFixed(2)}
        <Slider bind:value={x_scale_factor} min={1} max={20} step={0.0001} />
        y_scale_factor {y_scale_factor.toFixed(2)}
        <Slider bind:value={y_scale_factor} min={2} max={36} step={0.0001} />
        <Space h={5}/>-->
    </Grid.Col>
    <Grid.Col span={1}></Grid.Col>
</Grid>
<Grid cols={12}>
    <Grid.Col span={12}>
        
    </Grid.Col>
</Grid>
<!--
<Grid cols={12}>
    <Grid.Col span={2}>
        <Slider bind:value={a_dx} min={-500} max={500} step={0.0001} />
    </Grid.Col>
    <Grid.Col span={2}>
        <Slider bind:value={a_dy} min={-500} max={500} step={0.0001} />
    </Grid.Col>
    <Grid.Col span={2}>
        <Slider bind:value={a_angle} min={0} max={2*Math.PI} step={0.0001} />
    </Grid.Col>
    <Grid.Col span={2}>
        
    </Grid.Col>
    <Grid.Col span={2}>
        <Slider bind:value={a_skew_x} min={-3} max={3} step={0.0001} />
    </Grid.Col>
    <Grid.Col span={2}>
        <Slider bind:value={a_scale_y} min={-3} max={3} step={0.0001} />
    </Grid.Col>
</Grid>
-->

<div class="container" bind:clientWidth={w} bind:clientHeight={h}>
    <svg width="100%" height="100%" viewBox="{-centerX} {-centerY} {w} {h}" xmlns="http://www.w3.org/2000/svg">
            

            <FullsizeLattice 
                s={display_data.s} 
                affine_t={affine_t}
                edge_length={display_data.edge_length} 
                xmin={-w/2}
                xmax={w/2}
                ymin={-y_scale_factor*(12+0.5)-50}
                ymax={50}
                color="#C0C0C0"
            />
            <!--
            <StripLattice
                s={display_data.s}
                edge_length={display_data.edge_length}
                color="#88C"
                affine_t={affine_t}
                nodes={nodes_for_midi_in_strip.map(e=>{return e.c})}
                
            />
            -->
            <Lattice 
                bind:s={display_data.s_target} 
                bind:affine_t
                edge_length={display_data.edge_length} 
                show_rects={true}
            />
            
            <!--<Lattice bind:s edge_length={50} show_rects color="blue" bind:s_target bind:dual/>-->
            <LatticePath 
                bind:display_data
                bind:tuning_data
                bind:scale={scale} 
                bind:affine_t
                color="#404040" 
                showConstantPitchLines={false}
                variant={1}
                show_text={false}
                show_alt_text={false}
                oct_below={oct_below}
                oct_above={oct_above}
            />

            <!--<rect x={-centerX} y={0-y_scale_factor*(12+0.5)} width={w} height={y_scale_factor*12} fill="green" opacity="0.2"/>-->
            <rect x={-centerX} y={-centerY} width={w} height={centerY-y_scale_factor*(12+0.5)} fill="black" opacity="0.4"/>
            <rect x={-centerX} y={0-y_scale_factor*0.5} width={w} height={centerY+y_scale_factor*0.5} fill="black" opacity="0.4"/>
            
            <WindowLattice 
                s={display_data.s}
                edge_length={display_data.edge_length}
                color="green"
                affine_t={affine_t}
                tuning_data={tuning_data}
                window_width={window_width}
                window_offset={Math.round(window_offset)}
                bind:root_midi={start_midi}
                bind:scale
                bind:oct_above
                bind:oct_below
            />
            
            <!--
            <Lattice 
                bind:s={display_data.s_target} 
                affine_t={{m11:0.7, m12:0, m21:0, m22:0.7, dx:-centerX+50+display_data.s.a*18, dy:-centerY+50+display_data.s.b*18}}
                edge_length={display_data.edge_length} 
                show_rects={true}
            />            
            <LatticePath 
                bind:display_data
                bind:tuning_data
                bind:scale={scale_base} 
                affine_t={{m11:0.7, m12:0, m21:0, m22:0.7, dx:-centerX+50+display_data.s.a*18, dy:-centerY+50+display_data.s.b*18}}
                color="#404040" 
                showConstantPitchLines={true}
                variant={1}
                show_alt_text={false}
            />
            -->
            <!--
            <Lattice 
                bind:s={display_data.s_target} 
                affine_t={aff}
                edge_length={display_data.edge_length} 
                show_rects={true}
            />   
            
            <circle cx={0} cy={0} r={5} fill="red"/>
            <circle cx={apply_affine(aff,{x:generator_coord.aa*50, y:generator_coord.bb*50}).x} cy={apply_affine(aff,{x:generator_coord.aa*50, y:generator_coord.bb*50}).y} r={5} fill="red"/>
            
            <circle cx={0} cy={0} r={5} fill="red"/>
            <rect x={-w/4} y={-h/4} width={w/2} height={h/2} fill="black" opacity="0.4"/>
            -->
            
    </svg>
</div>
<!--<ContextMenu />-->