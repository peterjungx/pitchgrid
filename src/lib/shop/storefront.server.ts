import { env } from '$env/dynamic/private';

const API_VERSION = '2025-04';

export interface Money {
    amount: string;
    currencyCode: string;
}

export interface ShopProduct {
    title: string;
    descriptionHtml: string;
    featuredImage: { url: string; altText: string | null } | null;
    variantId: string;
    price: Money;
}

function config() {
    const domain = env.SHOPIFY_STORE_DOMAIN;
    const token = env.SHOPIFY_STOREFRONT_TOKEN;
    if (!domain || !token) {
        throw new Error('SHOPIFY_STORE_DOMAIN / SHOPIFY_STOREFRONT_TOKEN env vars are not set');
    }
    return { domain, token };
}

export async function storefrontQuery<T = unknown>(
    query: string,
    variables: Record<string, unknown> = {}
): Promise<T> {
    const { domain, token } = config();
    const res = await fetch(`https://${domain}/api/${API_VERSION}/graphql.json`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': token
        },
        body: JSON.stringify({ query, variables })
    });
    if (!res.ok) {
        throw new Error(`Storefront API ${res.status}: ${await res.text()}`);
    }
    const json = await res.json();
    if (json.errors?.length) {
        throw new Error(`Storefront API error: ${JSON.stringify(json.errors)}`);
    }
    return json.data as T;
}

/** Two-letter country from Vercel's geo header, falling back to DE (primary market). */
export function countryFromRequest(request: Request): string {
    return request.headers.get('x-vercel-ip-country') ?? 'DE';
}

export async function getProduct(handle: string, country: string): Promise<ShopProduct | null> {
    const data = await storefrontQuery<{
        product: {
            title: string;
            descriptionHtml: string;
            featuredImage: { url: string; altText: string | null } | null;
            variants: { nodes: { id: string; price: Money }[] };
        } | null;
    }>(
        `query Product($handle: String!, $country: CountryCode!) @inContext(country: $country) {
            product(handle: $handle) {
                title
                descriptionHtml
                featuredImage { url altText }
                variants(first: 1) { nodes { id price { amount currencyCode } } }
            }
        }`,
        { handle, country }
    );
    const p = data.product;
    const variant = p?.variants.nodes[0];
    if (!p || !variant) return null;
    return {
        title: p.title,
        descriptionHtml: p.descriptionHtml,
        featuredImage: p.featuredImage,
        variantId: variant.id,
        price: variant.price
    };
}

/** Creates a single-item cart and returns the Shopify checkout URL (on shop.pitchgrid.io). */
export async function createCheckout(variantId: string, country: string): Promise<string> {
    const data = await storefrontQuery<{
        cartCreate: {
            cart: { checkoutUrl: string } | null;
            userErrors: { message: string }[];
        };
    }>(
        `mutation CartCreate($variantId: ID!, $country: CountryCode!) @inContext(country: $country) {
            cartCreate(input: {
                lines: [{ merchandiseId: $variantId, quantity: 1 }]
                buyerIdentity: { countryCode: $country }
            }) {
                cart { checkoutUrl }
                userErrors { message }
            }
        }`,
        { variantId, country }
    );
    const { cart, userErrors } = data.cartCreate;
    if (!cart || userErrors.length) {
        throw new Error(`cartCreate failed: ${JSON.stringify(userErrors)}`);
    }
    return cart.checkoutUrl;
}
