<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { DiscordLogo, GithubLogo } from 'radix-icons-svelte';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';

	injectAnalytics({ mode: 'auto' });

	let mobileMenuOpen = false;

	type PlausibleProps = Record<string, string>;

	type PlausibleAnchor = HTMLAnchorElement & {
		dataset: DOMStringMap & {
			plausibleEvent?: string;
			plausibleLabel?: string;
			plausiblePlatform?: string;
		};
	};

	function toggleMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function isOutboundLink(link: HTMLAnchorElement) {
		if (!link.href) return false;

		try {
			const url = new URL(link.href, window.location.href);
			return (
				(url.protocol === 'http:' || url.protocol === 'https:') &&
				url.origin !== window.location.origin
			);
		} catch {
			return false;
		}
	}

	function normalizeLabel(value?: string | null) {
		return value?.replace(/\s+/g, ' ').trim() || undefined;
	}

	function getPlatform(url: URL, link: PlausibleAnchor) {
		const explicitPlatform = normalizeLabel(link.dataset.plausiblePlatform);
		if (explicitPlatform) return explicitPlatform;

		const title = normalizeLabel(link.getAttribute('title'));
		if (title) return title;

		const ariaLabel = normalizeLabel(link.getAttribute('aria-label'));
		if (ariaLabel) return ariaLabel;

		const host = url.hostname.replace(/^www\./, '').toLowerCase();

		if (host.includes('discord.gg') || host.includes('discord.com')) return 'Discord';
		if (host.includes('github.com')) return 'GitHub';
		if (host.includes('youtube.com') || host.includes('youtu.be')) return 'YouTube';
		if (host.includes('bandcamp.com')) return 'Bandcamp';
		if (host.includes('soundcloud.com')) return 'SoundCloud';
		if (host.includes('node.audio')) return 'node.audio';

		return host;
	}

	function getLabel(url: URL, link: PlausibleAnchor) {
		return (
			normalizeLabel(link.dataset.plausibleLabel) ||
			normalizeLabel(link.textContent) ||
			normalizeLabel(link.getAttribute('aria-label')) ||
			normalizeLabel(link.getAttribute('title')) ||
			getPlatform(url, link)
		);
	}

	function trackOutboundLink(link: PlausibleAnchor) {
		const plausible =
			typeof window !== 'undefined'
				? ((window as Window & { plausible?: (event: string, options?: { props?: PlausibleProps }) => void })
						.plausible)
				: undefined;

		if (!plausible || !isOutboundLink(link)) return;

		const url = new URL(link.href, window.location.href);
		const eventName = normalizeLabel(link.dataset.plausibleEvent) || 'Outbound Link Click';
		const label = getLabel(url, link);
		const platform = getPlatform(url, link);

		plausible(eventName, {
			props: {
				url: url.href,
				domain: url.hostname.replace(/^www\./, ''),
				label: label ?? url.href,
				platform
			}
		});
	}

	onMount(() => {
		const handleDocumentClick = (event: MouseEvent) => {
			const target = event.target;
			if (!(target instanceof Element)) return;

			const link = target.closest('a[href]') as PlausibleAnchor | null;
			if (!link) return;

			trackOutboundLink(link);
		};

		document.addEventListener('click', handleDocumentClick, { capture: true });

		return () => {
			document.removeEventListener('click', handleDocumentClick, { capture: true });
		};
	});

	// Close menu on navigation
	$: $page.url.pathname, mobileMenuOpen = false;
</script>

<svelte:head>
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<link rel="mask-icon" type="image/svg+xml" href="/favicon.svg" color="#000000"/>
	<link rel="icon" href="/favicon.ico" sizes="any">
	<link rel="mask-icon" href="/favicon.ico" sizes="any">
	<link rel="icon" href="/favicon.svg" type="image/svg+xml">
	<title>PitchGrid - The tonal structure of Western music is two-dimensional</title>
</svelte:head>

