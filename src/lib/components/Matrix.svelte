<script lang="ts">
    import IsoButton from './IsoButton.svelte';
    import PitchGrid from './PitchGrid.svelte';
    import PianoStrip from './PianoStrip.svelte';
    import DSGrid from './DSGrid.svelte';
    import TinySynthCtl from '$lib/components/TinySynthCtl.svelte';
    import TerraTuner from './TerraTuner.svelte';

    import { Container, Space, Stack, Anchor, Tooltip, NumberInput, Navbar, NativeSelect, Button } from '@svelteuidev/core';

    import { ConsistentTuning } from '$lib/consistent_tuning';
    import { matrix, add, multiply, dot } from 'mathjs';
    import { onMount, createEventDispatcher } from 'svelte';
    import Voronoi from 'voronoi';

    const dispatch = createEventDispatcher();

    let iso_button_path = 'M 0 0 L 60 30'
    let matrix_width=0, matrix_height=0

    export let navbar_opened = false
    export let temperament:ConsistentTuning

    let roundCorners:(a:string, b:number, c:number)=>{path: string} 
        = (a:string, b:number, c:number)=>({path: a})

    onMount(async () => {
        roundCorners = (await import('svg-round-corners')).roundCorners;
        setLayout(selected_layout)
    })

    const voronoi = new Voronoi();


    // Grid setup
    let grid: any[] = [];

    function coord_to_note(d: number, s: number){
        let notes = ['C','D','E','F','G','A','B']
        const halfsteps_major = [2,2,1,2,2,2,1]
        let halfsteps_major_d = 0
        if (d>0){
            for (let i=0; i<d; i++){
                halfsteps_major_d += halfsteps_major[i%7]
            }
        }
        else if (d<0){
            for (let i=-1; i>=d; i--){
                halfsteps_major_d -= halfsteps_major[(i+70)%7]
            }
        }
        let diatonic_note = notes[(d+70)%7]
        let accidental = '#'.repeat(s>halfsteps_major_d ? s-halfsteps_major_d:0) + 'b'.repeat(s<halfsteps_major_d ? halfsteps_major_d-s:0)
        return diatonic_note + accidental + Math.floor(s/12+4)
    }

    for (let d = -2*7; d <= 3*7; d++) {
        for (let s=-2*12; s<=3*12; s++) {
            if (coord_to_note(d,s).length < 5)
                grid.push({
                    d,
                    s, 
                    note: coord_to_note(d,s),
                    color: d%7===0 && s%12===0 ? 'red' : 'white',
                    label: coord_to_note(d,s),
                    freq: 1,
                    pressed: false,
                })
        }
    }


    // Temperament setup
    const temperaments:{[key: string]: ConsistentTuning} = {
        '12-TET':new ConsistentTuning(4, 7, 2**(7/12), 7, 12, 2),
        '31-TET':new ConsistentTuning(1, 2, 2**(5/31), 7, 12, 2),
        'Pythagorean':new ConsistentTuning(7, 12, 2, 4, 7, 3/2),
        '1/4-Comma Meantone':new ConsistentTuning(2, 4, 5/4, 7, 12, 2),
        '1/3-Comma Meantone':new ConsistentTuning(2, 3, 6/5, 7, 12, 2),
        'Cleantone':new ConsistentTuning(2, 4, 5/4, 4, 7, 3/2),
        'Cleantone-7':new ConsistentTuning(2, 3, 7/6, 4, 7, 3/2)
    }
    temperament = temperaments['12-TET']

    let freq_A4 = 440.0 // concert pitch

    function coord_to_freq(base_freq_a4:number, d: number, s: number){
        return base_freq_a4 / temperament.coord_to_freq(5,9) * temperament.coord_to_freq(d,s)
    }

    function retuneGrid(base_freq_a4:number){
        grid.forEach(e => {
            e.freq = coord_to_freq(base_freq_a4, e.d, e.s)
            e.freq_ratio = temperament.coord_to_freq(e.d, e.s)
        })
        grid = grid
    }
    $:retuneGrid(freq_A4)


    // Layout setup

    let one = 80
    let DSXY = multiply(one, matrix([[- 1/2, 1/2], [5/Math.sqrt(2), - 3/Math.sqrt(2)]]))
    let center = matrix([0, 0])

    function handleMatrixSizeChange(w:number,h:number){
        center = add(matrix([w/2, h/2]), multiply(DSXY, matrix([-3.5,-6])))
        recalcGrid()
    }
    $:handleMatrixSizeChange(matrix_width, matrix_height)

    function recalcGrid(){
        grid.forEach(e => {
            let v = add(center, multiply(DSXY, matrix([e.d, e.s])))
            e.x = v.get([0]) 
            e.y = v.get([1]) 
        })
        grid = grid
    }

    let layouts: {[key: string]: {scale: number, transform: number[][], label:string}} = {
        'ds_lattice':{
            scale: 80,
            transform: [[0, 1/Math.sqrt(2)], [-1/2, 0]],
            label:'(d,s)-Lattice'
        },
        'bosanquet':{
            scale: 40,
            transform: [[-12*0.8, 7*0.8], [0, -0.355], ],
            label:'Bosanquet'
        },
        'bosanquet2':{
            scale: 40,
            transform: [[0, Math.sqrt(2)/6], [12, -7]],
            label:'Bosanquet 2'
        },
        'fokker':{
            scale: 120,
            transform: [[0, 0.3], [-1, 0.5]],
            label:'Fokker'
        },
        'wicki':{
            scale: 50,
            transform: [[-12/Math.sqrt(2), 7/Math.sqrt(2)], [-2, 1]],
            label:'Wicki'
        },
        'cleantone':{
            scale: 80,
            transform: [[- 1/2, 1/2], [5/Math.sqrt(2), - 3/Math.sqrt(2)]],
            label:'Cleantone'
        },
    }
    function setLayout(layout: string){
        one = layouts[layout].scale
        DSXY = multiply(one, matrix(layouts[layout].transform))
        recalcGrid()
        calcIsoButtonPath()
    }

    let _playSynthNote:(d:number, s:number, v:number)=>void = ()=>{};
    function playSynthNote(d: number, s: number, v: number){
        _playSynthNote(d, s, v);
    }

    function handleStartMove(event: CustomEvent<any>) {
        let ev = event.detail

        playSynthNote(ev.d, ev.s, 100)
        //console.log(ev.freq)
        //dispatch('playnote', {freq: ev.freq})

    }

    function calcIsoButtonPath(){
        let pos_00 = matrix([0, 0])
        let pos = matrix([0, 0])
        let grid_sub = grid.filter(e => e.d<8 && e.d>-8 && e.s<12 && e.s>-12)
        grid_sub.forEach(e => {
            if (e.d===0 && e.s===0){
                pos_00 = matrix([e.x, e.y])
            }
        })
        grid_sub.forEach(e => {
            pos = add(multiply(-1, pos_00), matrix([e.x, e.y]))
            e.distance_sq = dot(pos, pos)
        })
        grid_sub.sort((a, b) => a.distance_sq - b.distance_sq)

        const x0 = grid_sub[0].x
        const y0 = grid_sub[0].y
        const offset = 3

        let points = grid_sub
            .slice(0,7)
            .map(e => ({x: e.x-x0, y: e.y-y0, d:Math.sqrt((e.x-x0)*(e.x-x0)+(e.y-y0)*(e.y-y0))}))
            .map(e=>({x:e.d>2*offset?e.x*(e.d-offset)/e.d:0, y:e.d>2*offset?e.y*(e.d-offset)/e.d:0}))
        
        const bbox = {xl: -1000, xr: 1000, yt: -1000, yb: 1000};
        const diagram = voronoi.compute(points, bbox);
        const path_points = diagram.cells.filter((e: { site: { x: number; y: number; }; })=>e.site.x===0 && e.site.y===0)[0].halfedges.map((e: { getEndpoint: () => any; })=>e.getEndpoint())
        
        const raw_path = 'M' + path_points.map((e: { x: number; y: number; })=>e.x + ' '+e.y).join('L') + 'Z'
        
        const rounded_path = roundCorners('M' + path_points.map((e: { x: number; y: number; })=>e.x + ' '+e.y).join('L') + 'Z', 10, 2)
        if (rounded_path.path && ! rounded_path.path.includes('NaN')){
            iso_button_path = rounded_path.path
        }else{
            iso_button_path = raw_path
        }
    }

    function handleMoving(event: CustomEvent<any>) {
        let ev = event.detail
        let cl = calcIsoButtonPath()
        
        if (ev.d === 0 && ev.s === 0) {
            center = matrix([ev.left, ev.top])
        }else{
            if (ev.d === 0) {
                DSXY = matrix([[DSXY.get([0,0]), (ev.left - center.get([0])) / ev.s], [DSXY.get([1,0]), (ev.top - center.get([1])) / ev.s]])
                //s_dx = (ev.left - center.get([0])) / ev.s
                //s_dy = (ev.top - center.get([1])) / ev.s
            }else if (ev.s === 0) {
                DSXY = matrix([[(ev.left - center.get([0])) / ev.d, DSXY.get([0,1])], [(ev.top - center.get([1])) / ev.d, DSXY.get([1,1])]])
                //d_dx = (ev.left - center.get([0])) / ev.d
                //d_dy = (ev.top - center.get([1])) / ev.d
            }else{
                
            }
        }
        recalcGrid()
    }
    function handleEndMove(event: CustomEvent<any>) {
        let ev = event.detail
        //console.log('end move', ev)
        playSynthNote(ev.d, ev.s, 0)
        //dispatch('stopnote', {freq: ev.freq})
    }
    function handleClick(d: number , s: number) {
        //console.log('clicked', d, s)
    }

    let selected_label: string = 'notename'
    let selected_layout: string = 'ds_lattice'
    let temperament_select: string = '12-TET'
    let selected_colorscheme: string = 'piano'

    let piano_strip_offset = 3
    let show_piano_strip = false 
    let show_pitch_grid = false
    let show_ds_grid = false

    let pressed_note_coords:any[] = []
    function handlePressedNoteCoords(pnc: any[]) {
        grid.forEach(f => {
            f.pressed = pnc.some(e => e.d === f.d && e.s === f.s)
        })
        grid=grid
    }

    $:(handlePressedNoteCoords(pressed_note_coords))

    export let show_terra_tuner = false

