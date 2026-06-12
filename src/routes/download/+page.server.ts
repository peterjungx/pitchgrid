import type { PageServerLoad } from './$types';
import { getReleases } from '$lib/shop/releases.server';

export const load: PageServerLoad = async ({ fetch, setHeaders }) => {
    const releases = await getReleases(fetch);
    // releases change only when a tag is pushed; let the CDN serve cached copies
    setHeaders({ 'cache-control': 'public, s-maxage=300, stale-while-revalidate=3600' });
    return {
        latest: releases[0] ?? null,
        legacy: releases.slice(1)
    };
};
