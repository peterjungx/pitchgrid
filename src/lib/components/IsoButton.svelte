<script lang="ts">
    import { createEventDispatcher } from 'svelte';
	import { browser } from '$app/environment';
	import {coord_to_interval} from '$lib/consistent_tuning';

	export let left = 100;
	export let top = 100;
    export let d = 0;
    export let s = 0;
	export let colorscheme = 'cleantone';
	export let labeltype = 'notename';
	export let notename = 'A4';
	export let freq = 440.0;
	export let freq_ratio = 1.0;
	//export let bordercolor = 'orange';
	export let display_center_point:boolean = false;
	export let path = 'M 0 0 L 60 30 L 0 60 L -60 30 Z';
	export let pressed = true;
	let displaymode = 'play'

	$: bordercolor = d===0&&s===0?'#808080':'#FFB319'
	let activecolor = '#FFE194';
	//$: console.log('pressed', pressed, d, s);

	
    // Color setup
	let color = '#B8DFD8'
    function setGridColors(col_scheme: string){
		// octave is last character of e.note string, as integer
		if (col_scheme === 'cleantone'){
			let octave = parseInt(notename.slice(-1))
			let note = notename[0]
			let accidental = notename.slice(1,-1)
			if (accidental===''){
				color = (octave + ( (note==='A' || note==='B') ? 1 : 0 )) % 2 === 0 ? 'white' : 'grey'
			}else{
				if (accidental==='#' && (note==='C' || note==='D' || note==='F' || note==='G' || note==='A')){
					color = (octave + ( (note==='A' || note==='G') ? 1 : 0 )) % 2 === 0 ? 'lightgrey' : 'darkgrey'
				}else if(accidental==='b' && (note==='B' || note==='D' || note==='E' || note==='G' || note==='A')){
					color = (octave + ( (note==='B') ? 1 : 0 )) % 2 === 0 ? 'lightgrey' : 'darkgrey'
				}else{
					color = '#B8DFD8'
				}
			}
		} else if (col_scheme === 'piano'){
			let note = notename[0]
			let accidental = notename.slice(1,-1)
			if (accidental===''){
				color = 'white' 
			}else{
				if (accidental==='#' && (note==='C' || note==='D' || note==='F' || note==='G' || note==='A')){
					color = '#303030'
				}else if(accidental==='b' && (note==='B' || note==='D' || note==='E' || note==='G' || note==='A')){
					color = '#303030'
				}else{
					color = "#B8DFD8"
				}
			}
		} else if (col_scheme === 'rainbow'){
			color = `hsl(${(d*7+s*5)%360}, 100%, 50%)`
		}
    }
	$:setGridColors(colorscheme);



	function calclabel(labeltype: string, freq: number, notename: string) {
		if (labeltype === 'freq') {
			return freq.toFixed(2);
		} else if (labeltype === 'notename') {
			return notename;
		} else if (labeltype === 'coordinates') {
			return `(${d}, ${s})`;
		} else if (labeltype === 'interval') {
			return coord_to_interval(d, s);
		} else if (labeltype === 'cents') {
			return (1200 * Math.log2(freq_ratio)).toFixed(2);
		} else if (labeltype === 'et_delta_cents') {
			return (1200 * Math.log2(freq_ratio) - 100 * s).toFixed(2);
		} else {
			return '';
		}
	}

	$:label = calclabel(labeltype, freq, notename);

    const dispatch = createEventDispatcher();

	
	let moving = false;
	let highlighted = false;

	function isDarkColor(col: string) {
		if (!browser) return false;
		let d = document.createElement("div");
		d.style.color = col;
		document.body.appendChild(d)
		//Color in RGB 
		let computedStyle = window.getComputedStyle(d);
		let hex_color = computedStyle.color ? computedStyle.color.match(/\d+/g).map(function(a){ return parseInt(a,10); }) : [0,0,0];
		document.body.removeChild(d)
		return (hex_color[0]*0.299 + hex_color[1]*0.587 + hex_color[2]*0.114) < 186;
	}

	$:fontcolor = isDarkColor(color) ? "white" : "black";
	
	function onMouseDown(e: any) {
		e.preventDefault();
		moving = true;
        dispatch('startmove', {d:d, s:s, left:left, top:top, freq:freq});
	}
	
	function onMouseInside() {
		console.log(d, s);
		highlighted
	}

	/**
     * @param {{ movementX: number; movementY: number; }} e
     */
	function onMouseMove(e: any) {
		e.preventDefault();
		if (moving) {
			left += e.movementX;
			top += e.movementY;
            //dispatch('moving', {d:d, s:s, left:left, top:top});
            dispatch('moving', {d:d, s:s, left:left, top:top});
            //console.log(left, top, d, s);
		}
	}
	
	function onMouseUp(e: any) {
		if (!moving) return;
		moving = false;
        dispatch('endmove', {d:d, s:s, left:left, top:top, freq:freq});
	}

	function handleClick() {
		dispatch('click', {d:d, s:s, left:left, top:top});
	}
    //console.log(left, top);
