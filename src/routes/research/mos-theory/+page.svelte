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

	.part-header {
		color: #FFAB00;
		font-size: 1.1rem;
		font-weight: bold;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		margin-top: 4rem;
		margin-bottom: 0.5rem;
		padding: 0.8rem 0;
		border-top: 2px solid rgba(255, 171, 0, 0.3);
		border-bottom: 1px solid rgba(255, 171, 0, 0.15);
	}
</style>

<div class="article">

<h1>The Two-Dimensional Structure of Musical Scales</h1>
<p class="article-meta">Peter Jung · February 2026</p>

<div class="abstract">
	<p>
		Western music theory implicitly treats scales as one-dimensional objects — sequences of 
		pitches ordered along a line. Yet the structure that gives rise to keys, modes, accidentals, 
		and the circle of fifths is inherently <em>two-dimensional</em>: every note in a diatonic 
		scale occupies a position on a two-dimensional integer lattice, and the scale itself is a 
		<em>path</em> on that lattice. This structure exists independently of any assignment of 
		frequencies — it is purely combinatorial.
	</p>
	<p>
		This article develops the mathematics of this two-dimensional structure in two stages. 
		<strong>Part I</strong> treats the lattice and its algebra: vectors, coprime bases, 
		lattice-preserving transformations, the MOS (Moments of Symmetry) construction, and the 
		interval system — all without reference to pitch or frequency. 
		<strong>Part II</strong> introduces the <em>tuning map</em>, a linear function that assigns 
		log-frequencies to lattice points, connecting the abstract structure to audible music. 
		This clean separation reveals that structure and tuning are orthogonal: infinitely many 
		tunings share the same tonal architecture.
	</p>
</div>

<nav class="toc">
	<h3>Contents</h3>
	<ol>
		<li><a href="#introduction">Introduction: The Hidden Dimension</a></li>
	</ol>
	<p style="margin: 0.5rem 0 0.3rem; color: #FFAB00; font-size: 0.9rem; font-weight: bold;">Part I — Structure</p>
	<ol start="2">
		<li><a href="#lattice">The Integer Lattice</a></li>
		<li><a href="#bases">Coprime Vectors and Bases</a></li>
		<li><a href="#mos">The MOS Construction</a></li>
		<li><a href="#vectors">Distinguished Vectors</a></li>
		<li><a href="#intervals">Interval Structure</a></li>
		<li><a href="#modes">Modes and Accidentals</a></li>
		<li><a href="#mappings">Lattice Transformations and MOS Mapping</a></li>
	</ol>
	<p style="margin: 0.5rem 0 0.3rem; color: #FFAB00; font-size: 0.9rem; font-weight: bold;">Part II — Tuning</p>
	<ol start="9">
		<li><a href="#tuning">The Tuning Map</a></li>
		<li><a href="#examples">Tuning Examples</a></li>
		<li><a href="#three-gap">The Three-Gap Theorem</a></li>
		<li><a href="#design-space">The Design Space</a></li>
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
	But look more carefully. The step from C to D and the step from E to F are both "one step" 
	in the scale, yet they differ in size. The major scale has five large steps and two small 
	steps, arranged in the pattern L–L–s–L–L–L–s. This distinction between <em>large</em> and 
	<em>small</em> is not a minor detail — it is the shadow of a second dimension.
</p>
<p>
	The key insight: the diatonic scale is generated by repeatedly stacking a single interval — 
	the <strong>generator</strong> (a fifth) — and folding the result within an 
	<strong>equave</strong> (the octave). The chain of fifths F–C–G–D–A–E–B produces exactly 
	the seven notes of the major scale. But this chain has its own geometry: each note has a 
	position <em>within the scale pattern</em> and a position <em>along the generator chain</em>. 
	These are two independent coordinates. The scale is not a line — it is a 
	<strong>path on a two-dimensional lattice</strong>.
</p>
<p>
	This article develops the mathematics of this lattice. Crucially, we separate the 
	<em>structure</em> of the lattice (which is purely combinatorial — integers, vectors, paths) 
	from the <em>tuning</em> (which assigns frequencies to lattice points). The structure comes 
	first, because it is the structure that determines keys, modes, intervals, and accidentals. 
	Tuning is a separate choice layered on top.
</p>

<div class="part-header">Part I — Structure</div>

<h2 id="lattice">2. The Integer Lattice</h2>

