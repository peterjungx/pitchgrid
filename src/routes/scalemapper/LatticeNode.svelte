<script lang='ts'>
    import ConstantPitchLine from './ConstantPitchLine.svelte';
    import type { system, MappedScaleDisplayData, node } from './lattice_math';
    import {ConsistentTuning} from '$lib/consistent_tuning';
    import type {TuningData} from '$lib/consistent_tuning';
    import {onMount} from 'svelte';
    
    //export let s_offset:system = {a:0,b:0}
    export let node:node
    export let color='gray';
    export let text='';
    export let alt_text:string|undefined = undefined;

    let r = 9;
    let showMenu = false;


    function rightClickContextMenu(e){
        console.log('right click')
        showMenu = true;
        //e.preventDefault();
    }

    function handleNodeClick(e){
        console.log('node click')
    }

    let showConstantPitchLine = true;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<circle 
    cx="{node.p.x}" cy="{node.p.y}" r="{r}" fill="{color}"
    on:contextmenu|preventDefault={rightClickContextMenu}
    on:click|preventDefault={handleNodeClick}
/>
<text 
    x="{node.p.x+r+1}" 
    y="{node.p.y-r}" 
    dominant-baseline="auto" 
    text-anchor="start" 
    fill="{color}"
>{text}</text> 

{#if alt_text}
    <text 
        x="{node.p.x+r+2}" 
        y="{node.p.y}" 
        dominant-baseline="hanging" 
        text-anchor="start" 
        fill="{'red'}"
    >{alt_text}</text> 
{/if}

<svelte:window on:click="{() => showMenu = false}" />

{#if showMenu}
<nav>
    <div style="position:fixed;top:{node.p.y}px;left:{node.p.x}px;background-color:white;border:1px solid gray;">
        <button on:click="{() => console.log('add item')}">Add item</button>
        <button on:click="{() => console.log('print')}">Print</button>
        <button on:click="{() => console.log('zoom')}">Zoom</button>
    </div>
</nav>
{/if}