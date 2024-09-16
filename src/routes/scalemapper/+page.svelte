<script lang='ts'>
    import Lattice from './Lattice.svelte';
    import LatticePath from './LatticePath.svelte';
    import ConstantPitchLine from './ConstantPitchLine.svelte';
    //import ContextMenu from './ContextMenu.svelte';
    import { Grid, NativeSelect, Checkbox, Space, NumberInput,ActionIcon, Group, Button } from '@svelteuidev/core';
    import {  QuestionMark, Play, Stop } from 'radix-icons-svelte';
    import Slider from '$lib/components/Slider.svelte';

    import { angle, coprime_tree, calc_scale } from './lattice_math';
    import type {system, MappedScaleDisplayData} from './lattice_math';

    import {ConsistentTuning, cont_frac} from '$lib/consistent_tuning';
    //import { applyAction } from '$app/forms';
    import type {TuningData} from '$lib/consistent_tuning';

    let coprime_tree_str = coprime_tree.map(e=>`${e.a},${e.b}`);

    let w=0, h=0;
    $: centerX = w/2;
    $: centerY = h/2;

    let display_data:MappedScaleDisplayData = {
        s: {a:3,b:5},
        s_target: {a:2,b:5},
        s_tune: {a:3,b:5},
        tune_target: false,
        dual: false,
        edge_length: 70,
    }
    let octave = 2;

    let tuning_data:TuningData = {
        base_freq: 440/2**(9/12),
        tuning: new ConsistentTuning(display_data.s_tune.a, display_data.s_tune.b, octave, 1, 0, octave**(1/(display_data.s_tune.a+2*display_data.s_tune.b))),
    }

    let sys_orig='3,5';
    $: [display_data.s.a, display_data.s.b] = sys_orig.split(',').map(e=>parseInt(e));
    let sys_target='2,5';
    $: [display_data.s_target.a, display_data.s_target.b] = sys_target.split(',').map(e=>parseInt(e));

    let mode = 2;


    const cmajor_scale = calc_scale({a:2,b:5}, 1);
    $: scale = calc_scale(display_data.s, mode-1);
    let current_tuning = '<3,5>-1:2-ET'
    let constant_pitch_angle = angle(display_data.s_tune.a, display_data.s_tune.b, -2, 1); // degrees relative to octave direction in the tuning system used.

    function update_s_tune(s:system, s_target:system, tune_target:boolean) {
        display_data.s_tune = tune_target?s_target:s;
        current_tuning = `<${display_data.s_tune.a},${display_data.s_tune.b}>` + current_tuning.slice(current_tuning.indexOf('-'));
        let [ra, rb] = current_tuning.split('-')[1].split(':').map(e=>parseFloat(e));
        constant_pitch_angle = angle(display_data.s_tune.a, display_data.s_tune.b, -rb, ra);
        console.log('current_tuning', current_tuning);

        tuning_data = tuning_data;
    }
    $: update_s_tune(display_data.s, display_data.s_target, display_data.tune_target);


    function parse_tuning(tuning:string) {
        // read the tuning string ""<3,5>-1:2-ET"
        // <3,5> -> system = {a:3,b:5}
        // 1:2-ET -> a anb b have relative interval sizes of 1:2
        // Supported ETs ra:rb with ra and rb numbers between 1 and 5
        // Also support special tuning labels besided ET, like <3,5>-Pythagorean
        
        let string_items = tuning.split('-');
        let [a,b] = string_items[0].slice(1,-1).split(',').map(e=>parseInt(e));
        if (string_items.length == 3 && string_items[2] == 'ET') {
            let [ra,rb] = string_items[1].split(':').map(e=>parseFloat(e));
            return {sys:{a,b}, et:{ra,rb}, temp:'ET'};
        }else{
            return {sys:{a,b}, et:null, temp:string_items[2]};
        }
    }

    function cycle_tuning() {
        // cycle between ETs 
        let et_list = ['1:2', '1:3', '1:4', '2:1', '2:3', '3:1', '3:2', '3:4', '3:5', '4:1', '4:3', '4:5', '5:3', '5:4', '1:1'] 
        let {sys, et, temp} = parse_tuning(current_tuning);
        if (temp != 'ET' || !et) return;

        let et_str = `${et.ra}:${et.rb}`;
        let idx = et_list.indexOf(et_str);
        let next_et_str = et_list[(idx+1)%et_list.length];
        current_tuning = `<${sys.a},${sys.b}>-${next_et_str}-ET`;
        octave = 2;
        
        let [ra, rb] = next_et_str.split(':').map(e=>parseFloat(e));
        constant_pitch_angle = angle(sys.a, sys.b, -rb, ra);
    }
    
    //let base_freq = 440/2**(9/12);
    let octave_freq = tuning_data.base_freq * tuning_data.tuning.coord_to_freq(display_data.s_tune.a, display_data.s_tune.b);
    let calcdfreq = tuning_data.base_freq * tuning_data.tuning.coord_to_freq(1,0);

    function update_on_tuning_param_change(octave:number, constant_pitch_angle:number, s_tune:system) {
        let large_to_small = -1/Math.tan((angle(0,1,s_tune.b,s_tune.a) + constant_pitch_angle)/180*Math.PI);
        //console.log('constant_pitch_angle', constant_pitch_angle)
        //console.log('large_to_small', large_to_small, );
        let a_cent = 1200 / (s_tune.a+large_to_small*s_tune.b);
        let a_freq_ratio = octave**(a_cent/1200);
        tuning_data.tuning.setup(s_tune.a, s_tune.b, octave, 1, 0, a_freq_ratio);
        tuning_data = tuning_data;
        octave_freq = tuning_data.base_freq * tuning_data.tuning.coord_to_freq(s_tune.a, s_tune.b)
        
        //console.log(1200*Math.log2(tuning_data.tuning.coord_to_freq(1,0)), 1200*Math.log2(tuning_data.tuning.coord_to_freq(0,1)));

        scale = scale;
        calcdfreq = tuning_data.base_freq * tuning_data.tuning.coord_to_freq(0,1);

    }
    $: update_on_tuning_param_change(octave, constant_pitch_angle, display_data.s_tune);

    let play = false;

    $: target_major_scale = calc_scale(display_data.s_target, 1);
    