<p>
	The foundation is the two-dimensional integer lattice <strong>ℤ²</strong> — the set of all 
	pairs of integers (<var>a</var>, <var>b</var>) with <var>a</var>, <var>b</var> ∈ ℤ.
</p>

<div class="definition">
	<div class="def-label">Definition 1 — The Tonal Lattice</div>
	<p>
		The <strong>tonal lattice</strong> is the integer lattice ℤ², whose elements we call 
		<strong>nodes</strong>. Each node <var>v</var> = (<var>a</var>, <var>b</var>) represents 
		a potential pitch in the tonal system. At this stage, no frequencies are assigned — nodes 
		are purely abstract positions.
	</p>
</div>

<p>
	Every structure we will define — scales, intervals, modes, accidentals — lives on this lattice 
	as a combinatorial object. Frequencies enter only in Part II, when we define the tuning map.
</p>

<h2 id="bases">3. Coprime Vectors and Bases</h2>

<p>
	The lattice has a rich algebraic structure that governs how we can describe and navigate it.
</p>

<div class="definition">
	<div class="def-label">Definition 2 — Coprime Vector</div>
	<p>
		A lattice vector <var>v</var> = (<var>a</var>, <var>b</var>) ∈ ℤ² is <strong>coprime</strong> 
		(or <strong>primitive</strong>) if gcd(<var>a</var>, <var>b</var>) = 1. Equivalently, 
		<var>v</var> is coprime if there is no lattice point strictly between the origin and 
		<var>v</var> on the line segment connecting them.
	</p>
</div>

<p>
	Coprimality is a basis-independent property: if gcd(<var>a</var>, <var>b</var>) = 1 in the 
	standard basis, it remains 1 in any other integer basis (because basis changes in ℤ² are 
	given by matrices with determinant ±1, which preserve the gcd).
</p>

<div class="definition">
	<div class="def-label">Definition 3 — Lattice Basis</div>
	<p>
		A <strong>basis</strong> for ℤ² is a pair of vectors {'{'}<var>e</var><sub>1</sub>, <var>e</var><sub>2</sub>{'}'} 
		such that every lattice point can be written uniquely as 
		<var>n</var><sub>1</sub><var>e</var><sub>1</sub> + <var>n</var><sub>2</sub><var>e</var><sub>2</sub> 
		with <var>n</var><sub>1</sub>, <var>n</var><sub>2</sub> ∈ ℤ.
	</p>
</div>

<div class="theorem">
	<div class="thm-label">Theorem 1 — Characterization of Lattice Bases</div>
	<p>
		Two vectors <var>e</var><sub>1</sub> = (<var>a</var><sub>1</sub>, <var>b</var><sub>1</sub>) 
		and <var>e</var><sub>2</sub> = (<var>a</var><sub>2</sub>, <var>b</var><sub>2</sub>) form 
		a basis of ℤ² if and only if:
	</p>
	<div class="formula">
		|<var>a</var><sub>1</sub><var>b</var><sub>2</sub> − <var>a</var><sub>2</sub><var>b</var><sub>1</sub>| = 1
	</div>
	<p>
		That is, the matrix with columns <var>e</var><sub>1</sub>, <var>e</var><sub>2</sub> has 
		determinant ±1. In particular, both <var>e</var><sub>1</sub> and <var>e</var><sub>2</sub> 
		must be coprime.
	</p>
</div>

<p>
	This means any two linearly independent coprime vectors whose coordinates satisfy the 
	determinant condition form a valid basis — and every node in the lattice has unique 
	integer coordinates in that basis. There are infinitely many such bases for ℤ², and the 
	music-theoretic objects we define (scales, intervals, modes) take different but equivalent 
	forms in each one.
</p>

<div class="example">
	<div class="ex-label">Example — Bases for the Diatonic Lattice</div>
	<p>
		In a 5L+2s diatonic MOS, the following are all valid bases for ℤ²:
	</p>
	<ul>
		<li><strong>Standard basis</strong>: {'{'} (1,0), (0,1) {'}'}</li>
		<li><strong>Step basis</strong>: {'{'} <var>L</var>, <var>s</var> {'}'} — where <var>L</var> and <var>s</var> are the large and small step vectors</li>
		<li><strong>Generator–period basis</strong>: {'{'} <var>v<sub>g</sub></var>, <var>v<sub>p</sub></var> {'}'} — generator and period vectors</li>
	</ul>
	<p>
		Each gives a different coordinate system for the same lattice. The choice of basis is a 
		matter of convenience, not structure.
	</p>