<style>
	:global(html) {
		background-color: #1a1a2e;
		color-scheme: dark;
	}

	:global(body) {
		margin: 0;
		padding: 0;
		background-color: #1a1a2e;
		color: #e0e0e0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
		line-height: 1.6;
	}

	:global(*) {
		box-sizing: border-box;
	}

	:global(a) {
		color: #FFAB00;
		text-decoration: none;
		transition: color 0.3s ease;
	}

	:global(a:hover) {
		color: #FFCC40;
		text-decoration: underline;
	}

	.layout {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	/* Navigation */
	.nav {
		position: sticky;
		top: 0;
		background: rgba(26, 26, 46, 0.95);
		backdrop-filter: blur(10px);
		border-bottom: 1px solid rgba(255, 171, 0, 0.3);
		z-index: 100;
		padding: 1rem 0;
	}

	.nav-container {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 2rem;
	}

	.nav-logo {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 1.5rem;
		font-weight: bold;
		color: #e0e0e0;
		text-decoration: none;
	}

	.nav-logo:hover {
		color: #FFAB00;
	}

	.nav-links {
		display: flex;
		align-items: center;
		gap: 2rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.nav-links li {
		position: relative;
		display: flex;
		align-items: center;
	}

	.nav-links a {
		color: #e0e0e0;
		font-weight: 500;
		padding: 0.5rem 0;
		transition: color 0.3s ease;
	}

	.nav-links a:hover {
		color: #FFAB00;
		text-decoration: none;
	}

	.nav-icon-links {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		margin-left: 0.5rem;
	}

	.nav-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		color: #e0e0e0;
		transition: color 0.3s ease;
		line-height: 1;
	}

	.nav-icon:hover {
		color: #FFAB00;
	}

	/* Dropdown */
	.dropdown {
		position: relative;
	}

	.dropdown-content {
		display: none;
		position: absolute;
		top: 100%;
		left: 0;
		background: #1a1a2e;
		border: 1px solid rgba(255, 171, 0, 0.3);
		border-radius: 8px;
		min-width: 200px;
		padding: 0.5rem 0;
		padding-top: 1rem;
		margin-top: 0;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
	}

	.dropdown-content::before {
		content: '';
		position: absolute;
		top: -0.5rem;
		left: 0;
		right: 0;
		height: 0.5rem;
	}

	.dropdown:hover .dropdown-content {
		display: block;
	}

	.dropdown-content a {
		display: block;
		padding: 0.75rem 1rem;
		color: #e0e0e0;
		font-size: 0.9rem;
	}

	.dropdown-content a:hover {
		background: rgba(255, 171, 0, 0.1);
		color: #FFAB00;
	}

	/* Mobile menu */
	.mobile-menu-btn {
		display: none;
		background: none;
		border: none;
		color: #e0e0e0;
		font-size: 1.5rem;
		cursor: pointer;
	}

	/* Main content */
	.main {
		flex: 1;
	}

	/* Footer */
	.footer {
		background: #16162a;
		border-top: 1px solid rgba(255, 171, 0, 0.3);
		padding: 3rem 0 1rem;
		margin-top: auto;
	}

	.footer-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 2rem;
	}

	.footer-content {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 2rem;
		margin-bottom: 2rem;
	}

	.footer-section h3 {
		color: #FFAB00;
		margin-bottom: 1rem;
		font-size: 1.1rem;
	}

	.footer-section ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.footer-section li {
		margin-bottom: 0.5rem;
	}

	.footer-bottom {
		border-top: 1px solid rgba(255, 171, 0, 0.2);
		padding-top: 1rem;
		text-align: center;
		color: #888;
		font-size: 0.9rem;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.nav-links {
			display: none;
			flex-direction: column;
			position: absolute;
			top: 100%;
			left: 0;
			right: 0;
			background: rgba(26, 26, 46, 0.98);
			backdrop-filter: blur(10px);
			border-bottom: 1px solid rgba(255, 171, 0, 0.3);
			padding: 1rem 2rem;
			gap: 0.5rem;
		}

		.nav-links.mobile-open {
			display: flex;
		}

		.nav-links li {
			width: 100%;
		}

		.nav-links a {
			display: block;
			padding: 0.75rem 0;
		}

		.nav-icon-links {
			padding-top: 0.5rem;
			border-top: 1px solid rgba(255, 171, 0, 0.15);
			margin-top: 0.5rem;
			margin-left: 0;
		}

		.dropdown-content {
			position: static;
			display: block;
			border: none;
			box-shadow: none;
			padding: 0 0 0 1rem;
			margin-top: 0;
			min-width: unset;
		}

		.dropdown-content::before {
			display: none;
		}

		.mobile-menu-btn {
			display: block;
		}

		.nav-container {
			padding: 0 1rem;
		}

		.footer-container {
			padding: 0 1rem;
		}
	}
