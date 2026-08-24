import { marked } from 'marked';
import eulaSource from '$lib/legal/plugin-eula.md?raw';
import type { PageLoad } from './$types';

// Rendered once at build/SSR time; legal text is static.
const html = marked.parse(eulaSource, { async: false }) as string;

export const load: PageLoad = () => {
    return { html };
};