</div>

<h2 id="mos">4. The MOS Construction</h2>

<p>
	A <strong>Moment of Symmetry (MOS)</strong> scale is a specific combinatorial structure on 
	the lattice, defined by a recursive process that produces two distinguished vectors and a 
	scale path. The construction is purely structural — it takes a rational or irrational 
	<em>generator ratio</em> as input and produces lattice vectors as output, with no reference 
	to frequency.
</p>

<div class="definition">
	<div class="def-label">Definition 4 — The MOS Algorithm</div>
	<p>
		Let <var>γ</var> ∈ (0, 1) be the <strong>generator ratio</strong> (the generator as a 
		fraction of the equave). Starting from initial values:
	</p>
	<div class="formula">
		<var>a</var><sub>0</sub> = 1, &ensp; <var>b</var><sub>0</sub> = 1, &ensp; 
		<var>L</var><sub>0</sub> = <var>γ</var>, &ensp; <var>s</var><sub>0</sub> = 1 − <var>γ</var>
	</div>
	<p>
		At each step <var>i</var> = 0, 1, 2, …:
	</p>
	<div class="formula">
		If <var>L<sub>i</sub></var> &gt; <var>s<sub>i</sub></var>: &ensp; 
		<var>b</var><sub><var>i</var>+1</sub> = <var>b<sub>i</sub></var> + <var>a<sub>i</sub></var>, &ensp;
		<var>L</var><sub><var>i</var>+1</sub> = <var>L<sub>i</sub></var> − <var>s<sub>i</sub></var>, &ensp;
		<var>a</var><sub><var>i</var>+1</sub> = <var>a<sub>i</sub></var>, &ensp;
		<var>s</var><sub><var>i</var>+1</sub> = <var>s<sub>i</sub></var><br/>
		If <var>L<sub>i</sub></var> &lt; <var>s<sub>i</sub></var>: &ensp;
		<var>a</var><sub><var>i</var>+1</sub> = <var>a<sub>i</sub></var> + <var>b<sub>i</sub></var>, &ensp;
		<var>s</var><sub><var>i</var>+1</sub> = <var>s<sub>i</sub></var> − <var>L<sub>i</sub></var>, &ensp;
		<var>b</var><sub><var>i</var>+1</sub> = <var>b<sub>i</sub></var>, &ensp;
		<var>L</var><sub><var>i</var>+1</sub> = <var>L<sub>i</sub></var>
	</div>
	<p>
		After <var>d</var> steps (the <strong>depth</strong>), the MOS scale has 
		<var>a<sub>d</sub></var> large steps and <var>b<sub>d</sub></var> small steps, for a 
		total of <var>n</var> = <var>a<sub>d</sub></var> + <var>b<sub>d</sub></var> notes per equave.
	</p>
</div>

<p>
	This is a variant of the Euclidean algorithm applied to the generator ratio. It simultaneously 
	computes the step counts (<var>a</var>, <var>b</var>) and the residual step-size ratios 
	(<var>L</var>, <var>s</var>) — but the latter serve only to determine which branch to take 
	at each step. The structural output is the pair (<var>a<sub>d</sub></var>, <var>b<sub>d</sub></var>) 
	and the <strong>path</strong>: the sequence of branch decisions (L &gt; s or L &lt; s) at each depth.
</p>

<div class="example">
	<div class="ex-label">Example — Diatonic from <var>γ</var> ≈ 7/12</div>
	<ul>
		<li>Depth 0: (1, 1), <var>L</var> ≈ 0.583, <var>s</var> ≈ 0.417</li>
		<li>Depth 1: L &gt; s → <var>b</var> = 2, (1, 2), <var>L</var> ≈ 0.167, <var>s</var> ≈ 0.417</li>
		<li>Depth 2: L &lt; s → <var>a</var> = 3, (3, 2), <var>L</var> ≈ 0.167, <var>s</var> ≈ 0.250</li>
		<li><strong>Depth 3</strong>: L &lt; s → <var>a</var> = 5, <strong>(5, 2)</strong> = <strong>5L + 2s = 7 notes</strong></li>
	</ul>
	<p>The path is (L&gt;s, L&lt;s, L&lt;s) — encoded as the boolean sequence (false, true, true).</p>
