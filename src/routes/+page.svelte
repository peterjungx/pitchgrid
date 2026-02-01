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

	.hero h1 {
		font-size: 3.5rem;
		font-weight: 700;
		margin-bottom: 1rem;
		color: #ffffff;
		line-height: 1.2;
	}

	.hero-tagline {
		font-size: 1.25rem;
		color: #FFAB00;
		margin-bottom: 2rem;
		max-width: 800px;
		margin-left: auto;
		margin-right: auto;
	}

	.hero-description {
		font-size: 1.1rem;
		color: #b0b0b0;
		margin-bottom: 3rem;
		max-width: 600px;
		margin-left: auto;
		margin-right: auto;
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
		margin-bottom: 3rem;
		font-weight: 600;
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

	/* Mapper Showcase */
	.mapper-showcase {
		text-align: center;
	}

	.mapper-subtitle {
		font-size: 1.15rem;
		color: #b0b0b0;
		margin-bottom: 2rem;
		max-width: 700px;
		margin-left: auto;
		margin-right: auto;
	}

	.mapper-screenshot {
		max-width: 780px;
		width: 100%;
		margin: 0 auto 2rem;
	}

	.mapper-screenshot img {
		width: 100%;
		height: auto;
		border-radius: 12px;
		box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5), 0 0 60px rgba(255, 171, 0, 0.1);
	}

	.mapper-description {
		font-size: 1.05rem;
		color: #b0b0b0;
		max-width: 700px;
		margin: 0 auto 2rem;
		line-height: 1.7;
	}

	.mapper-cta {
		display: flex;
		gap: 1rem;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
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

	/* About Section */
	.about-section {
		text-align: center;
	}

	.about-content {
		max-width: 800px;
		margin: 0 auto;
		font-size: 1.1rem;
		line-height: 1.8;
		color: #b0b0b0;
	}

	.concept-image {
		margin: 2rem auto;
		display: block;
		max-width: 400px;
		width: 100%;
		height: auto;
		border-radius: 12px;
		box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
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

	/* Responsive */
	@media (max-width: 768px) {
		.hero h1 {
			font-size: 2.5rem;
		}

		.hero-tagline {
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

		.music-section,
		.theory-section {
			padding: 2rem;
		}
	}
</style>

<!-- Hero Section -->
<section class="hero">
	<div class="hero-content">
		<h1>PitchGrid</h1>
		<p class="hero-tagline">Explore tunings beyond the piano — with structure that makes sense</p>
		<p class="hero-description">
			A VST3/AU plugin for exploring tuning systems beyond 12-tone equal temperament.
			Pick a scale, hear the difference, play it on your controller — with theory that still works.
		</p>
		<div class="hero-cta-group">
			<a href="https://node.audio/products/pitchgrid" class="hero-cta" target="_blank">Get PitchGrid Plugin</a>
			<a href="/info/plugin-user-manual" class="hero-cta-secondary">Learn More</a>
		</div>
		<div class="hero-screenshot">
			<img src="/docs/images/PitchGridPluginUI.png" alt="PitchGrid Plugin UI" />
		</div>
	</div>
</section>

<div class="container">
	<!-- Feature Cards Section -->
	<section class="section">
		<h2>Explore PitchGrid</h2>
		<div class="features-grid">
			<div class="feature-card">
				<span class="feature-icon">🎛️</span>
				<h3>PitchGrid Plugin</h3>
				<p>VST3/AU plugin for easy exploration of tunings in your DAW. Turn knobs to discover new musical worlds.</p>
				<a href="https://node.audio/products/pitchgrid" target="_blank" class="btn">Get the Plugin</a>
			</div>
			
			<div class="feature-card">
				<span class="feature-icon">🌐</span>
				<h3>Online Tools</h3>
				<p>Interactive web applications for exploring scales, tuning systems, and isomorphic keyboard layouts.</p>
				<a href="/diatonic" class="btn">Explore Tools</a>
			</div>
			
			<div class="feature-card">
				<span class="feature-icon">🎹</span>
				<h3>PitchGrid Mapper</h3>
				<p>A universal mapper between PitchGrid microtonal scales and isomorphic MIDI controllers (LinnStrument, Exquis, Launchpad, Lumatone). Connects your controller to the PitchGrid plugin.</p>
				<a href="https://github.com/pitchgrid-io/pitchgrid-mapper/releases" target="_blank" class="btn">Download</a>
			</div>

			<div class="feature-card">
				<span class="feature-icon">🗺️</span>
				<h3>Scale Mapper</h3>
				<p>Visualize and explore regular scale systems with our advanced mapping tools and algorithms.</p>
				<a href="/scalemapper" class="btn">Open Mapper</a>
			</div>
			
			<div class="feature-card">
				<span class="feature-icon">🥁</span>
				<h3>PGRhythm</h3>
				<p>Parametric MIDI sequencer that extends PitchGrid concepts to create complex rhythmic patterns.</p>
				<a href="https://github.com/peterjungx/pgrhythm" target="_blank" class="btn">View on GitHub</a>
			</div>
		</div>
	</section>

	<!-- Who Is This For Section -->
	<section class="section">
		<h2>Who Is PitchGrid For?</h2>
		<div class="audience-grid">
			<div class="audience-card audience-yes">
				<h3>✓ PitchGrid is for you if:</h3>
				<ul>
					<li>You're curious what music sounds like outside 12-tone equal temperament</li>
					<li>You play an isomorphic controller (LinnStrument, Lumatone, Exquis) and want to explore new tunings</li>
					<li>You've heard of "microtonal" music and want to try it yourself</li>
					<li>You're a composer looking for fresh harmonic territory</li>
					<li>You want to understand how Western music concepts generalize to other scales</li>
				</ul>
			</div>
			<div class="audience-card audience-maybe">
				<h3>? You might want something else if:</h3>
				<ul>
					<li>You just want purer thirds in standard 12-tone music (simpler JI tools exist)</li>
					<li>You want to auto-tune existing recordings (that's a different kind of tool)</li>
				</ul>
			</div>
		</div>
	</section>

	<!-- PitchGrid Mapper Showcase -->
	<section class="section mapper-showcase">
		<h2>PitchGrid Mapper</h2>
		<p class="mapper-subtitle">
			Play microtonal scales on your favorite isomorphic MIDI controller
		</p>
		<div class="mapper-screenshot">
			<img src="/docs/images/PitchGridMapper-Isomorphic.png" alt="PitchGrid Mapper — Isomorphic hexagonal layout" />
		</div>
		<p class="mapper-description">
			PitchGrid Mapper creates a virtual MIDI device that bridges your hardware controller 
			and the PitchGrid plugin. It automatically discovers supported controllers — LinnStrument, 
			Exquis, Launchpad, Lumatone — and maps their pads to PitchGrid's microtonal note mappings 
			with isomorphic, string-like, or piano-like layouts.
		</p>
		<div class="mapper-cta">
			<a href="https://github.com/pitchgrid-io/pitchgrid-mapper/releases" target="_blank" class="hero-cta">Download PitchGrid Mapper</a>
			<a href="/info/PitchGridMapper" class="hero-cta-secondary">Learn More</a>
		</div>
	</section>

	<!-- About Section -->
	<section class="section about-section">
		<h2>Understanding PitchGrid</h2>
		<div class="about-content">
			<p>
				<strong>Western music uses a 7-note scale with 5 large steps and 2 small steps — but there's nothing magical about 7.</strong>
			</p>
			<img src="/docs/images/PitchGrid-Basic-CMajor.png" alt="PitchGrid Basic C-Major" class="concept-image" />
			<p>
				PitchGrid lets you explore scales with 5, 8, 10, or any number of notes — all with the same kind 
				of internal structure: modes you can rotate through, keys you can change, and voice leading rules 
				that make musical sense. Different raw materials, familiar logic.
			</p>
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

	<!-- Music Section -->
	<section class="section">
		<h2>Music Created with PitchGrid</h2>
		<div class="music-section">
			<p style="text-align: center; font-size: 1.1rem; margin-bottom: 2rem; color: #b0b0b0;">
				Here are some musical pieces created with the PitchGrid plugin
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

	<!-- Videos Section -->
	<section class="section">
		<h2>Videos & Demonstrations</h2>
		<div class="videos-grid">
			<div class="video-item">
				<div class="video-placeholder">📹</div>
				<h4>Microtonality on the Exquis - The PitchGrid Way</h4>
				<p style="color: #b0b0b0; margin-bottom: 1rem;">
					Watch the features of the MicroExquis VCV Rack module in action.
				</p>
				<a href="https://youtu.be/nl94-T3geNw" target="_blank" class="btn">Watch Video</a>
			</div>
			
			<div class="video-item">
				<div class="video-placeholder">📹</div>
				<h4>PitchGrid - First Demo</h4>
				<p style="color: #b0b0b0; margin-bottom: 1rem;">
					First impressions of PitchGrid Rack for VCV and theoretical background.
				</p>
				<a href="https://youtu.be/ACGUp7ZtsWc" target="_blank" class="btn">Watch Video</a>
			</div>

			<div class="video-item">
				<div class="video-placeholder">📹</div>
				<h4>PGRhythm Demo</h4>
				<p style="color: #b0b0b0; margin-bottom: 1rem;">
					See how PitchGrid concepts extend to rhythm generation.
				</p>
				<a href="https://youtu.be/dhIEhQWGUYo" target="_blank" class="btn">Watch Demo</a>
			</div>
		</div>
	</section>

	<!-- Events Section -->
	<section class="section">
		<h2>Events & Exhibitions</h2>
		<div class="events-grid">
			<div class="event-card">
				<h4>PitchGrid at Superbooth 2025</h4>
				<p>
					Join us at Superbooth 2025 in Berlin, Germany (May 8th-10th) where we showcase 
					the PitchGrid and its applications.
				</p>
				<a href="https://www.superbooth.com/en/messe-and-exhibitors/exhibitors/pitchgrid.html" target="_blank">
					Learn More
				</a>
			</div>
			
			<div class="event-card">
				<h4>Talk at SuperBooth 2025</h4>
				<p>
					Joint presentation with Intuitive Instruments and Entonal Studio. 
					May 9th, 2:30pm-4:00pm in Berlin, Germany.
				</p>
				<a href="https://www.superbooth.com/en/events/details/pro-audio-presentation-intuitive-instruments-pitchgrid-entonal-studio.html" target="_blank">
					Event Details
				</a>
			</div>
		</div>
	</section>

	<!-- Source Code Section -->
	<section class="section">
		<h2>Open Source</h2>
		<p style="text-align: center; font-size: 1.1rem; margin-bottom: 2rem; color: #b0b0b0;">
			All PitchGrid sources are publicly available on GitHub. Contributions welcome!
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
		<div class="about-content">
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