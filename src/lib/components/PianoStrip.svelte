<script lang="ts">
    import { multiply, add, matrix } from 'mathjs';

    export let DSXY = matrix([[1,0], [0,1]])
    export let center = matrix([0, 0])
    export let offset = -2

    $: v_oct = multiply(DSXY, matrix([70, 120]))
    $: v_s = multiply(1/12, multiply(DSXY, matrix([1, 0])))

    $: p0 = add(add(multiply(-8-offset, v_s), multiply(-1, v_oct)), center)
    $: p1 = add(add(multiply(-8-offset, v_s), multiply(1, v_oct)), center)
    $: p2 = add(add(multiply(+3-offset, v_s), multiply(1, v_oct)), center)
    $: p3 = add(add(multiply(+3-offset, v_s), multiply(-1, v_oct)), center)


</script>

<style>
    svg {
        position: absolute;
        pointer-events: none;
        opacity: 0.2;
    }
</style>

<svg width="100%" height="100%">
    <path d="M {p0.get([0])} {p0.get([1])} L {p1.get([0])} {p1.get([1])} L {p2.get([0])} {p2.get([1])} L {p3.get([0])} {p3.get([1])} Z" style="fill:purple" />
</svg>