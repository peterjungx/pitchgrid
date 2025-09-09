<script lang="ts">
  import { calculateTickPositions, spiralRadius, polarToCartesian, segmentRadii } from '$lib/helix_math';

  export let num: number = 2;
  export let den: number = 1;
  export let N_C: number = 2;
  export let currentTime: number = 0;
  export let period: number = 10; // seconds
  export let isPlaying: boolean = false;
  export let width: number = 400;
  export let height: number = 400;

  $: R = Math.min(width, height) * 0.45; // Outer radius
  $: centerX = width / 2;
  $: centerY = height / 2;
  $: isAccelerando = num > den;

  // Calculate current playhead angle (0 to 2π)
  $: playheadAngle = (currentTime / period) * 2 * Math.PI;

  // Calculate tick positions
  $: ticks = calculateTickPositions(num, den, N_C).map(tick => {
    // For each tick, calculate its global angle
    const globalAngle = tick.segment * 2 * Math.PI + tick.angle;
    const radius = spiralRadius(tick.angle, tick.segment, R, N_C, isAccelerando);
    const [x, y] = polarToCartesian(radius, globalAngle);
    return {
      ...tick,
      globalAngle,
      x: centerX + x,
      y: centerY + y,
      radius
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

  // Find active ticks (those near any local playhead)
  $: activeTicks = ticks.filter(tick => {
    const normalizedTime = currentTime / period;

    // Check if tick is near any local playhead
    for (let p = 0; p < N_C; p++) {
      const localPlayheadPosition = p + normalizedTime;
      if (Math.abs(tick.t - localPlayheadPosition+0.003) < 0.003) {
        return true;
      }
    }
    return false;
  });
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

  <!-- Draw spiral segments -->
  {#each spiralPaths as path, i}
    <path d={path} fill="none" stroke="#9C52F2" stroke-width="4" opacity="0.7" />
  {/each}

  <!-- Draw tick marks -->
  {#each ticks as tick}
    <circle
      cx={tick.x}
      cy={tick.y}
      r="{activeTicks.includes(tick) ? 10 : 6}"
      fill="#FFAB00"
      stroke="#9C52F2"
      stroke-width="3"
      opacity="0.8"
      class:active={activeTicks.includes(tick)}
    />
  {/each}

  <!-- Draw playhead -->
  <line
    x1={centerX + (R / 2) * Math.cos(playheadAngle)}
    y1={centerY + (R / 2) * Math.sin(playheadAngle)}
    x2={centerX + R * Math.cos(playheadAngle)}
    y2={centerY + R * Math.sin(playheadAngle)}
    stroke="#0D75FF"
    stroke-width="3"
    stroke-linecap="round"
  />


</svg>

<style>

  .active {
    fill: #F20000 !important;
    r: 10 !important;
  }
</style>