<script lang='ts'>
    import ConstantPitchLine from './ConstantPitchLine.svelte';
    import type { system, MappedScaleDisplayData, node, affine_transform } from './lattice_math';
    import {ConsistentTuning} from '$lib/consistent_tuning';
    import type {TuningData} from '$lib/consistent_tuning';
    import {onMount} from 'svelte';


    export let display_data:MappedScaleDisplayData
    export let tuning_data:TuningData
    export let constant_pitch_angle:number
    
    export let node:node
    export let color='gray';
    export let text='';
    export let alt_text:string|undefined = undefined;
    export let showConstantPitchLine = true;
    export let variant = 1;
    export let show_alt_text = false;
    export let show_text = true;
    export let affine_t:affine_transform = {m11:1,m12:0,m21:0,m22:1,dx:0,dy:0};

    let r = 9;
    let showMenu = false;

    function rightClickContextMenu(e:MouseEvent){
        console.log('right click')
        showMenu = true;
        //e.preventDefault();
    }

    function handleNodeClick(e:MouseEvent){
        console.log('node click')
    }

    
</script>

{#if showConstantPitchLine}
    <ConstantPitchLine 
        bind:node
        bind:tuning_data
        bind:display_data
        bind:affine_t
        constant_pitch_angle={constant_pitch_angle} 
    />
{/if}

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<circle 
    cx="{node.p.x}" cy="{node.p.y}" r="{r}" fill="{color}"
    on:contextmenu|preventDefault={rightClickContextMenu}
    on:click|preventDefault={handleNodeClick}
/>
{#if show_text}
    <text 
        x="{node.p.x+r+2}" 
        y="{node.p.y-(variant==1?r:-5)}" 
        dominant-baseline={variant==1?"auto":"hanging"}
        text-anchor="start" 
        fill="{color}"
    >{text}</text> 
{/if}

{#if alt_text && show_alt_text}
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