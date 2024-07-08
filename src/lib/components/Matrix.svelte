<script lang="ts">
    import IsoButton from './IsoButton.svelte';
    import PitchGrid from './PitchGrid.svelte';
    import PianoStrip from './PianoStrip.svelte';
    import DSGrid from './DSGrid.svelte';

    import { ConsistentTuning } from '$lib/consistent_tuning';
    import { matrix, add, multiply, dot } from 'mathjs';
    import { onMount, createEventDispatcher } from 'svelte';
    import Voronoi from 'voronoi';

    const dispatch = createEventDispatcher();

    let iso_button_path = 'M 0 0 L 60 30'
    let matrix_width=0, matrix_height=0


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
        return diatonic_note + accidental + Math.floor(s/12+3)
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
                    //bordercolor: d===0&&s===0?'red':'orange'
                })
        }
    }


    // Temperament setup
    let temperament = new ConsistentTuning(4, 7, 2**(7/12), 7, 12, 2)

    let freq_A4 = 440.0 // concert pitch

    function coord_to_freq(d: number, s: number){
        return freq_A4 / temperament.coord_to_freq(5,9) * temperament.coord_to_freq(d,s)
    }

    function retuneGrid(){
        grid.forEach(e => {
            e.freq = coord_to_freq(e.d, e.s)
            e.freq_ratio = temperament.coord_to_freq(e.d, e.s)
        })
        grid = grid
    }
    retuneGrid()

    const temperaments = {
        '12-TET': {
            'generator_a':{
                'interval':'P5',
                'frequency_ratio': 2**(7/12)
            },
            'generator_b':{
                'interval':'P8',
                'frequency_ratio': 2
            }
        }
    }

    function set12TETTemperament(){
        temperament = new ConsistentTuning(4, 7, 2**(7/12), 7, 12, 2)
        retuneGrid()
    }
    function set31TETTemperament(){
        temperament = new ConsistentTuning(1, 2, 2**(5/31), 7, 12, 2)
        retuneGrid()
    }
    function setPythagoreanTemperament(){
        temperament = new ConsistentTuning(7, 12, 2, 4, 7, 3/2)
        retuneGrid()
    }
    function setQCMeantoneTemperament(){
        temperament = new ConsistentTuning(2, 4, 5/4, 7, 12, 2)
        retuneGrid()
    }
    function setTCMeantoneTemperament(){
        temperament = new ConsistentTuning(2, 3, 6/5, 7, 12, 2)
        retuneGrid()
    }
    function setCleantoneTemperament(){
        temperament = new ConsistentTuning(2, 4, 5/4, 4, 7, 3/2)
        retuneGrid()
    }
    function setCleantone7Temperament(){
        temperament = new ConsistentTuning(2, 3, 7/6, 4, 7, 3/2)
        retuneGrid()
    }


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
    function midi_note_to_freq(midi_note: number){
        let s = midi_note - 69
        let d = Math.floor((midi_note-69)/7)
        return coord_to_freq(d, s)
    }

    let layouts: {[key: string]: {scale: number, transform: number[][], label:string}} = {
        'ds_lattice':{
            scale: 80,
            transform: [[0, 1/Math.sqrt(2)], [-1/2, 0]],
            label:'(d,s)-Lattice'
        },
        'cleantone':{
            scale: 80,
            transform: [[- 1/2, 1/2], [5/Math.sqrt(2), - 3/Math.sqrt(2)]],
            label:'Cleantone'
        },
        'wicki':{
            scale: 50,
            transform: [[-12/Math.sqrt(2), 7/Math.sqrt(2)], [-2, 1]],
            label:'Wicki'
        },
        'bosanquet':{
            scale: 40,
            transform: [[0, Math.sqrt(2)/6], [12, -7]],
            label:'Bosanquet'
        },
        'fokker':{
            scale: 120,
            transform: [[0, 0.3], [-1, 0.5]],
            label:'Fokker'
        }
    }
    function setLayout(layout: string){
        one = layouts[layout].scale
        DSXY = multiply(one, matrix(layouts[layout].transform))
        recalcGrid()
        calcIsoButtonPath()
    }

    function handleStartMove(event: CustomEvent<any>) {
        let ev = event.detail

        console.log(ev.freq)
        dispatch('playnote', {freq: ev.freq})

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
        const offset = 6

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
        console.log('end move', ev)
        dispatch('stopnote', {freq: ev.freq})
    }
    function handleClick(d: number , s: number) {
        console.log('clicked', d, s)
    }

    let selected_label: string = 'notename'
    let selected_layout: string = 'ds_lattice'
    let temperament_select: ()=>void = set12TETTemperament
    let selected_colorscheme: string = 'piano'

    let piano_strip_offset = 0
    let show_piano_strip = false 
    let show_pitch_grid = false
    let show_ds_grid = false

