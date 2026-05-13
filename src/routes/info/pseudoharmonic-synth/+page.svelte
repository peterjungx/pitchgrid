<script>
	import { onMount } from 'svelte';
</script>

<svelte:head>
	<title>PseudoHarmonic Synth — User Guide | PitchGrid</title>
</svelte:head>

<div class="manual-page">
	<h1>PseudoHarmonic Synth</h1>
	<p class="lead">Additive synthesis with prime-factor stretching. Real-time consonance visualization that shows you exactly which tunings fit your sound.</p>

	<section>
		<h2>What it is</h2>
		<p>
			Instead of fixed harmonics, every partial's frequency is shaped by stretching the prime factors (2, 3, 5, 7) independently. 
			Change the stretch values and the entire harmonic series warps — creating rich, controllable inharmonic timbres while keeping musical structure.
		</p>
		<p>
			The big spectrum display shows the current partials with their just-intonation ratios. The red dashed line is the live Plomp-Levelt consonance curve. 
			Watch it move as you turn knobs — this is the direct visual link between timbre and tuning.
		</p>
	</section>

	<section>
		<h2>Core Controls</h2>
		
		<h3>Spectrum (the four stretches)</h3>
		<ul>
			<li><strong>2ND, 3RD, 5TH, 7TH</strong> — Stretch the corresponding prime partials. Default = pure harmonics (2.0 / 3.0 / 5.0 / 7.0). Higher or lower values create structured inharmonicity.</li>
			<li><strong>WARP</strong> — Global exponent applied after the prime stretches.</li>
		</ul>

		<h3>Timbre</h3>
		<ul>
			<li><strong>STRIKE / STRIKE POS</strong> — Impact strength and position on the "string".</li>
			<li><strong>ODD/EVEN</strong> — Balance between odd and even partials.</li>
			<li><strong>NOISE</strong> — Adds noise component to the attack.</li>
		</ul>

		<h3>Envelope</h3>
		<ul>
			<li><strong>DECAY / SUSTAIN / RELEASE</strong> — Classic ADSR-style controls.</li>
			<li><strong>ONSET PITCH / SETTLE</strong> — How much the pitch glides at the beginning of the note.</li>
		</ul>

		<h3>Consonance</h3>
		<ul>
			<li><strong>PARTIALS</strong> — How many partials contribute to the consonance calculation.</li>
			<li><strong>LOG BASE</strong> — Changes the visual scaling of the consonance curve.</li>
		</ul>
	</section>

	<section>
		<h2>Follow Tuning (OSC)</h2>
		<p>
			Enable "Follow Tuning" and the synth listens on OSC port 9000. When you change scale or root in PitchGrid Mapper, 
			the synth retunes its reference so the consonance curve stays meaningful for the current MOS scale. 
			This is the direct bridge between the Mapper and the synth.
		</p>
	</section>

	<section>
		<h2>MTS-ESP</h2>
		<p>
			Full MTS-ESP client support. Drop it after any MTS-ESP master (including the PitchGrid Plugin) and it will follow tuning in real time.
			The dropdown at the top shows the current MTS source.
		</p>
	</section>

	<section>
		<h2>Tips for exploration</h2>
		<ul>
			<li>Start with small deviations from the defaults (e.g. 2.1 instead of 2.0) — the changes are very musical.</li>
			<li>Watch the consonance curve while you play. The peaks tell you which intervals will sound clean on this timbre.</li>
			<li>Try stretching only the 5th and 7th while keeping 2 and 3 pure — you get "pseudo-just" timbres that still feel familiar.</li>
			<li>Use the synth as a research tool: load a scale in the Mapper, enable Follow Tuning, then explore which stretch values make the consonance curve line up with the scale steps.</li>
		</ul>
	</section>

	<div class="cta-row">
		<a href="https://github.com/pitchgrid-io/pseudoharmonic-synth/releases" class="btn" target="_blank">Download v0.3.1</a>
		<a href="https://github.com/pitchgrid-io/pseudoharmonic-synth" class="btn btn-secondary" target="_blank">View on GitHub</a>
	</div>
</div>

<style>
	.manual-page {
		max-width: 820px;
		margin: 0 auto;
		padding: 2rem;
		line-height: 1.7;
	}
	.lead {
		font-size: 1.2rem;
		color: #b0b0b0;
		margin-bottom: 2rem;
	}
	h2 {
		margin-top: 2.5rem;
		color: #FFAB00;
	}
	.cta-row {
		margin-top: 3rem;
		display: flex;
		gap: 1rem;
	}
</style>