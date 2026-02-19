<svelte:head>
	<title>The Two-Dimensional Structure of Musical Scales — PitchGrid Research</title>
	<meta name="description" content="A formal treatment of Moments of Symmetry (MOS) scales, rank-2 regular temperaments, and the two-dimensional tonal lattice that underlies Western music theory." />
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
		color: #e0e0e0;
		font-size: 1.2rem;
		margin-top: 2rem;
		margin-bottom: 0.8rem;
	}

	.article p {
		margin-bottom: 1.2rem;
	}

	.article a {
		color: #FFAB00;
		text-decoration: none;
	}

	.article a:hover {
		text-decoration: underline;
	}

	.article em {
		color: #e0c080;
	}

	.article strong {
		color: #e8e8e8;
	}

	.article ul, .article ol {
		margin-bottom: 1.2rem;
		padding-left: 1.8rem;
	}

	.article li {
		margin-bottom: 0.4rem;
	}

	.article code {
		background: rgba(255, 171, 0, 0.1);
		padding: 0.15rem 0.4rem;
		border-radius: 3px;
		font-size: 0.92rem;
		color: #FFAB00;
	}

	.formula {
		background: rgba(255, 255, 255, 0.04);
		border-left: 3px solid rgba(255, 171, 0, 0.4);
		padding: 1rem 1.5rem;
		margin: 1.5rem 0;
		font-family: 'Georgia', serif;
		font-style: italic;
		color: #e0c080;
		overflow-x: auto;
	}

	.definition {
		background: rgba(13, 117, 255, 0.06);
		border-left: 3px solid rgba(13, 117, 255, 0.5);
		padding: 1rem 1.5rem;
		margin: 1.5rem 0;
	}

	.definition .def-label {
		color: #0D75FF;
		font-weight: bold;
		font-size: 0.95rem;
		margin-bottom: 0.5rem;
	}

	.theorem {
		background: rgba(255, 171, 0, 0.06);
		border-left: 3px solid rgba(255, 171, 0, 0.5);
		padding: 1rem 1.5rem;
		margin: 1.5rem 0;
	}

	.theorem .thm-label {
		color: #FFAB00;
		font-weight: bold;
		font-size: 0.95rem;
		margin-bottom: 0.5rem;
	}

	.example {
		background: rgba(76, 175, 80, 0.06);
		border-left: 3px solid rgba(76, 175, 80, 0.5);
		padding: 1rem 1.5rem;
		margin: 1.5rem 0;
	}

	.example .ex-label {
		color: #4CAF50;
		font-weight: bold;
		font-size: 0.95rem;
		margin-bottom: 0.5rem;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		margin: 1.5rem 0;
		font-size: 0.95rem;
	}

	th {
		background: rgba(255, 171, 0, 0.1);
		color: #FFAB00;
		padding: 0.7rem 1rem;
		text-align: left;
		border-bottom: 2px solid rgba(255, 171, 0, 0.3);
	}

	td {
		padding: 0.6rem 1rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}

	tr:hover td {
		background: rgba(255, 255, 255, 0.03);
	}

	.highlight-row td {
		background: rgba(255, 171, 0, 0.08);
		font-weight: bold;
	}

	figure {
		margin: 2rem 0;
		text-align: center;
	}

	figure img {
		max-width: 100%;
		border-radius: 6px;
	}

	figcaption {
		color: #888;
		font-size: 0.9rem;
		margin-top: 0.5rem;
		font-style: italic;
	}

	.toc {
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 171, 0, 0.15);
		border-radius: 8px;
		padding: 1.5rem 2rem;
		margin: 2rem 0;
	}

	.toc h3 {
		color: #FFAB00;
		margin-top: 0;
		font-size: 1.1rem;
	}

	.toc ol {
		margin: 0;
		padding-left: 1.5rem;
	}

	.toc li {
		margin-bottom: 0.3rem;
	}

	.toc a {
		color: #bbb;
	}

	.toc a:hover {
		color: #FFAB00;
	}

	ol.references {
		font-size: 0.92rem;
		color: #999;
		line-height: 1.6;
	}

	ol.references li {
		margin-bottom: 0.8rem;
	}

	.abstract {
		font-style: italic;
		color: #bbb;
		border-left: 3px solid rgba(255, 171, 0, 0.3);
		padding-left: 1.5rem;
		margin: 2rem 0;
		line-height: 1.9;
	}

	var {
		font-family: 'Georgia', serif;
		font-style: italic;
		color: #e0c080;
	}
