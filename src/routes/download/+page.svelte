<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;

    const platformLabel: Record<string, string> = {
        macos: 'macOS',
        windows: 'Windows',
        linux: 'Linux'
    };
    const platformHint: Record<string, string> = {
        macos: 'Universal installer (Apple Silicon + Intel), notarized',
        windows: 'Signed installer, 64-bit',
        linux: 'VST3 + Standalone, tar.gz'
    };
    const order = ['macos', 'windows', 'linux'];

    $: latestAssets = data.latest
        ? [...data.latest.assets].sort((a, b) => order.indexOf(a.platform) - order.indexOf(b.platform))
        : [];

    function fmtDate(iso: string): string {
        return new Date(iso).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
    }
</script>

<svelte:head>
    <title>Download PitchGrid</title>
</svelte:head>

<main class="download-page">
    <section class="latest">
        <h1>Download PitchGrid</h1>
        {#if data.latest}
            <p class="version">
                Latest version <strong>{data.latest.version}</strong> · {fmtDate(data.latest.date)} ·
                14-day free trial included
            </p>
            <div class="platforms">
                {#each latestAssets as asset}
                    <a class="platform-card" href={asset.url} download>
                        <span class="platform">{platformLabel[asset.platform]}</span>
                        <span class="hint">{platformHint[asset.platform]}</span>
                        <span class="size">{asset.sizeMb} MB</span>
                    </a>
                {/each}
            </div>
            <p class="buy-hint">Like it? <a href="/buy">Get a license — 42 €/$/£</a></p>
        {:else}
            <p>No releases published yet — check back soon.</p>
        {/if}
    </section>

    {#if data.legacy.length > 0}
        <section class="legacy">
            <h2>Previous versions</h2>
            <table>
                <thead>
                    <tr><th>Version</th><th>Date</th><th>Downloads</th></tr>
                </thead>
                <tbody>
                    {#each data.legacy as release}
                        <tr>
                            <td>{release.version}</td>
                            <td>{fmtDate(release.date)}</td>
                            <td>
                                {#each release.assets as asset, i}
                                    {#if i > 0}&nbsp;·&nbsp;{/if}
                                    <a href={asset.url} download>{platformLabel[asset.platform]}</a>
                                {/each}
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </section>
    {/if}
</main>

<style>
    .download-page {
        min-height: 100vh;
        background: #131516;
        color: #f1f2f4;
        font-family: 'Instrument Sans', system-ui, sans-serif;
        padding: 4rem 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4rem;
    }
    h1, h2 {
        font-family: Rubik, system-ui, sans-serif;
    }
    .latest {
        text-align: center;
        max-width: 880px;
    }
    .version {
        color: #f1f2f4a0;
        margin-bottom: 2rem;
    }
    .version strong {
        color: #ffab00;
    }
    .platforms {
        display: flex;
        gap: 1.25rem;
        justify-content: center;
        flex-wrap: wrap;
    }
    .platform-card {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        background: #1a1d1f;
        border: 1px solid #ffffff1f;
        border-radius: 10px;
        padding: 1.4rem 1.8rem;
        min-width: 215px;
        text-decoration: none;
        color: inherit;
    }
    .platform-card:hover {
        border-color: #ffab00;
    }
    .platform {
        font-family: Rubik, system-ui, sans-serif;
        font-size: 1.25rem;
        font-weight: 600;
        color: #ffab00;
    }
    .hint {
        font-size: 0.85rem;
        color: #f1f2f4a0;
    }
    .size {
        font-size: 0.8rem;
        color: #f1f2f470;
    }
    .buy-hint {
        margin-top: 2rem;
        color: #f1f2f4a0;
    }
    .buy-hint a, .legacy a {
        color: #ffab00;
    }
    .legacy {
        max-width: 880px;
        width: 100%;
    }
    table {
        width: 100%;
        border-collapse: collapse;
    }
    th, td {
        text-align: left;
        padding: 0.6rem 0.8rem;
        border-bottom: 1px solid #ffffff1f;
    }
    th {
        color: #f1f2f4a0;
        font-weight: 500;
    }
</style>
