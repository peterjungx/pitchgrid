<script lang="ts">
	import Logo from './_Logo.svelte';
	import { Group, ActionIcon, Text, Anchor, Burger, Tooltip } from '@svelteuidev/core';
	import { Sun, Moon, GithubLogo, LightningBolt } from 'radix-icons-svelte';
	import { hotkey, useOs } from '@svelteuidev/composables';

	const os = useOs();
	const mod = os === 'macos' ? '⌘' : 'ctrl';

	export let isDark: boolean;
	export let opened: boolean;
	export let toggle: () => void;
	export let toggleOpen: () => void;
	export let show_terra_tuner = false;

	
</script>

<Group override={{ height: '100%', px: 20 }} position="apart">
    <Burger {opened} on:click={toggleOpen} override={{ d: 'block', '@sm': { d: 'block' } }} />
	<Anchor
		underline={false}
		href="/"
		override={{ '&:hover': { textDecoration: 'none !important' } }}
	>
		<Group>
			<Logo size={50} />
			<Tooltip
				wrapLines
				width={400}
				color='indigo'
				position='bottom'
                withArrow
                openDelay={400}
                closeDelay={400}
				allowPointerEvents
			>
				<Text 
					slot="label"
					color={isDark?'black':'white'}
				>
					Welcome to the Pitch Grid! Explore consistent tunings for isomorphic layouts of the western tonal system. Anything you do here, all chords look the same and sound the same (i.e. involve the same frequency ratios) in any particular setting, which is kind of remarkable... Have fun! And if you think you've learned something, you can 
					<Anchor href="https://www.buymeacoffee.com/peterjungx">buy me a coffee</Anchor>.
				</Text>
				<Text style="font-family:Futura" color={isDark?'white':'black'}  size="xl" override={{ d: 'none', '@sm': { d: 'block' } }}>
					PITCH GRID [alpha]
				</Text>
			</Tooltip>
		</Group>
	</Anchor>

    <Group>
		<ActionIcon variant="default" on:click={()=>{show_terra_tuner=!show_terra_tuner}}>
			<!--<img src='/somasynths_fav.png'/>-->
			<img src='/somalogo_navbar_proper.svg' width="16"/>
		</ActionIcon>
        <!--<Tooltip label={`${mod} + J`}>
            <ActionIcon variant="default" on:click={toggle} size={30} use={[[hotkey, [['mod+J', toggle]]]]}>
                {#if isDark}
                    <Moon />
                {:else}
                    <Sun />
                {/if}
            </ActionIcon>
        </Tooltip>-->
        <ActionIcon variant="default">
            <a href="https://github.com/peterjungx/pitchgrid"><GithubLogo /></a>
        </ActionIcon>
    </Group>

</Group>