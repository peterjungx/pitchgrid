<script lang='ts'>
    export let x=0;
    export let y=0;
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
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<circle 
    cx="{x}" cy="{y}" r="{r}" fill="{color}"
    on:contextmenu|preventDefault={rightClickContextMenu}
    on:click|preventDefault={handleNodeClick}
/>
<text 
    x="{x+r+1}" 
    y="{y-r}" 
    dominant-baseline="auto" 
    text-anchor="start" 
    fill="{color}"
>{text}</text> 

{#if alt_text}
    <text 
        x="{x+r+2}" 
        y="{y}" 
        dominant-baseline="hanging" 
        text-anchor="start" 
        fill="{'red'}"
    >{alt_text}</text> 
{/if}

<svelte:window on:click="{() => showMenu = false}" />

{#if showMenu}
<nav>
    <div style="position:fixed;top:{y}px;left:{x}px;background-color:white;border:1px solid gray;">
        <button on:click="{() => console.log('add item')}">Add item</button>
        <button on:click="{() => console.log('print')}">Print</button>
        <button on:click="{() => console.log('zoom')}">Zoom</button>
    </div>
</nav>
{/if}