</div>

<div class="theorem">
	<div class="thm-label">Theorem 2 — MOS Well-Formedness</div>
	<p>
		Every MOS scale at depth <var>d</var> ≥ 1 satisfies:
	</p>
	<ol>
		<li><strong>Two step sizes</strong>: The scale has exactly two distinct step types, 
			conventionally called <var>L</var> (large) and <var>s</var> (small).</li>
		<li><strong>Maximal evenness</strong>: The <var>L</var> and <var>s</var> steps are 
			distributed as evenly as possible within the equave.</li>
		<li><strong>Myhill's property</strong>: Every generic interval (spanning <var>k</var> 
			scale steps) comes in exactly two specific sizes — a <em>minor</em> and a <em>Major</em> 
			variant — differing by one <strong>chroma</strong> <var>c</var> = <var>L</var> − <var>s</var>.</li>
	</ol>
</div>

<h2 id="vectors">5. Distinguished Vectors</h2>

<p>
	The MOS construction produces several important lattice vectors. These are elements of ℤ² — 
	they carry no frequency information.
</p>

<div class="definition">
	<div class="def-label">Definition 5 — MOS Vectors</div>
	<p>Given an MOS with <var>a</var> large and <var>b</var> small steps:</p>
	<ul>
		<li><strong>Large step vector <var>L</var></strong> and <strong>small step vector <var>s</var></strong>: 
			the two basis vectors corresponding to the two step types. These form a basis of ℤ² 
			(since they arise from the Euclidean algorithm, their determinant is ±1).</li>
		<li><strong>Period vector <var>v<sub>p</sub></var></strong> = <var>a</var><sub>0</sub> · <var>L</var> + <var>b</var><sub>0</sub> · <var>s</var> 
			(where <var>a</var><sub>0</sub> = <var>a</var>/gcd(<var>a</var>,<var>b</var>), 
			<var>b</var><sub>0</sub> = <var>b</var>/gcd(<var>a</var>,<var>b</var>)): 
			represents one period of the scale in the lattice.</li>
		<li><strong>Generator vector <var>v<sub>g</sub></var></strong>: the lattice vector reached 
			by one generator step. Computed by applying the MOS path to the initial vector (1, 0).</li>
		<li><strong>Chroma vector <var>c</var></strong> = <var>L</var> − <var>s</var>: 
			the difference between the two step vectors. In the diatonic case, this corresponds 
			to a sharp/flat alteration.</li>
	</ul>
</div>

<p>
	Any pair of linearly independent vectors from this set forms a basis of ℤ². The 
	{'{'}<var>L</var>, <var>s</var>{'}'} basis is natural for describing scales (steps are unit 
	vectors). The {'{'}<var>v<sub>g</sub></var>, <var>v<sub>p</sub></var>{'}'} basis is natural for 
	describing the generator chain (generators are unit steps). The choice is a matter of 
	perspective, not structure.
</p>

<h2 id="intervals">6. Interval Structure</h2>

<p>
	The two-dimensional lattice gives rise to a rich interval system that generalizes 
	Western interval naming to arbitrary MOS scales.
</p>

<div class="definition">
	<div class="def-label">Definition 6 — Generic and Specific Intervals</div>
	<p>
		A <strong>generic interval</strong> of an MOS scale is determined by the number of scale 
		steps <var>k</var> it spans. By Myhill's property, each generic interval with 
		0 &lt; <var>k</var> &lt; <var>n</var> comes in exactly two <strong>specific</strong> sizes:
	</p>
	<div class="formula">
		minor <var>k</var>-th (m<var>k</var>): &ensp; contains the minimum number of <var>L</var>-steps for that span<br/>
		Major <var>k</var>-th (M<var>k</var>): &ensp; contains one more <var>L</var>-step (and one fewer <var>s</var>-step)
	</div>
	<p>
		The difference between M<var>k</var> and m<var>k</var> is always exactly one chroma <var>c</var>.
	</p>
</div>

<p>
	Our naming convention:
</p>
<ul>
	<li><strong>P1</strong> = unison (the zero vector)</li>
	<li><strong>m<var>k</var></strong> / <strong>M<var>k</var></strong> = minor / Major interval spanning <var>k</var> steps</li>
	<li><strong>P<var>n</var></strong> = the equave (spanning all <var>n</var> steps = the period vector)</li>