</style>

<div class="article">

<h1>The Two-Dimensional Structure of Musical Scales</h1>
<p class="article-meta">Peter Jung · February 2026</p>

<div class="abstract">
	<p>
		Western music theory implicitly treats scales as one-dimensional objects — sequences of 
		pitches ordered along a line. Yet the structure that gives rise to keys, modes, accidentals, 
		and the circle of fifths is inherently <em>two-dimensional</em>: every pitch in a diatonic 
		scale is located by two independent coordinates — its position within the scale pattern and 
		its position in the chain of generators (fifths). This article formalizes this observation 
		using the framework of <strong>rank-2 regular temperaments</strong> and 
		<strong>Moments of Symmetry (MOS) scales</strong>, shows that the diatonic scale is one 
		instance of a vast family of two-dimensional tonal structures, and develops the mathematical 
		tools needed to navigate this space.
	</p>
</div>

<nav class="toc">
	<h3>Contents</h3>
	<ol>
		<li><a href="#introduction">Introduction: The Hidden Dimension</a></li>
		<li><a href="#rank2">Rank-2 Regular Temperaments</a></li>
		<li><a href="#mos">Moments of Symmetry</a></li>
		<li><a href="#lattice">The Two-Dimensional Lattice</a></li>
		<li><a href="#intervals">Interval Structure</a></li>
		<li><a href="#modes">Modes and Accidentals</a></li>
		<li><a href="#examples">Examples</a></li>
		<li><a href="#three-gap">The Three-Gap Theorem</a></li>
		<li><a href="#generalization">Beyond Diatonic: The Design Space</a></li>
		<li><a href="#references">References</a></li>
	</ol>
</nav>

<h2 id="introduction">1. Introduction: The Hidden Dimension</h2>

<p>
	Consider the C major scale: C D E F G A B. In conventional music theory, this is a sequence 
	of seven pitches ordered by frequency. Intervals are measured by counting <em>steps</em> along 
	this sequence — a second spans one step, a third spans two, and so on. The entire framework 
	of scales, keys, and intervals appears to live on a <em>line</em>.
</p>
<p>
	But look more carefully. The interval from C to D (a major second, 200¢ in 12-TET) and the 
	interval from E to F (a minor second, 100¢) are both "one step" apart in the scale, yet 
	they differ by a factor of two in size. This is not a minor detail — it is a structural 
	feature that generates the entire richness of Western tonality. The distinction between 
	<em>large</em> and <em>small</em> steps is the shadow of a hidden second dimension.
</p>
<p>
	The key insight is this: the diatonic scale is generated by repeatedly stacking a single 
	interval — the <strong>generator</strong> (a fifth, ≈702¢) — and folding the result back 
	into a single <strong>equave</strong> (the octave, 1200¢). The chain of fifths 
	F–C–G–D–A–E–B produces exactly the seven notes of the major scale. But this chain has 
	its own geometry: each note has a position <em>within the scale</em> (its scale degree) 
	and a position <em>along the generator chain</em> (how many fifths away from the starting 
	note). These are two independent coordinates. The scale is not a line — it is a 
	<strong>lattice</strong>.
</p>
<p>
	This article develops the mathematics of this two-dimensional structure. The framework 
	encompasses all scales that arise from a single generator and equave — the family of 
	<strong>Moments of Symmetry (MOS)</strong> scales, first described by Erv Wilson (1975). 
	The diatonic scale (5 large + 2 small steps), the pentatonic scale (2L + 3s), and the 
	chromatic scale (7L + 5s) are familiar instances. But the same construction produces 
	scales with any number of notes and any ratio of step sizes — Porcupine[8] (1L + 7s), 
	Slendric[11] (5L + 6s), Bohlen–Pierce (5L + 4s with a tritave equave) — each with its 
	own two-dimensional tonal architecture, its own modes, its own system of accidentals.
</p>
<p>
	PitchGrid is the framework for exploring this space. It treats the generator and equave 
	as continuous parameters, turning scale construction into a design problem: dial in any 
	generator size and depth, and the resulting MOS scale unfolds with all its structural 
	properties computed automatically.
