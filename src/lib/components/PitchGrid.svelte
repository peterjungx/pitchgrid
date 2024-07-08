<script lang="ts">
    import { multiply, matrix } from 'mathjs';
    import {createEventDispatcher} from 'svelte';
    import {ConsistentTuning} from '$lib/consistent_tuning';

    const dispatch = createEventDispatcher();

    export let DSXY = matrix([[1,0], [0,1]])
    export let center = matrix([0, 0])
    export let temperament:ConsistentTuning

    let ds = matrix([1,1])

    $: enh_angle = temperament.direction_of_enharmonic_equivalence()

    $: d_enh = Math.sin( enh_angle )
    $: s_enh = Math.cos( enh_angle )
    
    $: v_enh = multiply(DSXY, matrix([d_enh, s_enh]))
    
    $: a = multiply(DSXY, matrix([temperament.da, temperament.sa]))
    $: b = multiply(DSXY, matrix([temperament.db, temperament.sb]))

    $: tri = [...Array(13).keys()].map(e=> multiply(DSXY, matrix(temperament.freq_to_coord(Math.pow(2, e/12)))))

</script>

<style>
    svg {
        position: absolute;
        pointer-events: none;
    }
</style>

<!-- draw a straight green line from upper left to lower right corner -->
<svg width="100%" height="100%">
    <line 
        x1="{center.get([0]) - v_enh.get([0]) * 1000}" 
        y1="{center.get([1]) - v_enh.get([1]) * 1000}" 
        x2="{center.get([0]) + v_enh.get([0]) * 1000}" 
        y2="{center.get([1]) + v_enh.get([1]) * 1000}" 
        style="stroke:rgb(0,255,0);stroke-width:2" />        
    {#each tri.slice(1,12) as t}
        <line 
            x1="{t.get([0]) + center.get([0]) - v_enh.get([0]) * 1000}" 
            y1="{t.get([1]) + center.get([1]) - v_enh.get([1]) * 1000}" 
            x2="{t.get([0]) + center.get([0]) + v_enh.get([0]) * 1000}" 
            y2="{t.get([1]) + center.get([1]) + v_enh.get([1]) * 1000}" 
            style="stroke:rgb(0,127,0);stroke-width:1" />        
    {/each}
    <line 
        x1="{tri[12].get([0]) + center.get([0]) - v_enh.get([0]) * 1000}" 
        y1="{tri[12].get([1]) + center.get([1]) - v_enh.get([1]) * 1000}" 
        x2="{tri[12].get([0]) + center.get([0]) + v_enh.get([0]) * 1000}" 
        y2="{tri[12].get([1]) + center.get([1]) + v_enh.get([1]) * 1000}" 
        style="stroke:rgb(0,255,0);stroke-width:1" />    
    <line 
        x1="{a.get([0]) + center.get([0]) - v_enh.get([0]) * 1000}" 
        y1="{a.get([1]) + center.get([1]) - v_enh.get([1]) * 1000}" 
        x2="{a.get([0]) + center.get([0]) + v_enh.get([0]) * 1000}" 
        y2="{a.get([1]) + center.get([1]) + v_enh.get([1]) * 1000}" 
        style="stroke:rgb(0,0,255);stroke-width:1" />
    <line 
        x1="{b.get([0]) + center.get([0]) - v_enh.get([0]) * 1000}" 
        y1="{b.get([1]) + center.get([1]) - v_enh.get([1]) * 1000}" 
        x2="{b.get([0]) + center.get([0]) + v_enh.get([0]) * 1000}" 
        y2="{b.get([1]) + center.get([1]) + v_enh.get([1]) * 1000}" 
        style="stroke:rgb(255,0,0);stroke-width:1" />

</svg>


