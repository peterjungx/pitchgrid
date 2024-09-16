<script lang='ts'>
    import {onMount} from 'svelte';
    import type { system, node, edge, MappedScaleDisplayData } from './lattice_math';
    import {prepare_scale, apply_lattice_transform, calc_scale_target_labels} from './lattice_math';
    import LatticePathNode from './LatticePathNode.svelte';
    import {ConsistentTuning} from '$lib/consistent_tuning';
    import {LatticeSynth} from '$lib/lattice_synth';
    import type {TuningData} from '$lib/consistent_tuning';
    import { e } from 'mathjs';

    export let display_data:MappedScaleDisplayData;
    export let tuning_data:TuningData;
    export let path:any[]=[{x:0,y:0,label:'1'}, {x:1,y:1,label:'2'}];
    export let color = 'cyan';
    export let play:boolean = false;
    export let showConstantPitchLines = true;
    export let within_target = false;
    export let variant = 1;
    export let show_alt_text = false;

    let enh_angle = tuning_data.tuning.direction_of_enharmonic_equivalence();

    let synth:LatticeSynth
    onMount(()=>{
        console.log('onMount temperament', tuning_data.tuning);
        if(tuning_data.tuning){
            synth = new LatticeSynth(tuning_data.tuning);
        }
    })

    // generate lattice nodes, 0 <= x <= a, 0 <= y <= b
    let _nodes:node[] = [];
    let _edges:edge[] = [];

    function update(s:system, edge_length:number, path:any[], s_target:system, color:string, dual:boolean) {
        let label_s = within_target ? s_target : s;
        let labels = (label_s.a==2&&label_s.b==5)?['C','D','E','F','G', 'A','B','C']:undefined;
        let sys = within_target ? s_target : s;
        let {nodes, edges} = prepare_scale(path, sys, edge_length, color, labels);
        if (!within_target) {
            apply_lattice_transform(nodes, s, s_target, edge_length, dual);
            calc_scale_target_labels(nodes,s_target);
            apply_lattice_transform(edges, s, s_target, edge_length, dual);
        }
        _nodes = nodes;
        _edges = edges;
        enh_angle = tuning_data.tuning.direction_of_enharmonic_equivalence();

    }
    $: update(display_data.s, display_data.edge_length, path, display_data.s_target, color, display_data.dual);


    let play_interval:number = 300; // ms
    $: playing_sequence = [...Array(_nodes.length).keys()].concat([...Array(_nodes.length).keys()].slice(1,-1).reverse());
    let playing_idx = 0;

    let timer_interval:any;

    function play_node(n:node){
        if (n){
            n.col = 'green';
            if(synth){
                let coord = display_data.tune_target==false?n.c_orig:n.c;
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
    <LatticePathNode 
        bind:node={n}
        bind:tuning_data
        bind:display_data 
        bind:constant_pitch_angle={enh_angle}
        bind:color="{n.col}" 
        variant={variant}
        show_alt_text={show_alt_text}
        text="{n.text}"
        alt_text="{n.alt_text}"
        showConstantPitchLine={showConstantPitchLines}
    />
{/each}