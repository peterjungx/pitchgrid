<script lang='ts'>
    import { onMount } from 'svelte';
    import { Modal, NativeSelect, Button, CheckboxGroup, Flex, Grid } from '@svelteuidev/core';
    import { WebMidi } from "webmidi";
    import { ConsistentTuning, coord_to_interval, interval_to_coord } from '$lib/consistent_tuning';



    export let opened = false;
    export let grid: any[];
    export let temperament: ConsistentTuning;

    let soma_terra_midi_id:string|null = null;
    let soma_terra_midi_out:any = null;
    let soma_terra_midi_in:any = null;
    let soma_terra_live_preset:Uint8Array = new Uint8Array();
    let soma_terra_pitch_shifter_preset:Uint8Array = new Uint8Array();

    const terra_pitchshifter_select_items = [
        {label: 'B1', value: 'B1'},
        {label: 'B2', value: 'B2'},
        {label: 'B3', value: 'B3'},
        {label: 'Px1', value: 'P1'},
        {label: 'Px2', value: 'P2'},
        {label: 'Px4', value: 'P4'},
    ]

    function crc32(message:Uint8Array){
        let crc = 0xFFFFFFFF;
        for (let i = 0; i < message.length; i++) {
            let k = Math.floor(i/4)*4 + (3-(i%4));
            crc ^= (message[k] << 24);
            for (let j = 0; j < 8; j++) {
                let msb = crc >> 31;
                crc = crc << 1;
                crc ^= msb ? 0x04C11DB7 : 0;
            }
        }
        let crc_bytes = new Uint8Array(4);
        crc_bytes[0] = crc & 0xFF;
        crc_bytes[1] = (crc >> 8) & 0xFF;
        crc_bytes[2] = (crc >> 16) & 0xFF;
        crc_bytes[3] = (crc >> 24) & 0xFF;
        return crc_bytes;
    }
    function soma_binary_to_sysex(data:Uint8Array){
        let sysex = new Uint8Array(data.length / 4 * 5);
        let j = 0;
        for (let i = 0; i < data.length; i+=4) {
            let word = data[i] | (data[i+1] << 8) | (data[i+2] << 16) | (data[i+3] << 24);
            sysex[j++] = (word >> 28) & 0x7F;
            sysex[j++] = (word >> 21) & 0x7F;
            sysex[j++] = (word >> 14) & 0x7F;
            sysex[j++] = (word >> 7) & 0x7F;
            sysex[j++] = word & 0x7F;
        }
        return sysex;
    }
    function soma_sysex_to_binary (data:Uint8Array) {
        let binary = new Uint8Array(data.length / 5 * 4);
        let j = 0;
        for (let i = 0; i < data.length; i+=5) {
            let word = (data[i] << 28) | (data[i+1] << 21) | (data[i+2] << 14) | (data[i+3] << 7) | data[i+4];
            binary[j++] = word & 0xFF;
            binary[j++] = (word >> 8) & 0xFF;
            binary[j++] = (word >> 16) & 0xFF;
            binary[j++] = (word >> 24) & 0xFF;
        }
        return binary;
    }

    onMount(() => {
        WebMidi.enable({sysex: true})
        .then(onWebMidiEnabled)
        .catch(err => alert(err));


        grid.forEach((e:any) => {
            console.log(e.d, e.s, coord_to_interval(e.d, e.s), interval_to_coord(coord_to_interval(e.d, e.s)));
        });
    });

    function onWebMidiEnabled() {
        // Inputs
        console.log('MIDI inputs:')
        WebMidi.inputs.forEach(input => console.log(' ', input.manufacturer, input.name));
        // Outputs
        console.log('MIDI outputs:')
        WebMidi.outputs.forEach(output => console.log(' ', output.manufacturer, output.name));
    }

    const sysex_head = new Uint8Array([0xF0, 0x7E, 0x54, 0x45, 0x52]);
    const sysex_tail = new Uint8Array([0xF7]);


    // define type TerraFunction 
    type TerraFunction = {
        sysex_cmd: Uint8Array|((bank:number, preset:number) => Uint8Array),
        cb: (data:Uint8Array) => void
    }
    // define terra_functions with type Map of string to TerraFunction
    const fetch_live_state:TerraFunction = {
        sysex_cmd: new Uint8Array([0x0A, 0x00, 0x7F, 0x0A]),
        cb: (data:Uint8Array) => {
            console.log('live preset', data);
            soma_terra_live_preset = data;
        }
    }    
    const fetch_pitch_shifter_preset:TerraFunction = {
        sysex_cmd: (bank:number, preset:number) => {return new Uint8Array([0x04, bank, preset, 0x04])},
        cb: (data:Uint8Array) => {
            console.log('pitch shifter preset', data);
            soma_terra_pitch_shifter_preset = data;
        }
    }
    const fetch_full_dump:TerraFunction = {
        sysex_cmd: new Uint8Array([0x00, 0x7F, 0x00, 0x00]),
        cb: (data:Uint8Array) => {
            console.log('full dump', data);
        }
    }
    let active_calls = new Map<string, TerraFunction>();

    function call_terra_function(func:TerraFunction){
        if (soma_terra_midi_out) {
            console.log('sending sysex to', soma_terra_midi_out);
            let sysex_cmd = typeof func.sysex_cmd === 'function' ? func.sysex_cmd(pitch_shifter_bank, pitch_shifter_preset) : func.sysex_cmd;
            soma_terra_midi_out.send([...sysex_head, ...sysex_cmd, ...sysex_tail]);
            active_calls.set(sysex_cmd.slice(0,3).toString(), func);
            console.log('active_calls set', sysex_cmd.slice(0,3).toString());
        }
    }

    const compareUint8Arrays = (arr1:Uint8Array, arr2:Uint8Array) => 
        arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);

    function set_soma_terra_midi() {
        if (soma_terra_midi_id) {
            soma_terra_midi_out = WebMidi.getOutputById(soma_terra_midi_id);
            soma_terra_midi_in = WebMidi.getInputByName(soma_terra_midi_out.name);
            // listen for sysex messages
            soma_terra_midi_in.addListener('sysex', (e:any) => {
                console.log('sysex', e);
                if (!compareUint8Arrays(e.data.slice(0, 5), sysex_head) || !compareUint8Arrays(e.data.slice(-1), sysex_tail)) {
                    return;
                }
                let soma_sysex_cmd_str = e.data.slice(5, 8).toString()
                if (active_calls.has(soma_sysex_cmd_str)) {
                    active_calls.get(soma_sysex_cmd_str)?.cb(soma_sysex_to_binary(e.data.slice(9, -1)));
                    active_calls.delete(soma_sysex_cmd_str);
                }
            });
        }
    }

    let ps: { [key: string]: string } = {
        oooo:'P1',
        Oooo:'P15',
        oOoo:'P8',
        ooOo:'-P8',
        oooO:'-P15',
        OOoo:'P5',
        OOoO:'-P4',
        OoOO:'P4',
        ooOO:'-P5',
        OOOo:'P12',
        OoOo:'P22',
        oOoO:'-P22',
        oOOO:'-P12',
        oOOo:'M2',
        OooO:'m2',
        OOOO:'M3',
    }

    function set_tuning(){
        // set pitches
        let scale = [[0,0], [1,2], [2,4], [3,5], [4,7], [5,9], [6,11], [7,12], [8,14], [9,16], [10,17], [11,19]];
        for (let i = 0; i < 12; i++) {
            let note = scale[i];
            let freq = grid.filter((e:any)=>e.d==note[0] && e.s==note[1])[0].freq;
            let midi_note = Math.log2(freq / 440) * 12 + 69;
            let terra_cents = Math.round((midi_note - Math.round(midi_note)) * 128);
            if (terra_cents < 0) {
                terra_cents += 256;
            }
            midi_note = Math.round(midi_note)

            if (soma_terra_live_preset){
                soma_terra_live_preset[16 +i]=midi_note;
                soma_terra_live_preset[16 +12 +i]=terra_cents;
            }

            //let midi_note_exact = midi_note + (terra_cents-(terra_cents>127?256:0)) / 128;
            //let mapped_freq = Math.pow(2, (midi_note_exact - 69) / 12) * 440;
            //let mapped_freq_error_cents = 1200 * Math.log2(mapped_freq / freq);
           //console.log('note', note, freq, midi_note, terra_cents,mapped_freq, mapped_freq_error_cents);
        }

        // set pitch shifter preset to be used 
        soma_terra_live_preset[16] += pitch_shifter_preset & 0x01 ? 128 : 0;
        soma_terra_live_preset[17] += pitch_shifter_preset & 0x02 ? 128 : 0;
        soma_terra_live_preset[18] += pitch_shifter_preset & 0x04 ? 128 : 0;
        soma_terra_live_preset[19] += pitch_shifter_bank == 1 ? 128 : 0;
        soma_terra_live_preset[20] += pitch_shifter_bank == 2 ? 128 : 0;


        // set pitch shifter preset pitches
        for (let cfg in ps){
            if (ps.hasOwnProperty(cfg)){

                let i = (cfg.charAt(0)=='O'?8:0) + (cfg.charAt(1)=='O'?4:0) + (cfg.charAt(2)=='O'?2:0) + (cfg.charAt(3)=='O'?1:0);
                let [d,s] = interval_to_coord( ps[cfg])
                let freq = temperament.coord_to_freq(d,s);
                let midi_note_offset = Math.log2(freq) * 12;
                let terra_cents_offset = Math.round((midi_note_offset - Math.round(midi_note_offset)) * 128);
                if (terra_cents_offset < 0) {
                    terra_cents_offset += 256;
                }
                midi_note_offset = Math.round(midi_note_offset)
                midi_note_offset += midi_note_offset < 0 ? 256 : 0;
                if(soma_terra_pitch_shifter_preset){
                    soma_terra_pitch_shifter_preset[16+i] = midi_note_offset
                    soma_terra_pitch_shifter_preset[32+i] = terra_cents_offset
                }
            }
        }

        let crc = crc32(soma_terra_live_preset.slice(16,48))
        soma_terra_live_preset.set(crc, 12);

        crc = crc32(soma_terra_pitch_shifter_preset.slice(16,48))
        soma_terra_pitch_shifter_preset.set(crc, 12);

    }

    

    function write_live_preset(){
        if (soma_terra_midi_out && soma_terra_live_preset) {
            
            let sysex_msg = [...sysex_head, 0x0B, 0x00, 0x7F, 0x0B, ...soma_binary_to_sysex(soma_terra_live_preset), ...sysex_tail];
            console.log('sending data:', soma_terra_live_preset);
            console.log('sending sysex:', sysex_msg);
            soma_terra_midi_out.send(sysex_msg);
        }
    }
    function write_pitch_shifter_preset(){
        if (soma_terra_midi_out && soma_terra_pitch_shifter_preset) {
            
            let sysex_msg = [...sysex_head, 0x05, pitch_shifter_bank, pitch_shifter_preset, 0x05, ...soma_binary_to_sysex(soma_terra_pitch_shifter_preset), ...sysex_tail];
            console.log('sending data:', soma_terra_live_preset);
            console.log('sending sysex:', sysex_msg);
            soma_terra_midi_out.send(sysex_msg);
        }
    }

    const default_intervals=['P22','P15','P12',
        'P8','P5', 'P4', 'M3','m3','M2','m2', 'A1', 
        'P1',
        '-A1','-m2','-M2','-m3','-M3','-P4','-P5','-P8',
        '-P12','-P15','-P22']

    let pitch_shifter_bank = 2;
    let pitch_shifter_preset = 7;
    let pitchshifter_select_value = ['B3', 'P1', 'P2', 'P4'];

    function update_pitch_shifter_preset_select(){

        let bank_selection = pitchshifter_select_value.filter(e=>e.slice(0,1)=='B').map(e=>Number(e.slice(1))-1);
        if (bank_selection.length > 1) {
            pitchshifter_select_value = pitchshifter_select_value.filter(e=>e!='B'+(pitch_shifter_bank+1));
            pitch_shifter_bank = Number(pitchshifter_select_value.filter(e=>e.slice(0,1)=='B')[0].slice(1))-1;
        }
        if (bank_selection.length == 0) {
            pitchshifter_select_value = ['B'+(pitch_shifter_bank+1), ...pitchshifter_select_value]
        }
        pitch_shifter_preset = pitchshifter_select_value.filter(e=>e.slice(0,1)=='P').map(e=>Number(e.slice(1))).reduce((a,v)=>a+v,0);        
    }

