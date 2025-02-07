<script lang="ts">
    export let midi_note_number:number;
    export let scale:number; // should be width of octave in px
    export let color:string;
    export let opacity:number;
    export let margin:number;
    export let height_factor = 1.0;
    export let note_label = 'A';
    export let midi_label = '60';
    export let pitch_label = '';
    export let is_root = false;

    $: key_id = (midi_note_number + 144) % 12;
    $: bh = 42 * height_factor;
    $: wh = 68 * height_factor;
    const br = 3.5;
    const wb = 12;
    let wtr, wmr, wml, wtl, wcx=0;
    let d:string;

    function update(m:number, key_id:number, bh:number, wh:number){
        m = m > 0.75 ? 0.75 : m < 0 ? 0 : m;
        

        switch (key_id){
            case 0: // C
                wtr = 3.5; wmr = 4.5; wtl = 4; wcx = 2;
                d = `M0,0 l${wtr-2*m},0 a${m},${m} 0 0,1 ${m},${m} l0,${bh-m} a${m},${m} 0 0,0 ${m},${m} l${wmr-2*m},0  a${m},${m} 0 0,1 ${m},${m}    l0,${wh-bh-3*m} a${m},${m} 0 0,1 ${-m},${m}  l${-wb+4*m},0 a${m},${m} 0 0,1 ${-m},${-m} l0,${-wh+2*m} a${m},${m} 0 0,1 ${m},${-m} Z`;        
                break;
            case 2: // D
                wtr = 3.5; wmr = 2.5; wml = 2.5; wtl = 3.5; wcx = 0;
                d = `M0,0 l${wtr-2*m},0 a${m},${m} 0 0,1 ${m},${m} l0,${bh-m} a${m},${m} 0 0,0 ${m},${m} l${wmr-2*m},0  a${m},${m} 0 0,1 ${m},${m}    l0,${wh-bh-3*m} a${m},${m} 0 0,1 ${-m},${m}  l${-wb+4*m},0 a${m},${m} 0 0,1 ${-m},${-m}    l0,${-wh+bh+3*m} a${m},${m} 0 0,1 ${m},${-m}  l${wml-2*m},0  a${m},${m} 0 0,0 ${m},${-m}  l0,${-bh+m} a${m},${m} 0 0,1 ${m},${-m} Z`;        
                break;
            case 4: // E
                wtr = 4; wml = 4.5; wtl = 3.5; wcx = -2;
                d = `M0,0 l${wtr-2*m},0 a${m},${m} 0 0,1 ${m},${m} l0,${wh-2*m} a${m},${m} 0 0,1 ${-m},${m}  l${-wb+4*m},0 a${m},${m} 0 0,1 ${-m},${-m}    l0,${-wh+bh+3*m} a${m},${m} 0 0,1 ${m},${-m} l${wml-2*m},0 a${m},${m} 0 0,0 ${m},${-m} l0,${-bh+m} a${m},${m} 0 0,1 ${m},${-m} Z`;        
                break;
            case 5: // F
                wtr = 3.5; wmr = 5.5; wtl = 3; wcx = 3;
                d = `M0,0 l${wtr-2*m},0 a${m},${m} 0 0,1 ${m},${m} l0,${bh-m} a${m},${m} 0 0,0 ${m},${m} l${wmr-2*m},0  a${m},${m} 0 0,1 ${m},${m}    l0,${wh-bh-3*m} a${m},${m} 0 0,1 ${-m},${m}  l${-wb+4*m},0 a${m},${m} 0 0,1 ${-m},${-m} l0,${-wh+2*m} a${m},${m} 0 0,1 ${m},${-m} Z`;        
                break;
            case 7: // G
                wtr = 3.5; wmr = 3.5; wml = 1.5; wtl = 3.5; wcx = 1;
                d = `M0,0 l${wtr-2*m},0 a${m},${m} 0 0,1 ${m},${m} l0,${bh-m} a${m},${m} 0 0,0 ${m},${m} l${wmr-2*m},0  a${m},${m} 0 0,1 ${m},${m}    l0,${wh-bh-3*m} a${m},${m} 0 0,1 ${-m},${m}  l${-wb+4*m},0 a${m},${m} 0 0,1 ${-m},${-m}    l0,${-wh+bh+3*m} a${m},${m} 0 0,1 ${m},${-m}  l${wml-2*m},0  a${m},${m} 0 0,0 ${m},${-m}  l0,${-bh+m} a${m},${m} 0 0,1 ${m},${-m} Z`;        
                break;
            case 9: // A
                wtr = 3.5; wmr = 1.5; wml = 3.5; wtl = 3.5; wcx = -1;
                d = `M0,0 l${wtr-2*m},0 a${m},${m} 0 0,1 ${m},${m} l0,${bh-m} a${m},${m} 0 0,0 ${m},${m} l${wmr-2*m},0  a${m},${m} 0 0,1 ${m},${m}    l0,${wh-bh-3*m} a${m},${m} 0 0,1 ${-m},${m}  l${-wb+4*m},0 a${m},${m} 0 0,1 ${-m},${-m}    l0,${-wh+bh+3*m} a${m},${m} 0 0,1 ${m},${-m}  l${wml-2*m},0  a${m},${m} 0 0,0 ${m},${-m}  l0,${-bh+m} a${m},${m} 0 0,1 ${m},${-m} Z`;        
                break;
            case 11: // B
                wtr = 3; wml = 5.5; wtl = 3.5; wcx = -3;
                d = `M0,0 l${wtr-2*m},0 a${m},${m} 0 0,1 ${m},${m} l0,${wh-2*m} a${m},${m} 0 0,1 ${-m},${m}  l${-wb+4*m},0 a${m},${m} 0 0,1 ${-m},${-m}    l0,${-wh+bh+3*m} a${m},${m} 0 0,1 ${m},${-m} l${wml-2*m},0 a${m},${m} 0 0,0 ${m},${-m} l0,${-bh+m} a${m},${m} 0 0,1 ${m},${-m} Z`;        
                break;
            default: // black keys
                wcx = 0;
                d = `M0,0 l${br-2*m},0 a${m},${m} 0 0,1 ${m},${m} l0,${bh-3*m} a${m},${m} 0 0,1 ${-m},${m} l${-2*br+4*m},0 a${m},${m} 0 0,1 ${-m},${-m} l0,${-bh+3*m} a${m},${m} 0 0,1 ${m},${-m} Z`;        
                
        }
        
    }
    $: update(margin, key_id, bh, wh);

</script>

<g transform="scale({scale})">
    <path d="{d}" fill="{color}" opacity="{opacity}" stroke={is_root?"#FFB319":"none"} stroke-width={2*margin}/>
</g>
<g transform="scale({4.4})">
    <text x="{wcx}" y="{color=='white'?wh-3:bh-3}" fill="{color=="white"?"black":"white"}" font-size="{20/scale}" text-anchor="middle" alignment-baseline="middle" opacity="{opacity}">{note_label}</text>
    <text x="{wcx}" y="{color=='white'?wh-9:bh-9}" fill="{color=="white"?"black":"white"}" font-size="{20/scale}" text-anchor="middle" alignment-baseline="middle" opacity="{opacity}">{midi_label}</text>
    <g transform="rotate(-90)">
        <text x="{color=='white'?24-wh:24-bh}" y="0" fill="{color=="white"?"black":"white"}" font-size="{16/scale}" text-anchor="middle" alignment-baseline="middle" opacity="{opacity}">{pitch_label}</text>
    </g>

</g>
