<script lang="ts">
    import { multiply, add, matrix } from 'mathjs';

    export let DSXY = matrix([[1,0], [0,1]])
    export let center = matrix([0, 0])
    export let offset = 1

    $: v_oct = multiply(DSXY, matrix([70, 120]))
    $: v_s = multiply(1/12, multiply(DSXY, matrix([1, 0])))

    $: p1_0 = add(add(multiply(-4.5-offset, v_s), multiply(-1, v_oct)), center)
    $: p1_1 = add(add(multiply(-4.5-offset, v_s), multiply(1, v_oct)), center)
    $: p1_2 = add(add(multiply(-800-offset, v_s), multiply(1, v_oct)), center)
    $: p1_3 = add(add(multiply(-800-offset, v_s), multiply(-1, v_oct)), center)

    $: p2_0 = add(add(multiply(300-offset, v_s), multiply(-1, v_oct)), center)
    $: p2_1 = add(add(multiply(300-offset, v_s), multiply(1, v_oct)), center)
    $: p2_2 = add(add(multiply(7.5-offset, v_s), multiply(1, v_oct)), center)
    $: p2_3 = add(add(multiply(7.5-offset, v_s), multiply(-1, v_oct)), center)

</script>

<style>
    svg {
        position: absolute;
        pointer-events: none;
        opacity: 0.5;
    }
</style>

<svg width="100%" height="100%">
    <path d="M {p1_0.get([0])} {p1_0.get([1])} L {p1_1.get([0])} {p1_1.get([1])} L {p1_2.get([0])} {p1_2.get([1])} L {p1_3.get([0])} {p1_3.get([1])} Z" style="fill:grey" />
    <path d="M {p2_0.get([0])} {p2_0.get([1])} L {p2_1.get([0])} {p2_1.get([1])} L {p2_2.get([0])} {p2_2.get([1])} L {p2_3.get([0])} {p2_3.get([1])} Z" style="fill:grey" />
</svg>