</p>

<h2 id="rank2">2. Rank-2 Regular Temperaments</h2>

<p>
	A <strong>regular temperament</strong> is a tuning system in which pitches are generated by 
	a small number of independent intervals. The <em>rank</em> of the temperament is the number 
	of generators needed.
</p>

<div class="definition">
	<div class="def-label">Definition 1 — Rank-2 Regular Temperament</div>
	<p>
		A <strong>rank-2 regular temperament</strong> is a tuning system generated by two 
		intervals: the <strong>equave</strong> <var>E</var> (the interval of equivalence, 
		typically the octave at 1200¢) and the <strong>generator</strong> <var>g</var> 
		(an interval strictly between 0 and <var>E</var>). Every pitch in the system is of the form:
	</p>
	<div class="formula">
		<var>p</var>(<var>a</var>, <var>b</var>) = <var>a</var> · <var>L</var> + <var>b</var> · <var>s</var>
	</div>
	<p>
		where <var>a</var>, <var>b</var> ∈ ℤ are the lattice coordinates, and <var>L</var>, <var>s</var> 
		are the <em>large</em> and <em>small</em> step sizes derived from the generator and equave 
		(defined precisely in Section 3).
	</p>
</div>

<p>
	The crucial point is that rank-2 temperaments are <em>not</em> one-dimensional. A single 
	pitch is specified by two integers (<var>a</var>, <var>b</var>), not one. The pair 
	(<var>a</var>, <var>b</var>) determines both the pitch (via the tuning map) and the 
	structural role of the note (its position in the lattice, which determines its relationships 
	to other notes).
</p>
<p>
	Familiar tuning systems are rank-2 temperaments:
</p>
<ul>
	<li><strong>12-TET</strong>: equave = 1200¢, generator = 700¢ (tempered fifth)</li>
	<li><strong>Pythagorean</strong>: equave = 1200¢, generator = 701.96¢ (just fifth, 3:2)</li>
	<li><strong>Quarter-comma meantone</strong>: equave = 1200¢, generator = 696.58¢ (¼-comma flat fifth)</li>
	<li><strong>Bohlen–Pierce</strong>: equave = 1901.96¢ (tritave, 3:1), generator = 1466.87¢</li>
</ul>
<p>
	Note that 12-TET, Pythagorean, and meantone share the same scale <em>structure</em> (both 
	produce 5L+2s diatonic scales at depth 3) but differ in their generator size. This is the 
	power of the rank-2 framework: structure and tuning are orthogonal. You can continuously 
	vary the generator while preserving the scale's combinatorial properties.
</p>

<h2 id="mos">3. Moments of Symmetry</h2>

<p>
	Given a generator <var>g</var> and equave <var>E</var>, we construct a scale by stacking 
	<var>n</var> copies of the generator and reducing modulo the equave. The resulting scale 
	has remarkable structural properties, first identified by Erv Wilson (1975) and formalized 
	under the name <strong>Moments of Symmetry</strong>.
</p>

<div class="definition">
	<div class="def-label">Definition 2 — MOS Scale</div>
	<p>
		Let <var>g</var> ∈ (0, <var>E</var>) be a generator and <var>E</var> &gt; 0 the equave. 
		The <strong>MOS scale</strong> of cardinality <var>n</var> is the set of pitches:
	</p>
	<div class="formula">
		<var>S<sub>n</sub></var> = {'{'} <var>k</var> · <var>g</var> mod <var>E</var> : <var>k</var> = 0, 1, …, <var>n</var>−1 {'}'}
	</div>
	<p>
		A scale <var>S<sub>n</sub></var> is a <strong>Moment of Symmetry</strong> if it has exactly 
		two distinct step sizes when its elements are arranged in ascending order within the equave.
	</p>
</div>

<p>
	Not every cardinality <var>n</var> yields an MOS scale. For a given generator ratio 
	<var>g</var>/<var>E</var>, only certain values of <var>n</var> produce exactly two step sizes. 
	These special cardinalities form a sequence that can be computed via the 
	<strong>Stern–Brocot tree</strong> (equivalently, via the continued fraction expansion of 
	<var>g</var>/<var>E</var>).
</p>

