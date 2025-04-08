<script lang='ts'>
    import StandardLattice from './StandardLattice.svelte';
    import LatticePath from './LatticePath.svelte';
    import WindowLattice from './WindowLattice.svelte';
    import FullsizeLattice from './FullsizeLattice.svelte';
    import PianoMapperControls from './PianoMapperControls.svelte';

    import {sx} from 'scalatrix';
    import type {MOS, AffineTransform, Vector2i} from 'scalatrix';

    import {onMount} from 'svelte';

    console.log('scalatrix MOS');

    let w=0, h=0;

    let system:Vector2i = {x:2,y:5};
    let generator = 7/12;
    //let generator = .5849625007; // log2(3/2) = pythagorean tuning
    let depth = 3;

    let steps = 12;
    let window_width_y = 200;
    let key_std_width = 32;
    let offset = 4; 
    let mode = 1;
    let stretch = 1.0;
    let mos:MOS = sx.MOS.fromG(depth, mode, generator, stretch, 1);
    
    onMount(()=>{
        console.log('onMount');
        //window.mos = mos;
        mos = mos;
    });
    let base_freq = 440/2**(9/12);
    let start_midi = 60;
    //let scale = mos.generateScaleFromMOS(base_freq, 128, start_midi);
    let G_s = mos.angle();

    function updateMOS(depth:number, G:number, stretch:number){
        //console.log('updateMOS', system.x, system.y, G, G_s, depth, mode, stretch, mos.v_gen.x, mos.v_gen.y, mos.a, mos.b);
        mos.adjustG(depth, mode, G, stretch, 1);
        G_s = mos.angle();
        system.x = mos.a;
        system.y = mos.b;

        if (mode > system.x + system.y - 1){
            mode = system.x + system.y - 1;
        }

        mos = mos;
        system = system;
    }
    $: updateMOS(depth, generator, stretch);

    //function updateScale(s:Vector2i, base_freq:number, start_midi:number){
    //    scale = mos.generateScaleFromMOS(base_freq, 128, start_midi);
    //}
    //$: updateScale(s, base_freq, start_midi);


    let scale_to_screen_affine_t:AffineTransform;
    function update_affine(strip_width:number, key_std_width:number, offset:number, window_width_y:number, mos:MOS, s:Vector2i){
        if (scale_to_screen_affine_t!==undefined)scale_to_screen_affine_t.delete();
        scale_to_screen_affine_t = sx.affineFromThreeDots(
            {x:0, y:0}, 
            mos.v_gen, 
            s,       
            {x: (w- key_std_width*strip_width)/2, y:100+window_width_y*(1-(offset-.5)/strip_width)}, 
            {x: (w- key_std_width*strip_width)/2 + generator*key_std_width*strip_width, 
                y:100+window_width_y*(1-(offset+.5)/strip_width)},
            {x: (w+ key_std_width*strip_width)/2, y:100+window_width_y*(1-(offset-.5)/strip_width)}  
        );
    }
    update_affine(steps, key_std_width, offset, window_width_y, mos, system);
    $: update_affine(steps, key_std_width, offset, window_width_y, mos, system);

    //let scale_to_screen_affine_t:AffineTransform;
    //function updateAffine(tuning_to_screen_affine_t:any, mos:any){
    //    scale_to_screen_affine_t = tuning_to_screen_affine_t.applyAffine( mos.impliedAffine );
    //    console.log('scale_to_screen_affine_t', scale_to_screen_affine_t);
    //} 
    //$: updateAffine(tuning_to_screen_affine_t, mos);

    function update_mode(_offset:number, _steps:number, _system:Vector2i){
        _offset = Math.round(_offset) - 1;
        _steps = Math.round(_steps);
        if (_offset > _steps){
            offset = _steps;
        }
        let min_node_offset_mode = 1 - mode;
        let max_node_offset_mode = _system.x + _system.y - mode;
        if (min_node_offset_mode <= -_offset){
            mode --;
            updateMOS(depth, generator, stretch);
            //console.log('updated mode', mode+1, '->', mode, min_node_offset_mode, max_node_offset_mode);
        }if (max_node_offset_mode > _steps - _offset){
            mode ++;
            updateMOS(depth, generator, stretch);
            //console.log('updated mode', mode-1, '->', mode, min_node_offset_mode, max_node_offset_mode);
        }
        
    }
    $: update_mode(offset, steps, system);


    let base_tune = 0;
    function update_base_tune(base_tune:number){
        base_freq = 440/2**(9/12+base_tune);
    }
    $: update_base_tune(base_tune);

    //const cmajor_scale = calc_scale({a:2,b:5}, 1);

    function update_angle(G_s:number){
        let newG = mos.gFromAngle(G_s);
        console.log('newG', G_s, generator, newG);
        generator = newG;

        updateMOS(depth, generator, stretch);
        update_affine(steps, key_std_width, offset, window_width_y, mos, system);
    }
    $: update_angle(G_s);


    let Down = ()=>{
        if (depth<9){
            depth ++;
        }
    };
    let Up = ()=>{
        if (depth>0){
            depth --;
        }
    };
    
    let freeze_mapping:boolean = false;

</script>

<style>
    .container {
        position: absolute;
        overflow:hidden;
        left:0px;
        right:0px;
        top:100px;
        bottom:0px;
        
        /*border: 1px solid red;*/
        /*background-color: #FFB319;*/
        background-color: #B8DFD8;
    }
    
</style>

<PianoMapperControls 
    bind:Up 
    bind:Down
    bind:octave_exp={stretch}
    bind:G={generator} 
    bind:G_s 
    bind:steps
    bind:offset
    bind:freeze_mapping 
    bind:base_tune
/>

<div class="container" bind:clientWidth={w} bind:clientHeight={h}>
    <svg width="100%" height="100%" viewBox="{0} {0} {w} {h}" xmlns="http://www.w3.org/2000/svg">
            

            <FullsizeLattice 
                G_s={G_s}
                mos={mos}
                affine_t={scale_to_screen_affine_t}
                display_width={w}
                key_std_width={key_std_width}
                strip_width={steps}
                base_freq={base_freq}
                offset={offset}
            />

            <StandardLattice 
                bind:s={system}
                affine_t = {scale_to_screen_affine_t}
                show_rects={true}
            /> 

            <LatticePath 
                mos={mos}
                color="#404040"
                affine_t = {scale_to_screen_affine_t}
                screen_width={w}
            />

            <rect x={0} y={0} width={w} height={100} fill="black" opacity="0.4"/>
            <rect x={0} y={100+window_width_y} width={w} height={h-(100+window_width_y)} fill="black" opacity="0.4"/>
            
            <WindowLattice 
                mos={mos}
                affine_t={scale_to_screen_affine_t}
                display_width={w}
                key_std_width={key_std_width}
                steps={steps}
                base_freq={base_freq}
                root_midi={start_midi}
                offset={offset}
            />
            

            
    </svg>
</div>
