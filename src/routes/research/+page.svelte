<svelte:head>
	<title>Research — PitchGrid</title>
</svelte:head>

<style>
	.research-index {
		max-width: 900px;
		margin: 0 auto;
		padding: 4rem 2rem;
	}

	h1 {
		color: #FFAB00;
		font-size: 2.5rem;
		margin-bottom: 1rem;
	}

	.subtitle {
		color: #aaa;
		font-size: 1.15rem;
		margin-bottom: 3rem;
		line-height: 1.7;
	}

	.paper-card {
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 171, 0, 0.2);
		border-radius: 12px;
		padding: 2rem;
		transition: border-color 0.3s ease, background 0.3s ease;
	}

	.paper-card:hover {
		border-color: rgba(255, 171, 0, 0.5);
		background: rgba(255, 255, 255, 0.06);
	}

	.paper-card h2 {
		margin: 0 0 0.5rem 0;
		font-size: 1.4rem;
	}

	.paper-card h2 a {
		color: #e0e0e0;
	}

	.paper-card h2 a:hover {
		color: #FFAB00;
		text-decoration: none;
	}

	.paper-meta {
		color: #888;
		font-size: 0.9rem;
		margin-bottom: 1rem;
	}

	.paper-abstract {
		color: #bbb;
		font-size: 0.95rem;
		line-height: 1.7;
	}
</style>

<div class="research-index">
	<h1>Research</h1>
	<p class="subtitle">
		Technical articles on the theory and algorithms behind PitchGrid.
	</p>

	<div class="paper-card" style="margin-bottom: 2rem;">
		<h2><a href="/research/mos-theory">The Two-Dimensional Structure of Musical Scales</a></h2>
		<p class="paper-meta">Peter Jung · February 2026</p>
		<p class="paper-abstract">
			Western music theory implicitly treats scales as one-dimensional objects. Yet the 
			structure that gives rise to keys, modes, accidentals, and the circle of fifths is 
			inherently two-dimensional. This article formalizes this observation using rank-2 
			regular temperaments and Moments of Symmetry (MOS) scales, shows that the diatonic 
			scale is one instance of a vast family of two-dimensional tonal structures, and develops 
			the mathematical tools needed to navigate this space.
		</p>
	</div>

	<div class="paper-card">
		<h2><a href="/research/consonance">The PitchGrid Spiky Consonance Measure</a></h2>
		<p class="paper-meta">Peter Jung · February 2026</p>
		<p class="paper-abstract">
			We present a novel, timbre-aware measure of musical consonance derived from Plomp-Levelt 
			sensory dissonance curves. By extracting a hull curve and computing the residual "spiky" 
			consonance signal, the measure quantifies consonance on a perceptually meaningful 0–1 scale. 
			We validate it across 12-TET, Pythagorean, quarter-comma meantone, and Bohlen-Pierce tuning 
			systems, showing it correctly captures historical tuning preferences and the dependence of 
			consonance on both interval structure and spectral content.
		</p>
	</div>
</div>
