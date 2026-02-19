<svelte:head>
	<title>The PitchGrid Spiky Consonance Measure — PitchGrid Research</title>
	<meta name="description" content="A novel timbre-aware consonance measure based on Plomp-Levelt sensory dissonance curves, validated across multiple tuning systems." />
</svelte:head>

<style>
	.article {
		max-width: 860px;
		margin: 0 auto;
		padding: 3rem 2rem 5rem;
		font-size: 1.05rem;
		line-height: 1.8;
		color: #d4d4d4;
	}

	.article h1 {
		color: #FFAB00;
		font-size: 2.2rem;
		line-height: 1.3;
		margin-bottom: 0.5rem;
	}

	.article-meta {
		color: #888;
		font-size: 0.95rem;
		margin-bottom: 2.5rem;
		padding-bottom: 1.5rem;
		border-bottom: 1px solid rgba(255, 171, 0, 0.2);
	}

	.article h2 {
		color: #FFAB00;
		font-size: 1.5rem;
		margin-top: 3rem;
		margin-bottom: 1rem;
		padding-bottom: 0.3rem;
		border-bottom: 1px solid rgba(255, 171, 0, 0.15);
	}

	.article h3 {
		color: #e0c060;
		font-size: 1.2rem;
		margin-top: 2rem;
		margin-bottom: 0.75rem;
	}

	.abstract {
		background: rgba(255, 171, 0, 0.06);
		border-left: 3px solid #FFAB00;
		padding: 1.25rem 1.5rem;
		margin: 1.5rem 0 2.5rem;
		border-radius: 0 8px 8px 0;
		font-style: italic;
		color: #ccc;
	}

	figure {
		margin: 2rem 0;
		text-align: center;
	}

	figure img {
		max-width: 100%;
		border-radius: 8px;
		border: 1px solid rgba(255, 255, 255, 0.08);
	}

	figcaption {
		color: #999;
		font-size: 0.88rem;
		margin-top: 0.6rem;
		font-style: italic;
	}

	.equation {
		background: rgba(255, 255, 255, 0.04);
		border-radius: 8px;
		padding: 1rem 1.5rem;
		margin: 1.5rem 0;
		text-align: center;
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: 1.1rem;
		color: #e8e8e8;
		overflow-x: auto;
	}

	.equation .label {
		float: right;
		color: #888;
		font-size: 0.9rem;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		margin: 1.5rem 0;
		font-size: 0.95rem;
	}

	thead th {
		background: rgba(255, 171, 0, 0.12);
		color: #FFAB00;
		padding: 0.7rem 1rem;
		text-align: left;
		font-weight: 600;
		border-bottom: 2px solid rgba(255, 171, 0, 0.3);
	}

	tbody td {
		padding: 0.6rem 1rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}

	tbody tr:hover {
		background: rgba(255, 255, 255, 0.03);
	}

	.highlight {
		color: #FFAB00;
		font-weight: 600;
	}

	.references {
		font-size: 0.92rem;
		line-height: 1.7;
	}

	.references li {
		margin-bottom: 0.6rem;
	}

	.back-link {
		display: inline-block;
		margin-bottom: 1.5rem;
		font-size: 0.95rem;
		color: #888;
	}

	.back-link:hover {
		color: #FFAB00;
	}

	var {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-style: italic;
		color: #e8d8a0;
	}

	code {
		background: rgba(255, 255, 255, 0.06);
		padding: 0.15rem 0.4rem;
		border-radius: 4px;
		font-size: 0.92em;
	}
</style>

<div class="article">

<a href="/research" class="back-link">← Back to Research</a>

<h1>The PitchGrid Spiky Consonance Measure</h1>
<p class="article-meta">Peter Jung · February 2026 · PitchGrid</p>

<div class="abstract">
	<strong>Abstract.</strong> We present a novel measure of musical consonance that is both timbre-aware 
	and perceptually grounded. Starting from the Plomp-Levelt sensory dissonance model with Sethares' 
	parametrization, we compute a pairwise dissonance curve for complex tones. We then extract a cubic 
	spline "hull" curve that traces the shoulders of the dissonance function, and define the 
	<em>spiky consonance curve</em> as the residual between hull and dissonance. After normalization 
	and logarithmic scaling, the resulting <em>PitchGrid Consonance Measure</em> maps intervals to a 
	0–1 scale where 1 is unison and 0 is fully dissonant. We validate the measure across 12-tone equal 
	temperament, Pythagorean tuning, quarter-comma meantone, and the Bohlen-Pierce scale, showing that 
	it correctly captures historical preferences for meantone temperament and the fundamental dependence 
	of consonance on both tuning and timbre.
