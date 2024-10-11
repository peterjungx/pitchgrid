<script lang="ts">
    import { onMount, tick } from 'svelte';
    import { goto } from '$app/navigation';
    import { SvelteUIProvider, Header, Tabs, Space, Container } from '@svelteuidev/core';

    /** @type {import('./$types').LayoutData} */
    export let data;
    let activeTab = 0;
    let valid = true;

    let menuitems:string[] = ['PitchGrid', 'ScaleMapper', 'MicroExquis'];
    function loadTab(event: CustomEvent) {
        goto(`/docs/${menuitems[event.detail.index]}`);
    }

    onMount(async () => {
        let pageIndex = menuitems.findIndex((item) => item === data.page);
        if(pageIndex === -1) {
            valid = false;
            return;
        }
        await tick();
        activeTab = pageIndex;
    });
</script>

<SvelteUIProvider 
    withNormalizeCSS 
    withGlobalStyles
    override={{
        backgroundColor:'#FFFFFF',  
    }}
>   
    {#if valid}
    <Header height="40px" fixed>
        {#key menuitems}
        <Tabs bind:active={activeTab} on:change={loadTab}>
            {#each menuitems as item}
                <Tabs.Tab label={item}></Tabs.Tab>
            {/each}
        </Tabs>
        {/key}
    </Header>
    <Space h={50} />
    <Container>
        <slot></slot>
    </Container>
    {/if}
    {#if !valid}
        <div style="margin: 20px">
            <h1><img src="favicon.png" alt="" style="width:60px"/> 404 Not Found</h1>
        </div>
    {/if}

</SvelteUIProvider>