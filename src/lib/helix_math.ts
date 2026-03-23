/**
 * Mathematical functions for the Helix Metronome
 */

export interface TickPosition {
  t: number; // Time position (0 to N_C)
  angle: number; // Angle in radians
  radius: number; // Radius at this position
  segment: number; // Which spiral segment (0 to N_C-1)
  idx: number; // Index of the tick
}

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

/**
 * Calculate tick positions for the metronome
 * @param num Numerator of the ratio
 * @param den Denominator of the ratio
 * @param N_C Number of cycles
 * @param N_B Number of bars (default 1)
 * @returns Array of tick positions
 */
export function calculateTickPositions(num: number, den: number, N_C: number, N_B: number = 1): TickPosition[] {
  const ticks: TickPosition[] = [];
  const isAccelerando = num > den;

  // Reduce the ratio to coprime form
  const g = 1;//gcd(num, den);
  const num_r = num / g;
  const den_r = den / g;

  // Integer range: small^N_C to large^N_C with step thinning.
  // For coprime small/large, N_Bars = large - small is the number of bars
  // in the full range. Thin by keeping every N_Bars-th tick (counting from
  // end_i) to get 1 bar. For N_B bars, multiply the range by N_B.
  const small = Math.min(num_r, den_r);
  const large = Math.max(num_r, den_r);
  const N_Bars = large - small;
  const start_i = N_B * Math.pow(small, N_C);
  const end_i = N_B * Math.pow(large, N_C);

  const log_start = Math.log(start_i);
  const log_end = Math.log(end_i);
  const log_diff = log_end - log_start;

  let tickIdx = 0;
  for (let i = start_i; i <= end_i; i++) {
    // Thin: keep every N_Bars-th integer counting from end_i
    if ((end_i - i) % N_Bars !== 0) continue;

    let t: number;

    if (isAccelerando) {
      t = N_C * (Math.log(i) - log_start) / log_diff;
    } else {
      t = N_C * (log_end - Math.log(i)) / log_diff;
    }

    // Snap near-integer t values to avoid floating-point segment misassignment
    const t_rounded = Math.round(t);
    if (Math.abs(t - t_rounded) < 1e-9) t = t_rounded;

    // Only include ticks within display range (include final tick at t=N_C)
    if (t >= 0 && t <= N_C) {
      const segment = t === N_C ? N_C - 1 : Math.floor(t);
      const angle = t === N_C ? 2 * Math.PI : (t - segment) * 2 * Math.PI;

      ticks.push({
        t,
        angle,
        radius: 0, // Will be calculated later based on spiral
        segment,
        idx: tickIdx
      });
    }
    tickIdx++;
  }

  ticks.sort((a, b) => a.t - b.t);
  return ticks;
}

/**
 * Compute the Δt of the reference beat interval used for BPM.
 * Decelerando: first interval on segment 1
 * Accelerando: last tick on penultimate segment to first tick on ultimate segment
 */
export function referenceIntervalDt(num: number, den: number, N_C: number, N_B: number = 1): number | null {
  const ticks = calculateTickPositions(num, den, N_C, N_B);
  const isAccelerando = num > den;

  if (isAccelerando) {
    const penultTicks = ticks.filter(t => t.segment === N_C - 2).sort((a, b) => a.t - b.t);
    const ultTicks = ticks.filter(t => t.segment === N_C - 1).sort((a, b) => a.t - b.t);
    if (penultTicks.length < 1 || ultTicks.length < 1) return null;
    return ultTicks[0].t - penultTicks[penultTicks.length - 1].t;
  } else {
    const segTicks = ticks.filter(t => t.segment === 1).sort((a, b) => a.t - b.t);
    if (segTicks.length < 2) return null;
    return segTicks[1].t - segTicks[0].t;
  }
}

/**
 * Number of beats on the reference layer.
 * Decelerando: segment 1. Accelerando: penultimate segment (N_C - 2).
 */
export function referenceLayerBeats(num: number, den: number, N_C: number, N_B: number = 1): number {
  const ticks = calculateTickPositions(num, den, N_C, N_B);
  const isAccelerando = num > den;
  const targetSegment = isAccelerando ? N_C - 2 : 1;
  return ticks.filter(t => t.segment === targetSegment).length;
}

/**
 * Index of the reference tick in the sorted ticks array.
 * Accelerando: first tick on the last layer (N_C - 1).
 * Decelerando: first tick on the second layer (segment 1).
 */
export function referenceTickIndex(num: number, den: number, N_C: number, N_B: number = 1): number {
  const ticks = calculateTickPositions(num, den, N_C, N_B);
  const isAccelerando = num > den;
  const targetSegment = isAccelerando ? N_C - 1 : 1;
  const idx = ticks.findIndex(t => t.segment === targetSegment);
  return idx >= 0 ? idx : 0;
}

/**
 * Find the N_B (bars) value whose reference-layer beat count is closest
 * to a desired number of beats.
 */
export function closestNBForBeats(targetBeats: number, num: number, den: number, N_C: number, maxNB: number = 99): number {
  let bestNB = 1;
  let bestDiff = Infinity;
  for (let nb = 1; nb <= maxNB; nb++) {
    const beats = referenceLayerBeats(num, den, N_C, nb);
    const diff = Math.abs(beats - targetBeats);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestNB = nb;
    }
  }
  return bestNB;
}

/**
 * Calculate the radius of the spiral at a given angle and segment
 * @param angle Angle in radians (0 to 2π)
 * @param segment Segment number (0 to N_C-1)
 * @param R Outer radius
 * @param N_C Number of cycles
 * @param isAccelerando Whether it's accelerando or ritardando
 * @returns Radius at the given position
 */
export function spiralRadius(angle: number, segment: number, R: number, N_C: number, isAccelerando: boolean): number {
  const normalized_angle = angle / (2 * Math.PI); // 0 to 1
  const innerR = R / 2;
  const deltaR = R - innerR;

  if (isAccelerando) {
    return innerR + (segment + 0.5 + normalized_angle) * deltaR / (N_C + 1);
  } else {
    return R - (segment + 0.5 + normalized_angle) * deltaR / (N_C + 1);
  }
}

/**
 * Convert polar coordinates to cartesian
 * @param radius Radius
 * @param angle Angle in radians
 * @returns [x, y] coordinates
 */
export function polarToCartesian(radius: number, angle: number): [number, number] {
  // Subtract π/2 so angle 0 points to 12 o'clock instead of 3 o'clock
  const rotated = angle - Math.PI / 2;
  return [
    radius * Math.cos(rotated),
    radius * Math.sin(rotated)
  ];
}

/**
 * Calculate the total angle for a complete cycle
 * @param N_C Number of cycles
 * @returns Total angle in radians
 */
export function totalAngle(N_C: number): number {
  return N_C * 2 * Math.PI;
}

/**
 * Get the start and end radii for a spiral segment
 * @param segment Segment number
 * @param R Outer radius
 * @param N_C Number of cycles
 * @param isAccelerando Whether it's accelerando
 * @returns [startRadius, endRadius]
 */
export function segmentRadii(segment: number, R: number, N_C: number, isAccelerando: boolean): [number, number] {
  const innerR = R / 2;
  const deltaR = R - innerR;
  const segmentHeight = deltaR / (N_C + 1);

  if (isAccelerando) {
    const start = innerR + (segment + 0.5) * segmentHeight;
    const end = innerR + (segment + 1.5) * segmentHeight;
    return [start, end];
  } else {
    const start = R - (segment + 1.5) * segmentHeight;
    const end = R - (segment + 0.5) * segmentHeight;
    return [start, end];
  }
}