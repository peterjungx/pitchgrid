<script lang='ts'>
    import { onMount } from 'svelte';
    import Lattice from './Lattice.svelte';
    import LatticePath from './LatticePath.svelte';
    import { Grid, NativeSelect, Checkbox, Space, NumberInput,ActionIcon, Group } from '@svelteuidev/core';
    import {  QuestionMark } from 'radix-icons-svelte';
    import Slider from '$lib/components/Slider.svelte';

    import { coprime_tree, calc_scale } from './lattice_math';
    import type {system} from './lattice_math';
    let coprime_tree_str = coprime_tree.map(e=>`${e.a},${e.b}`);

    onMount(() => {
        console.log('mos')
    })

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
    let mode = 1;
    let tune_origin = false;


    const cmajor_scale = calc_scale({a:2,b:5}, 5);
    $: scale = calc_scale(s, mode-1);

    let octave = 2;
    let constant_pitch_direction = 1;

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
    <Grid.Col span={3}>
        <NativeSelect 
            bind:value={sys_orig}
            label="Origin Scale" 
            data={coprime_tree_str}
        />
    </Grid.Col>
    <Grid.Col span={3}>
        <NativeSelect 
            bind:value={sys_target}
            label="Target Scale" 
            data={coprime_tree_str}
        />
    </Grid.Col>
    <Grid.Col span={3}>
        <NumberInput bind:value={mode} min={1} max={s.a+s.b} label="Mode" />
    </Grid.Col>
    <Grid.Col span={3}>
        <Space h={5}/>
        <Checkbox bind:checked={dual} label="Dual Lattice" />
        <!--<Space h={5}/>
        <Checkbox bind:checked={tune_origin} label="Tune Origin" />-->
    </Grid.Col>
    <Grid.Col span={3}>
    <!--    
        <Space h={5}/>
        <Slider bind:value={octave} min={0.5} max={2.5} step={0.0001} />
        <Space h={5}/>
        <Slider bind:value={constant_pitch_direction} min={-5} max={5} step={0.0001} />
    -->
    </Grid.Col>
    <Grid.Col span={1}>
        <Group>
        <ActionIcon variant="default">
            <a href="MOS Revisited.pdf" download><QuestionMark /></a>
        </ActionIcon>
        </Group>
    </Grid.Col>

</Grid>


<div class="container" bind:clientWidth={w} bind:clientHeight={h}>
    <svg width="100%" height="100%" viewBox="{-centerX} {-centerY} {w} {h}" xmlns="http://www.w3.org/2000/svg">
        <Lattice bind:s={s_target} edge_length={50} show_rects={false}/>
        {#if s_target.a===2 && s_target.b===5}
            <LatticePath bind:s={s_target} edge_length={50} path={cmajor_scale} color="black"/>
        {/if}

        <!--<Lattice bind:s edge_length={50} show_rects color="blue" bind:s_target bind:dual/>-->
        <LatticePath bind:s edge_length={50} path={scale} bind:s_target bind:dual color="blue"/>
    </svg>
</div>