<script>
	import { SvelteUIProvider } from '@svelteuidev/core';
</script>

<SvelteUIProvider 
    withNormalizeCSS 
    withGlobalStyles
    override={{
        backgroundColor:'#FFB319'
    }}
>
	<slot />
</SvelteUIProvider>