import { redirect } from '@sveltejs/kit';
import { MOONBASE_BUY_URL } from '$lib/shop/moonbase';

export const prerender = false;

export function load() {
    throw redirect(302, MOONBASE_BUY_URL);
}
