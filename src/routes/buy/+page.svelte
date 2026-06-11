<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;

    $: price = new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: data.product.price.currencyCode,
        minimumFractionDigits: 0
    }).format(Number(data.product.price.amount));
</script>

<svelte:head>
    <title>Buy {data.product.title} — PitchGrid</title>
</svelte:head>

<main class="buy-page">
    <section class="card">
        {#if data.product.featuredImage}
            <img src={data.product.featuredImage.url} alt={data.product.featuredImage.altText ?? data.product.title} />
        {/if}
        <div class="details">
            <h1>{data.product.title}</h1>
            <p class="price">{price}</p>
            <div class="description">{@html data.product.descriptionHtml}</div>
            <form method="POST" action="?/buy">
                <input type="hidden" name="variantId" value={data.product.variantId} />
                <button type="submit" class="buy-button">Buy now — {price}</button>
            </form>
            <p class="trial">
                Not sure yet? <a href="/info/PitchGrid">Learn more</a> or download the
                <strong>14-day free trial</strong>.
            </p>
        </div>
    </section>
</main>

<style>
    .buy-page {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #131516;
        color: #f1f2f4;
        font-family: 'Instrument Sans', system-ui, sans-serif;
        padding: 2rem;
    }
    .card {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 3rem;
        max-width: 960px;
        align-items: center;
    }
    .card img {
        width: 100%;
        border-radius: 12px;
    }
    h1 {
        font-family: Rubik, system-ui, sans-serif;
        font-size: 2.5rem;
        margin: 0 0 0.5rem;
    }
    .price {
        font-size: 1.75rem;
        color: #ffab00;
        font-weight: 600;
        margin: 0 0 1rem;
    }
    .description :global(p) {
        color: #f1f2f4d9;
        line-height: 1.6;
    }
    .description :global(ul) {
        color: #f1f2f4d9;
        line-height: 1.8;
        padding-left: 1.2rem;
    }
    .buy-button {
        background: #ffab00;
        color: #131516;
        border: none;
        border-radius: 8px;
        padding: 1rem 2.5rem;
        font-size: 1.1rem;
        font-weight: 700;
        font-family: inherit;
        cursor: pointer;
        margin-top: 1rem;
    }
    .buy-button:hover {
        background: #ffc23e;
    }
    .trial {
        margin-top: 1.5rem;
        color: #f1f2f4a0;
    }
    .trial a {
        color: #ffab00;
    }
    @media (max-width: 720px) {
        .card {
            grid-template-columns: 1fr;
        }
    }
</style>