</style>

<div class="layout">
	<!-- Navigation -->
	<nav class="nav">
		<div class="nav-container">
			<a href="/" class="nav-logo">
				<img src="/PitchGridLogo-Plugin.svg" alt="PitchGrid" height="32" />
			</a>
			
			<ul class="nav-links" class:mobile-open={mobileMenuOpen}>
				<li class="dropdown">
					<a href="/diatonic">Tools</a>
					<div class="dropdown-content">
						<a href="/diatonic">Diatonic PitchGrid</a>
						<a href="/scalemapper">Scale Mapper</a>
						<a href="/helix-metronome">Helix Metronome</a>
						<a href="https://library.vcvrack.com/PitchGrid/MicroExquis" target="_blank">MicroExquis (VCV)</a>
					</div>
				</li>
				<li class="dropdown">
					<a href="/info/PitchGrid">Info</a>
					<div class="dropdown-content">
						<a href="/info/PitchGrid">The PitchGrid Concept</a>
						<a href="/info/plugin-user-manual">Plugin User Manual</a>
						<a href="/info/PitchGridMapper">PitchGrid Mapper</a>
						<a href="/info/MicroExquis">MicroExquis Guide</a>
						<a href="/info/ScaleMapper">Scale Mapper</a>
					</div>
				</li>
				<li><a href="/research">Research</a></li>
				<li><a href="https://node.audio/products/pitchgrid" target="_blank" data-plausible-label="Plugin Nav">Plugin</a></li>
				<li class="nav-icon-links">
					<a href="https://www.youtube.com/playlist?list=PLY4_jglyyynCPIssKpbC-ZejFcSrjBemR" target="_blank" rel="noopener noreferrer" class="nav-icon" title="YouTube" data-plausible-label="YouTube Nav">
						<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.377.504A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.504 9.376.504 9.376.504s7.505 0 9.377-.504a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
					</a>
					<a href="https://discord.gg/Ahs3B2Fx" target="_blank" rel="noopener noreferrer" class="nav-icon" title="Discord" data-plausible-label="Discord Nav">
						<DiscordLogo size={22} />
					</a>
					<a href="https://github.com/pitchgrid-io" target="_blank" rel="noopener noreferrer" class="nav-icon" title="GitHub" data-plausible-label="GitHub Nav">
						<GithubLogo size={22} />
					</a>
				</li>
			</ul>

			<button class="mobile-menu-btn" on:click={toggleMenu}>{mobileMenuOpen ? '✕' : '☰'}</button>
		</div>
	</nav>

	<!-- Main content -->
	<main class="main">
		<slot />
	</main>

	<!-- Footer -->
	<footer class="footer">
		<div class="footer-container">
			<div class="footer-content">
				<div class="footer-section">
					<h3>Tools</h3>
					<ul>
						<li><a href="/diatonic">Diatonic PitchGrid</a></li>
						<li><a href="/scalemapper">Scale Mapper</a></li>
						<li><a href="/helix-metronome">Helix Metronome</a></li>
						<li><a href="https://library.vcvrack.com/PitchGrid/MicroExquis" target="_blank">MicroExquis</a></li>
					</ul>
				</div>
				
				<div class="footer-section">
					<h3>Projects</h3>
					<ul>
						<li><a href="https://github.com/peterjungx/pitchgrid" target="_blank">PitchGrid Website</a></li>
						<li><a href="https://github.com/peterjungx/PitchGridRack" target="_blank">VCV Rack Plugin</a></li>
						<li><a href="https://github.com/peterjungx/scalatrix" target="_blank">Scalatrix Library</a></li>
						<li><a href="https://github.com/peterjungx/pgrhythm" target="_blank">PGRhythm</a></li>
					</ul>
				</div>
				
				<div class="footer-section">
					<h3>Connect</h3>
					<ul>
						<li><a href="mailto:peter@pitchgrid.io">peter@pitchgrid.io</a></li>
						<li><a href="https://discord.gg/nm5RwCJhQT" target="_blank">Discord</a></li>
						<li><a href="https://www.youtube.com/@pitchgrid-io" target="_blank">YouTube</a></li>
					</ul>
				</div>
			</div>
			
			<div class="footer-bottom">
				<p>&copy; 2026 Peter Jung. Most PitchGrid tools are open source and available on GitHub.</p>
			</div>
		</div>
	</footer>
</div>
