<style>
	/* Hero Section */
	.hero {
		background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f1419 100%);
		padding: 6rem 0 4rem;
		text-align: center;
		position: relative;
		overflow: hidden;
	}

	.hero::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: url('/docs/images/PitchGrid-Basic-CMajor.png') center/contain no-repeat;
		opacity: 0.1;
		z-index: 1;
	}

	.hero-content {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 2rem;
		position: relative;
		z-index: 2;
	}

	.hero-claim {
		font-size: 2.5rem;
		font-weight: 700;
		margin-bottom: 1.5rem;
		color: #ffffff;
		line-height: 1.2;
	}

	.hero-subtext {
		font-size: 1.25rem;
		color: #b0b0b0;
		margin-bottom: 2.5rem;
		max-width: 700px;
		margin-left: auto;
		margin-right: auto;
		line-height: 1.6;
	}

	.hero-subtext em {
		color: #FFAB00;
		font-style: normal;
	}

	.hero-cta-group {
		display: flex;
		gap: 1rem;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		margin-bottom: 3rem;
	}

	.hero-cta {
		display: inline-block;
		background: linear-gradient(135deg, #FFAB00, #FFCC40);
		color: #1a1a2e;
		padding: 1rem 2rem;
		border-radius: 50px;
		font-weight: 600;
		font-size: 1.1rem;
		text-decoration: none;
		transition: all 0.3s ease;
		box-shadow: 0 4px 15px rgba(255, 171, 0, 0.3);
	}

	.hero-cta:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(255, 171, 0, 0.4);
		color: #1a1a2e;
	}

	.hero-cta-secondary {
		display: inline-block;
		background: transparent;
		border: 2px solid rgba(255, 171, 0, 0.5);
		color: #FFAB00;
		padding: 0.9rem 2rem;
		border-radius: 50px;
		font-weight: 600;
		font-size: 1.1rem;
		text-decoration: none;
		transition: all 0.3s ease;
	}

	.hero-cta-secondary:hover {
		border-color: #FFAB00;
		background: rgba(255, 171, 0, 0.1);
		transform: translateY(-2px);
		color: #FFAB00;
	}

	.hero-screenshot {
		max-width: 720px;
		width: 100%;
		margin: 0 auto;
		display: block;
	}

	.hero-screenshot img {
		width: 100%;
		height: auto;
		border-radius: 12px;
		box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5), 0 0 60px rgba(255, 171, 0, 0.1);
	}

	/* Container */
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 2rem;
	}

	.section {
		padding: 4rem 0;
	}

	.section h2 {
		font-size: 2.5rem;
		color: #ffffff;
		text-align: center;
		margin-bottom: 1.5rem;
		font-weight: 600;
	}

	.section-intro {
		font-size: 1.15rem;
		color: #b0b0b0;
		max-width: 800px;
		margin: 0 auto 3rem;
		text-align: center;
		line-height: 1.7;
	}

	.section-intro em {
		color: #FFAB00;
		font-style: normal;
	}

	/* Insight Section */
	.insight-section {
		background: rgba(255, 171, 0, 0.05);
		border-radius: 12px;
		padding: 3rem;
		text-align: center;
	}

	.insight-text {
		font-size: 1.2rem;
		color: #d0d0d0;
		max-width: 800px;
		margin: 0 auto;
		line-height: 1.8;
	}

	.insight-text p {
		margin-bottom: 1.5rem;
	}

	.insight-text strong {
		color: #ffffff;
	}

	/* Feature Cards */
	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 2rem;
		margin: 2rem 0;
	}

	.feature-card {
		background: linear-gradient(135deg, #2a2a4e 0%, #1f1f3a 100%);
		border: 1px solid rgba(255, 171, 0, 0.2);
		border-radius: 12px;
		padding: 2rem;
		text-align: center;
		transition: all 0.3s ease;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
	}

	.feature-card:hover {
		transform: translateY(-5px);
		border-color: #FFAB00;
		box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
	}

	.feature-icon {
		font-size: 3rem;
		color: #FFAB00;
		margin-bottom: 1rem;
		display: block;
	}

	.feature-card h3 {
		color: #ffffff;
		font-size: 1.3rem;
		margin-bottom: 1rem;
		font-weight: 600;
	}

	.feature-card p {
		color: #b0b0b0;
		margin-bottom: 1.5rem;
		line-height: 1.6;
	}

	.feature-card .btn {
		display: inline-block;
		background: rgba(255, 171, 0, 0.1);
		border: 1px solid #FFAB00;
		color: #FFAB00;
		padding: 0.75rem 1.5rem;
		border-radius: 25px;
		text-decoration: none;
		font-weight: 500;
		transition: all 0.3s ease;
	}

	.feature-card .btn:hover {
		background: #FFAB00;
		color: #1a1a2e;
	}

	.feature-card .btn-secondary {
		background: transparent;
		border-color: rgba(255, 171, 0, 0.5);
		margin-left: 0.5rem;
	}

	.feature-card .btn-secondary:hover {
		background: rgba(255, 171, 0, 0.1);
		border-color: #FFAB00;
		color: #FFAB00;
	}

	.features-grid-small {
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		max-width: 900px;
		margin: 0 auto;
	}

	/* Product Showcase */
	.product-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
		gap: 3rem;
		margin-bottom: 3rem;
	}

	.product-item {
		background: linear-gradient(135deg, #2a2a4e 0%, #1f1f3a 100%);
		border: 1px solid rgba(255, 171, 0, 0.2);
		border-radius: 16px;
		padding: 2rem;
		text-align: center;
	}

	.product-screenshot {
		margin-bottom: 1.5rem;
	}

	.product-screenshot img {
		width: 100%;
		max-width: 100%;
		height: auto;
		border-radius: 8px;
		box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
	}

	.product-item h3 {
		color: #ffffff;
		font-size: 1.4rem;
		margin-bottom: 1rem;
	}

	.product-item p {
		color: #b0b0b0;
		line-height: 1.7;
		margin-bottom: 1.5rem;
	}

	.product-item p strong {
		color: #FFAB00;
	}

	.product-item .btn {
		display: inline-block;
		background: rgba(255, 171, 0, 0.1);
		border: 1px solid #FFAB00;
		color: #FFAB00;
		padding: 0.75rem 1.5rem;
		border-radius: 25px;
		text-decoration: none;
		font-weight: 500;
		transition: all 0.3s ease;
		margin: 0.25rem;
	}

	.product-item .btn:hover {
		background: #FFAB00;
		color: #1a1a2e;
	}

	.product-item .btn-secondary {
		background: transparent;
		border-color: rgba(255, 171, 0, 0.5);
	}

	.product-item .btn-secondary:hover {
		background: rgba(255, 171, 0, 0.1);
		border-color: #FFAB00;
		color: #FFAB00;
	}

	/* Validation Section */
	.validation-box {
		background: rgba(255, 171, 0, 0.08);
		border: 1px solid rgba(255, 171, 0, 0.3);
		border-radius: 12px;
		padding: 2.5rem 3rem;
		max-width: 800px;
		margin: 0 auto;
		text-align: center;
	}

	.validation-box h3 {
		color: #FFAB00;
		font-size: 1.4rem;
		margin-bottom: 1rem;
	}

	.validation-box p {
		color: #d0d0d0;
		line-height: 1.7;
		margin: 0;
		font-size: 1.05rem;
	}

	/* Audience Section */
	.audience-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
		gap: 2rem;
		max-width: 900px;
		margin: 0 auto;
	}

	.audience-card {
		background: rgba(26, 26, 46, 0.5);
		border-radius: 12px;
		padding: 2rem;
	}

	.audience-card h3 {
		color: #ffffff;
		font-size: 1.1rem;
		margin-bottom: 1rem;
	}

	.audience-card ul {
		margin: 0;
		padding-left: 1.25rem;
		color: #b0b0b0;
	}

	.audience-card li {
		margin-bottom: 0.75rem;
		line-height: 1.5;
	}

	.audience-yes {
		border: 1px solid rgba(100, 200, 100, 0.3);
	}

	.audience-yes h3 {
		color: #7dce7d;
	}

	.audience-maybe {
		border: 1px solid rgba(255, 171, 0, 0.3);
	}

	.audience-maybe h3 {
		color: #FFAB00;
	}

	/* Concept Image */
	.concept-image {
		margin: 2rem auto;
		display: block;
		max-width: 400px;
		width: 100%;
		height: auto;
		border-radius: 12px;
		box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
	}

	/* Music Section */
	.music-section {
		background: rgba(255, 171, 0, 0.05);
		border-radius: 12px;
		padding: 3rem;
	}

	.music-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
	}

	.music-item {
		background: rgba(26, 26, 46, 0.5);
		border: 1px solid rgba(255, 171, 0, 0.3);
		border-radius: 8px;
		padding: 1.5rem;
	}

	.music-item h4 {
		color: #FFAB00;
		margin-bottom: 1rem;
		font-size: 1.1rem;
	}

	.music-item ul {
		margin: 0;
		padding-left: 1.5rem;
	}

	.music-item li {
		margin-bottom: 0.5rem;
	}

	/* Videos Section */
	.videos-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
		gap: 2rem;
	}

	.video-item {
		background: rgba(26, 26, 46, 0.5);
		border: 1px solid rgba(255, 171, 0, 0.3);
		border-radius: 8px;
		padding: 1.5rem;
		text-align: center;
	}

	.video-item h4 {
		color: #ffffff;
		margin-bottom: 1rem;
	}

	.video-placeholder {
		background: rgba(255, 171, 0, 0.1);
		border: 2px dashed #FFAB00;
		border-radius: 8px;
		padding: 2rem;
		margin-bottom: 1rem;
		color: #FFAB00;
		font-size: 3rem;
	}

	/* Theory Section */
	.theory-section {
		background: rgba(26, 26, 46, 0.3);
		border-radius: 12px;
		padding: 3rem;
		text-align: center;
	}

	.theory-section .btn-large {
		display: inline-block;
		background: linear-gradient(135deg, #FFAB00, #FFCC40);
		color: #1a1a2e;
		padding: 1.25rem 2.5rem;
		border-radius: 50px;
		font-weight: 600;
		font-size: 1.2rem;
		text-decoration: none;
		transition: all 0.3s ease;
		box-shadow: 0 4px 15px rgba(255, 171, 0, 0.3);
	}

	.theory-section .btn-large:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(255, 171, 0, 0.4);
		color: #1a1a2e;
	}

	/* Events Section */
	.events-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
		gap: 2rem;
	}

	.event-card {
		background: linear-gradient(135deg, #2a2a4e 0%, #1f1f3a 100%);
		border: 1px solid rgba(255, 171, 0, 0.2);
		border-radius: 12px;
		padding: 2rem;
		transition: all 0.3s ease;
	}

	.event-card:hover {
		border-color: #FFAB00;
		transform: translateY(-2px);
	}

	.event-card h4 {
		color: #FFAB00;
		margin-bottom: 1rem;
		font-size: 1.2rem;
	}

	/* Source Code Section */
	.source-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
	}

	.source-item {
		background: rgba(26, 26, 46, 0.5);
		border: 1px solid rgba(255, 171, 0, 0.3);
		border-radius: 8px;
		padding: 1.5rem;
	}

	.source-item h4 {
		color: #FFAB00;
		margin-bottom: 0.75rem;
		font-size: 1.1rem;
	}

	/* References Section */
	.references ul {
		list-style: none;
		padding: 0;
	}

	.references li {
		background: rgba(26, 26, 46, 0.5);
		border-left: 4px solid #FFAB00;
		margin-bottom: 1rem;
		padding: 1.5rem;
		border-radius: 0 8px 8px 0;
	}

	/* Pioneer CTA */
	.pioneer-section {
		background: linear-gradient(135deg, rgba(255, 171, 0, 0.15) 0%, rgba(255, 171, 0, 0.05) 100%);
		border: 1px solid rgba(255, 171, 0, 0.3);
		border-radius: 16px;
		padding: 3rem;
		text-align: center;
		max-width: 800px;
		margin: 0 auto;
	}

	.pioneer-section h2 {
		margin-bottom: 1rem;
	}

	.pioneer-section p {
		font-size: 1.15rem;
		color: #d0d0d0;
		line-height: 1.7;
		margin-bottom: 2rem;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.hero-claim {
			font-size: 1.8rem;
		}

		.hero-subtext {
			font-size: 1.1rem;
		}

		.hero-cta-group {
			flex-direction: column;
			align-items: center;
		}

		.hero-screenshot {
			max-width: 95%;
		}

		.container {
			padding: 0 1rem;
		}

		.section {
			padding: 3rem 0;
		}

		.section h2 {
			font-size: 2rem;
		}

		.product-grid {
			grid-template-columns: 1fr;
		}

		.insight-section,
		.music-section,
		.theory-section {
			padding: 2rem;
		}

		.validation-box {
			padding: 2rem;
		}
	}
