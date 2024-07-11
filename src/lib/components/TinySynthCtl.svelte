<script lang='ts'>
    import { onMount } from 'svelte';

    import { ConsistentTuning } from '$lib/consistent_tuning';
    import { KeyboardPiano } from '$lib/keyboard_piano';
    import { NoteToMPE } from '$lib/note_to_mpe';

    import { Text, Stack, Space, Tooltip } from '@svelteuidev/core';

    import JZZ from 'jzz';
    import Tiny from 'jzz-synth-tiny';
    Tiny(JZZ);
    JZZ.synth.Tiny.register('Web Audio');
    let synth = JZZ.synth.Tiny()

    let selected_synth_engine_id = 0
    //synth.setSynth(0, synth.getSynth(58))
    //let tuba = synth.getSynth;
    //synth.setSynth(0, tuba);
    //for (let i = 1; i < 16; i++) {
    //    synth.setBendRange(i,48)
    //}

    export let temperament:ConsistentTuning
    export let pressed_note_coords:any[] = [];
    export let pianokeyboardProjectionOffset = 1

    export const playNote = (d:number, s:number, v:number) => {
        //console.log('playNote', d, s, v)
        handleNoteCoords(d, s, v)
    }

    let keyboard_piano:KeyboardPiano 
    let note_to_mpe = new NoteToMPE(temperament)
    $:(note_to_mpe.temperament = temperament)
    $:(note_to_mpe.projectionOffset = pianokeyboardProjectionOffset)

    function handleNoteCoords(d:number, s:number, velocity:number){
        let [mpe, pressed_notes] = note_to_mpe.noteCoordsToMPE(note_to_mpe, {d:d, s:s}, velocity, freq_A4)
        pressed_note_coords = pressed_notes
        //console.log('note', {d:d, s:s}, 'velocity', velocity, 'mpe', mpe)
        mpe.forEach((msg) => {
            synth.send(msg);
        })
    }
    function handleNote(note:number, velocity:number){
        let [mpe, pressed_notes] = note_to_mpe.noteToMPE(note_to_mpe, note, velocity, freq_A4)
        pressed_note_coords = pressed_notes
        //console.log('note', note, 'velocity', velocity, 'mpe', mpe)
        mpe.forEach((msg) => {
            synth.send(msg);
        })
    }
    onMount(() => {
        keyboard_piano = new KeyboardPiano(handleNote)
    })
    export let freq_A4 = 440.0

</script>

<Stack>
    <Space/>
    <Tooltip
        wrapLines
        width={300}
        withArrow
        openDelay={400}
        closeDelay={400}
        position="right"
        color="indigo"
        label="Adjust the concert pitch of the tuning. The note you adjust is always A4, which has the coordinates (5,9) in (d,s) space. (We set C4 as the origin, (0,0), in (d,s) space."
    >    
        <Text size='sm'>Concert pitch {freq_A4} Hz</Text>
        <input type="range" 
            bind:value={freq_A4} 
            min={420}
            max={460}
            step={0.1}
        /> 
    </Tooltip>  

    <Tooltip
        wrapLines
        width={200}
        withArrow
        openDelay={400}
        closeDelay={400}
        position="right"
        color="indigo"
        label="Select a preset for the YZZ Tiny Synth that is included in this app (128 presets available)."
    >   
        <Text size='sm'>Tiny Synth No. {selected_synth_engine_id}</Text>
        <input type="range" 
            bind:value={selected_synth_engine_id} 
            min={0}
            max={127}
            step={1}
            on:change={() => {
                synth.setSynth(0, synth.getSynth(selected_synth_engine_id))
            }}
        />
    </Tooltip> 
</Stack>