</div>

<h2>1. Introduction</h2>

<p>
	The question of why certain musical intervals sound consonant has occupied theorists for millennia. 
	While classical accounts emphasize small-integer frequency ratios (Pythagoras, Euler, Helmholtz), 
	the landmark work of <strong>Plomp and Levelt (1965)</strong> demonstrated that consonance has a 
	strong <em>sensory</em> component: pairs of pure tones produce roughness (dissonance) when their 
	frequency difference falls within a critical bandwidth of the auditory system.
</p>
<p>
	<strong>Sethares (1993, 2005)</strong> extended this insight to complex tones, showing that the 
	consonance of an interval depends not only on the frequency ratio but also on the <em>timbre</em> — 
	the spectrum of partials — of the tones involved. His parametric model of the Plomp-Levelt curve 
	enabled computation of aggregate dissonance for arbitrary spectra, revealing that the familiar 
	consonances of Western music emerge naturally from harmonic spectra, while inharmonic timbres 
	(bells, metallophones) favor entirely different interval structures.
</p>
<p>
	However, the raw Sethares dissonance curve, while informative, does not directly yield a clean 
	measure of consonance. The dissonance minima that indicate consonant intervals sit in valleys of 
	varying depth and width, making comparison across intervals and tuning systems difficult. In this 
	article, we introduce the <strong>PitchGrid Spiky Consonance Measure</strong>: a post-processing 
	pipeline that extracts consonance peaks from the Plomp-Levelt dissonance curve, normalizes them, 
	and maps them to a perceptually meaningful 0–1 scale.
</p>

<h2>2. Method</h2>

<h3>2.1 Interval Naming Convention</h3>

<p>
	Throughout this article, we use a <strong>zero-based interval naming convention</strong> designed
	to generalize naturally to any MOS (Moment of Symmetry) scale. In this system:
</p>
<ul>
	<li><strong>P0</strong> = unison, <strong>P7</strong> = octave (for 7-note diatonic scales)</li>
	<li>Intervals that come in two sizes across modes are labeled <strong>mX</strong> (minor) and
		<strong>MX</strong> (Major) — e.g., m2 = minor third, M2 = major third in diatonic</li>
	<li>We deliberately avoid the traditional labels "perfect fourth" (P4) and "perfect fifth" (P5).
		In our notation these are <strong>m3</strong> and <strong>M4</strong> respectively, because the
		concept of "perfection" for 4ths and 5ths does not generalize to non-diatonic MOS scales where
		different step counts may be "perfect"</li>
	<li>This notation extends naturally: a Bohlen-Pierce scale uses P0–P9, Porcupine[8] uses P0–P8,
		and Slendric[11] uses P0–P11, each with their own minor/Major interval pairs</li>
</ul>

<p>
	For readability, conventional names are given in parentheses where they first appear.
</p>

<h3>2.2 Plomp-Levelt Dissonance Curve</h3>

<p>
	Given a timbre defined by a set of partials with frequencies 
	<var>f<sub>1</sub>, f<sub>2</sub>, …, f<sub>N</sub></var> and corresponding amplitudes 
	<var>a<sub>1</sub>, a<sub>2</sub>, …, a<sub>N</sub></var>, we compute the sensory dissonance 
	between two complex tones separated by an interval <var>x</var> (in cents). For each pair of 
	partials (<var>i</var> from tone 1, <var>j</var> from tone 2), the pairwise dissonance is given 
	by Sethares' parametrization of the Plomp-Levelt curve:
</p>

<div class="equation">
	<var>d</var>(<var>f<sub>i</sub></var>, <var>f<sub>j</sub></var>) = 
	min(<var>a<sub>i</sub></var>, <var>a<sub>j</sub></var>) · 
	[<var>C</var><sub>1</sub> · <var>e</var><sup><var>A</var><sub>1</sub>·<var>s</var>·|Δ<var>f</var>|</sup> + 
	<var>C</var><sub>2</sub> · <var>e</var><sup><var>A</var><sub>2</sub>·<var>s</var>·|Δ<var>f</var>|</sup>]
	<span class="label">(1)</span>
