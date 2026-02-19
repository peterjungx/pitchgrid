/**
 * Plomp-Levelt sensory dissonance + Hull₃ spiky consonance measure.
 * Lightweight TypeScript implementation for real-time coloring in the Mapper.
 */

// Plomp-Levelt constants
const DSTAR = 0.24;
const S1 = 0.0207;
const S2 = 18.96;
const C1 = 5.0;
const C2 = -5.0;
const A1 = -3.51;
const A2 = -5.75;

export interface Partial {
    ratio: number;
    amplitude: number;
}

export function makeHarmonicSpectrum(nPartials: number = 10, decay: number = 0.88): Partial[] {
    return Array.from({ length: nPartials }, (_, i) => ({
        ratio: i + 1,
        amplitude: decay ** i,
    }));
}

export function makeOddHarmonicSpectrum(nPartials: number = 7, decay: number = 0.88): Partial[] {
    return Array.from({ length: nPartials }, (_, i) => ({
        ratio: 2 * i + 1,
        amplitude: decay ** (2 * i),
    }));
}

/**
 * Compute PL dissonance curve at given cent positions.
 */
export function computePLCurve(
    centsArr: number[],
    spectrum: Partial[],
    f0: number = 261.63
): number[] {
    const partials = spectrum.map(p => p.ratio);
    const amps = spectrum.map(p => p.amplitude);
    const baseFreqs = partials.map(p => f0 * p);
    const K = partials.length;

    return centsArr.map(c => {
        const ratio = 2 ** (c / 1200);
        const shiftedFreqs = partials.map(p => f0 * ratio * p);
        
        // Combine and sort all frequencies
        const allF: number[] = [...baseFreqs, ...shiftedFreqs];
        const allA: number[] = [...amps, ...amps];
        const indices = allF.map((_, i) => i).sort((a, b) => allF[a] - allF[b]);
        const sortedF = indices.map(i => allF[i]);
        const sortedA = indices.map(i => allA[i]);

        let diss = 0;
        const n = sortedF.length;
        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                const fdif = sortedF[j] - sortedF[i];
                const s = DSTAR / (S1 * sortedF[i] + S2);
                const sf = s * fdif;
                const a = Math.min(sortedA[i], sortedA[j]);
                diss += a * (C1 * Math.exp(A1 * sf) + C2 * Math.exp(A2 * sf));
            }
        }
        return diss;
    });
}

/**
 * Find local maxima indices with given order (comparison window).
 */
function argrelmax(arr: number[], order: number): number[] {
    const result: number[] = [];
    for (let i = order; i < arr.length - order; i++) {
        let isMax = true;
        for (let j = 1; j <= order; j++) {
            if (arr[i] <= arr[i - j] || arr[i] <= arr[i + j]) {
                isMax = false;
                break;
            }
        }
        if (isMax) result.push(i);
    }
    return result;
}

/**
 * Simple not-a-knot cubic spline interpolation.
 * Returns a function that evaluates the spline at any x.
 */