</ul>
<p>
	We deliberately avoid the traditional P4/P5 convention (perfect fourth/fifth), as it 
	is specific to the diatonic scale and does not generalize. In a Porcupine[8] scale (1L + 7s), 
	there is no structural reason to single out any interval as "perfect." Our notation treats 
	all generic intervals uniformly.
</p>

<div class="example">
	<div class="ex-label">Example — Diatonic Intervals (5L + 2s)</div>
	<table>
		<thead>
			<tr><th>Steps</th><th>Minor</th><th>Major</th><th>Traditional Name</th></tr>
		</thead>
		<tbody>
			<tr><td>0</td><td colspan="2">P1 (unison)</td><td>unison</td></tr>
			<tr><td>1</td><td>m1</td><td>M1</td><td>minor / major second</td></tr>
			<tr><td>2</td><td>m2</td><td>M2</td><td>minor / major third</td></tr>
			<tr><td>3</td><td>m3</td><td>M3</td><td>perfect fourth / tritone</td></tr>
			<tr><td>4</td><td>m4</td><td>M4</td><td>tritone / perfect fifth</td></tr>
			<tr><td>5</td><td>m5</td><td>M5</td><td>minor / major sixth</td></tr>
			<tr><td>6</td><td>m6</td><td>M6</td><td>minor / major seventh</td></tr>
			<tr><td>7</td><td colspan="2">P7 (equave)</td><td>octave</td></tr>
		</tbody>
	</table>
	<p>
		Note that the traditional "perfect fourth" is our m3, and the "perfect fifth" is M4. 
		The tritone at 600¢ in 12-TET appears as both M3 and m4 — it is the boundary where two 
		generic intervals share a specific size. In non-equal temperaments, M3 ≠ m4: the 
		tritone <em>splits</em>. This splitting is invisible in one-dimensional scale theory 
		but natural in the lattice.
	</p>
</div>

<h3>6.1 Interval Extraction from Modes</h3>

<p>
	The complete interval set can be extracted by comparing two extreme modes of the scale. 
	<strong>Mode 0</strong> (brightest) and <strong>mode <var>n</var>−1</strong> (darkest) 
	represent the two extremes of the modal rotation. Comparing the lattice position of each 
	scale degree between these modes gives all minor/Major pairs: the smaller value at each 
	degree is the minor variant, the larger is the Major.
</p>

<h2 id="modes">7. Modes and Accidentals</h2>

<p>
	An MOS scale with <var>n</var> notes has <var>n</var> <strong>modes</strong>, corresponding 
	to the <var>n</var> distinct rotations of its step pattern.
</p>

<div class="definition">
	<div class="def-label">Definition 7 — Mode</div>
	<p>
		The <strong>mode</strong> <var>m</var> ∈ {'{'} 0, 1, …, <var>n</var>−1 {'}'} determines 
		which rotation of the step pattern is used. Mode 0 has the brightest character 
		(maximum large steps at the beginning); mode <var>n</var>−1 is the darkest. In diatonic 
		terms: mode 0 ≈ Lydian, mode <var>n</var>−1 ≈ Locrian.
	</p>
</div>

<div class="definition">
	<div class="def-label">Definition 8 — Accidentals</div>
	<p>
		An <strong>accidental</strong> is a displacement of a scale note by one or more chroma 
		vectors <var>c</var> = <var>L</var> − <var>s</var>. Adding a chroma raises a note by one 
		"sharp" (♯); subtracting one lowers it by one "flat" (♭).
	</p>
	<p>
		The accidental count of any lattice node is determined by its position relative to the 
		scale: specifically, by its generator-chain coordinate modulo the scale size <var>n</var><sub>0</sub> 
		(= <var>n</var> / gcd(<var>a</var>,<var>b</var>)).
	</p>
</div>

<p>
	Accidentals generalize perfectly to non-diatonic MOS scales. A Porcupine[8] scale has its 
	own chroma vector with its own meaning — "sharp" and "flat" are structural operations 
	on the lattice, not specific pitch adjustments.
</p>

<h2 id="mappings">8. Lattice Transformations and MOS Mapping</h2>

