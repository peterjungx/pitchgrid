<script lang='ts'>
    import { Grid, Space,  Button } from '@svelteuidev/core';
    import Slider from '$lib/components/Slider.svelte';
    import Knob from '$lib/components/Knob.svelte';

    export let Down:()=>void;
    export let Up:()=>void;
    export let base_tune:number;
    export let octave_exp:number;
    export let G:number;
    export let G_s:number;
    export let window_width:number;
    export let window_offset:number;
    export let x_scale_factor:number;
    export let freeze_mapping:boolean;
    export let cpa_slider_min:number;
    export let cpa_slider_max:number;

</script>

<Grid cols={7}>



    <!--
    
    <Grid.Col span={1}>
        <Space h={5}/>
        level={depth}
        <Space h={5}/>
        a={display_data.s.a} b={display_data.s.b}
        <Space h={5}/>
        mode={mode}
        <Space h={5}/>
        g=({generator_coord.aa}, {generator_coord.bb})
    </Grid.Col>
    
    <Grid.Col span={2}>
        <Space h={5}/>
        base {base_tune.toFixed(3)}
        <Slider bind:value={base_tune} min={-1} max={1} step={0.0001} />
        stretch {octave_exp.toFixed(3)}
        <Slider bind:value={octave_exp} min={0.1} max={2.2} step={0.0001} />
    </Grid.Col>
    <Grid.Col span={2}>
        <Space h={5}/>
        angle coarse {G.toFixed(3)}
        <Slider bind:value={G} min={0.5} max={1} step={0.0001}/>
        angle fine {G_s.toFixed(3)}
        <Slider bind:value={G_s} bind:min={cpa_slider_min} bind:max={cpa_slider_max} step={0.001} />
        <Space h={5}/>
    </Grid.Col>
    <Grid.Col span={2}>
        <Space h={5}/>
        period {window_width}
        <Slider bind:value={window_width} min={2} max={36} step={1} disabled={freeze_mapping}/>
        offset {Math.round(window_offset)}
        <Slider bind:value={window_offset} min={1} bind:max={window_width} step={0.1} disabled={freeze_mapping} />
    </Grid.Col>
    <Grid.Col span={2}>
        zoom {x_scale_factor.toFixed(2)}
        <Slider bind:value={x_scale_factor} min={1} max={20} step={0.0001} />
        y_scale_factor {y_scale_factor.toFixed(2)}
        <Slider bind:value={y_scale_factor} min={2} max={36} step={0.0001} />
        <Space h={5}/>
    </Grid.Col>
    --> 
    <Grid.Col span={1}>
        <Knob
            bind:value={base_tune}
            minValue={-1}
            maxValue={1}
            label="base"
            precision={3}
        />
    </Grid.Col> 
    <Grid.Col span={1}>
        <Knob
            bind:value={octave_exp}
            minValue={0.1}
            maxValue={2.2}
            label="stretch"
            precision={3}
        />
    </Grid.Col>
    <Grid.Col span={1}>
        <Knob
            bind:value={G}
            minValue={0.5}
            maxValue={1}
            label="angle coarse"
            precision={3}
        />
    </Grid.Col>
    <Grid.Col span={1}>
        <Knob
            bind:value={G_s}
            bind:minValue={cpa_slider_min}
            bind:maxValue={cpa_slider_max}
            label="angle fine"
            precision={3}
        />
    </Grid.Col>
    <Grid.Col span={1}>
        <Knob
            bind:value={window_width}
            minValue={2}
            maxValue={36}
            label="period"
            precision={0}
        />
    </Grid.Col>
    <Grid.Col span={1}>
        <Knob
            bind:value={window_offset}
            minValue={1}
            maxValue={window_width}
            label="offset"
            precision={0}
        />


        <!--start midi {start_midi}
        <Slider bind:value={start_midi} min={30} max={90} step={1}/>
        <Space h={15}/>
        <Checkbox bind:checked={freeze_mapping} label="freeze mapping" />-->
    </Grid.Col>

    <Grid.Col span={1} >
        <Space h={10}/>
        <div style="margin:auto;width:50%">
            <Button 
                size="sm" 
                on:click={Down}
                disabled={freeze_mapping}
            >+</Button>
        </div>
        <Space h={5}/>
        <div style="margin:auto;width:50%">
            <Button
                size="sm" 
                on:click={Up}
                disabled={freeze_mapping}
            >-</Button>
        </div>
    </Grid.Col>


    <!--
    <Grid.Col span={2}>
        <Space h={5}/>
        angle coarse {G.toFixed(3)}
        <Slider bind:value={G} min={0.5} max={1} step={0.0001}/>
        angle fine {G_s.toFixed(3)}
        <Slider bind:value={G_s} bind:min={cpa_slider_min} bind:max={cpa_slider_max} step={0.001} />
        <Space h={5}/>
    </Grid.Col>
    -->


    <Grid.Col span={1}></Grid.Col>
</Grid>
<Grid cols={12}>
    <Grid.Col span={12}>
        
    </Grid.Col>
</Grid>
<!--
<Grid cols={12}>
    <Grid.Col span={2}>
        <Slider bind:value={a_dx} min={-500} max={500} step={0.0001} />
    </Grid.Col>
    <Grid.Col span={2}>
        <Slider bind:value={a_dy} min={-500} max={500} step={0.0001} />
    </Grid.Col>
    <Grid.Col span={2}>
        <Slider bind:value={a_angle} min={0} max={2*Math.PI} step={0.0001} />
    </Grid.Col>
    <Grid.Col span={2}>
        
    </Grid.Col>
    <Grid.Col span={2}>
        <Slider bind:value={a_skew_x} min={-3} max={3} step={0.0001} />
    </Grid.Col>
    <Grid.Col span={2}>
        <Slider bind:value={a_scale_y} min={-3} max={3} step={0.0001} />
    </Grid.Col>
</Grid>
-->