</div>

<p>where <var>s</var> = <var>d</var>* / (<var>S</var><sub>1</sub> · <var>f</var><sub>min</sub> + <var>S</var><sub>2</sub>), 
	with constants:</p>

<div class="equation">
	<var>d</var>* = 0.24, &ensp;
	<var>S</var><sub>1</sub> = 0.0207, &ensp;
	<var>S</var><sub>2</sub> = 18.96, &ensp;
	<var>C</var><sub>1</sub> = 5, &ensp;
	<var>C</var><sub>2</sub> = −5, &ensp;
	<var>A</var><sub>1</sub> = −3.51, &ensp;
	<var>A</var><sub>2</sub> = −5.75
</div>

<p>
	The total dissonance at interval <var>x</var> is the sum over all inter-tone partial pairs:
</p>

<div class="equation">
	<var>D</var>(<var>x</var>) = Σ<sub><var>i,j</var></sub> 
	<var>d</var>(<var>f<sub>i</sub></var>, <var>f<sub>j</sub></var> · 2<sup><var>x</var>/1200</sup>)
	<span class="label">(2)</span>
</div>

<h3>2.3 The Hull Curve (Hull₃)</h3>

<p>
	The dissonance curve <var>D</var>(<var>x</var>) contains sharp valleys at consonant intervals, 
	but these sit on a varying baseline. To extract the consonance information, we construct a 
	<em>hull curve</em> that traces the "shoulders" of the dissonance function — the smooth upper 
	envelope from which consonance valleys descend.
</p>

<p>The procedure is:</p>
<ol>
	<li>Compute the second derivative <var>D″</var>(<var>x</var>) of the dissonance curve (numerically).</li>
	<li>Identify local maxima of <var>D″</var>(<var>x</var>), excluding singular spikes where 
		<var>D″</var> ≤ 0.005 (these correspond to the sharp tips of dissonance peaks, not the 
		shoulder structure we seek).</li>
	<li>Construct a <strong>cubic spline interpolation</strong> through these shoulder points.</li>
	<li>Clamp: ensure the hull is everywhere ≥ <var>D</var>(<var>x</var>), so it forms a true upper bound.</li>
</ol>

<p>
	We denote this the <strong>Hull₃</strong> curve (cubic spline through second-derivative maxima). 
	The subscript distinguishes it from simpler hull constructions (e.g., linear interpolation or 
	convex hull), which proved less effective at capturing the musically relevant shoulder structure.
</p>

<figure>
	<img src="/research/hull1_vs_hull3.png" alt="Comparison of Hull₁ (linear) vs Hull₃ (cubic spline) curves" />
	<figcaption>Figure 1. Comparison of Hull₁ (linear interpolation) vs Hull₃ (cubic spline) construction methods. 
		Hull₃ provides a smoother, more faithful envelope of the dissonance curve shoulders.</figcaption>
</figure>

<h3>2.4 The Spiky Consonance Curve</h3>

<p>
	The <em>spiky consonance curve</em> is defined as the residual:
</p>

<div class="equation">
	<var>S</var>(<var>x</var>) = Hull₃(<var>x</var>) − <var>D</var>(<var>x</var>)
	<span class="label">(3)</span>
</div>

<p>
	This curve is non-negative by construction (since the hull is clamped to be ≥ <var>D</var>) and 
	exhibits sharp peaks at consonant intervals — where the dissonance curve dips furthest below 
	the shoulder envelope. The name "spiky" reflects the characteristic sharp, narrow peaks at 
	consonant ratios.
</p>

<h3>2.5 Normalization</h3>

<p>
	We normalize the spiky curve by dividing by its value at unison (0 cents):
</p>

<div class="equation">
	<var>S̃</var>(<var>x</var>) = <var>S</var>(<var>x</var>) / <var>S</var>(0)
	<span class="label">(4)</span>
</div>

<p>so that unison always has normalized spiky value 1.</p>

<h3>2.6 The PitchGrid Consonance Measure</h3>

<p>
	Finally, we apply a logarithmic scaling to map the normalized spiky values to a perceptually 
	meaningful range:
</p>

<div class="equation">
	<var>C</var>(<var>x</var>) = max(0, &ensp;1 + ½ · log<sub>10</sub>(<var>S̃</var>(<var>x</var>)))
	<span class="label">(5)</span>
