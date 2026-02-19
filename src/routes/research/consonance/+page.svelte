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

	.highlight-row {
		background: rgba(255, 171, 0, 0.08);
	}

	.formula {
		background: rgba(255, 255, 255, 0.04);
		border-left: 3px solid rgba(255, 171, 0, 0.4);
		padding: 0.8rem 1.2rem;
		margin: 1rem 0;
		font-family: 'Georgia', serif;
		font-size: 1.1rem;
		letter-spacing: 0.02em;
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
	<strong>Abstract.</strong> For centuries, music theory has treated consonance as a fixed property 
	of intervals — determined by the simplicity of frequency ratios and inherited from the harmonic 
	series. We show that consonance is better understood as an emergent property of the interaction 
	between <em>tuning</em> and <em>timbre</em>, and we provide a computable measure that captures 
	this interaction. Our key innovation is a signal-processing technique we call <em>hull extraction</em>: 
	fitting a smooth envelope to the Plomp-Levelt dissonance curve and defining consonance as the 
	residual — the "spiky" peaks where dissonance drops below its local baseline. This reframes 
	consonance not as the absence of roughness in absolute terms, but as <em>how much better an 
	interval sounds compared to its spectral neighborhood</em>. The resulting PitchGrid Consonance 
	Measure assigns each interval a score from 0 (maximally dissonant) to 1 (unison), enabling 
	systematic comparison across tuning systems, timbres, and scale structures — including 
	non-Western and microtonal scales that traditional theory cannot address. We validate the 
	measure across six tuning systems, from 12-TET to exotic MOS scales like Porcupine and 
	Slendric, and demonstrate a striking result: by constructing a <em>pseudoharmonic</em> timbre 
	matched to 12-TET ("reverse tuning"), one can achieve higher consonance than quarter-comma 
	meantone with natural harmonic timbre — suggesting that the path to consonance may lie not 
	in perfecting the tuning, but in adapting the sound itself.
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
	(bells, metallophones) favor entirely different interval structures. Sethares also demonstrated 
	the converse: given any scale, one can construct a timbre whose partials align with the scale's 
	intervals, making that scale sound consonant.
</p>
<p>
	However, Sethares' dissonance curve — while foundational — has an inherent limitation: 
	it measures <em>absolute</em> roughness, not <em>relative</em> consonance. The dissonance 
	minima that indicate consonant intervals sit in valleys of varying depth and width, on a 
	baseline that shifts with register and timbre. Comparing the "consonance" of a fifth against 
	a major third, or across different tuning systems, requires visual inspection rather than 
	quantitative comparison. No prior work has extracted a clean, normalized consonance measure 
	from the Sethares dissonance curve.
</p>
<p>
	In this article, we introduce the <strong>PitchGrid Spiky Consonance Measure</strong> — a 
	novel post-processing pipeline built on a technique we call <em>hull extraction</em>. We fit 
	a smooth envelope (hull) to the dissonance curve and define consonance as the <em>residual</em> 
	between the hull and the curve itself. This transforms consonance from "how low is the 
	dissonance?" to "how far does the dissonance drop below its local spectral baseline?" — a 
	relative measure that naturally adapts to different timbres and registers. After normalization 
	and logarithmic scaling, the measure maps any interval to a 0–1 scale, enabling quantitative 
	comparison across tuning systems, timbres, and scale structures.
</p>
<p>
	We validate the measure across six tuning systems — including non-diatonic MOS (Moments of 
	Symmetry) scales such as Porcupine[8] and Slendric[11] — bridging Erv Wilson's structural 
	scale theory with Sethares' psychoacoustic framework. We further introduce <em>reverse tuning</em>: 
	the systematic construction of pseudoharmonic timbres matched to a given scale, and demonstrate 
	that reverse-tuned 12-TET achieves higher mean consonance than quarter-comma meantone with 
	harmonic timbre — a result with implications for electronic music production and instrument design.
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
	<img src="/research/param_varying_f0.png" alt="Normalized spiky consonance at different fundamental frequencies" />
	<figcaption>Figure 5. Normalized spiky₃ consonance for fundamental frequencies from 100 Hz to 
		1000 Hz (10 harmonic partials, decay = 0.88). Peak <em>positions</em> are invariant — they 
		are determined by the frequency ratios between partials, not by absolute frequency. However, 
		peak <em>heights</em> differ: lower fundamentals produce stronger consonance peaks because 
		the critical bandwidth (Plomp-Levelt parameter) is relatively wider at low frequencies, 
		making the dissonance dips deeper and the spiky peaks more prominent. At 1000 Hz, the 
		critical bandwidth is narrower relative to the partial spacing, producing shallower peaks.</figcaption>
</figure>

<p>
	The key observation is that the consonance patterns are <strong>remarkably stable across 
	fundamental frequencies</strong>. Consonance values calculated at one frequency are comparable 
	to those calculated at another, with the notable exception of intervals close to unison and 
	the octave — where deeper frequencies visibly broaden the consonance peak. It is expected 
	that lower fundamentals widen the unison peak (critical bandwidth grows relative to the small 
	frequency differences near unison), but it is surprising that this broadening effect does 
	<em>not</em> carry over to most other just frequency ratios. The peaks at the fifth, thirds, 
	and sixths remain largely consistent in height across the tested range.
</p>
<p>
	This stability means that our consonance measure, evaluated at any reasonable fundamental 
	frequency, will produce comparable results for the vast majority of intervals. Unless otherwise 
	specified, all evaluations in this study use <var>f</var><sub>0</sub> = 261.6 Hz (middle C).
</p>

<h3>4.2 Varying Number of Partials</h3>

<figure>
	<img src="/research/param_varying_partials.png" alt="Normalized spiky consonance with different numbers of partials" />
	<figcaption>Figure 6. Effect of the number of harmonic partials on normalized spiky₃ consonance 
		(f₀ = 261.6 Hz, decay = 0.88). With only 4 partials, only the octave and fifth produce 
		clear peaks. As more partials are added, additional consonance peaks emerge at thirds, 
		sixths, and higher-order intervals. Beyond ~10 partials, the peak structure stabilizes — 
		additional partials refine rather than fundamentally alter the consonance landscape.</figcaption>
</figure>

<h3>4.3 Varying Amplitude Decay</h3>

<figure>
	<img src="/research/param_varying_decay.png" alt="Normalized spiky consonance with different amplitude decay rates" />
	<figcaption>Figure 7. Effect of amplitude decay rate on normalized spiky₃ consonance 
		(f₀ = 261.6 Hz, 10 partials). With steep decay (0.70), only the lowest partials contribute 
		significantly, producing a smooth curve dominated by the octave. As decay approaches 1.0 
		(equal-amplitude partials), higher partials become equally important, creating a richer, 
		more complex consonance pattern with sharper peaks. The decay rate = 0.88 used throughout 
		this study represents a typical acoustic instrument timbre.</figcaption>
</figure>

<h2>5. Discussion</h2>

<h3>5.1 The Hull Extraction: Why It Matters</h3>

<p>
	The central novelty of this work is the <em>hull extraction</em> technique. Prior approaches to 
	consonance based on the Plomp-Levelt model (Sethares 1993, 2005; Vassilakis 2001) work with 
	the raw dissonance curve — identifying consonant intervals as dissonance minima. But minima of 
	varying depth on a shifting baseline resist quantitative comparison. A shallow minimum at 400¢ 
	might represent a "better" consonance than a deep minimum at 700¢ if the local dissonance 
	baseline is different.
</p>
<p>
	Hull extraction solves this by fitting a smooth envelope to the dissonance curve and measuring 
	consonance as the <em>residual</em> — how far each interval drops below its spectral neighborhood. 
	This is conceptually analogous to how the auditory system likely processes consonance: not as 
	absolute roughness, but as roughness <em>relative to expectation</em>. The result is a measure 
	that automatically adapts to different timbres, registers, and spectral densities without manual 
	calibration.
</p>
<p>
	To our knowledge, no prior work in the consonance/dissonance literature has applied envelope 
	extraction to the Plomp-Levelt dissonance curve or defined consonance as a hull residual. 
	The closest analogues exist in other fields — spectral baseline correction in analytical 
	chemistry, trend extraction in signal processing — but the application to musical consonance 
	appears to be new.
</p>

<h3>5.2 Timbre Dependence</h3>

<p>
	The PitchGrid Consonance Measure inherits from Sethares the crucial insight that consonance 
	is not a property of an interval alone — it is a property of the <em>combination</em> of 
	interval and spectrum. What our measure adds is a way to <em>quantify</em> this relationship:
</p>
<ul>
	<li><strong>Instrument design</strong>: The optimal tuning for an instrument depends on its spectrum. 
		Metallophones and bells (inharmonic spectra) naturally favor non-standard scales — and the 
		mean consonance score can now tell us <em>by how much</em>.</li>
	<li><strong>Electronic music</strong>: Synthesized timbres can be designed to make any desired scale 
		consonant. Our reverse tuning results demonstrate this quantitatively for the first time.</li>
	<li><strong>Generalized music theory</strong>: Scale theory (MOS scales, regular temperaments) 
		can be paired with consonance analysis to predict which scales will "work" for a given timbre 
		— enabling systematic exploration of the vast space of non-diatonic tonal structures.</li>
</ul>

<h3>5.3 Relationship to Existing Measures</h3>

<p>
	Several consonance measures exist in the literature: Euler's <em>gradus suavitatis</em>, 
	Tenney height, harmonic entropy (Erlich), and various roughness models (Vassilakis, 
	Harrison &amp; Pearce). The PitchGrid measure occupies a distinct niche:
</p>
<ul>
	<li>Unlike ratio-based measures (Euler, Tenney), it applies to <em>any</em> interval, including 
		irrational ones (tempered intervals), without requiring approximation by simple ratios.</li>
	<li>Unlike harmonic entropy (Erlich), which is a top-down information-theoretic measure of 
		ratio ambiguity, our approach is bottom-up: derived from the physics of beating partials. 
		The two approaches measure different aspects of consonance and are complementary.</li>
	<li>Unlike raw roughness models (Sethares, Vassilakis), it provides a normalized 0–1 scale 
		through the novel hull-extraction and log-scaling steps — enabling the quantitative 
		comparisons demonstrated in this article.</li>
	<li>Unlike composite models (Harrison &amp; Pearce 2020), which combine roughness, harmonicity, 
		and familiarity to predict chord ratings, our measure is intentionally pure — isolating 
		the sensory component to serve as a foundation for higher-level analysis.</li>
</ul>

<h3>5.4 Limitations</h3>

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
	These are deliberate omissions, not oversights. The measure is designed to capture the 
	<em>sensory floor</em> of consonance — the psychoacoustic foundation upon which musical 
	context, cultural learning, and cognitive processing operate. A complete consonance model 
	would integrate our measure with harmonic entropy and contextual factors, but the sensory 
	component must be isolated and correct before it can be combined.
</p>

<h2>6. Reverse Tuning: Constructing Timbres for Scales</h2>

<p>
	Traditional tuning theory asks: <em>given the harmonic series, which scales sound most consonant?</em>
	Reverse tuning inverts this question: <em>given a scale, which timbre maximizes its consonance?</em>
</p>
<p>
	The Plomp-Levelt model depends on two inputs: the intervals of the scale and the partial frequencies 
	of the timbre. While centuries of music theory have focused on adjusting scales to fit the harmonic 
	series, reverse tuning adjusts the partials to fit the scale. For any tuning system, we construct a 
	<strong>pseudoharmonic spectrum</strong> — a set of partials whose frequency ratios are derived from 
	the scale's own intervals rather than from integer multiples of a fundamental.
</p>
<p>
	For 12-TET, this means tuning the 3rd partial from its just value of 1902.0¢ to exactly 1900.0¢ 
	(a tempered perfect twelfth), the 5th partial from 2786.3¢ to 2800.0¢ (a tempered major 
	seventeenth), and deriving all composite partials from these adjusted primes. The result is a timbre 
	that is acoustically <em>native</em> to equal temperament.
</p>

<h3>6.1 Mean Consonance Score</h3>

<p>
	To compare tuning/timbre configurations with different numbers of intervals fairly, we define the 
	<strong>mean consonance score</strong> as the average <var>C</var>(<var>x</var>) over all scale 
	intervals from unison (0¢) up to 1950¢:
</p>
<div class="formula">
	C̄ = (1/<var>N</var>) · Σ <var>C</var>(<var>x<sub>i</sub></var>), &nbsp;&nbsp; 
	<var>x<sub>i</sub></var> ∈ [0, 1950¢]
</div>
<p>
	This always yields a value between 0 and 1, enabling direct comparison across tuning systems 
	with different cardinalities.
</p>

<table>
	<thead>
		<tr>
			<th>Configuration</th>
			<th>Timbre</th>
			<th># Intervals</th>
			<th>Mean C̄</th>
		</tr>
	</thead>
	<tbody>
		<tr class="highlight-row">
			<td><strong>12-TET (pseudoharmonic)</strong></td>
			<td><strong>reverse-tuned</strong></td>
			<td>22</td>
			<td><strong>0.342</strong></td>
		</tr>
		<tr>
			<td>1/4-comma Meantone</td>
			<td>harmonic</td>
			<td>22</td>
			<td>0.319</td>
		</tr>
		<tr>
			<td>Bohlen-Pierce</td>
			<td>odd harmonics</td>
			<td>18</td>
			<td>0.316</td>
		</tr>
		<tr>
			<td>Slendric[11]</td>
			<td>harmonic</td>
			<td>35</td>
			<td>0.271</td>
		</tr>
		<tr>
			<td>12-TET</td>
			<td>harmonic</td>
			<td>22</td>
			<td>0.271</td>
		</tr>
		<tr>
			<td>Pythagorean</td>
			<td>harmonic</td>
			<td>22</td>
			<td>0.265</td>
		</tr>
		<tr>
			<td>Porcupine[8]</td>
			<td>harmonic</td>
			<td>25</td>
			<td>0.262</td>
		</tr>
	</tbody>
</table>

<h3>6.2 The Key Result</h3>

<p>
	<strong>Reverse-tuned 12-TET (C̄ = 0.342) beats 1/4-comma meantone with harmonic timbre 
	(C̄ = 0.319).</strong>
</p>
<p>
	Meantone temperament was historically designed to optimize the consonance of thirds within the 
	harmonic series. Yet by reverse-tuning the timbre to 12-TET instead, we achieve a higher mean 
	consonance — without any compromise on the scale side. The pseudoharmonic spectrum lifts nearly 
	every interval: minor thirds jump from <var>C</var> = 0.00 to 0.25, major seconds from 0.14 to 
	0.38, minor fifths from 0.08 to 0.40.
</p>
<p>
	This suggests a paradigm shift: <strong>the optimal path to consonance may lie not in perfecting 
	the tuning, but in adapting the timbre.</strong> For electronic and synthesized music — where 
	timbre is freely adjustable — reverse tuning unlocks consonance in any scale, including those 
	traditionally considered "out of tune."
</p>

<h3>6.3 Perceptual Limits of Reverse Tuning</h3>

<p>
	A crucial caveat: stronger deviations from harmonicity give the timbre a metallic, bell-like 
	quality. At some point, the human auditory system ceases to fuse the partials into a single 
	coherent pitch and instead perceives them as distinct, separate tones. The pseudoharmonic 
	adjustments for 12-TET are very small — the largest shift is only 13.7¢ on the 5th partial — 
	and remain well within perceptual tolerance. For more exotic scales, however, the required 
	deviations may become audibly unnatural.
</p>
<p>
	Developing a <strong>quantitative measure of deviation from harmonicity</strong> that captures 
	the risk of destroying timbral coherence is a key question that will be tackled in upcoming 
	research. Such a measure would act as a constraint on reverse tuning: the pseudoharmonic 
	spectrum must not deviate so far from the harmonic series that it loses its identity as a 
	pitched sound.
</p>
<p>
	This opens an exciting avenue: <strong>jointly optimizing tuning and timbre</strong> to maximize 
	consonance while minimizing deviation from harmonicity. Rather than fixing one and adjusting 
	the other, both the scale and the spectrum become free parameters in a single optimization 
	problem — a possibility that the PitchGrid consonance framework now makes tractable.
</p>

<h3>6.4 Implications</h3>

<ul>
	<li><strong>Any MOS scale can be made consonant</strong> by constructing a matched pseudoharmonic 
		spectrum. This opens Porcupine, Slendric, and other non-diatonic scales to consonant 
		harmony.</li>
	<li><strong>The mean consonance score</strong> provides a single number between 0 and 1 for 
		comparing tuning/timbre configurations, enabling systematic optimization.</li>
	<li><strong>For acoustic instruments</strong>, reverse tuning is constrained by physics — but 
		for synthesis, sampling, and physical modeling, it offers a concrete recipe for building 
		timbres that make any scale sing.</li>
	<li><strong>Joint tuning-timbre optimization</strong>, balancing consonance against timbral 
		naturalness, is a natural next step enabled by this framework.</li>
</ul>

<h2>7. Application to Counterpoint</h2>

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

<h2>8. References</h2>

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
	<li>Harrison, P. M. C. &amp; Pearce, M. T. (2020). "Simultaneous consonance in music perception 
		and composition." <em>Psychological Review</em>, 127(2), 216–244.</li>
	<li>Eerola, T. &amp; Lahdelma, I. (2021). "The anatomy of consonance/dissonance: Evaluating 
		acoustic and cultural predictors across multiple datasets." <em>Music &amp; Science</em>, 4.</li>
	<li>Wilson, E. (1975). "Letter to Chalmers pertaining to Moments of Symmetry." 
		Published at anaphoria.com.</li>
</ol>

</div>