function cubicSpline(xs: number[], ys: number[]): (x: number) => number {
    const n = xs.length - 1;
    if (n < 2) {
        // Linear fallback
        return (x: number) => {
            if (n === 0) return ys[0];
            const t = (x - xs[0]) / (xs[1] - xs[0]);
            return ys[0] + t * (ys[1] - ys[0]);
        };
    }

    const h: number[] = [];
    for (let i = 0; i < n; i++) h.push(xs[i + 1] - xs[i]);

    // Build tridiagonal system for not-a-knot conditions
    const size = n + 1;
    const A: number[][] = Array.from({ length: size }, () => new Array(size).fill(0));
    const rhs: number[] = new Array(size).fill(0);

    // Interior equations
    for (let i = 1; i < n; i++) {
        A[i][i - 1] = h[i - 1];
        A[i][i] = 2 * (h[i - 1] + h[i]);
        A[i][i + 1] = h[i];
        rhs[i] = 3 * ((ys[i + 1] - ys[i]) / h[i] - (ys[i] - ys[i - 1]) / h[i - 1]);
    }

    // Not-a-knot boundary conditions
    A[0][0] = h[1];
    A[0][1] = -(h[0] + h[1]);
    A[0][2] = h[0];
    rhs[0] = 0;

    A[n][n - 2] = h[n - 1];
    A[n][n - 1] = -(h[n - 2] + h[n - 1]);
    A[n][n] = h[n - 2];
    rhs[n] = 0;

    // Gaussian elimination
    for (let i = 0; i < size; i++) {
        let maxRow = i;
        for (let k = i + 1; k < size; k++) {
            if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) maxRow = k;
        }
        [A[i], A[maxRow]] = [A[maxRow], A[i]];
        [rhs[i], rhs[maxRow]] = [rhs[maxRow], rhs[i]];

        for (let k = i + 1; k < size; k++) {
            const factor = A[k][i] / A[i][i];
            for (let j = i; j < size; j++) {
                A[k][j] -= factor * A[i][j];
            }
            rhs[k] -= factor * rhs[i];
        }
    }

    const c: number[] = new Array(size).fill(0);
    for (let i = size - 1; i >= 0; i--) {
        c[i] = rhs[i];
        for (let j = i + 1; j < size; j++) {
            c[i] -= A[i][j] * c[j];
        }
        c[i] /= A[i][i];
    }

    // Compute spline coefficients
    const a = ys.slice();
    const b: number[] = new Array(n).fill(0);
    const d: number[] = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
        b[i] = (a[i + 1] - a[i]) / h[i] - h[i] * (2 * c[i] + c[i + 1]) / 3;
        d[i] = (c[i + 1] - c[i]) / (3 * h[i]);
    }

    return (x: number) => {
        // Find interval
        let i = 0;
        if (x <= xs[0]) i = 0;
        else if (x >= xs[n]) i = n - 1;
        else {
            for (i = 0; i < n; i++) {
                if (x < xs[i + 1]) break;
            }
        }
        const dx = x - xs[i];
        return a[i] + b[i] * dx + c[i] * dx * dx + d[i] * dx * dx * dx;
    };
}

/**
 * Numerical gradient matching numpy's np.gradient behavior.
 */
function gradient(arr: number[], dx: number): number[] {
    const n = arr.length;
    const g: number[] = new Array(n);
    if (n < 2) return [0];
    g[0] = (arr[1] - arr[0]) / dx;
    g[n - 1] = (arr[n - 1] - arr[n - 2]) / dx;
    for (let i = 1; i < n - 1; i++) {
        g[i] = (arr[i + 1] - arr[i - 1]) / (2 * dx);
    }
    return g;
}

export interface ConsonanceCurve {
    cents: number[];
    pl: number[];
    hull: number[];
    spiky: number[];
}

/**
 * Compute the full spiky₃ consonance curve.
 */
export function computeSpikyCurve(
    centsRange: [number, number],
    spectrum: Partial[],
    f0: number = 261.63,
    margin: number = 300,
    resolution: number = 0.5,
    order: number = 3,
    spikeThreshold: number = 0.005
): ConsonanceCurve {
    const [cMin, cMax] = centsRange;
    const extMin = cMin - margin;
    const extMax = cMax + margin;
    const nPoints = Math.floor((extMax - extMin) / resolution) + 1;
    
    const centsExt: number[] = [];
    for (let i = 0; i < nPoints; i++) {
        centsExt.push(extMin + i * resolution);
    }
    
    const plExt = computePLCurve(centsExt, spectrum, f0);
    const dx = resolution;

    // Compute second derivative
    const d1 = gradient(plExt, dx);
    const d2 = gradient(d1, dx);

    // Find local maxima of d2 with given order
    let maxIdx = argrelmax(d2, order);

    if (maxIdx.length < 2) {
        // Fallback: return flat
        const mask = centsExt.map(c => c >= cMin && c <= cMax);
        return {
            cents: centsExt.filter((_, i) => mask[i]),
            pl: plExt.filter((_, i) => mask[i]),
            hull: plExt.filter((_, i) => mask[i]),
            spiky: plExt.filter((_, i) => mask[i]).map(() => 0),
        };
    }

    // Exclude singularities
    const cleanIdx = maxIdx.filter(i => d2[i] <= spikeThreshold);
    let anchorIdx = cleanIdx.length >= 2 ? cleanIdx : maxIdx.slice(0, Math.max(2, maxIdx.length >> 1));
    anchorIdx.sort((a, b) => a - b);

    // Add endpoints if needed
    const endpointThreshold = Math.floor(50 / resolution);
    if (anchorIdx[0] > endpointThreshold) {
        anchorIdx = [0, ...anchorIdx];
    }
    if (anchorIdx[anchorIdx.length - 1] < nPoints - endpointThreshold) {
        anchorIdx = [...anchorIdx, nPoints - 1];
    }

    const anchorCents = anchorIdx.map(i => centsExt[i]);
    const anchorVals = anchorIdx.map(i => plExt[i]);

    // Fit spline through anchors
    const spline = cubicSpline(anchorCents, anchorVals);

    // Compute hull (clamped above PL)
    const hullExt = centsExt.map((c, i) => Math.max(spline(c), plExt[i]));
    const spikyExt = hullExt.map((h, i) => h - plExt[i]);

    // Crop to display range
    const mask = centsExt.map(c => c >= cMin && c <= cMax);
    return {
        cents: centsExt.filter((_, i) => mask[i]),
        pl: plExt.filter((_, i) => mask[i]),
        hull: hullExt.filter((_, i) => mask[i]),
        spiky: spikyExt.filter((_, i) => mask[i]),
    };
}

