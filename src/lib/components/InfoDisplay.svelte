<script lang="ts">
  export let bpm: number;
  export let num: number;
  export let den: number;
  export let refBeats: number;

  $: isAcc = num > den;
</script>

<div class="display">
  <div class="row bpm-row">{bpm}</div>
  <div class="row ratio-row">
    {#if isAcc}
      <!-- Acc: num top-left, den bottom-right, arrow ↗ -->
      <span class="ratio-label top-left">{num}</span>
      <span class="ratio-label bottom-right">{den}</span>
    {:else}
      <!-- Dec: num bottom-left, den top-right, arrow ↘ -->
      <span class="ratio-label bottom-left">{num}</span>
      <span class="ratio-label top-right">{den}</span>
    {/if}
    <svg class="ratio-arrow" viewBox="0 0 80 100" preserveAspectRatio="xMidYMid meet">
      {#if isAcc}
        <line x1="4" y1="90" x2="76" y2="10" stroke="#333" stroke-width="7" stroke-linecap="round"/>
        <polyline points="61,12 78,10 76,29" fill="none" stroke="#333" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
      {:else}
        <line x1="4" y1="10" x2="76" y2="90" stroke="#333" stroke-width="7" stroke-linecap="round"/>
        <polyline points="76,73 78,90 61,88" fill="none" stroke="#333" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
      {/if}
    </svg>
  </div>
  <div class="row beats-row">{refBeats}</div>
</div>

<style>
  .display {
    display: flex;
    flex-direction: column;
    border: 5px solid #222;
    background: white;
    aspect-ratio: 25 / 35;
    height: 168px;

    font-family: 'Helvetica', Helvetica, sans-serif;
    font-weight: normal;
    color: #222;
  }

  .row {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .bpm-row {
    height: 38px;
    flex-shrink: 0;
    font-size: 32px;
    padding: 0;
    border-bottom: 3px solid #888;
  }

  .ratio-row {
    position: relative;
    flex: 1;
    border-bottom: 3px solid #888;
  }

  .ratio-label {
    position: absolute;
    font-size: 44px;
    line-height: 1;
    z-index: 1;
  }

  .top-left { top: 2px; left: 8px; }
  .bottom-left { bottom: 2px; left: 8px; }
  .top-right { top: 2px; right: 8px; }
  .bottom-right { bottom: 2px; right: 8px; }

  .ratio-arrow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 70%;
    height: 80%;
  }

  .beats-row {
    height: 38px;
    flex-shrink: 0;
    font-size: 32px;
  }
</style>
