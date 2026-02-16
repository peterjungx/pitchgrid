<script lang="ts">
  import { calculateTickPositions, referenceTickIndex, spiralRadius, polarToCartesian, segmentRadii } from '$lib/helix_math';

  export let num: number = 2;
  export let den: number = 1;
  export let N_C: number = 2;
  export let N_B: number = 1;
  export let currentTime: number = 0;
  export let period: number = 10; // seconds
  export let isPlaying: boolean = false;
  export let volumePattern: string = '8252';
  export let activeTickIds: Set<number> = new Set();
  export let width: number = 400;
  export let height: number = 400;

  $: R = Math.min(width, height) * 0.45; // Outer radius
  $: centerX = width / 2;
  $: centerY = height / 2;
  $: isAccelerando = num > den;
  $: refSegment = isAccelerando ? N_C - 2 : 1;

  // Calculate current playhead angle (0 to 2π) and rotation for the spiral
  $: playheadAngle = (currentTime / period) * 2 * Math.PI;
  $: rotationDeg = -playheadAngle * 180 / Math.PI;

  // Calculate tick positions
  $: refIdx = referenceTickIndex(num, den, N_C, N_B);
  $: ticks = calculateTickPositions(num, den, N_C, N_B).map((tick, tickIndex) => {
    // For each tick, calculate its global angle
    const globalAngle = tick.segment * 2 * Math.PI + tick.angle;
    const radius = spiralRadius(tick.angle, tick.segment, R, N_C, isAccelerando);
    const [x, y] = polarToCartesian(radius, globalAngle);
    const envelope = 0.5 + 0.5 * Math.sin(Math.PI * tick.t / N_C);
    const patternPos = ((tickIndex - refIdx) % volumePattern.length + volumePattern.length) % volumePattern.length;
    const patternDigit = parseInt(volumePattern[patternPos]) || 0;
    const volume = envelope * (patternDigit / 9);
    return {
      ...tick,
      globalAngle,
      x: centerX + x,
      y: centerY + y,
      radius,
      volume,
      isReference: tickIndex === refIdx
    };
  });

  // Generate spiral path for each segment
  $: spiralPaths = Array.from({ length: N_C }, (_, segment) => {
    const points: string[] = [];
    const steps = 100; // Number of points per segment

    for (let i = 0; i <= steps; i++) {
      const angle = (i / steps) * 2 * Math.PI;
      const radius = spiralRadius(angle, segment, R, N_C, isAccelerando);
      const [x, y] = polarToCartesian(radius, angle);
      points.push(`${centerX + x},${centerY + y}`);
    }

    return `M ${points.join(' L ')}`;
  });

  // Reference interval arc: the beat whose duration defines BPM.
  // Decelerando: first interval on segment 1
  // Accelerando: last interval on segment N_C - 2 (penultimate)
  $: refArc = (() => {
    const steps = 50;
    const points: string[] = [];

    if (isAccelerando) {
      // Last interval on penultimate layer: crosses boundary into ultimate layer
      const penultSeg = N_C - 2;
      const ultSeg = N_C - 1;

      const penultTicks = ticks.filter(t => t.segment === penultSeg).sort((a, b) => a.t - b.t);
      const ultTicks = ticks.filter(t => t.segment === ultSeg).sort((a, b) => a.t - b.t);

      if (penultTicks.length < 1 || ultTicks.length < 1) return null;

      const lastOnPenult = penultTicks[penultTicks.length - 1];
      const firstOnUlt = ultTicks[0];

      // Part 1: from last tick on penultimate segment to end of segment (2π)
      for (let i = 0; i <= steps; i++) {
        const angle = lastOnPenult.angle + (i / steps) * (2 * Math.PI - lastOnPenult.angle);
        const radius = spiralRadius(angle, penultSeg, R, N_C, isAccelerando);
        const [x, y] = polarToCartesian(radius, angle);
        points.push(`${centerX + x},${centerY + y}`);
      }

      // Part 2: from start of ultimate segment (0) to first tick
      if (firstOnUlt.angle > 0) {
        for (let i = 1; i <= steps; i++) {
          const angle = (i / steps) * firstOnUlt.angle;
          const radius = spiralRadius(angle, ultSeg, R, N_C, isAccelerando);
          const [x, y] = polarToCartesian(radius, angle);
          points.push(`${centerX + x},${centerY + y}`);
        }
      }
    } else {
      // Decelerando: first interval on segment 1
      const segTicks = ticks.filter(t => t.segment === 1).sort((a, b) => a.t - b.t);
      if (segTicks.length < 2) return null;

      const tick1 = segTicks[0];
      const tick2 = segTicks[1];

      for (let i = 0; i <= steps; i++) {
        const angle = tick1.angle + (i / steps) * (tick2.angle - tick1.angle);
        const radius = spiralRadius(angle, 1, R, N_C, isAccelerando);
        const [x, y] = polarToCartesian(radius, angle);
        points.push(`${centerX + x},${centerY + y}`);
      }
    }

    return points.length > 0 ? `M ${points.join(' L ')}` : null;
  })();

</script>

<svg {width} {height} class="spiral-canvas">
  <!-- Spiral area background -->
  <circle
    cx={centerX}
    cy={centerY}
    r={R}
    fill="#CCCCCC"
  />
  <circle
    cx={centerX}
    cy={centerY}
    r={R / 2}
    fill="#F0F0F0"
  />

  <!-- Rotating group: spiral + ticks rotate counter-clockwise -->
  <g transform="rotate({rotationDeg}, {centerX}, {centerY})">
    <!-- Draw spiral segments -->
    {#each spiralPaths as path, i}
      <path d={path} fill="none" stroke="#9C52F2" stroke-width="{i === refSegment ? 6 : 4}" opacity="0.7" />
    {/each}

    <!-- Reference interval arc (BPM beat) -->
    {#if refArc}
      <path d={refArc} fill="none" stroke="#00AA00" stroke-width="6" opacity="0.8" />
    {/if}

    <!-- Draw tick marks -->
    {#each ticks as tick}
      <circle
        cx={tick.x}
        cy={tick.y}
        r="{activeTickIds.has(tick.idx) ? 12 : 12 * tick.volume}"
        fill="#FFAB00"
        stroke="{tick.isReference ? '#00AA00' : '#9C52F2'}"
        stroke-width="{tick.isReference ? 4 : 3}"
        class:active={activeTickIds.has(tick.idx)}
      />
    {/each}
  </g>

  <!-- Playhead fixed at 12 o'clock -->
  <line
    x1={centerX}
    y1={centerY - R / 2}
    x2={centerX}
    y2={centerY - R}
    stroke="#F20000"
    stroke-width="3"
    stroke-linecap="round"
  />


</svg>

<style>

  .active {
    fill: #F20000 !important;
    r: 12 !important;
  }
</style>