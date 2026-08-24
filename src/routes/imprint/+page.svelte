<script lang="ts">
    import type { PageData } from './$types';
    export let data: PageData;
</script>

<svelte:head>
    <title>Impressum — PitchGrid</title>
    <meta name="description" content="Impressum (legal notice) for PitchGrid — Bayes GmbH, Cologne." />
</svelte:head>

<main class="legal">
    <article class="prose">
        {@html data.html}
    </article>
</main>

<style>
    .legal {
        min-height: 100vh;
        background: #131516;
        color: #f1f2f4d9;
        font-family: 'Instrument Sans', system-ui, sans-serif;
        padding: 4rem 1.5rem;
    }
    .prose {
        max-width: 760px;
        margin: 0 auto;
        line-height: 1.7;
    }
    .prose :global(h1) {
        font-family: Rubik, system-ui, sans-serif;
        color: #f1f2f4;
        font-size: 2rem;
        margin-bottom: 0.25rem;
    }
    .prose :global(h2) {
        font-family: Rubik, system-ui, sans-serif;
        color: #f1f2f4;
        font-size: 1.25rem;
        margin-top: 2.5rem;
    }
    .prose :global(h3) {
        font-family: Rubik, system-ui, sans-serif;
        color: #f1f2f4;
        font-size: 1.05rem;
        margin-top: 1.75rem;
    }
    .prose :global(h2 + p),
    .prose :global(p) {
        margin: 0.75rem 0;
    }
    .prose :global(a) {
        color: #ffab00;
    }
    .prose :global(strong) {
        color: #f1f2f4;
    }
    .prose :global(hr) {
        border: none;
        border-top: 1px solid #ffffff1f;
        margin: 2rem 0;
    }
    .prose :global(ul) {
        padding-left: 1.25rem;
    }
    .prose :global(li) {
        margin: 0.4rem 0;
    }
    .prose :global(em) {
        color: #f1f2f4a0;
    }
    .prose :global(code) {
        font-size: 0.9em;
        color: #f1f2f4;
    }
</style>