</style>

<!-- Hero Section -->
<section class="hero">
	<div class="hero-content">
		<h1 class="hero-claim">The tonal structure of Western music is two-dimensional.</h1>
		<p class="hero-subtext">
			The piano hides this. Standard notation encodes it. PitchGrid <em>reveals</em> it — 
			and once you see it, you can play it.
		</p>
		<div class="hero-cta-group">
			<a href="https://node.audio/products/pitchgrid" class="hero-cta" target="_blank">Get PitchGrid Plugin</a>
			<a href="https://github.com/pitchgrid-io/pitchgrid-mapper/releases" class="hero-cta-secondary" target="_blank">Get PitchGrid Mapper</a>
		</div>
		<div class="hero-screenshot">
			<img src="/docs/images/PitchGridPluginUI.png" alt="PitchGrid Plugin — visualizing the two-dimensional structure of music" />
		</div>
	</div>
</section>

<div class="container">
	<!-- The Insight -->
	<section class="section">
		<div class="insight-section">
			<div class="insight-text">
				<p>
					<strong>You already learned two-dimensional music theory. You just couldn't see it.</strong>
				</p>
				<p>
					The notation is 2D — scale degrees on one axis, accidentals on the other. 
					Chord relationships are 2D. Voice leading rules are 2D. 
					The stack-of-fifths construction that gave us the diatonic scale, known since Babylonian times, is intrinsically 2D.
				</p>
				<p>
					But the piano keyboard is one-dimensional. So you learned to <em>think</em> in 1D, 
					projecting everything down onto a line.
				</p>
				<p>
					<strong>PitchGrid unfolds that projection.</strong> What felt like arbitrary rules suddenly makes geometric sense. 
					Modes, keys, transposition, counterpoint — they all still work, but now you can see <em>why</em>.
				</p>
			</div>
		</div>
	</section>

	<!-- Validation -->
	<section class="section">
		<h2>You Knew There Was More</h2>
		<p class="section-intro">
			If you've explored microtonality and felt lost — you're not alone.
		</p>
		<div class="validation-box">
			<h3>The Microtonal Jungle</h3>
			<p>
				Many talented musicians enter the world of alternative tunings hoping to find new sonic territory. 
				Instead, they find disconnected tools, invented notations, debates about EDOs, and an approach 
				completely severed from the Western theory they spent years learning. 
				Their music loses architecture. Eventually, many give up and return to 12-TET.
			</p>
		</div>
		<p class="section-intro" style="margin-top: 2rem;">
			PitchGrid is the map they didn't have. <em>Western theory extended, not abandoned.</em>
		</p>
	</section>

	<!-- The Tools -->
	<section class="section">
		<h2>See It. Play It.</h2>
		<p class="section-intro">
			Two tools that work as one — connecting eyes, fingers, and ears 
			to scales that were previously inaccessible.
		</p>
		
		<div class="product-grid">
			<div class="product-item">
				<div class="product-screenshot">
					<img src="/docs/images/PitchGridPluginUI.png" alt="PitchGrid Plugin UI" />
				</div>
				<h3>🎛️ PitchGrid Plugin</h3>
				<p>
					<strong>See the tuning.</strong> The plugin opens a window into an infinite 2D lattice of pitches. 
					Turn knobs to explore — watch intervals shift, find the sweet spots where ratios align. 
					Modes, transposition, chord relationships: they all still work. 
					Maps to the piano keyboard and DAW piano roll — bridging new tunings with your existing tools.
				</p>
				<a href="https://node.audio/products/pitchgrid" target="_blank" class="btn">Get the Plugin</a>
				<a href="/info/plugin-user-manual" class="btn btn-secondary">User Manual</a>
			</div>
			
			<div class="product-item">
				<div class="product-screenshot">
					<img src="/docs/images/PitchGridMapper-Isomorphic.png" alt="PitchGrid Mapper — Isomorphic Layout" />
				</div>
				<h3>🎹 PitchGrid Mapper</h3>
				<p>
					<strong>Play the tuning.</strong> The Mapper lays out any scale on your 2D controller so the 
					geometry matches the music. Same shape = same interval, anywhere on the grid. 
					Your hands learn what your ears hear.
				</p>
				<a href="https://github.com/pitchgrid-io/pitchgrid-mapper/releases" target="_blank" class="btn">Download Mapper</a>
				<a href="/info/PitchGridMapper" class="btn btn-secondary">Learn More</a>
			</div>
		</div>
		
		<div class="validation-box">
			<h3>Together: A Complete System</h3>
			<p>
				Change a scale in your DAW — your controller layout updates instantly. 
				Explore 5-note, 8-note, 10-note scales, each with modes and transpositions intact. 
				The familiar clichés of Western music — the patterns that make music feel like music — 
				now work in completely new tonal architectures.
			</p>
		</div>
	</section>

	<!-- What's Universal -->
	<section class="section">
		<h2>What Still Works</h2>
		<p class="section-intro">
			PitchGrid doesn't throw away what you learned. It separates what's <em>truly universal</em> 
			from what's just a side effect of 12-tone equal temperament.
		</p>
		<img src="/docs/images/PitchGrid-Basic-CMajor.png" alt="PitchGrid Basic C-Major" class="concept-image" />
		<div class="audience-grid">
			<div class="audience-card audience-yes">
				<h3>✓ These still work:</h3>
				<ul>
					<li>Modes and modal interchange</li>
					<li>Keys and key relationships</li>
					<li>Functional tonality</li>
					<li>Voice leading and counterpoint</li>
					<li>Scale degree + accidental notation</li>
				</ul>
			</div>
			<div class="audience-card audience-maybe">
				<h3>↻ These are 12-TET specific:</h3>
				<ul>
					<li>Circle of fifths closing after 12 steps (in general, it's a spiral)</li>
					<li>The semitone as fundamental unit</li>
					<li>Conflating "small step" with "chromatic alteration"</li>
					<li>Enharmonic equivalence (C♯ = D♭)</li>
				</ul>
			</div>
		</div>
	</section>

	<!-- Who Is This For -->
	<section class="section">
		<h2>Who Is PitchGrid For?</h2>
		<div class="audience-grid">
			<div class="audience-card audience-yes">
				<h3>✓ PitchGrid is for you if:</h3>
				<ul>
					<li>You've tried microtonality and felt lost in the xenharmonic jungle</li>
					<li>You want new sounds without abandoning the theory you know</li>
					<li>You play an isomorphic controller and want to explore new tunings</li>
					<li>You're a composer looking for fresh harmonic territory</li>
					<li>You want to understand <em>why</em> Western music theory works</li>
				</ul>
			</div>
			<div class="audience-card audience-maybe">
				<h3>? You might want something else if:</h3>
				<ul>
					<li>You want to auto-tune existing recordings</li>
					<li>You're happy managing thousands of individual tuning files</li>
					<li>You're not ready to invest time learning new concepts</li>
				</ul>
			</div>
		</div>
	</section>

	<!-- The Honest Truth -->
	<section class="section">
		<div class="pioneer-section">
			<h2>The Honest Truth</h2>
			<p>
				There is no corpus yet. No cultural memory of melodies in these tunings. 
				No standards to learn, no covers to play. The promised land exists — but it's waiting for settlers.
			</p>
			<p>
				<strong>The first great works in these tunings haven't been written yet. Maybe you'll write them.</strong>
			</p>
			<a href="https://node.audio/products/pitchgrid" class="hero-cta" target="_blank">Start Exploring</a>
		</div>
	</section>

	<!-- More Tools Section -->
	<section class="section">
		<h2>More Tools</h2>
		<div class="features-grid features-grid-small">
			<div class="feature-card">
				<span class="feature-icon">🌐</span>
				<h3>Online Tools</h3>
				<p>Interactive web apps for exploring scales and tuning systems — no install required.</p>
				<a href="/diatonic" class="btn">Explore Tools</a>
			</div>

			<div class="feature-card">
				<span class="feature-icon">🗺️</span>
				<h3>Scale Mapper</h3>
				<p>Visualize and explore regular scale systems with advanced mapping algorithms.</p>
				<a href="/scalemapper" class="btn">Open Mapper</a>
			</div>
			
			<div class="feature-card">
				<span class="feature-icon">🥁</span>
				<h3>PGRhythm</h3>
				<p>Parametric MIDI sequencer extending PitchGrid concepts to rhythm.</p>
				<a href="https://github.com/peterjungx/pgrhythm" target="_blank" class="btn">View on GitHub</a>
			</div>
		</div>
	</section>

	<!-- Theory Section -->
	<section class="section">
		<div class="theory-section">
			<h2>The Math Behind It (Optional)</h2>
			<p style="font-size: 1.1rem; color: #b0b0b0; margin-bottom: 2rem;">
				Want to understand why this works? The theory is there if you want it — but you don't need it to play.
			</p>
			<a href="/info/PitchGrid" class="btn-large">Read the PitchGrid Concept</a>
		</div>
	</section>

	<!-- Music Section (commented out - works too minuscule for scope)
	<section class="section">
		<h2>Music Created with PitchGrid</h2>
		<div class="music-section">
			<p style="text-align: center; font-size: 1.1rem; margin-bottom: 2rem; color: #b0b0b0;">
				Early explorers are already making music in these new territories
			</p>
			<div class="music-grid">
				<div class="music-item">
					<h4>Featured Tracks</h4>
					<ul>
						<li>
							<a href="https://beatsbasteln.bandcamp.com/track/tranquil-9-5in17" target="_blank">
								"Tranquil 9&5in17" by Beats Basteln
							</a>
						</li>
					</ul>
				</div>
				
				<div class="music-item">
					<h4>SoundCloud Playlist</h4>
					<ul>
						<li>
							<a href="https://soundcloud.com/peter-jung-119529179/sets/pitchgrid" target="_blank">
								PitchGrid Collection
							</a>
						</li>
						<li>
							<a href="https://soundcloud.com/forrest-fang/forrest-fang-harmonic-perch" target="_blank">
								"Harmonic Perch" by Forrest Fang
							</a>
						</li>
						<li>
							<a href="https://soundcloud.com/western-sub/unseen-footage" target="_blank">
								"Unseen footage" by Western Sub
							</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</section>
	-->

	<!-- Videos Section -->
	<section class="section">
		<h2>Videos & Demonstrations</h2>
		<div class="videos-grid">
			<!-- Microtonality on the Exquis - commented out, will add Plugin+Mapper videos later
			<div class="video-item">
				<a href="https://youtu.be/nl94-T3geNw" target="_blank">
					<img src="https://img.youtube.com/vi/nl94-T3geNw/hqdefault.jpg" alt="Microtonality on the Exquis" style="width: 100%; border-radius: 8px; margin-bottom: 1rem;" />
				</a>
				<h4>Microtonality on the Exquis</h4>
				<p style="color: #b0b0b0; margin-bottom: 1rem;">
					The MicroExquis VCV Rack module in action.
				</p>
			</div>
			-->
			
			<div class="video-item">
				<a href="https://youtu.be/8jzrObegsr0" target="_blank">
					<img src="https://img.youtube.com/vi/8jzrObegsr0/hqdefault.jpg" alt="PitchGrid Plugin Introduction" style="width: 100%; border-radius: 8px; margin-bottom: 1rem;" />
				</a>
				<h4>PitchGrid Plugin Introduction</h4>
				<p style="color: #b0b0b0; margin-bottom: 1rem;">
					Getting started with the PitchGrid plugin.
				</p>
			</div>

			<div class="video-item">
				<a href="https://www.youtube.com/watch?v=milhWLX0McU" target="_blank">
					<img src="https://img.youtube.com/vi/milhWLX0McU/hqdefault.jpg" alt="Now and Xen Podcast: PitchGrid" style="width: 100%; border-radius: 8px; margin-bottom: 1rem;" />
				</a>
				<h4>Now and Xen Podcast</h4>
				<p style="color: #b0b0b0; margin-bottom: 1rem;">
					Episode 093 — in-depth discussion with Stephen Weigel.
				</p>
			</div>

			<div class="video-item">
				<a href="https://youtu.be/3LOPHwRs9p8" target="_blank">
					<img src="https://img.youtube.com/vi/3LOPHwRs9p8/hqdefault.jpg" alt="Uncover the Hidden Potential" style="width: 100%; border-radius: 8px; margin-bottom: 1rem;" />
				</a>
				<h4>Uncover the Hidden Potential</h4>
				<p style="color: #b0b0b0; margin-bottom: 1rem;">
					Exploring new tonal possibilities with PitchGrid.
				</p>
			</div>
		</div>
	</section>

	<!-- Events Section -->
	<section class="section">
		<h2>Events & Exhibitions</h2>
		<div class="events-grid">
			<div class="event-card">
				<h4>PitchGrid at Superbooth 2026</h4>
				<p>
					Visit us at Superbooth 2026 in Berlin — booth o136. 
					Explore alternative tuning systems hands-on.
				</p>
				<a href="https://www.superbooth.com/en/messe-and-exhibitors/exhibitors/pitchgrid.html" target="_blank">
					Learn More
				</a>
			</div>
			
			<div class="event-card">
				<h4>Talk at Superbooth 2025</h4>
				<p>
					"Microtonal Dimensions" — joint presentation with Intuitive Instruments and Entonal Studio. 
					May 9th, 2025.
				</p>
				<a href="https://www.superbooth.com/en/events/details/pro-audio-presentation-intuitive-instruments-pitchgrid-entonal-studio.html" target="_blank">
					Watch Recording
				</a>
			</div>
		</div>
	</section>

	<!-- Source Code Section -->
	<section class="section">
		<h2>Open Source</h2>
		<p style="text-align: center; font-size: 1.1rem; margin-bottom: 2rem; color: #b0b0b0;">
			Most PitchGrid sources are publicly available on GitHub. Contributions welcome!
		</p>
		<div class="source-grid">
			<div class="source-item">
				<h4>pitchgrid</h4>
				<p>This website, including the Diatonic PitchGrid and ScaleMapper tools.</p>
				<a href="https://github.com/peterjungx/pitchgrid" target="_blank">View Repository</a>
			</div>
			
			<div class="source-item">
				<h4>PitchGridRack</h4>
				<p>VCV Rack plugin including the MicroExquis module for hardware integration.</p>
				<a href="https://github.com/peterjungx/PitchGridRack" target="_blank">View Repository</a>
			</div>
			
			<div class="source-item">
				<h4>scalatrix</h4>
				<p>Core library unifying PitchGrid algorithms. Written in C++ with Python and WASM bindings.</p>
				<a href="https://github.com/peterjungx/scalatrix" target="_blank">View Repository</a>
			</div>
		</div>
	</section>

	<!-- References Section -->
	<section class="section references">
		<h2>References & Inspiration</h2>
		<p style="text-align: center; font-size: 1.1rem; margin-bottom: 2rem; color: #b0b0b0;">
			PitchGrid is built on the shoulders of giants. Thank you to these pioneers:
		</p>
		<ul>
			<li>
				<strong><a href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4452394" target="_blank">Musical Tonality (2023)</a></strong>
				<br>Hans Peter Deutsch's 500+ page mathematical exploration of perfect tonal systems for Western music.
			</li>
			<li>
				<strong><a href="https://www.anaphoria.com/wilson.html" target="_blank">The Wilson Archives</a></strong>
				<br>Erv Wilson's discovery of MOS scales and Kraig Grady's popularization of these concepts.
			</li>
			<li>
				<strong><a href="https://sethares.engr.wisc.edu" target="_blank">William Sethares</a></strong>
				<br>Profound insights on the connection between tuning and the spectrum of sound.
			</li>
			<li>
				<strong><a href="https://nowandxen.libsyn.com" target="_blank">Now and Xen</a></strong>
				<br>Stephen Weigel's invaluable podcast on the current state of microtonality.
			</li>
		</ul>
	</section>

	<!-- Contact Section -->
	<section class="section" style="text-align: center;">
		<h2>Get Involved</h2>
		<div style="max-width: 800px; margin: 0 auto; font-size: 1.1rem; line-height: 1.8; color: #b0b0b0;">
			<p>
				<strong>Who is behind PitchGrid?</strong><br>
				The PitchGrid project is the brainchild of Peter Jung, an independent researcher.
			</p>
			<p>
				If you are a builder of tools for musicians and are interested in integrating 
				PitchGrid into your product, or if you'd like to contribute to the project, 
				I would be happy to support you.
			</p>
			<p style="margin-top: 2rem;">
				<a href="mailto:peter@pitchgrid.io" style="font-size: 1.2rem; font-weight: 600;">
					Contact me at peter@pitchgrid.io
				</a>
			</p>
		</div>
	</section>
</div>
