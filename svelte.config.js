import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      runtime: 'nodejs20.x'
    })
  },
  vite: {
    build: {
      rollupOptions: {
        external: []
      }
    },
    ssr: {
      noExternal: ['$lib/scalatrix']
    },
    optimizeDeps: {
      include: ['$lib/scalatrix']
    },
    server: {
      fs: {
        allow: ['..']
      }
    }
  }
};

export default config;
