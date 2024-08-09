<script lang='ts'>
    import { createEventDispatcher } from 'svelte';

    export let min=1
    export let max=100
    export let value=50
    export let step=1

    let track=false
    let input:any
    let left=0
    let right=0

    let dispatch = createEventDispatcher()
    function change(event:any){
        dispatch('change', event.target.value)
    }

    function mousedown(event:any){
        let rect = input.getBoundingClientRect()
        left = rect.left + 10
        right = rect.right -10
        track=true

    }
    function mouseup(event:any){
        track=false
        dispatch('change', event.target.value)
    }
    function mousemove(event:any){
        if (track){
            console.log(event)
            let x = event.clientX
            value = step*Math.round(Math.max(min, Math.min( (x-left)/(right-left)*(max-min)+min, max))/step)
        }
        
    }
</script>

<style>
    .slidecontainer {
        margin-top:7px;
        width: 100%; /* Width of the outside container */
    }

    .slider {
        -webkit-appearance: none;
        width: 100%;
        height: 10px;
        border-radius: 5px;  
        background: #d3d3d3;
        outline: none;
        opacity: 0.7;
        -webkit-transition: .2s;
        transition: opacity .2s;
    }

    /* Mouse-over effects */
    .slider:hover {
        opacity: 1; /* Fully shown on mouse-over */
    }

    .slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%; 
        background: rgb(97,168,189);
        cursor: pointer;
    }

    .slider::-moz-range-thumb {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: rgb(97,168,189);
        cursor: pointer;
    }
</style>

<div class="slidecontainer">
    <input 
        bind:this={input}
        type="range" 
        min={min}
        max={max}
        step={step}
        bind:value
        class="slider"
        on:change={change}
        on:mousemove={mousemove}
        on:mousedown={mousedown}
        on:mouseup={mouseup}
        on:touchstart={mousedown}
        on:touchend={mouseup}
        on:touchmove={mousemove}
    >
</div>