<div class="definition">
	<div class="def-label">Definition 3 — Depth and the MOS Sequence</div>
	<p>
		The <strong>depth</strong> of an MOS scale is the number of steps in the Euclidean-algorithm-like 
		process that derives the scale structure from the generator ratio. Starting from 
		<var>a</var><sub>0</sub> = <var>b</var><sub>0</sub> = 1 and step sizes 
		<var>L</var><sub>0</sub> = <var>g</var>, <var>s</var><sub>0</sub> = <var>E</var> − <var>g</var>:
	</p>
	<div class="formula">
		At each step: if <var>L<sub>i</sub></var> &gt; <var>s<sub>i</sub></var>, then 
		<var>b</var><sub><var>i</var>+1</sub> = <var>b<sub>i</sub></var> + <var>a<sub>i</sub></var>, 
		<var>L</var><sub><var>i</var>+1</sub> = <var>L<sub>i</sub></var> − <var>s<sub>i</sub></var><br/>
		Otherwise: <var>a</var><sub><var>i</var>+1</sub> = <var>a<sub>i</sub></var> + <var>b<sub>i</sub></var>, 
		<var>s</var><sub><var>i</var>+1</sub> = <var>s<sub>i</sub></var> − <var>L<sub>i</sub></var>
	</div>
	<p>
		After <var>d</var> steps, the MOS scale has <var>a<sub>d</sub></var> large steps and 
		<var>b<sub>d</sub></var> small steps, for a total of 
		<var>n</var> = <var>a<sub>d</sub></var> + <var>b<sub>d</sub></var> notes per equave.
	</p>
</div>

<div class="example">
	<div class="ex-label">Example — The Diatonic Scale</div>
	<p>
		Take <var>g</var>/<var>E</var> ≈ 7/12 (the fifth as a fraction of the octave). Starting 
		from (1, 1):
	</p>
	<ul>
		<li>Depth 0: 1L + 1s = 2 notes (tritone-split octave)</li>
		<li>Depth 1: <var>g</var> &gt; <var>E</var>−<var>g</var>, so <var>b</var> = 1+1 = 2 → 1L + 2s = 3 notes (triad)</li>
		<li>Depth 2: <var>L</var> &gt; <var>s</var>, so <var>b</var> = 2+1 = 3 → 1L + 3s… wait, <var>L</var> &lt; <var>s</var> now, so <var>a</var> = 1+1 = 2 → 2L + 3s = 5 notes (pentatonic)</li>
		<li>Depth 3: <var>L</var> &gt; <var>s</var>, so <var>b</var> = 3+2 = 5 → <strong>5L + 2s = 7 notes (diatonic)</strong></li>
	</ul>
	<p>
		The diatonic scale is the depth-3 MOS of the fifth generator. Its 5 large steps (whole 
		tones, ≈200¢) and 2 small steps (semitones, ≈100¢) are the familiar pattern 
		T–T–S–T–T–T–S of the major scale.
	</p>
</div>

<div class="theorem">
	<div class="thm-label">Theorem 1 — MOS Well-Formedness</div>
	<p>
		Every MOS scale satisfies the following properties:
	</p>
	<ol>
		<li><strong>Two step sizes</strong>: The scale has exactly two distinct step sizes, <var>L</var> (large) and <var>s</var> (small), with <var>L</var> &gt; <var>s</var> &gt; 0.</li>
		<li><strong>Maximal evenness</strong>: The large and small steps are distributed as evenly as possible — no two large steps are adjacent unless all steps between them are large (and vice versa for small steps).</li>
		<li><strong>Myhill's property</strong>: Every generic interval (spanning the same number of scale steps) comes in exactly two sizes — a <em>minor</em> and a <em>Major</em> variant — differing by the <strong>chroma</strong> <var>c</var> = <var>L</var> − <var>s</var>.</li>
	</ol>
</div>

<p>
	Myhill's property is the key to the interval system: in a 5L+2s diatonic scale, a "third" 
	(spanning 2 steps) comes in two sizes — minor third (s + L) and major third (L + L). The 
	difference is exactly one chroma. This is not a coincidence — it is a structural consequence 
	of the MOS construction, and it holds for <em>every</em> MOS scale, not just the diatonic one.
</p>

<h2 id="lattice">4. The Two-Dimensional Lattice</h2>

<p>
	The central claim of PitchGrid is that every MOS scale lives naturally on a 
	<strong>two-dimensional integer lattice</strong> ℤ². We now make this precise.
