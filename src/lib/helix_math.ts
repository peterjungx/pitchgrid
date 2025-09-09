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

/**
 * Calculate tick positions for the metronome
 * @param num Numerator of the ratio
 * @param den Denominator of the ratio
 * @param N_C Number of cycles
 * @returns Array of tick positions
 */
export function calculateTickPositions(num: number, den: number, N_C: number): TickPosition[] {
  const ticks: TickPosition[] = [];
  const isAccelerando = num > den;

  let start_i: number, end_i: number;
  if (isAccelerando) {
    start_i = Math.pow(den, N_C);
    end_i = Math.pow(num, N_C);
  } else {
    start_i = Math.pow(num, N_C);
    end_i = Math.pow(den, N_C);
  }

  const log_start = Math.log(start_i);
  const log_end = Math.log(end_i);
  const log_diff = log_end - log_start;

  // Generate ticks at integer intervals
  const num_ticks = Math.floor(end_i - start_i) + 1;
  for (let idx = 0; idx < num_ticks; idx++) {
    const i = start_i + idx;
    let t: number;

    if (isAccelerando) {
      t = N_C * (Math.log(i) - log_start) / log_diff;
    } else {
      t = N_C * (log_end - Math.log(i)) / log_diff;
    }

    // Only include ticks within display range
    if (t >= 0 && t < N_C) {
      const segment = Math.floor(t);
      const angle = (t - segment) * 2 * Math.PI; // Angle within segment

      ticks.push({
        t,
        angle,
        radius: 0, // Will be calculated later based on spiral
        segment,
        idx
      });
    }
  }

  return ticks;
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
  return [
    radius * Math.cos(angle),
    radius * Math.sin(angle)
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