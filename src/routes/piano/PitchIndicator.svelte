<script lang='ts'>
    import { browser } from '$app/environment';
    import {getSx, type AffineTransform, type MOS, type PrimeList} from '$lib/scalatrix';
    import type { nodeinfo } from './types';
    import { base } from '$app/paths';

    export let mos:MOS;
    export let affine_t:AffineTransform;
    export let nodeinfos:nodeinfo[];
    export let octave;
    export let steps;
    export let base_freq:number;

    let sx: any = null;
    let loading = true;
    let error: string | null = null;

    async function loadScalatrix() {
        if (!browser) return;

        try {
            const module = await getSx();
            sx = module;
            loading = false;
        } catch (err) {
            console.error('Failed to load scalatrix:', err);
            error = 'Failed to load scalatrix module';
            loading = false;
        }
    }

    // Load scalatrix when component mounts in browser
    $: if (browser && loading && !sx) {
        loadScalatrix();
    }

    // Initialize scalatrix data structures only when module is loaded
    let primeList:PrimeList | null = null;
    let pitchSet: any = null;

    $: if (sx && !primeList) {
        try {
            primeList = new sx.PrimeList();
            if (primeList) {
                primeList.push_back({
                    number: 2,
                    log2fr: Math.log2(2),
                    label: '2',
                });
                primeList.push_back({
                    number: 3,
                    log2fr: Math.log2(3),//-.00162,
                    label: '3',
                });
                primeList.push_back({
                    number: 5,
                    log2fr: Math.log2(5),//+.0114,
                    label: '5',
                });
                primeList.push_back({
                    number: 7,
                    log2fr: Math.log2(7),//-.058,
                    label: '7',
                });

                console.log('primeList', primeList.size());
                pitchSet = sx.generateJIPitchSet(primeList, 50, -1.0, 2.0);
            }
        } catch (err) {
            console.error('Failed to initialize scalatrix data:', err);
            error = 'Failed to initialize scalatrix data';
        }
    }


    type pitchLine = {x:number, y:number, len:number, stroke:string, label:string};
    let pitch_lines:pitchLine[] = [];

    const pitches = [
        {limit:2, pitch:1/2, label:'1:2'},

        {limit:2, pitch:1, label:'1:1'},
        {limit:2, pitch:2, label:'2:1'},
        {limit:2, pitch:4, label:'4:1'},
        {limit:3, pitch:4/3, label:'4:3'},
        {limit:3, pitch:3/2, label:'3:2'},
        //{limit:3, pitch:3, label:'3:1'},
        {limit:5, pitch:5/4, label:'5:4'},
        //{limit:5, pitch:10/4, label:'10:4'},
        {limit:5, pitch:6/5, label:'6:5'},
        {limit:5, pitch:8/5, label:'8:5'},
        {limit:5, pitch:5/3, label:'5:3'},
        {limit:3, pitch:9/8, label:'9:8'},
        {limit:5, pitch:9/5, label:'9:5'},
        {limit:5, pitch:16/15, label:'16:15'},
        {limit:5, pitch:15/8, label:'15:8'},
        //{limit:3, pitch:9/4, label:'9:4'},
        //{limit:5, pitch:16/15, label:'16:15'},
        //{limit:3, pitch:16/9, label:'16:9'},
        //{limit:11, pitch:16/11, label:'16:11'},
        //{limit:13, pitch:16/13, label:'16:13'},
        //{limit:7, pitch:16/7, label:'16:7'},
        //{limit:7, pitch:7/6, label:'7:6'},
        //{limit:7, pitch:9/7, label:'9:7'},
        //{limit:7, pitch:10/7, label:'10:7'},
    ]

    function update(steps:number, affine_t:AffineTransform, octave:number, base_freq:number) {
        console.log('update pitch indicator', steps, affine_t, octave, base_freq);
        pitch_lines = [];

        // Only update if scalatrix is loaded and data is available
        if (!sx || !pitchSet || loading) return;

        try {
            let base_scale_nodes = mos.base_scale.getNodes();
            let octave_node = base_scale_nodes.get(mos.n);
            if (octave_node == undefined) return;
            let octave_freq = base_freq * octave_node.pitch;
            let octave_pos = affine_t.apply(octave_node.natural_coord).x;
            base_scale_nodes.delete();

            let base_pos = affine_t.apply({x:0,y:0}).x;

            for (let i=0; i<pitchSet.size(); i++){
                let p = pitchSet.get(i);

                //console.log('pitch', p.pitch, Math.log(p.pitch)/Math.log(2), octave_freq/base_freq);
                pitch_lines.push({
                    x: p? p.log2fr / Math.log2(octave_freq/base_freq) *(octave_pos-base_pos) + base_pos : 0,
                    y: 75,
                    len: 20 + 15*((i)%2),
                    stroke:'black',
                    label:p?p.label.toString():'',
                });
            }
        } catch (err) {
            console.error('Error updating pitch indicator:', err);
        }
    }
    $: update(steps, affine_t, octave, base_freq);

</script>

{#if loading}
    <text x="50%" y="40" text-anchor="middle" fill="gray" font-size="12">Loading scalatrix...</text>
{:else if error}
    <text x="50%" y="40" text-anchor="middle" fill="red" font-size="12">Error: {error}</text>
{:else if sx && pitchSet}
    {#each pitch_lines as l}
        <line x1={l.x} y1={l.y-l.len} x2={l.x} y2={l.y} stroke={l.stroke} stroke-width={1}/>
        <g transform="rotate(-90)">
            <text x={-l.y+l.len+2} y={l.x} fill={l.stroke} font-size="15" text-anchor="left">{l.label}</text>
        </g>
    {/each}
    {#each nodeinfos as n}
        <line x1={n.n.p.x} y1={75} x2={n.n.p.x} y2={100} stroke="white" stroke-width="1"/>
        <line x1={n.n.p.x} y1={100} x2={n.n.p.x} y2={n.n.p.y} stroke="#FFB319" stroke-width="1"/>
    {/each}
{/if}
