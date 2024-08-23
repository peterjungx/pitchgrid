<script lang='ts'>
    import Lattice from './Lattice.svelte';
    import LatticePath from './LatticePath.svelte';
    import ConstantPitchLine from './ConstantPitchLine.svelte';
    import { Grid, NativeSelect, Checkbox, Space, NumberInput,ActionIcon, Group, Button } from '@svelteuidev/core';
    import {  QuestionMark, Play, Stop } from 'radix-icons-svelte';
    import Slider from '$lib/components/Slider.svelte';

    import { angle, coprime_tree, calc_scale } from './lattice_math';
    import type {system} from './lattice_math';

    import {ConsistentTuning} from '$lib/consistent_tuning';

    let coprime_tree_str = coprime_tree.map(e=>`${e.a},${e.b}`);

    let w=0, h=0;
    $: centerX = w/2;
    $: centerY = h/2;

    let s:system = {a:3,b:5};
    let s_target:system = {a:2,b:5};

    let sys_orig='3,5';
    $: [s.a, s.b] = sys_orig.split(',').map(e=>parseInt(e));
    let sys_target='2,5';
    $: [s_target.a,s_target.b] = sys_target.split(',').map(e=>parseInt(e));

    let dual = false
    let mode = 2;


    const cmajor_scale = calc_scale({a:2,b:5}, 1);
    $: scale = calc_scale(s, mode-1);
    let tune_target = false;
    let current_tuning = '<3,5>-1:2-ET'
    let s_tune:system = tune_target?s_target:s;
    let octave = 2;
    let constant_pitch_angle = angle(s_tune.a, s_tune.b, -2, 1); // degrees relative to octave direction in the tuning system used.

    function update_s_tune(s:system, s_target:system, tune_target:boolean) {
        s_tune = tune_target?s_target:s;
        current_tuning = `<${s_tune.a},${s_tune.b}>` + current_tuning.slice(current_tuning.indexOf('-'));
        let [ra, rb] = current_tuning.split('-')[1].split(':').map(e=>parseFloat(e));
        constant_pitch_angle = angle(s_tune.a, s_tune.b, -rb, ra);
        console.log('current_tuning', current_tuning);
    }
    $: update_s_tune(s, s_target, tune_target);



    let temperament = new ConsistentTuning(s_tune.a, s_tune.b, octave, 1, 0, octave**(1/(s_tune.a+2*s_tune.b)));


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
        //console.log(sys.a, sys.b, next_et_str, constant_pitch_angle);
    }
    
    let base_freq = 440;
    let octave_freq = base_freq * temperament.coord_to_freq(s_tune.a, s_tune.b);
    function update_on_tuning_param_change(octave:number, constant_pitch_angle:number, s_tune:system) {
        let large_to_small = -1/Math.tan((angle(0,1,s_tune.b,s_tune.a) + constant_pitch_angle)/180*Math.PI);
        console.log('constant_pitch_angle', constant_pitch_angle)
        console.log('large_to_small', large_to_small, );
        let a_cent = 1200 / (s_tune.a+large_to_small*s_tune.b);
        let a_freq_ratio = octave**(a_cent/1200);
        temperament.setup(s_tune.a, s_tune.b, octave, 1, 0, a_freq_ratio);
        base_freq = base_freq
        octave_freq = base_freq * temperament.coord_to_freq(s_tune.a, s_tune.b)
        
        console.log(1200*Math.log2(temperament.coord_to_freq(1,0)), 1200*Math.log2(temperament.coord_to_freq(0,1)));
    }
    $: update_on_tuning_param_change(octave, constant_pitch_angle, s_tune);

    let play = false;
    
</script>

<style>
    .container {
        position: absolute;
        overflow:hidden;
        left:0px;
        right:0px;
        top:68px;
        bottom:0px;
        /*border: 1px solid red;*/
        background-color: #FFB319;
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
        <NumberInput bind:value={mode} min={1} max={s.a+s.b} label="Mode" />
    </Grid.Col>
    <Grid.Col span={3}>
        <Space h={5}/>
        <Checkbox bind:checked={dual} label="Dual Lattice" />
        <Space h={5}/>
        <Checkbox bind:checked={tune_target} label="Tune Target" />
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
        <Lattice bind:s={s_target} edge_length={50} show_rects={false}/>
        {#if s_target.a===2 && s_target.b===5}
            <LatticePath bind:s={s_target} edge_length={50} path={cmajor_scale} color="#A0A0A0"/>
        {/if}

        <ConstantPitchLine
        bind:s
        bind:s_target
        bind:s_tune
        bind:dual
        bind:constant_pitch_angle
        bind:tune_target
        bind:freq={base_freq}
        edge_length={50}
    />
    <ConstantPitchLine
        bind:s
        bind:s_target
        bind:s_tune
        bind:s_offset={s_tune}
        bind:freq={octave_freq}
        bind:dual
        bind:constant_pitch_angle
        bind:tune_target
        edge_length={50}
    />
        <!--<Lattice bind:s edge_length={50} show_rects color="blue" bind:s_target bind:dual/>-->
        <LatticePath 
            bind:s 
            edge_length={50} 
            bind:path={scale} 
            bind:s_target
            bind:dual 
            color="#303030" 
            bind:temperament
            bind:play
            bind:tune_target
        />



    </svg>
</div>