<p>
	The set of invertible linear maps from ℤ² to itself forms the group <strong>GL(2, ℤ)</strong> — 
	the group of 2×2 integer matrices with determinant ±1. These are precisely the 
	<strong>basis changes</strong> of the lattice: each one maps every basis to another basis 
	and preserves the lattice structure (every node maps to a unique node, and every node is hit).
</p>

<div class="theorem">
	<div class="thm-label">Theorem 3 — Lattice-Preserving Maps</div>
	<p>
		A linear map <var>M</var>: ℤ² → ℤ² is a lattice automorphism (bijection preserving the 
		integer lattice) if and only if <var>M</var> ∈ GL(2, ℤ), i.e., <var>M</var> is a 2×2 
		integer matrix with det(<var>M</var>) = ±1.
	</p>
</div>

<p>
	This has a powerful consequence for MOS scales: we can <strong>map between different 
	MOS structures</strong> using GL(2, ℤ) transformations. Given two MOS scales with step 
	bases {'{'}<var>L</var><sub>1</sub>, <var>s</var><sub>1</sub>{'}'} and 
	{'{'}<var>L</var><sub>2</sub>, <var>s</var><sub>2</sub>{'}'}, the map that sends 
	<var>L</var><sub>1</sub> → <var>L</var><sub>2</sub> and <var>s</var><sub>1</sub> → <var>s</var><sub>2</sub> 
	is an element of GL(2, ℤ). This map establishes a structural correspondence between the two 
	scale systems — every node in one lattice maps uniquely to a node in the other.
</p>
<p>
	Crucially, this mapping operates purely at the structural level. It does not require that 
	the tuning maps of the two systems are compatible. In particular, a vector that corresponds 
	to a positive frequency interval in one MOS may correspond to a negative one in another — 
	this is perfectly valid structurally, since the lattice itself carries no frequency information. 
	The constraint that <var>f</var>(<var>L</var>) &gt; 0 and <var>f</var>(<var>s</var>) &gt; 0 
	belongs to the tuning, not to the structure.
</p>

<div class="part-header">Part II — Tuning</div>

<h2 id="tuning">9. The Tuning Map</h2>

<p>
	So far, everything has been purely combinatorial — lattice vectors, scale paths, intervals, 
	modes, and accidentals, all defined without reference to pitch or frequency. We now connect 
	the lattice to audible music by introducing the <strong>tuning map</strong>.
</p>

<div class="definition">
	<div class="def-label">Definition 9 — Tuning Map</div>
	<p>
		A <strong>tuning map</strong> is a linear function <var>f</var>: ℤ² → ℝ that assigns a 
		<strong>log-frequency</strong> (in cents, or equivalently log₂ of frequency ratio × 1200) 
		to each lattice node. Linearity means:
	</p>
	<div class="formula">
		<var>f</var>(<var>a</var><var>e</var><sub>1</sub> + <var>b</var><var>e</var><sub>2</sub>) 
		= <var>a</var> · <var>f</var>(<var>e</var><sub>1</sub>) + <var>b</var> · <var>f</var>(<var>e</var><sub>2</sub>)
	</div>
	<p>
		A tuning map is <strong>uniquely determined</strong> by specifying <var>f</var>(<var>e</var><sub>1</sub>) 
		and <var>f</var>(<var>e</var><sub>2</sub>) for any basis {'{'}<var>e</var><sub>1</sub>, <var>e</var><sub>2</sub>{'}'}.
	</p>
</div>

<p>
	The tuning map is what separates different tunings that share the same MOS structure. For a 
	5L+2s diatonic scale:
</p>
<ul>
	<li>Specifying <var>f</var>(<var>L</var>) = 200¢ and <var>f</var>(<var>s</var>) = 100¢ gives <strong>12-TET</strong></li>
	<li>Specifying <var>f</var>(<var>L</var>) = 203.91¢ and <var>f</var>(<var>s</var>) = 90.22¢ gives <strong>Pythagorean</strong></li>
	<li>Specifying <var>f</var>(<var>L</var>) = 193.16¢ and <var>f</var>(<var>s</var>) = 117.11¢ gives <strong>quarter-comma meantone</strong></li>
</ul>
<p>
	All three produce the same scale <em>structure</em> — the same intervals, modes, accidentals, 
	and lattice relationships. They differ only in the specific cent values assigned to each node. 
	Structure and tuning are <strong>orthogonal</strong>.
</p>