//d="M 0 -24 L 48 0 L 0 24 L -48 0 Z" 
	
// 	$: console.log(moving);
</script>


<style>
	

	.draggable {
		user-select: none;
		position: absolute;
		pointer-events: none;
	}

    .button {
        background-color: transparent;
        background-repeat: no-repeat;
        color: black;
        padding: 0;
		right:0;
		bottom:0;
        border: none;
		pointer-events: none;
		/* button is 50% translucent */ 
		/*opacity: 0.5;*/
    }

	.button-svg {
		display:inline-block;
		border: none;
		width: 400px;
		height: 400px;
		pointer-events: none; 
	}

	.button-svg-path {
		cursor: pointer;
		outline: none;
		pointer-events:all;
		stroke:var(--color-bordercolor);
		/*opacity: 0.5;*/
	}
	.button-svg-path:hover {
		stroke-width: 3px;
		fill: #eeeeee;
	}
	.button-svg-path:active {
		stroke-width: 5px;
		fill:var(--color-activecolor);
	}
	.button-svg-text {
		pointer-events: none;
		outline: none;
		font-size: 12px;
		font-weight: bold;
		/*opacity: 0.5;*/
	}

</style>

<section style="left: {left-200}px; top: {top-200}px; --color-bordercolor:{bordercolor}; --color-activecolor:{activecolor}" class="draggable">
	<button class="button">
		<svg class="button-svg" viewBox="-200 -200 400 400">
			
			 {#if displaymode=='play'}
			 	<!-- svelte-ignore a11y-click-events-have-key-events -->
				<path on:click={handleClick} on:mousedown={onMouseDown} on:touchstart={onMouseDown} role="button" tabindex="0"
					class="button-svg-path"
					d="{path}" 
					stroke-linejoin="round"
					stroke-linecap="round"
					stroke-width="{pressed?5:3}"
					fill="{pressed?'#FFE194':color}"
				/>
			{/if}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<text 
				on:click={handleClick} on:mousedown={onMouseDown} on:touchstart={onMouseDown} role="button" tabindex="0"
				class="button-svg-text"
				x={displaymode=='play'?"0%" :'1%'}
				y={displaymode=='play'?"0%" :'-1%'}
				dominant-baseline={displaymode=='play'?"middle" :'bottom'}
				text-anchor={displaymode=='play'?"middle" :'left'}
				fill="{fontcolor}"
			>
				{label}
			</text>
			<!-- if display_center_point is set, display a dot in the center -->
			{#if display_center_point||displaymode!='play'}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<circle 
					on:click={handleClick} on:mousedown={onMouseDown} on:touchstart={onMouseDown} role="button" tabindex="0"
					cx="0" 
					cy="0" 
					r="4" 
					fill="#1e777f" 
				/>
			{/if}
		</svg>
	</button>
</section>

<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} on:touchend={onMouseUp} on:touchcancel={onMouseUp}/>