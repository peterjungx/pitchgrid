import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { countryFromRequest, createCheckout, getProduct } from '$lib/shop/storefront.server';

const PRODUCT_HANDLE = 'pitchgrid-plugin';

export const load: PageServerLoad = async ({ request, setHeaders }) => {
    const country = countryFromRequest(request);
    const product = await getProduct(PRODUCT_HANDLE, country);
    if (!product) throw error(404, 'Product not found');
    // price varies by visitor country, don't let CDNs cache across regions
    setHeaders({ 'cache-control': 'private, max-age=300' });
    return { product, country };
};

export const actions: Actions = {
    buy: async ({ request }) => {
        const country = countryFromRequest(request);
        const form = await request.formData();
        const variantId = form.get('variantId');
        if (typeof variantId !== 'string' || !variantId.startsWith('gid://shopify/ProductVariant/')) {
            throw error(400, 'Invalid variant');
        }
        const checkoutUrl = await createCheckout(variantId, country);
        throw redirect(303, checkoutUrl);
    }
};
