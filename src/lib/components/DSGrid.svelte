<script lang="ts">
    import { multiply, matrix } from 'mathjs';
    import {createEventDispatcher} from 'svelte';
    import {ConsistentTuning} from '$lib/consistent_tuning';

    const dispatch = createEventDispatcher();

    export let DSXY = matrix([[1,0], [0,1]])
    export let center = matrix([0, 0])

    $: vs = multiply(DSXY, matrix([0, 1]))
    $: vd = multiply(DSXY, matrix([1, 0]))


</script>

<style>
    svg {
        position: absolute;
        pointer-events: none;
    }
</style>

<!-- draw a straight green line from upper left to lower right corner -->
<svg width="100%" height="100%">
      
    {#each {length:61} as _, s}
        <line 
            x1="{center.get([0]) + (s-24) * vs.get([0]) - 1000 * vd.get([0])}" 
            y1="{center.get([1]) + (s-24) * vs.get([1]) - 1000 * vd.get([1])}" 
            x2="{center.get([0]) + (s-24) * vs.get([0]) + 1000 * vd.get([0])}" 
            y2="{center.get([1]) + (s-24) * vs.get([1]) + 1000 * vd.get([1])}" 
            style="stroke:yellow;stroke-width:1" />        
    {/each}
    {#each {length:36} as _, d}
        <line 
            x1="{center.get([0]) + (d-14) * vd.get([0]) - 1000 * vs.get([0])}" 
            y1="{center.get([1]) + (d-14) * vd.get([1]) - 1000 * vs.get([1])}" 
            x2="{center.get([0]) + (d-14) * vd.get([0]) + 1000 * vs.get([0])}" 
            y2="{center.get([1]) + (d-14) * vd.get([1]) + 1000 * vs.get([1])}" 
            style="stroke:lightblue;stroke-width:1" />        
    {/each}

</svg>