</p>

<div class="definition">
	<div class="def-label">Definition 4 — The MOS Lattice</div>
	<p>
		Given an MOS scale with <var>a</var> large steps and <var>b</var> small steps, the 
		<strong>MOS lattice</strong> is the integer lattice ℤ² with basis vectors corresponding 
		to the large step <var>L</var> and small step <var>s</var>. A pitch at lattice 
		position (<var>i</var>, <var>j</var>) has log-frequency:
	</p>
	<div class="formula">
		<var>f</var>(<var>i</var>, <var>j</var>) = <var>i</var> · <var>L</var> + <var>j</var> · <var>s</var>
	</div>
	<p>
		where <var>L</var> and <var>s</var> are measured in log-frequency units (e.g., cents/1200 
		for octaves, or log₂ of frequency ratios).
	</p>
</div>

<p>
	The lattice has two distinguished directions:
</p>
<ul>
	<li>The <strong>scale direction</strong>: moving along the scale (incrementing scale degree) 
		alternates between L-steps and s-steps according to the MOS pattern. In the lattice, 
		this is a path that zigzags between the two basis directions.</li>
	<li>The <strong>generator direction</strong>: the vector corresponding to one generator step 
		(<var>g</var>) in the lattice. For the diatonic scale with <var>g</var> ≈ 7/12 of an 
		octave, the generator vector points to the lattice position of the fifth.</li>
</ul>

<div class="definition">
	<div class="def-label">Definition 5 — The Tuning Map (Implied Affine Transform)</div>
	<p>
		The <strong>tuning map</strong> is an affine transformation 
		<var>T</var>: ℝ² → ℝ² that maps lattice coordinates to pitch space. It is determined by 
		three constraints:
	</p>
	<ol>
		<li>The origin (0, 0) maps to pitch 0 (the reference pitch)</li>
		<li>The generator vector <var>v<sub>g</sub></var> maps to the generator pitch <var>g</var> · <var>P</var> (where <var>P</var> is the period = <var>E</var>/<var>r</var>, with <var>r</var> = gcd(<var>a</var>, <var>b</var>))</li>
		<li>The equave vector (<var>a</var>/<var>r</var>, <var>b</var>/<var>r</var>) maps to the period <var>P</var></li>
	</ol>
	<p>
		These three points uniquely determine the affine transformation.
	</p>
</div>

<p>
	The tuning map is what connects the abstract combinatorial lattice to actual pitches. 
	Changing the generator size <var>g</var> changes the tuning map but preserves the lattice 
	structure — notes slide continuously in pitch while maintaining their structural relationships. 
	This is the mathematical basis for PitchGrid's continuous tuning parameter.
</p>

<h2 id="intervals">5. Interval Structure</h2>

<p>
	The two-dimensional lattice gives rise to a rich interval system that generalizes 
	Western interval naming.
</p>

<div class="definition">
	<div class="def-label">Definition 6 — Generic and Specific Intervals</div>
	<p>
		A <strong>generic interval</strong> of an MOS scale is determined by the number of scale 
		steps it spans. A <strong>specific interval</strong> is a generic interval with a 
		particular size in cents. By Myhill's property (Theorem 1), each generic interval of 
		<var>k</var> steps comes in exactly two specific sizes:
	</p>
	<div class="formula">
		minor <var>k</var>-th: &nbsp; <var>m<sub>k</sub></var> · <var>L</var> + (<var>k</var> − <var>m<sub>k</sub></var>) · <var>s</var><br/>
		Major <var>k</var>-th: &nbsp; (<var>m<sub>k</sub></var>+1) · <var>L</var> + (<var>k</var> − <var>m<sub>k</sub></var> − 1) · <var>s</var>
	</div>
	<p>
		where <var>m<sub>k</sub></var> is the minimum number of L-steps in any span of <var>k</var> 
		consecutive scale degrees.
	</p>
</div>

<p>
	The notation we adopt is:
</p>
<ul>
	<li><strong>P1</strong> = unison (0¢)</li>
	<li><strong>m<var>k</var></strong> / <strong>M<var>k</var></strong> = minor / Major interval spanning <var>k</var> steps</li>
	<li><strong>P<var>n</var></strong> = the equave (spanning all <var>n</var> steps)</li>