<div class="theorem">
	<div class="thm-label">Theorem 4 — Tuning from Any Basis</div>
	<p>
		Since the tuning map is linear and ℤ² has many bases, specifying <var>f</var> on 
		<em>any</em> basis determines it everywhere. Common choices:
	</p>
	<ul>
		<li><strong>Step basis</strong>: specify <var>f</var>(<var>L</var>) and <var>f</var>(<var>s</var>) 
			— directly gives step sizes</li>
		<li><strong>Generator–period basis</strong>: specify <var>f</var>(<var>v<sub>g</sub></var>) and 
			<var>f</var>(<var>v<sub>p</sub></var>) — gives generator and period sizes. The 
			<strong>generator ratio</strong> <var>γ</var> = <var>f</var>(<var>v<sub>g</sub></var>) / <var>f</var>(<var>v<sub>p</sub></var>) 
			is PitchGrid's primary tuning parameter.</li>
	</ul>
</div>

<p>
	The tuning map also determines which of the two step types is "large" and which is "small" 
	in pitch: we label them so that <var>f</var>(<var>L</var>) &gt; <var>f</var>(<var>s</var>) &gt; 0. 
	This is a convention imposed by the tuning, not by the lattice structure itself.
</p>

<h2 id="examples">10. Tuning Examples</h2>

<h3>10.1 Pythagorean Tuning (5L + 2s, <var>g</var> = 701.96¢)</h3>
<p>
	The just fifth (ratio 3:2 = 701.96¢) produces the historical Pythagorean tuning. Under 
	the tuning map: <var>f</var>(<var>L</var>) = 203.91¢ (Pythagorean whole tone), 
	<var>f</var>(<var>s</var>) = 90.22¢ (Pythagorean limma), 
	<var>f</var>(<var>c</var>) = 113.69¢ (Pythagorean apotome). Pythagorean tuning produces 
	pure fifths but wide major thirds (407.82¢ vs. the just 386.31¢).
</p>

<h3>10.2 Quarter-Comma Meantone (5L + 2s, <var>g</var> = 696.58¢)</h3>
<p>
	By narrowing the fifth by ¼ of the syntonic comma, meantone achieves pure major thirds 
	(386.31¢) at the cost of slightly impure fifths. Same lattice structure as Pythagorean — 
	same intervals, same modes, same accidentals — only the tuning map changes.
</p>

<h3>10.3 Bohlen–Pierce (5L + 4s, equave = tritave)</h3>
<p>
	Bohlen–Pierce replaces the octave (2:1) with the <strong>tritave</strong> (3:1, ≈1902¢) 
	as the equave. Its generator produces a 5L + 4s MOS at depth 4 — a 9-note scale within 
	the tritave. The lattice structure is different from diatonic (5+4 vs. 5+2), giving it 
	its own distinct interval system, modes, and accidentals. When paired with odd-harmonic 
	timbres, it produces a convincingly consonant tonal system — as demonstrated in our 
	<a href="/research/consonance">consonance study</a>.
</p>

<h3>10.4 Porcupine[8] (1L + 7s)</h3>
<p>
	Porcupine temperament uses a generator near 163¢ (a neutral second). At depth 6, it 
	produces 1 large step and 7 small steps — 8 notes per octave. The extreme asymmetry 
	(1L vs 7s) produces a nearly equal-spaced scale with one "gap." Its consonance properties 
	depend critically on timbre.
</p>

<h3>10.5 Slendric[11] (5L + 6s)</h3>
<p>
	Slendric temperament produces an 11-note MOS with 5 large and 6 small steps. With nearly 
	equal step sizes, it evokes Javanese slendro scales. The 11-note cardinality gives it a 
	rich interval set with 35 distinct intervals up to 1950¢.
</p>

<h2 id="three-gap">11. The Three-Gap Theorem</h2>

<p>
	The MOS construction is intimately connected to the <strong>three-gap theorem</strong> 
	(Steinhaus conjecture, proved by Sós 1958): when <var>n</var> points are placed on a 
	circle at separations of an irrational fraction of the circumference, the gaps between 
	consecutive points take at most three distinct values — and if there are three, one is 
	the sum of the other two.
</p>

