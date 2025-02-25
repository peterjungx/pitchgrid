<script lang='ts'>
    import type { node, system, affine_transform } from './lattice_math';
    import {apply_affine, node_at_coord} from './lattice_math';
    import type { nodeinfo } from './types';
    import type {TuningData} from '$lib/consistent_tuning';
    export let window_width;
    export let affine_t:affine_transform;
    export let tuning_data:TuningData;
    export let s:system;
    export let nodeinfos:nodeinfo[];
    export let octave;



    type pitchLine = {x:number, y:number, len:number, stroke:string, label:string};
    let pitch_lines:pitchLine[] = [];

    const pitches = [
        {limit:2, pitch:1/2, label:'1:2'},

        {limit:1, pitch:1, label:'1:1'},
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

    function update(window_width:number, affine_t:affine_transform, octave:number){
        pitch_lines = [];
        
        let octave_freq = tuning_data.tuning.coord_to_freq(s.a, s.b);
        let octave_pos = node_at_coord({aa:s.a, bb:s.b}, s, 50, 'black', affine_t).p.x;

        let base_freq = tuning_data.tuning.coord_to_freq(0, 0);
        let base_pos = node_at_coord({aa:0, bb:0}, s, 50, 'black', affine_t).p.x;

        let a = (octave_pos-base_pos)/(Math.log(octave_freq/base_freq));


        pitches.forEach(p=>{
            console.log('pitch', p.pitch, Math.log(p.pitch)/Math.log(2), octave_freq/base_freq);
            pitch_lines.push({
                x: Math.log(p.pitch)/Math.log(octave_freq/base_freq) *(octave_pos-base_pos) + base_pos,
                // wrong, should be:

                y: -230,
                len: 10+100/p.limit,
                stroke:'black', 
                label:p.label,
            });
        })

    }
    $: update(window_width, affine_t, octave);

</script>

{#each pitch_lines as l}
    <line x1={l.x} y1={l.y-l.len} x2={l.x} y2={l.y} stroke={l.stroke} stroke-width={1}/>
    <g transform="rotate(-90)">
        <text x={-l.y+l.len+2} y={l.x} fill={l.stroke} font-size="15" text-anchor="left">{l.label}</text>
    </g>
{/each}
{#each nodeinfos as n}
    <line x1={n.n.p.x} y1={-230} x2={n.n.p.x} y2={-190} stroke="white" stroke-width="1"/>
    <line x1={n.n.p.x} y1={-190} x2={n.n.p.x} y2={n.n.p.y} stroke="#FFB319" stroke-width="1"/>
{/each}
