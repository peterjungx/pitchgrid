<script lang='ts'>
    export let x=0;
    export let y=0;
    export let color='gray';
    export let text='';
    let r = 6;
</script>

<circle cx="{x}" cy="{y}" r="{r}" fill="{color}" />
<text 
    x="{x+r}" 
    y="{y-r}" 
    dominant-baseline="left" 
    text-anchor="top" 
    fill="{color}"
>{text}</text> 