</script>

<style>
    .container {
        position: absolute;
        overflow:hidden;
        left:0px;
        right:0px;
        top:69px;
        bottom:0px;
        /*border: 1px solid red;*/
        /*background-color: #FFB319;*/
        background-color: #FFFFFF;
    }
</style>

<Grid cols={16}>
    <Grid.Col span={2}>
        <NativeSelect 
            bind:value={sys_orig}
            label="Origin Scale" 
            data={coprime_tree_str}
        />
    </Grid.Col>
    <Grid.Col span={2}>
        <NativeSelect 
            bind:value={sys_target}
            label="Target Scale" 
            data={coprime_tree_str}
        />
    </Grid.Col>
    <Grid.Col span={2}>
        <NumberInput bind:value={mode} min={1} max={display_data.s.a+display_data.s.b} label="Mode" />
    </Grid.Col>
    <Grid.Col span={3}>
        <Space h={5}/>
        <Checkbox bind:checked={display_data.dual} label="Dual Lattice" />
        <Space h={5}/>
        <Checkbox bind:checked={display_data.tune_target} label="Tune Target" />
    </Grid.Col>
    <Grid.Col span={3}>
        <Space h={5}/>
        <Slider bind:value={octave} min={0.5} max={2.5} step={0.0001} />
        <Space h={5}/>
        <Slider bind:value={constant_pitch_angle} min={0} max={180} step={0.01} />
    </Grid.Col>
    <Grid.Col span={3}>
        <Space h={15}/>
        <Button 
            size="sm" 
            on:click={cycle_tuning}
        >Cycle Tuning {current_tuning}</Button>
    </Grid.Col>
    <Grid.Col span={1}>
        <Group>
            <ActionIcon variant="default">
                <a href="MOS_Revisited.pdf" download><QuestionMark /></a>
            </ActionIcon>
            <ActionIcon variant="default">
                <button on:click={()=>{play=!play}}>{#if play}<Stop />{:else}<Play />{/if}</button>
            </ActionIcon>
        </Group>
    </Grid.Col>
</Grid>

<div class="container" bind:clientWidth={w} bind:clientHeight={h}>
    <svg width="100%" height="100%" viewBox="{-centerX} {-centerY} {w} {h}" xmlns="http://www.w3.org/2000/svg">
        <Lattice 
            bind:s={display_data.s_target} 
            edge_length={display_data.edge_length} 
            show_rects={false}
        />
        
        <LatticePath 
            bind:display_data
            bind:tuning_data
            bind:path={target_major_scale} 
            within_target={true}
            color="#B0B0B0"
            showConstantPitchLines={false}

        />
        
        <!--<Lattice bind:s edge_length={50} show_rects color="blue" bind:s_target bind:dual/>-->
        <LatticePath 
            bind:display_data
            bind:tuning_data
            bind:path={scale} 
            color="#303030" 
            bind:play
            showConstantPitchLines={true}
            variant={2}
            show_alt_text={false}
        />



    </svg>
</div>
<!--<ContextMenu />-->