<script lang='ts'>
    import { browser } from '$app/environment';
    import { page } from '$app/stores';
    import { getSx } from '$lib/scalatrix';
    import Window from './Window.svelte';

    let sx: any = null;
    let loading = true;

    // URL params for depth and mode
    $: urlDepth = $page.url.searchParams.get('depth');
    $: urlMode = $page.url.searchParams.get('mode');
    $: initDepth = urlDepth ? parseInt(urlDepth) : 3;
    $: initMode = urlMode ? parseInt(urlMode) : 1;

    async function loadScalatrix() {
        if (!browser) return;
        try {
            sx = await getSx();
            loading = false;
        } catch (err) {
            console.error('Failed to load scalatrix:', err);
            loading = false;
        }
    }

    if (browser) {
        loadScalatrix();
    }
</script>

{#if browser && !loading && sx}
    <Window {sx} {initDepth} {initMode} />
{:else}
    <div style="padding: 20px; text-align: center;">
        {#if loading}
            Loading scalatrix piano interface...
        {:else}
            Piano interface requires browser environment
        {/if}
    </div>
{/if}