</ul>
<p>
	Note: we deliberately avoid the traditional P4/P5 convention (perfect fourth/fifth), as it 
	is specific to the diatonic scale and does not generalize. In a Porcupine[8] scale (1L + 7s), 
	the "fourth" and "fifth" have no structural reason to be singled out as "perfect." Our 
	notation treats all generic intervals uniformly: each comes in a minor and Major variant, 
	except for the unison P1 and equave P<var>n</var>.
</p>

<div class="example">
	<div class="ex-label">Example — Diatonic Intervals (5L + 2s)</div>
	<table>
		<thead>
			<tr><th>Steps</th><th>Minor</th><th>Major</th><th>12-TET (cents)</th></tr>
		</thead>
		<tbody>
			<tr><td>0</td><td colspan="2">P1 (unison)</td><td>0</td></tr>
			<tr><td>1</td><td>m1 (minor second)</td><td>M1 (major second)</td><td>100 / 200</td></tr>
			<tr><td>2</td><td>m2 (minor third)</td><td>M2 (major third)</td><td>300 / 400</td></tr>
			<tr><td>3</td><td>m3 (= trad. "perfect fourth")</td><td>M3 (= trad. "tritone")</td><td>500 / 600</td></tr>
			<tr><td>4</td><td>m4 (= trad. "tritone")</td><td>M4 (= trad. "perfect fifth")</td><td>600 / 700</td></tr>
			<tr><td>5</td><td>m5 (minor sixth)</td><td>M5 (major sixth)</td><td>800 / 900</td></tr>
			<tr><td>6</td><td>m6 (minor seventh)</td><td>M6 (major seventh)</td><td>1000 / 1100</td></tr>
			<tr><td>7</td><td colspan="2">P7 (octave)</td><td>1200</td></tr>
		</tbody>
	</table>
	<p>
		Observe that in 12-TET, the traditional "tritone" at 600¢ appears as both M3 and m4 — it 
		is the boundary where the minor variant of one generic interval coincides with the Major 
		variant of the next. In non-equal temperaments (e.g., meantone), M3 ≠ m4: the tritone 
		splits into two distinct intervals. This is a direct consequence of the two-dimensional 
		structure.
	</p>
</div>

<h3>5.1 Interval Extraction from Modes</h3>

<p>
	The complete set of intervals for an MOS scale can be extracted by comparing two 
	extreme modes: <strong>mode 0</strong> (the brightest mode, with the generator chain starting 
	from the lowest position) and <strong>mode <var>n</var>−1</strong> (the darkest mode). 
	Comparing the pitch of each scale degree between these two modes gives all minor/Major pairs:
</p>
<div class="formula">
	For scale degree <var>k</var> = 1, …, <var>n</var>−1:<br/>
	minor variant = min(pitch<sub>mode 0</sub>[<var>k</var>], pitch<sub>mode n−1</sub>[<var>k</var>])<br/>
	Major variant = max(pitch<sub>mode 0</sub>[<var>k</var>], pitch<sub>mode n−1</sub>[<var>k</var>])
</div>

<h2 id="modes">6. Modes and Accidentals</h2>

<p>
	An MOS scale with <var>n</var> notes has <var>n</var> <strong>modes</strong>, corresponding 
	to the <var>n</var> distinct rotations of its step pattern. In the diatonic scale, these are 
	the seven church modes (Ionian, Dorian, Phrygian, …). The mode is a continuous parameter 
	in PitchGrid: rotating the mode shifts notes along the generator chain.
</p>

<div class="definition">
	<div class="def-label">Definition 7 — Mode</div>
	<p>
		The <strong>mode</strong> <var>m</var> ∈ {'{'} 0, 1, …, <var>n</var>−1 {'}'} of an MOS scale 
		determines the rotation of the step pattern. Mode 0 has the most "bright" (large-step-heavy) 
		character; mode <var>n</var>−1 is the most "dark." In Western terms: mode 0 corresponds to 
		Lydian (brightest), and mode <var>n</var>−1 to Locrian (darkest).
	</p>
</div>