</div>

<p>
	This yields a consonance measure with the following properties:
</p>
<ul>
	<li><strong>Range 0–1</strong>: Unison maps to 1, intervals with normalized spiky values below 0.01 
		map to 0.</li>
	<li><strong>Logarithmic perception</strong>: The log scaling mirrors the approximately logarithmic 
		nature of perceptual judgments (Weber-Fechner law), compressing large differences at the 
		consonant end and expanding small differences at the dissonant end.</li>
	<li><strong>Timbre-dependent</strong>: Because the entire pipeline starts from the spectrum of 
		partials, the consonance measure inherently depends on both the interval and the timbre.</li>
</ul>

<figure>
	<img src="/research/spiky3_log.png" alt="Normalized log-scale spiky consonance curves" />
	<figcaption>Figure 2. The PitchGrid Consonance Measure (log-scaled spiky curve) for a standard 
		harmonic timbre. Peaks correspond to familiar consonant intervals.</figcaption>
</figure>

<h2>3. Results</h2>

<h3>3.1 Tuning System Comparison</h3>

<p>
	We computed the PitchGrid Consonance Measure for several historically important tuning systems, 
	using a standard harmonic timbre (8 partials with 1/<var>n</var> amplitude decay) at 
	<var>f</var><sub>0</sub> = 263 Hz (middle C). The following table summarizes consonance values 
	for the diatonic intervals:
</p>

<table>
	<thead>
		<tr>
			<th>Interval</th>
			<th>12-TET</th>
			<th>Pythagorean</th>
			<th>¼-comma Meantone</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>P0 (unison)</td>
			<td>1.00</td>
			<td>1.00</td>
			<td>1.00</td>
		</tr>
		<tr>
			<td>m1 (minor second)</td>
			<td>0.00</td>
			<td>0.00</td>
			<td>0.00</td>
		</tr>
		<tr>
			<td>M1 (major second)</td>
			<td>0.00</td>
			<td>0.00</td>
			<td>0.00</td>
		</tr>
		<tr>
			<td>m2 (minor third)</td>
			<td>0.16</td>
			<td>0.11</td>
			<td>0.38</td>
		</tr>
		<tr>
			<td>M2 (major third)</td>
			<td class="highlight">0.30</td>
			<td>0.22</td>
			<td class="highlight">0.54</td>
		</tr>
		<tr>
			<td>m3 (perfect fourth)</td>
			<td>0.60</td>
			<td>0.61</td>
			<td>0.58</td>
		</tr>
		<tr>
			<td>M3 (augmented fourth)</td>
			<td>0.00</td>
			<td>0.00</td>
			<td class="highlight">0.25</td>
		</tr>
		<tr>
			<td>m4 (diminished fifth)</td>
			<td>0.00</td>
			<td>0.17</td>
			<td>0.06</td>
		</tr>
		<tr>
			<td>M4 (perfect fifth)</td>
			<td>0.73</td>
			<td class="highlight">0.74</td>
			<td>0.71</td>
		</tr>
		<tr>
			<td>m5 (minor sixth)</td>
			<td>0.22</td>
			<td>0.18</td>
			<td>0.44</td>
		</tr>
		<tr>
			<td>M5 (major sixth)</td>
			<td>0.12</td>
			<td>0.08</td>
			<td>0.31</td>
		</tr>
		<tr>
			<td>m6 (minor seventh)</td>
			<td>0.00</td>
			<td>0.00</td>
			<td>0.00</td>
		</tr>
		<tr>
			<td>M6 (major seventh)</td>
			<td>0.00</td>
			<td>0.00</td>
			<td>0.00</td>
		</tr>
		<tr>
			<td>P7 (octave)</td>
			<td class="highlight">0.83</td>
			<td class="highlight">0.83</td>
			<td class="highlight">0.83</td>
		</tr>
	</tbody>
</table>

