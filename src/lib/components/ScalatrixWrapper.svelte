<script lang="ts">
    import { browser } from '$app/environment';
    import { getSx } from '$lib/scalatrix';
    import { createEventDispatcher, onMount } from 'svelte';

    const dispatch = createEventDispatcher();

    export let loading = true;
    export let error: string | null = null;

    let sx: any = null;

    async function loadScalatrix() {
        if (!browser) return;

        try {
            sx = await getSx();
            loading = false;
            dispatch('loaded', { sx });
        } catch (err) {
            console.error('Failed to load scalatrix:', err);
            error = 'Failed to load scalatrix module';
            loading = false;
            dispatch('error', { error: err });
        }
    }

    onMount(() => {
        loadScalatrix();
    });
</script>

{#if loading}
    <slot name="loading">
        <div style="padding: 20px; text-align: center; color: gray;">
            Loading scalatrix...
        </div>
    </slot>
{:else if error}
    <slot name="error" {error}>
        <div style="padding: 20px; text-align: center; color: red;">
            Error: {error}
        </div>
    </slot>
{:else if sx}
    <slot {sx} />
{/if}