</script>

<Modal {opened} on:close={() => opened = false}>

    <NativeSelect
        size="xs"
        label="SOMA Terra MIDI"
        bind:value={soma_terra_midi_id}
        on:change={set_soma_terra_midi}
        data = {WebMidi.outputs.map(output => ({value: output.id, label: `${output.name} (${output.manufacturer})`}))}
    />

    <Button size="xs" on:click={()=>{call_terra_function(fetch_live_state)}}>Fetch SOMA Terra Live State</Button>
    <div>{soma_terra_live_preset.slice(0,12)}</div>
    <div>{soma_terra_live_preset.slice(12,16)}</div>
    <div>{soma_terra_live_preset.slice(16,16+12)}</div>
    <div>{soma_terra_live_preset.slice(16+12,16+24)}</div>
    <div>{soma_terra_live_preset.slice(16+24,48)}</div>
    <div>{crc32(soma_terra_live_preset.slice(16,48))}</div>

    <Button size="xs" on:click={()=>{call_terra_function(fetch_pitch_shifter_preset)}}>Fetch SOMA Terra Pitch Shifter Preset B{pitch_shifter_bank+1} P{pitch_shifter_preset+1}</Button>
    
    <div>{soma_terra_pitch_shifter_preset.slice(0,12)}</div>
    <div>{soma_terra_pitch_shifter_preset.slice(12,16)}</div>
    <div>{soma_terra_pitch_shifter_preset.slice(16,16+16)}</div>
    <div>{soma_terra_pitch_shifter_preset.slice(16+16,16+32)}</div>
    <div>{crc32(soma_terra_pitch_shifter_preset.slice(16,48))}</div>
    <div>{(new Int8Array(soma_terra_pitch_shifter_preset.slice(16,16+16)))}</div>
    
    <CheckboxGroup
        size="xs"
        items={terra_pitchshifter_select_items}
        bind:value={pitchshifter_select_value}
        on:change={update_pitch_shifter_preset_select}
    />
   
    <div>{pitchshifter_select_value} {pitch_shifter_bank} {pitch_shifter_preset}</div>
   
    <Grid spacing="xs" cols={16}>
        <Grid.Col span={4}></Grid.Col>
        <Grid.Col span={8}> <NativeSelect label="oooo" size="xs" data={default_intervals} bind:value={ps.oooo}/></Grid.Col>
        <Grid.Col span={4}> <NativeSelect label="Oooo" size="xs" data={default_intervals} bind:value={ps.Oooo} /></Grid.Col>
        <Grid.Col span={4}> <NativeSelect label="oOoo" size="xs" data={default_intervals} bind:value={ps.oOoo} /></Grid.Col>
        <Grid.Col span={4}> <NativeSelect label="ooOo" size="xs" data={default_intervals} bind:value={ps.ooOo} /></Grid.Col>
        <Grid.Col span={4}> <NativeSelect label="oooO" size="xs" data={default_intervals} bind:value={ps.oooO} /></Grid.Col>
        <Grid.Col span={4}> <NativeSelect label="OOoo" size="xs" data={default_intervals} bind:value={ps.OOoo} /></Grid.Col>
        <Grid.Col span={4}> <NativeSelect label="OOoO" size="xs" data={default_intervals} bind:value={ps.OOoO} /></Grid.Col>
        <Grid.Col span={4}> <NativeSelect label="OoOO" size="xs" data={default_intervals} bind:value={ps.OoOO} /></Grid.Col>
        <Grid.Col span={4}> <NativeSelect label="ooOO" size="xs" data={default_intervals} bind:value={ps.ooOO} /></Grid.Col>
        <Grid.Col span={4}> <NativeSelect label="OOOo" size="xs" data={default_intervals} bind:value={ps.OOOo} /></Grid.Col>
        <Grid.Col span={4}> <NativeSelect label="OoOo" size="xs" data={default_intervals} bind:value={ps.OoOo} /></Grid.Col>
        <Grid.Col span={4}> <NativeSelect label="oOoO" size="xs" data={default_intervals} bind:value={ps.oOoO} /></Grid.Col>
        <Grid.Col span={4}> <NativeSelect label="oOOO" size="xs" data={default_intervals} bind:value={ps.oOOO} /></Grid.Col>
        <Grid.Col span={4}> <NativeSelect label="oOOo" size="xs" data={default_intervals} bind:value={ps.oOOo} /></Grid.Col>
        <Grid.Col span={4}> <NativeSelect label="OooO" size="xs" data={default_intervals} bind:value={ps.OooO} /></Grid.Col>
        <Grid.Col span={8}> <NativeSelect label="OOOO" size="xs" data={default_intervals} bind:value={ps.OOOO} /></Grid.Col>
    </Grid>
    <Flex>
        <Button size="xs" on:click={set_tuning}>Set Tuning</Button>
        <Button size="xs" on:click={write_live_preset}>Set Live Preset</Button>
        <Button size="xs" on:click={write_pitch_shifter_preset}>Set Pitch Shifter Preset</Button>
    </Flex>
</Modal>
