<script lang='ts'>
    import {onMount} from 'svelte';
    import type { system, node, edge } from './lattice_math';
    import {prepare_scale, apply_lattice_transform} from './lattice_math';
    import Node from './Node.svelte';
    import {ConsistentTuning} from '$lib/consistent_tuning';
    import {LatticeSynth} from '$lib/lattice_synth';

    export let s:system = {a:1,b:1};
    export let edge_length=50;
    export let path:any[]=[{x:0,y:0,label:'1'}, {x:1,y:1,label:'2'}];
    export let color = 'cyan';
    export let s_target:system|undefined = undefined;
    export let dual:boolean = false;
    export let temperament:ConsistentTuning|undefined = undefined;
    export let play:boolean = false;
    export let tune_target:boolean|undefined = false;


    let synth:LatticeSynth
    onMount(()=>{
        if(temperament){
            synth = new LatticeSynth(temperament);
        }
    })

    // generate lattice nodes, 0 <= x <= a, 0 <= y <= b
    let _nodes:node[] = [];
    let _edges:edge[] = [];

    function update(s:system, edge_length:number, path:any[], s_target:system|undefined, color:string, dual:boolean) {
        let labels = (s.a==2&&s.b==5)?['C','D','E','F','G', 'A','B','C']:undefined;
        let {nodes, edges} = prepare_scale(path, s, edge_length, color, labels);
        if (s_target) {
            apply_lattice_transform(nodes, s, s_target, edge_length, dual);
            apply_lattice_transform(edges, s, s_target, edge_length, dual);
        }
        _nodes = nodes;
        _edges = edges;
    }
    $: update(s, edge_length, path, s_target, color, dual);


    let play_interval:number = 200; // ms
    $: playing_sequence = [...Array(_nodes.length).keys()].concat([...Array(_nodes.length).keys()].slice(1,-1).reverse());
    let playing_idx = 0;

    let timer_interval:any;

    function play_node(n:node){
        if (n){
            n.col = 'green';
            if(synth){
                let coord = tune_target==false?n.c_orig:n.c;
                if (coord){
                    synth.play_note(coord.aa, coord.bb, 100);
                    //console.log('play', n.c.aa, n.c.bb, temperament?.coord_to_freq(n.c.aa, n.c.bb));
                    _nodes = _nodes;
                    setTimeout(()=>{
                        n.col = color;
                        synth.play_note(coord.aa, coord.bb, 0);
                        _nodes = _nodes;
                    }, play_interval-100);       
                }
            }
        }
    }

    function handle_play_state_change(play:boolean){
        if (play){
            play_node(_nodes[playing_sequence[playing_idx%playing_sequence.length]]);
            playing_idx++;
            timer_interval = setInterval(()=>{
                play_node(_nodes[playing_sequence[playing_idx%playing_sequence.length]]);
                playing_idx++;
            }, play_interval);
        }else{
            clearInterval(timer_interval);
        }
    }
    $:handle_play_state_change(play);

    //temperament


</script>


{#each _edges as e}
    <line x1={e.p1.x} y1={e.p1.y} x2={e.p2.x} y2={e.p2.y} stroke="{e.col}" stroke-width="3"/>
{/each}

{#each _nodes as n}
    <Node 
        x={n.p.x} 
        y={n.p.y} 
        bind:color="{n.col}" 
        text="{n.text}"
    />
{/each}