<div class="definition">
	<div class="def-label">Definition 8 — Accidentals and the Chroma</div>
	<p>
		The <strong>chroma</strong> is the vector <var>c</var> = <var>L</var> − <var>s</var> in 
		the lattice (equivalently, <var>c</var> = <var>L</var><sub>vec</sub> − <var>s</var><sub>vec</sub>). 
		An <strong>accidental</strong> is a displacement of a scale note by one or more chromas. 
		In the diatonic scale, the chroma corresponds to a sharp or flat: raising a note by one 
		chroma is equivalent to adding a sharp (♯), lowering by one chroma adds a flat (♭).
	</p>
	<p>
		The number of accidentals on a note is computed from its generator-chain position:
	</p>
	<div class="formula">
		accidentals(<var>v</var>) = ⌊(<var>n<sub>gen</sub></var>(<var>v</var>) + <var>m<sub>neutral</sub></var> + ½) / <var>n</var><sub>0</sub>⌋
	</div>
	<p>
		where <var>n<sub>gen</sub></var> is the number of generators from the origin and 
		<var>m<sub>neutral</sub></var> depends on the mode.
	</p>
</div>

<p>
	Accidentals generalize perfectly to non-diatonic scales. A Porcupine[8] scale has its own 
	chroma and its own sharps and flats — they just correspond to different pitch adjustments 
	than in the diatonic system.
</p>

<h2 id="examples">7. Examples</h2>

<h3>7.1 Pythagorean Tuning (5L + 2s, <var>g</var> = 701.96¢)</h3>
<p>
	The just fifth (ratio 3:2 = 701.96¢) produces the historical Pythagorean tuning. The 
	large step is the Pythagorean whole tone (203.91¢) and the small step is the Pythagorean 
	limma (90.22¢). The chroma is 113.69¢ — the Pythagorean apotome. Pythagorean tuning 
	produces pure fifths but wide major thirds (407.82¢ vs. the just 386.31¢).
</p>

<h3>7.2 Quarter-Comma Meantone (5L + 2s, <var>g</var> = 696.58¢)</h3>
<p>
	By narrowing the fifth by ¼ of the syntonic comma, meantone achieves pure major thirds 
	(386.31¢) at the cost of slightly impure fifths. The large step is 193.16¢, the small step 
	is 117.11¢, and the chroma is 76.05¢. Same lattice structure as Pythagorean — only the 
	tuning map changes.
</p>

<h3>7.3 Bohlen–Pierce (5L + 4s, equave = tritave)</h3>
<p>
	The Bohlen–Pierce scale replaces the octave (2:1) with the <strong>tritave</strong> (3:1, 
	≈1902¢) as the interval of equivalence. Its generator produces a 5L + 4s MOS at depth 4 
	— a 9-note scale within the tritave. The lattice structure is fundamentally different from 
	diatonic: 5 large and 4 small steps, with its own set of modes and accidentals. When paired 
	with odd-harmonic timbres (which have natural affinity for the tritave), it produces a 
	convincingly consonant tonal system.
</p>

<h3>7.4 Porcupine[8] (1L + 7s)</h3>
<p>
	Porcupine temperament uses a generator near 163¢ (a neutral second). At depth 6, it 
	produces a scale with 1 large step and 7 small steps — 8 notes per octave. This extreme 
	asymmetry (1L vs 7s) produces a scale character very different from diatonic: nearly 
	equal-spaced, with one "gap." Its consonance properties depend critically on timbre, 
	as analyzed in our <a href="/research/consonance">consonance study</a>.
</p>

<h3>7.5 Slendric[11] (5L + 6s)</h3>
<p>
	Slendric temperament uses a generator near 233¢ and produces an 11-note MOS with 5 
	large and 6 small steps. With nearly equal step sizes, it has a quality reminiscent 
	of Javanese slendro scales — hence the name. The 11-note cardinality gives it a rich 
	interval set with 35 distinct intervals up to 1950¢.
</p>

<h2 id="three-gap">8. The Three-Gap Theorem</h2>

<p>
	The MOS construction is intimately connected to the <strong>three-gap theorem</strong> 
	(also known as the Steinhaus conjecture, proved by Sós 1958): when <var>n</var> points 
	are placed on a circle at equal angular separations of an irrational fraction of the 
	circumference, the gaps between consecutive points take at most three distinct values 
	— and if there are three values, one is the sum of the other two.
</p>