<div class="theorem">
	<div class="thm-label">Theorem 5 — Three-Gap Theorem (Sós, 1958)</div>
	<p>
		Let <var>α</var> ∈ (0, 1) be irrational and <var>n</var> ≥ 1. Place points at 
		positions {'{'} <var>k</var> · <var>α</var> mod 1 : <var>k</var> = 0, …, <var>n</var>−1 {'}'} 
		on the unit circle. The gaps between consecutive points take at most three distinct 
		lengths. If exactly three lengths occur, one equals the sum of the other two.
	</p>
</div>

<p>
	MOS scales are precisely the case where exactly <strong>two</strong> gap lengths occur. 
	This happens at cardinalities that are denominators of convergents or semiconvergents 
	of the continued fraction expansion of <var>γ</var>. The depth parameter in PitchGrid 
	indexes these special cardinalities.
</p>
<p>
	Between two consecutive MOS cardinalities, the scale has three step sizes — these are 
	the transitional "non-MOS" scales that PitchGrid traverses when depth varies continuously.
</p>

<h2 id="design-space">12. The Design Space</h2>

<p>
	The rank-2 MOS framework reveals that the diatonic scale is one point in a vast 
	<strong>design space</strong> of tonal structures, parameterized by:
</p>
<ul>
	<li><strong>Generator ratio</strong> <var>γ</var> ∈ (0, 1): determines the MOS family. 
		<var>γ</var> ≈ 7/12 gives diatonic; other values give Porcupine, Slendric, Mavila, 
		and hundreds of other temperament families.</li>
	<li><strong>Depth</strong> <var>d</var> ∈ ℕ: determines cardinality. For diatonic generators: 
		depth 2 → pentatonic (5 notes), depth 3 → diatonic (7), depth 4 → chromatic (12).</li>
	<li><strong>Equave</strong>: the interval of equivalence. Octave (2:1) is standard; 
		tritave (3:1), or other values produce radically different tonal worlds.</li>
	<li><strong>Mode</strong> <var>m</var> ∈ {'{'} 0, …, <var>n</var>−1 {'}'}: governs the 
		bright/dark character of the scale.</li>
	<li><strong>Tuning map</strong> <var>f</var>: assigns specific frequencies to the structure, 
		independently of all the above.</li>
</ul>
<p>
	Every point in this space defines a complete tonal system with its own intervals, modes, 
	accidentals, and structural relationships — and for each structure, infinitely many 
	tunings are possible. The consonance properties of each system depend on the interaction 
	between the scale's intervals (determined by the structure + tuning) and the timbre's 
	partial structure — as analyzed quantitatively in our 
	<a href="/research/consonance">spiky consonance study</a>.
</p>
<p>
	The research question that PitchGrid ultimately poses is: <em>what do these alternative 
	tonal architectures sound like?</em> With the tools developed here — parametric scale 
	construction, generalized interval naming, continuous tuning control, lattice algebra, 
	and quantitative consonance analysis — this question can now be explored systematically.
</p>

<h2 id="references">13. References</h2>

<ol class="references">
	<li>Wilson, E. (1975). "Letter to Chalmers pertaining to Moments of Symmetry." 
		Published at anaphoria.com.</li>
	<li>Carey, N. &amp; Clampitt, D. (1989). "Aspects of Well-Formed Scales." 
		<em>Music Theory Spectrum</em>, 11(2), 187–206.</li>
	<li>Clough, J. &amp; Douthett, J. (1991). "Maximally Even Sets." 
		<em>Journal of Music Theory</em>, 35(1/2), 93–173.</li>
	<li>Sós, V. T. (1958). "On the distribution mod 1 of the sequence <em>nα</em>." 
		<em>Annales Universitatis Scientiarum Budapestinensis de Rolando Eötvös Nominatae, 
		Sectio Mathematica</em>, 1, 127–134.</li>
	<li>Erlich, P. (1997). "Tuning, tonality, and twenty-two-tone temperament." 
		<em>Xenharmonikôn</em>, 17.</li>
	<li>Milne, A. J., Sethares, W. A. &amp; Plamondon, J. (2007). "Isomorphic controllers and 
		dynamic tuning." <em>Computer Music Journal</em>, 31(4), 15–32.</li>
	<li>Bohlen, H. (1978). "13 Tonstufen in der Duodezime." <em>Acustica</em>, 39(2), 76–86.</li>
	<li>Sethares, W. A. (2005). <em>Tuning, Timbre, Spectrum, Scale</em> (2nd ed.). Springer.</li>
</ol>

</div>