<p>Key observations:</p>
<ul>
	<li>The <strong>octave</strong> (P7, 0.83) and <strong>fifth</strong> (M4, 0.73–0.74) are the most consonant 
		intervals across all tuning systems — consistent with universal musical practice.</li>
	<li>The <strong>Pythagorean fifth</strong> (0.74) slightly exceeds the 12-TET fifth (0.73), reflecting 
		the just 3:2 ratio.</li>
	<li><strong>Quarter-comma meantone</strong> dramatically improves thirds: M2 (major third) jumps from 
		0.30 (12-TET) to <span class="highlight">0.54</span>, reflecting the just 5:4 ratio. This comes 
		at a small cost to M4 (fifth): 0.71 vs 0.73.</li>
	<li>Seconds (m1, M1) and sevenths (m6, M6) consistently receive consonance values of 0 — correctly 
		classified as dissonant.</li>
	<li>The <strong>tritone region</strong> (M3/m4) is more nuanced than previously assumed: while both are
		0 in 12-TET, the Pythagorean diminished fifth (m4 = 588.2¢) achieves 0.17, and the meantone
		augmented fourth (M3 = 579.6¢) reaches 0.25. These intervals are <em>not</em> interchangeable —
		they split apart in non-equal tunings and can be mildly consonant.</li>
</ul>

<figure>
	<img src="/research/tuning_comparison.png" alt="Tuning system comparison showing PL curves, hull curves, and spiky consonance" />
	<figcaption>Figure 3. Comparison of dissonance curves, hull curves, and spiky consonance across six 
		tuning systems. Vertical lines indicate scale degrees. The spiky peaks (bottom row) clearly show 
		how consonance varies with tuning.</figcaption>
</figure>

<h3>3.2 Historical Validation: The Case for Meantone</h3>

<p>
	The dramatic improvement of thirds in quarter-comma meantone provides a quantitative explanation 
	for a well-documented historical preference. Renaissance and Baroque musicians (roughly 1450–1700) 
	widely adopted meantone temperament precisely because it produced sweeter thirds — essential for 
	the triadic harmony that emerged in that era. Our consonance measure quantifies this: the major 
	third's consonance nearly doubles from 0.30 to 0.54.
</p>
<p>
	The eventual transition to 12-TET in the 18th–19th centuries reflects a different trade-off: 
	equal temperament sacrifices third quality for unlimited modulation. Our measure captures both 
	sides of this trade-off numerically.
</p>

<h3>3.3 Bohlen-Pierce Scale with Odd Harmonics</h3>

<p>
	The Bohlen-Pierce (BP) scale divides the <em>tritave</em> (3:1 ratio, ~1902 cents) into 13 
	equal steps. It was designed for use with timbres containing only odd harmonics 
	(1, 3, 5, 7, …), which naturally align with the tritave rather than the octave.
</p>

<p>
	We computed the consonance measure for BP intervals using both a standard harmonic spectrum 
	and an odd-harmonics-only spectrum:
</p>

<figure>
	<img src="/research/bp_odd_harmonics.png" alt="Bohlen-Pierce with harmonic vs odd-harmonic spectrum" />
	<figcaption>Figure 4. The Bohlen-Pierce scale with a standard harmonic spectrum (top) vs an 
		odd-harmonics-only spectrum (bottom). With odd harmonics, BP intervals align with consonance 
		peaks, and the tritave achieves a consonance of 0.72.</figcaption>
</figure>

<p>
	With the odd-harmonic timbre, the tritave achieves a consonance of <strong>0.72</strong> — 
	comparable to the fifth in standard tuning. BP scale degrees align with spiky consonance peaks, 
	validating the fundamental insight that <em>consonance is a joint property of tuning and timbre</em>.
</p>

<h3>3.4 Non-Diatonic MOS Scales: Porcupine[8] and Slendric[11]</h3>

<p>
	To demonstrate the generality of the consonance measure beyond diatonic scales, we evaluate two
	non-diatonic MOS scales using a 13-partial harmonic spectrum (decay factor 0.88):
</p>

<p><strong>Porcupine[8]</strong> (1L7s) — an 8-note MOS scale with one large and seven small steps:</p>

<table>
	<thead>
		<tr>
			<th>Interval</th>
			<th>Cents</th>
			<th>Consonance</th>
		</tr>
	</thead>
	<tbody>
		<tr><td>P0</td><td>0.0</td><td class="highlight">1.00</td></tr>
		<tr><td>P8</td><td>1200.0</td><td class="highlight">0.84</td></tr>
		<tr><td>m5</td><td>713.3</td><td class="highlight">0.60</td></tr>
		<tr><td>m3</td><td>388.8</td><td>0.43</td></tr>
		<tr><td>M3</td><td>486.7</td><td>0.41</td></tr>
		<tr><td>m6</td><td>875.5</td><td>0.35</td></tr>
		<tr><td>M2</td><td>324.5</td><td>0.14</td></tr>
		<tr><td>m4</td><td>551.0</td><td>0.06</td></tr>
		<tr><td>m2</td><td>226.5</td><td>0.01</td></tr>
		<tr><td>M1</td><td>162.2</td><td>0.00</td></tr>
		<tr><td>M4</td><td>649.0</td><td>0.00</td></tr>
		<tr><td>m7</td><td>1037.8</td><td>0.00</td></tr>
	</tbody>