/**
 * Compute consonance value C(x) at a specific cent position.
 */
export function consonanceAt(curve: ConsonanceCurve, cents: number): number {
    // Linear interpolation
    const arr = curve.cents;
    const spiky = curve.spiky;
    
    if (cents <= arr[0]) return spiky[0];
    if (cents >= arr[arr.length - 1]) return spiky[spiky.length - 1];
    
    let i = 0;
    while (i < arr.length - 1 && arr[i + 1] < cents) i++;
    const t = (cents - arr[i]) / (arr[i + 1] - arr[i]);
    const spikyVal = spiky[i] + t * (spiky[i + 1] - spiky[i]);
    
    // Normalize: peak at 0 cents
    const peak = Math.max(...spiky);
    if (peak <= 0) return 0;
    
    const normalized = spikyVal / peak;
    return Math.max(0, 1 + 0.5 * Math.log10(Math.max(normalized, 1e-10)));
}

/**
 * Compute consonance for an array of cent values (efficient: normalizes once).
 */
export function consonanceValues(curve: ConsonanceCurve, centsList: number[]): number[] {
    const peak = Math.max(...curve.spiky);
    if (peak <= 0) return centsList.map(() => 0);
    
    return centsList.map(cents => {
        const arr = curve.cents;
        const spiky = curve.spiky;
        
        if (cents <= arr[0]) return 0;
        if (cents >= arr[arr.length - 1]) return 0;
        
        let i = 0;
        while (i < arr.length - 1 && arr[i + 1] < cents) i++;
        const t = (cents - arr[i]) / (arr[i + 1] - arr[i]);
        const spikyVal = spiky[i] + t * (spiky[i + 1] - spiky[i]);
        
        const normalized = spikyVal / peak;
        return Math.max(0, 1 + 0.5 * Math.log10(Math.max(normalized, 1e-10)));
    });
}

/**
 * Map consonance value (0-1) to an HSL color.
 * Uses hue based on the interval's position in the consonance curve
 * and brightness based on the C(x) value.
 */
export function consonanceToColor(consonance: number, cents: number, equaveCents: number = 1200): string {
    if (consonance <= 0) return 'hsl(0, 0%, 25%)';  // gray for dissonant
    
    // Hue: based on position in the equave (0-360°)
    const hue = (cents / equaveCents * 360 + 360) % 360;
    
    // Saturation: high for consonant, low for dissonant
    const saturation = 40 + consonance * 50; // 40-90%
    
    // Lightness: brighter for more consonant
    const lightness = 25 + consonance * 45; // 25-70%
    
    return `hsl(${hue.toFixed(0)}, ${saturation.toFixed(0)}%, ${lightness.toFixed(0)}%)`;
}

/**
 * Alternative: map consonance peaks to distinct colors.
 * Each "consonance family" (unison, fifth, third, etc.) gets its own hue.
 */
export function consonancePeakColor(consonance: number, peakIndex: number, totalPeaks: number): string {
    if (consonance <= 0) return 'hsl(0, 0%, 25%)';
    
    const hue = (peakIndex / totalPeaks) * 330; // Spread across color wheel (avoid wrapping)
    const saturation = 50 + consonance * 40;
    const lightness = 30 + consonance * 40;
    
    return `hsl(${hue.toFixed(0)}, ${saturation.toFixed(0)}%, ${lightness.toFixed(0)}%)`;
}
