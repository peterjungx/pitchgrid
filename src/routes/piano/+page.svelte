<script lang='ts'>
    import { browser } from '$app/environment';
    import Window from './Window.svelte';
</script>

{#if browser}
    <Window/>
{:else}
    <div style="padding: 20px; text-align: center;">
        Loading piano interface...
    </div>
{/if}