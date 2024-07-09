<script lang="ts">

    import Matrix from '$lib/components/Matrix.svelte'
    import {Player} from '$lib/sound'
    import { onMount } from 'svelte';
    import {WebMidi} from "webmidi";

    import HeadContent from './HeadContent.svelte';
    let isDark = false;
    let opened = false;
    function toggleOpened() {
        opened = !opened;
    }
    import { colorScheme, SvelteUIProvider, AppShell, Header, Title, Navbar, Container } from '@svelteuidev/core';

    function toggleTheme(){
        colorScheme.update((v) => v === 'dark' ? 'light' : 'dark')
        isDark = !isDark;
    }

    let player:Player;
    onMount(() => {
        player = new Player()

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Shift') {
                //console.log('sustain')
                sustain = true;
            }
        })  
        window.addEventListener('keyup', (e) => {
            if (e.key === 'Shift') {
                //console.log('sustain off')
                sustain = false;
                sustainingNotes.forEach((freq) => {
                    player.stopNote(freq)
                })
                sustainingNotes.clear()
            }
        })
    })

    let midi_on = false;

    let sustain = false;
    let sustainingNotes = new Set<number>();
    function handle_stop_note(freq: number) {
        if (!sustain) {
            player.stopNote(freq)
        }else{
            sustainingNotes.add(freq)
        }
    }

    function toggleMidiOnOff() {
        midi_on = !midi_on;

        if (midi_on) {
            WebMidi.enable()
            .then(onWebMidiEnabled)
            .catch(err => alert(err));
        } else {
            WebMidi.disable()
            .then(() => console.log('WebMidi disabled!'))
            .catch(err => alert(err));
        }
    }

    function onWebMidiEnabled() {
        
        // Inputs
        console.log('MIDI inputs:')
        WebMidi.inputs.forEach(input => console.log(' ', input.manufacturer, input.name));
        
        // Outputs
        console.log('MIDI outputs:')
        WebMidi.outputs.forEach(output => console.log(' ', output.manufacturer, output.name));


        const myInput = WebMidi.getInputByName("Minilab3 MIDI");
        if(!myInput) {
            alert('No MIDI input found')
            return
        }
        myInput.addListener('noteon',
            function(e) {
                console.log("Received 'noteon' message (" + e.note.name + e.note.octave + ").");
                //player.playNoteFreq(e.note.frequency)
            }
        );
        myInput.addListener('noteoff',
            function(e) {
                console.log("Received 'noteoff' message (" + e.note.name + e.note.octave + ").");
                //player.playNoteFreq(e.note.frequency)
                console.log(e.note)
            }
        );

    }
    
</script>

<svelte:head>
    <title>PitchGrid</title>
</svelte:head>

<SvelteUIProvider withGlobalStyles themeObserver={$colorScheme}>
    <AppShell>
        <Header 
            slot='header'
            height={60}
        >
            <HeadContent 
                {isDark} {opened} toggle={toggleTheme} toggleOpen={toggleOpened}
            />

        </Header>
        <Matrix 
            on:playnote={(ev) => player.playNote(ev.detail.freq)} 
            on:stopnote={(ev) => handle_stop_note(ev.detail.freq)} 
            navbar_opened={opened}
        >
        </Matrix>
    </AppShell>
</SvelteUIProvider>

<!--
<span>
    <button on:click={toggleMidiOnOff}>MIDI ({#if midi_on}on{:else}off{/if})</button>
</span>
-->