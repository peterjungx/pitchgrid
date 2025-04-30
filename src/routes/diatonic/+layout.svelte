<script lang="ts">
	import { SvelteUIProvider } from '@svelteuidev/core';
	//import {  useSvelteUITheme, createTheme } from '@svelteuidev/core';
    //const defaultTheme = useSvelteUITheme();
    //const newTheme = {
    //    ...useSvelteUITheme(),
    //    ...(createTheme('new-theme', {
    //        backgroundColor: '#FFB319',
    //        }) as object)
    //    }
    //console.log(newTheme);
    //theme={newTheme}
    //override={{
    //    backgroundColor:'#FFB319',
    //    
    //}}

</script>

<SvelteUIProvider 
    withNormalizeCSS 
    withGlobalStyles
    override={{
        backgroundColor:'#FFB319',  
    }}
    
>
    
	<slot />
</SvelteUIProvider>