<div class="theorem">
	<div class="thm-label">Theorem 2 — Three-Gap Theorem (Sós, 1958)</div>
	<p>
		Let <var>α</var> ∈ (0, 1) be irrational and <var>n</var> ≥ 1. Place points at 
		positions {'{'} <var>k</var> · <var>α</var> mod 1 : <var>k</var> = 0, …, <var>n</var>−1 {'}'} 
		on the unit circle. The gaps between consecutive points take at most three distinct 
		lengths. If exactly three lengths occur, one equals the sum of the other two.
	</p>
</div>

<p>
	MOS scales correspond to the special case where exactly <strong>two</strong> gap lengths 
	occur — the "Moment of Symmetry" condition. This happens precisely at the cardinalities 
	<var>n</var> that are denominators of convergents or semiconvergents of the continued 
	fraction expansion of <var>α</var> = <var>g</var>/<var>E</var>. The depth parameter in 
	PitchGrid indexes these special cardinalities.
</p>
<p>
	Between two consecutive MOS cardinalities, there is a transitional scale with three 
	step sizes — these are the "non-MOS" scales that PitchGrid traverses when the depth 
	parameter is varied continuously.
</p>

<h2 id="generalization">9. Beyond Diatonic: The Design Space</h2>

<p>
	The rank-2 MOS framework reveals that the diatonic scale is one point in a vast 
	<strong>design space</strong> of tonal structures, parameterized by:
</p>
<ul>
	<li><strong>Generator</strong> <var>g</var> ∈ (0, <var>E</var>): the generative interval. Fifths give diatonic scales; other generators give Porcupine, Slendric, Mavila, and hundreds of other temperament families.</li>
	<li><strong>Depth</strong> <var>d</var> ∈ ℕ: the number of iterations, determining the scale's cardinality. Depth 2 gives pentatonic, depth 3 gives diatonic, depth 4 gives chromatic (for the fifth generator).</li>
	<li><strong>Equave</strong> <var>E</var>: the interval of equivalence. Octave (1200¢) is standard, but tritave (1902¢), double octave, or other values produce radically different tonal worlds.</li>
	<li><strong>Mode</strong> <var>m</var> ∈ {'{'} 0, …, <var>n</var>−1 {'}'}: the rotation of the step pattern, governing the character (bright/dark) of the scale.</li>
</ul>
<p>
	Every point in this space defines a complete tonal system with its own intervals, modes, 
	accidentals, and structural relationships. The consonance properties of each system depend 
	on the interaction between the scale's intervals and the timbre's partial structure — as 
	analyzed quantitatively in our <a href="/research/consonance">spiky consonance study</a>.
</p>
<p>
	The research question that PitchGrid ultimately poses is: <em>what do these alternative 
	tonal architectures sound like?</em> With the tools developed here — parametric scale 
	construction, generalized interval naming, continuous tuning control, and quantitative 
	consonance analysis — this question can now be explored systematically.
</p>

<h2 id="references">10. References</h2>

<ol class="references">
	<li>Wilson, E. (1975). "Letter to Chalmers pertaining to Moments of Symmetry." 
		Published at anaphoria.com.</li>
	<li>Carey, N. & Clampitt, D. (1989). "Aspects of Well-Formed Scales." 
		<em>Music Theory Spectrum</em>, 11(2), 187–206.</li>
	<li>Clough, J. & Douthett, J. (1991). "Maximally Even Sets." 
		<em>Journal of Music Theory</em>, 35(1/2), 93–173.</li>
	<li>Sós, V. T. (1958). "On the distribution mod 1 of the sequence <em>nα</em>." 
		<em>Annales Universitatis Scientiarum Budapestinensis de Rolando Eötvös Nominatae, 
		Sectio Mathematica</em>, 1, 127–134.</li>
	<li>Erlich, P. (1997). "Tuning, tonality, and twenty-two-tone temperament." 
		<em>Xenharmonikôn</em>, 17.</li>
	<li>Milne, A. J., Sethares, W. A. & Plamondon, J. (2007). "Isomorphic controllers and 
		dynamic tuning." <em>Computer Music Journal</em>, 31(4), 15–32.</li>
	<li>Bohlen, H. (1978). "13 Tonstufen in der Duodezime." <em>Acustica</em>, 39(2), 76–86.</li>
	<li>Sethares, W. A. (2005). <em>Tuning, Timbre, Spectrum, Scale</em> (2nd ed.). Springer.</li>
</ol>

</div>
