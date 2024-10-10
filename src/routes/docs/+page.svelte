<script lang="ts">
    import { onMount } from 'svelte';
    import {parseMarkdown} from './markdown';
    import { SvelteUIProvider, Header, Group, Anchor, Tabs, Container, Space } from '@svelteuidev/core';
    import { page } from '$app/stores'
    const tab_to_load_first = $page.url.searchParams.get('tab')
    console.log(tab_to_load_first)

    let html: any;
    let menuitems:string[] = [];
    let activeTab = 0;

    onMount(async () => {
        fetch(`docs?content=list`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                menuitems = data;
                if (tab_to_load_first){
                    // find the tab matching the name
                    const index = menuitems.findIndex((item) => item.includes(tab_to_load_first));
                    if (index > -1){
                        load(menuitems[index]);
                        activeTab = index;
                    }
                }else{
                    load(menuitems[0]);
                }
            });
    });

    function load(file: string) {
        console.log(file);
        fetch(`docs?file=${file}`)
            .then(res => res.text())
            .then(md => html = parseMarkdown(md));
    }

    function loadTab(event: CustomEvent) {
        load(menuitems[event.detail.index]);
    }

</script>


<SvelteUIProvider 
    withNormalizeCSS 
    withGlobalStyles
    override={{
        backgroundColor:'#FFFFFF',  
    }}
>   
    <Header height="40px" fixed>
        {#key menuitems}
        <Tabs bind:active={activeTab} on:change={loadTab}>
            {#each menuitems as item}
                <Tabs.Tab label={item.substring(3)}></Tabs.Tab>
            {/each}
        </Tabs>
        {/key}
    </Header>
    <Space h={40} />
    {#if html}
        <Container>
            <div style="margin:10px;">
                {@html html}
            </div>
        </Container>
    {/if}   
</SvelteUIProvider>

