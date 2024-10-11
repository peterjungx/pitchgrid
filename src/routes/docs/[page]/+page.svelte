<script lang="ts">
    import { onMount } from 'svelte';
    import {parseMarkdown} from '../markdown';
    let html: any;
    /** @type {import('./$types').PageData} */
    export let data;
    let loaded = false;

    async function load(page: string) {
        console.log('item', page);
        let res = await fetch(`/docs/${page}.md`);
        console.log('item', res);

        let md = await res.text();
        console.log('md', md);
        if (!res.ok) {
            html = `<h1>404 Not Found</h1>`;
            return;
        }
        html = parseMarkdown(md);
    }

    onMount(() => {
        load(data.page);
        loaded = true;
    });
    $: if(loaded)load(data.page);
</script>

{#if html}
    {@html html}
{:else}
    <p>Loading...</p>
{/if}