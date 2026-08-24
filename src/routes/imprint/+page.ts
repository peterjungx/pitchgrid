import { marked } from 'marked';
import source from '$lib/legal/imprint.md?raw';
import type { PageLoad } from './$types';

// Rendered once at build/SSR time; legal text is static.
const html = marked.parse(source, { async: false }) as string;

export const load: PageLoad = () => {
    return { html };
};
