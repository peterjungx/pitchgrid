<script lang="ts">
	export let size: number = 110;
</script>

<style>
	.logo {
		display: flex;
		align-items: center;
	}
	span {
		margin: 0 2px;
	}
	/* narrow sans serif bold */
	.big {
		font-size: 3.5em;
		font-weight: bold;
		font-family: 'Arial Narrow', sans-serif;
		color: #303030;
	}
	.yellow {
		color: #ffb319;
	}
</style>

<div class="logo">
	<span>
		<img src="/PitchGridLogo-TwoColor-YellowBlack.svg" alt="Logo" width={size} height={size} />
	</span>
	<span>
		<div class="big">PITCH<b class="yellow">GRID</b></div>
	</span>
</div>