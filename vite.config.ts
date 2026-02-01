import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		allowedHosts: ['odie.local']
	},
	optimizeDeps: {
		// Packages with missing svelte exports condition - include for proper bundling
		include: ['radix-icons-svelte', '@bulatdashiev/svelte-slider']
	},
	ssr: {
		noExternal: ['radix-icons-svelte', '@bulatdashiev/svelte-slider']
	}
});