</script>

<style>
    .matrix-container {
        position: absolute;
        overflow:hidden;
        left:0px;
        right:0px;
        top:68px;
        bottom:0px;
        /*border: 1px solid red;*/
        background-color: #404040;
    }
</style>


<Navbar 
    width={{sm:200}} 
    hidden={!navbar_opened} 
    hiddenBreakpoint='md'
>
    <Container>
        <Stack>
            <Space />
            <Tooltip
                wrapLines
                width={300}
                withArrow
                openDelay={400}
                closeDelay={400}
                position="right"
                color="indigo"
                label="Select the information the keys show. You can show frequencies or deviation from equal temperament in cents, etc."
            >
                <NativeSelect 
                    bind:value={selected_label}
                    label='Labels'
                    data={[
                        {value:'notename', label:'Note names'},
                        {value:'coordinates', label:'Coordinates (d,s)'},
                        {value:'freq', label:'Frequency (Hz)'},
                        {value:'interval', label:'Interval'},
                        {value:'cents', label:'Cents'},
                        {value:'et_delta_cents', label:'dCents (ET)'}
                    ]}
                />
            </Tooltip>  

            <Tooltip
                wrapLines
                width={300}
                withArrow
                openDelay={400}
                closeDelay={400}
                position="right"
                color="indigo"
                label="Select preconfigured isomorphic layout. Default is diatonic steps (d) along y-axis and chormatic steps (semitones s) along x-axis. This is the (d,s)-lattice. Other options include historic layouts like Wicki, Bosanquet or Fokker. You can also drag C3, C#3 or Dbb3 to create your own isomorphic layout."
            >
                <NativeSelect
                    bind:value={selected_layout}
                    on:change={()=>{setLayout(selected_layout)}}
                    label='Layout'
                    data={Object.keys(layouts).map(e=>({value:e, label:layouts[e].label}))}
                />
            </Tooltip> 

            <Tooltip
                wrapLines
                width={300}
                withArrow
                openDelay={400}
                closeDelay={400}
                position="right"
                color="indigo"
                label="Select the temperament applied to the 2-d layout. In the common 12-TET (twelve tone equal temperament) pitch does not change along the d-axis. In principle, any rank-2 regular temperament (or consistent tuning) is supported, with the Pythagorean and all Meantone temperaments being among them. Here we have some temperaments preconfigured."
            >
                <NativeSelect
                    bind:value={temperament_select}
                    label='Temperament'
                    on:change={()=>{
                        temperament = temperaments[temperament_select];
                        retuneGrid(freq_A4)
                    }}
                    data={Object.keys(temperaments)}
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
                label="Select the coloring scheme to apply to the keys."
                >            
                <NativeSelect 
                    bind:value={selected_colorscheme}
                    label='Color Scheme'
                    data={[
                        {value:'piano', label:'Piano'},
                        {value:'rainbow', label:'Rainbow'},
                        {value:'cleantone', label:'Cleantone'}
                    ]}
                />
            </Tooltip>

            <Tooltip
                wrapLines
                width={300}
                withArrow
                openDelay={400}
                closeDelay={400}
                position="right"
                color="indigo"
                label="A piano keyboard is 1-dimensional, hence it only can play a subset of the notes from the two dimensions of Western musical scales presented here. Whatever keys happen to fall inside the piano strip will be available. You can use your PC keyboard to play a piano keyboard configuration."
            >    
                <Button 
                    on:click={()=>{show_piano_strip = !show_piano_strip}}
                >
                    Piano Strip ({#if show_piano_strip}on{:else}off{/if})
                </Button>
            </Tooltip>
            {#if show_piano_strip}
            <Tooltip
                wrapLines
                width={300}
                withArrow
                openDelay={400}
                closeDelay={400}
                position="right"
                color="indigo"
                label="Apply an offset to the strip to change the area playable on the keyboard. Offset=1 means all black keys are b's, 6 means all black keys are #'s. This setting depends on which key you want to play in. For example, A-major has three accidentals, F#, C# and G#. If you want to play a piece in that key on the piano, the offset should be at least 4, so these notes are available."
                >               
                
                    <NumberInput 
                        bind:value={piano_strip_offset}
                        label='Piano Strip Offset'
                        min={1}
                        max={6}
                        step={1}
                    />
            </Tooltip>
            {/if}

            <Tooltip
                wrapLines
                width={300}
                withArrow
                openDelay={400}
                closeDelay={400}
                position="right"
                color="indigo"
                label="The lines in the pitch grid show along the direction of constant pitch. We display lines for the twelve pitches of 12-TET, and the generator frequencies of the selected temperament."
            >    
                <Button 
                    on:click={()=>{show_pitch_grid = !show_pitch_grid}}
                >
                    Pitch Grid ({#if show_pitch_grid}on{:else}off{/if})
                </Button>
            </Tooltip>

            <Tooltip
                wrapLines
                width={200}
                withArrow
                openDelay={400}
                closeDelay={400}
                position="right"
                color="indigo"
                label="The DS Grid shows lines along the diatonic and chromatic directions."
            >                
                <Button 
                    on:click={()=>{show_ds_grid = !show_ds_grid}}
                >
                    DS Grid ({#if show_ds_grid}on{:else}off{/if})
                </Button>
            </Tooltip>  

        </Stack>

        <TinySynthCtl 
            temperament={temperament} 
            bind:pressed_note_coords={pressed_note_coords} 
            bind:playNote={_playSynthNote}
            bind:freq_A4={freq_A4}
            bind:pianokeyboardProjectionOffset={piano_strip_offset}
        />

        <Stack justify="flex-end">
            <Space h="xl" />
            <Anchor href="/about">About</Anchor>
        </Stack>
    </Container>
</Navbar>


    <div 
        class="matrix-container" 
        bind:clientWidth={matrix_width}
        bind:clientHeight={matrix_height}
    >

        {#each grid as e}
            <IsoButton 
                on:moving={handleMoving} 
                on:startmove={handleStartMove}
                on:endmove={handleEndMove}
                on:click={()=>handleClick(e.d, e.s)}
                bind:left={e.x} 
                bind:top={e.y} 
                bind:notename={e.note}
                bind:freq={e.freq}
                bind:freq_ratio={e.freq_ratio}
                bind:pressed={e.pressed}
                colorscheme={selected_colorscheme}
                path={iso_button_path}
                labeltype={selected_label}
                display_center_point={show_piano_strip||show_pitch_grid||show_ds_grid?true:false}
                d={e.d} 
                s={e.s} />
        {/each}
        {#if show_piano_strip}
            <PianoStrip 
                DSXY={DSXY}
                center={center}
                offset={piano_strip_offset}
            />
        {/if}
        {#if show_pitch_grid}
            <PitchGrid 
                DSXY={DSXY}
                center={center}
                temperament={temperament}
            />
        {/if}
        {#if show_ds_grid}
            <DSGrid 
                DSXY={DSXY}
                center={center}
            />
        {/if}

    </div>

    <TerraTuner 
        bind:opened={show_terra_tuner} 
        bind:grid={grid}
        bind:temperament={temperament}
    />
    