</table>

<p><strong>Slendric[11]</strong> (6L5s) — an 11-note MOS scale with six large and five small steps:</p>

<table>
	<thead>
		<tr>
			<th>Interval</th>
			<th>Cents</th>
			<th>Consonance</th>
			<th>Notes</th>
		</tr>
	</thead>
	<tbody>
		<tr><td>P0</td><td>0.0</td><td class="highlight">1.00</td><td></td></tr>
		<tr><td>P11</td><td>1200.3</td><td class="highlight">0.84</td><td></td></tr>
		<tr><td>m1</td><td>31.7</td><td class="highlight">0.72</td><td>Near-unison: high consonance</td></tr>
		<tr><td>M6</td><td>701.2</td><td class="highlight">0.71</td><td>≈ just fifth (702.0¢)</td></tr>
		<tr><td>m5</td><td>499.2</td><td>0.57</td><td></td></tr>
		<tr><td>M10</td><td>1168.6</td><td>0.56</td><td></td></tr>
		<tr><td>m9</td><td>966.6</td><td>0.24</td><td></td></tr>
		<tr><td>m3</td><td>265.4</td><td>0.14</td><td></td></tr>
		<tr><td>M2</td><td>233.7</td><td>0.11</td><td></td></tr>
	</tbody>
</table>

<p>
	Notable features: Slendric's M6 at 701.2¢ lands almost exactly on the just perfect fifth
	(3:2 = 702.0¢) and achieves a consonance of 0.71 — comparable to the diatonic fifth. The tiny
	m1 interval (31.7¢) also scores high (0.72) because it is close enough to unison that partials
	barely beat against each other. These results illustrate how the consonance measure applies
	transparently to any MOS scale, with consonance peaks emerging naturally from the interaction of
	tuning and timbre.
</p>

<h2>4. Parameter Studies</h2>

<p>
	To understand the robustness of the measure, we examined its sensitivity to the three main 
	spectral parameters: fundamental frequency, number of partials, and amplitude decay rate.
</p>

<h3>4.1 Varying Fundamental Frequency</h3>

<figure>
	<img src="/research/varying_f0.png" alt="Consonance curves at different fundamental frequencies" />
	<figcaption>Figure 5. Consonance curves for fundamental frequencies from 100 Hz to 1000 Hz. 
		Consonance peaks are stable in position but vary in height — lower fundamentals produce 
		broader, more prominent consonance peaks due to wider critical bandwidths.</figcaption>
</figure>

<h3>4.2 Varying Number of Partials</h3>

<figure>
	<img src="/research/varying_partials.png" alt="Consonance curves with different numbers of partials" />
	<figcaption>Figure 6. Effect of the number of harmonic partials. More partials produce sharper 
		consonance peaks but also increase overall dissonance between peaks.</figcaption>
</figure>

<h3>4.3 Varying Amplitude Decay</h3>

<figure>
	<img src="/research/varying_decay.png" alt="Consonance curves with different amplitude decay rates" />
	<figcaption>Figure 7. Effect of amplitude decay rate (1/<var>n<sup>α</sup></var>). Steeper decay 
		(fewer significant partials) produces simpler consonance structure; slower decay generates more 
		complex peak patterns.</figcaption>
</figure>

<h2>5. Discussion</h2>

<h3>5.1 Timbre Dependence</h3>

<p>
	The most important property of the PitchGrid Consonance Measure is its explicit dependence on 
	timbre. Consonance is not a property of an interval alone — it is a property of the 
	<em>combination</em> of interval and spectrum. This has profound implications:
