<script lang='ts'>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    import type {Vector2i, Vector2d} from '$lib/scalatrix';

    type node = {
        c: Vector2i,
        p: Vector2d,
        col:string,
        text:string
    };
    
    //export let s_offset:system = {a:0,b:0}
    export let node:node;
    export let color='gray';
    export let text='';
    export let alt_text:string|undefined = undefined;
    export let size = 9;

    function handleNodeClick(e:any){
        console.log('node click')
        // show a popup with the node info
        // e.preventDefault();
        // e.stopPropagation();
        // e.stopImmediatePropagation();

        //color = 'red';
        dispatch('nodeClick', {
            node: node,
            event: e
        });
    }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<circle 
    cx="{node.p.x}" cy="{node.p.y}" r="{ size }" fill="{color}"
    on:click|preventDefault={handleNodeClick}
/>
<text 
    x="{node.p.x + size + 1}" 
    y="{node.p.y - size}" 
    dominant-baseline="auto" 
    text-anchor="start" 
    fill="{color}"
>{text}</text> 

{#if alt_text}
    <text 
        x="{node.p.x + size + 2}" 
        y="{node.p.y}" 
        dominant-baseline="hanging" 
        text-anchor="start" 
        fill="{'red'}"
    >{alt_text}</text> 
{/if}