</script>

<style>
    .matrix-container {
        position: absolute;
        overflow:hidden;
        left:0px;
        right:0px;
        top:40px;
        bottom:0px;
        /*border: 1px solid red;*/
        background-color: #404040;
    }
</style>

<div>
    <div style="display:inline-block;">
        <a href="https://github.com/peterjungx/pitchgrid" target="_blank">PitchGrid</a>
    </div>

    <div style="display:inline-block;">
        <span>Labels:</span>
        <select bind:value={selected_label}>
            <option value="notename">Note names</option>
            <option value="coordinates">Coordinates (d,s)</option>
            <option value="freq">Frequency (Hz)</option>
            <option value="interval">Interval</option>
            <option value="cents">Cents</option>
            <option value="et_delta_cents">dCents (ET)</option>
        </select>
    </div>

    <div style="display:inline-block;">
        <span>Layout:</span>
        <select bind:value={selected_layout} on:change={()=>{setLayout(selected_layout)}}>
            {#each Object.keys(layouts) as layout}
                <option value={layout}>{layouts[layout].label}</option>
            {/each}
        </select>
    </div>


    <div style="display:inline-block;">
        <span>Temperament:</span>
        <select bind:value={temperament_select} on:change={()=>{temperament_select()}}>
            <option value="{set12TETTemperament}">12-TET</option>
            <option value="{set31TETTemperament}">31-TET</option>
            <option value="{setPythagoreanTemperament}">Pythagorean</option>
            <option value="{setQCMeantoneTemperament}">1/4-Comma Meantone</option>
            <option value="{setTCMeantoneTemperament}">1/3-Comma Meantone</option>
            <option value="{setCleantoneTemperament}">Cleantone</option>
            <option value="{setCleantone7Temperament}">Cleantone-7</option>
        </select>
    </div>

    <div style="display:inline-block;">
        <button on:click={()=>{show_piano_strip = !show_piano_strip}}>Piano Strip ({#if show_piano_strip}on{:else}off{/if})</button>
        <button on:click={()=>{show_pitch_grid = !show_pitch_grid}}>Pitch Grid ({#if show_pitch_grid}on{:else}off{/if})</button>
        <button on:click={()=>{show_ds_grid = !show_ds_grid}}>DS Grid ({#if show_ds_grid}on{:else}off{/if})</button>
    </div>

    <div style="display:inline-block;">
        <span>Concert Pitch (A4 in Hz)</span>
        <input style="width:50px" type="number" bind:value={freq_A4} on:change={retuneGrid}/>
    </div>

    <div style="display:inline-block;">
        <span>Color Scheme:</span>
        <select bind:value={selected_colorscheme}>
            <option value="piano">Piano</option>
            <option value="rainbow">Rainbow</option>
            <option value="cleantone">Cleantone</option>
        </select>
    </div>

    <div style="display:inline-block;">
       <a href="/about">About</a>
    </div>

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



</div>


