<script lang="ts">
	let email = '';
	let name = '';
	let message = '';
	let loading = false;
	let success = false;
	let consent = false;

	async function handleSubmit() {
		if (!email || !consent) return;

		loading = true;
		message = '';
		success = false;

		try {
			const res = await fetch('/api/subscribe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, name })
			});

			const data = await res.json();

			if (data.success) {
				message = data.message || 'Thank you for subscribing!';
				success = true;
				email = '';
				name = '';
				consent = false;
			} else {
				message = data.error || 'Subscription failed. Please try again.';
			}
		} catch (err) {
			message = 'Network error. Please try again.';
		} finally {
			loading = false;
		}
	}
</script>

<div class="newsletter">
	<h3>Stay updated</h3>
	<p class="intro">Join the PitchGrid mailing list for updates, new tools, and events.</p>
	
	<form on:submit|preventDefault={handleSubmit}>
		<input 
			type="text" 
			bind:value={name} 
			placeholder="Your name (optional)" 
			disabled={loading}
		/>
		<input 
			type="email" 
			bind:value={email} 
			placeholder="your@email.com" 
			required 
			disabled={loading}
		/>
		<label class="consent">
			<input
				type="checkbox"
				bind:checked={consent}
				required
				disabled={loading}
			/>
			<span>
				I agree to receive email updates about PitchGrid.
				<a href="/privacy">See our privacy policy</a>.
			</span>
		</label>
		<button type="submit" disabled={loading || !email || !consent}>
			{loading ? 'Subscribing...' : 'Subscribe'}
		</button>
	</form>

	{#if message}
		<p class:success>{message}</p>
	{/if}
</div>

<style>
	.newsletter {
		max-width: 320px;
	}

	.newsletter h3 {
		color: #FFAB00;
		margin-bottom: 0.5rem;
	}

	.newsletter p {
		margin-bottom: 1rem;
		color: #ccc;
		font-size: 0.95rem;
	}

	.intro {
		color: #ccc;
		font-size: 0.95rem;
		margin-bottom: 1rem;
		margin-top: 0;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	input {
		padding: 0.75rem;
		border: 1px solid rgba(255, 171, 0, 0.3);
		background: #1a1a2e;
		color: #e0e0e0;
		border-radius: 6px;
		font-size: 1rem;
	}

	input:focus {
		outline: none;
		border-color: #FFAB00;
	}

	.consent {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
		color: #ccc;
		font-size: 0.85rem;
		line-height: 1.4;
		cursor: pointer;
	}

	.consent input[type="checkbox"] {
		margin-top: 0.2rem;
		flex-shrink: 0;
		width: auto;
		padding: 0;
		accent-color: #FFAB00;
		cursor: pointer;
	}

	button {
		padding: 0.75rem;
		background: #FFAB00;
		color: #1a1a2e;
		border: none;
		border-radius: 6px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	button:hover:not(:disabled) {
		background: #FFCC40;
		transform: translateY(-1px);
	}

	button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.success {
		color: #4ade80;
		margin-top: 0.5rem;
		font-size: 0.9rem;
	}

	:global(.newsletter p:not(.success):not(.intro)) {
		color: #ff6b6b;
		font-size: 0.9rem;
		margin-top: 0.5rem;
	}
</style>