</p>
<ul>
	<li><strong>Instrument design</strong>: The optimal tuning for an instrument depends on its spectrum. 
		Metallophones and bells (inharmonic spectra) naturally favor non-standard scales.</li>
	<li><strong>Electronic music</strong>: Synthesized timbres can be designed to make any desired scale 
		consonant — Sethares' key insight, now quantified by our measure.</li>
	<li><strong>Generalized music theory</strong>: Scale theory (e.g., MOS scales, regular temperaments) 
		can be paired with consonance analysis to predict which scales will "work" for a given timbre.</li>
</ul>

<h3>5.2 Relationship to Existing Measures</h3>

<p>
	Several consonance measures exist in the literature: Euler's <em>gradus suavitatis</em>, 
	Tenney height, harmonic entropy (Erlich), and various roughness models. The PitchGrid measure 
	differs in several key ways:
</p>
<ul>
	<li>Unlike ratio-based measures (Euler, Tenney), it applies to <em>any</em> interval, including 
		irrational ones (tempered intervals).</li>
	<li>Unlike harmonic entropy, it is fully timbre-dependent rather than assuming a universal harmonic 
		template.</li>
	<li>Unlike raw roughness models (Sethares, Vassilakis), it provides a normalized 0–1 scale with 
		clear perceptual meaning through the hull-extraction and log-scaling steps.</li>
</ul>

<h3>5.3 Limitations</h3>

<p>
	The current measure is purely based on sensory (roughness) dissonance and does not account for:
</p>
<ul>
	<li><strong>Musical context</strong>: Harmonic function, voice leading, and expectation all influence 
		perceived consonance/dissonance in practice.</li>
	<li><strong>Cultural factors</strong>: Familiarity and training affect consonance judgments.</li>
	<li><strong>Virtual pitch</strong>: The perception of a missing fundamental and pattern-matching to 
		harmonic templates is not modeled.</li>
</ul>
<p>
	Nevertheless, as a <em>sensory</em> consonance measure, it provides a rigorous, computable 
	foundation upon which higher-level musical analysis can build.
</p>

<h2>6. Application to Counterpoint</h2>

<p>
	The consonance measure naturally defines <em>consonance classes</em> that can serve as the basis 
	for generalized counterpoint rules. Using the PitchGrid Consonance Measure, we can classify 
	intervals of any tuning system into categories analogous to the traditional:
</p>
<ul>
	<li><strong>Perfect consonances</strong> (<var>C</var> &gt; 0.6): unison, octave, fifth</li>
	<li><strong>Imperfect consonances</strong> (0.2 &lt; <var>C</var> ≤ 0.6): thirds, sixths (quality 
		depends on tuning)</li>
	<li><strong>Dissonances</strong> (<var>C</var> ≤ 0.2): seconds, sevenths; the tritone region (M3/m4)
		is typically dissonant but can be mildly consonant in certain tunings</li>
</ul>
<p>
	This classification extends naturally to non-standard tuning systems: for the Bohlen-Pierce scale 
	with odd harmonics, the tritave and certain BP intervals become "perfect consonances," enabling 
	counterpoint-like composition in entirely new tonal frameworks.
</p>

<h2>7. References</h2>

<ol class="references">
	<li>Plomp, R. &amp; Levelt, W. J. M. (1965). "Tonal consonance and critical bandwidth." 
		<em>Journal of the Acoustical Society of America</em>, 38(4), 548–560.</li>
	<li>Sethares, W. A. (1993). "Local consonance and the relationship between timbre and scale." 
		<em>Journal of the Acoustical Society of America</em>, 94(3), 1218–1228.</li>
	<li>Sethares, W. A. (2005). <em>Tuning, Timbre, Spectrum, Scale</em> (2nd ed.). Springer.</li>
	<li>Helmholtz, H. von (1877/1954). <em>On the Sensations of Tone</em>. Dover.</li>
	<li>Erlich, P. (1997). "Tuning, tonality, and twenty-two-tone temperament." 
		<em>Xenharmonikôn</em>, 17.</li>
	<li>Bohlen, H. (1978). "13 Tonstufen in der Duodezime." <em>Acustica</em>, 39(2), 76–86.</li>
	<li>Vassilakis, P. N. (2001). <em>Perceptual and Physical Properties of Amplitude Fluctuation 
		and their Musical Significance</em>. PhD thesis, UCLA.</li>
	<li>Milne, A. J., Sethares, W. A. &amp; Plamondon, J. (2007). "Isomorphic controllers and 
		dynamic tuning." <em>Computer Music Journal</em>, 31(4), 15–32.</li>
</ol>

</div>
