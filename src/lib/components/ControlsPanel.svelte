<script lang="ts">
  import { metronomeStore, metronomeActions } from '$lib/stores/metronome';

  function handleCycleChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const value = parseInt(target.value);
    metronomeActions.setCycles(value);
  }

  function handlePeriodChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = parseFloat(target.value);
    metronomeActions.setPeriod(value);
  }
</script>

<div class="controls-panel">
  <!-- Transport controls -->
  <div class="transport-controls">
    <button
      class="control-button"
      on:click={metronomeActions.play}
      disabled={$metronomeStore.isPlaying}
    >
      ▶️ Play
    </button>
    <button
      class="control-button"
      on:click={metronomeActions.pause}
      disabled={!$metronomeStore.isPlaying}
    >
      ⏸️ Pause
    </button>
    <button
      class="control-button"
      on:click={metronomeActions.stop}
    >
      ⏹️ Stop
    </button>
  </div>

  <!-- Cycle count selector -->
  <div class="control-group">
    <label for="cycles">Cycles:</label>
    <select id="cycles" value={$metronomeStore.N_C} on:change={handleCycleChange}>
      <option value={2}>2</option>
      <option value={3}>3</option>
      <option value={4}>4</option>
    </select>
  </div>

  <!-- Period slider -->
  <div class="control-group">
    <label for="period">Period: {$metronomeStore.period.toFixed(1)}s</label>
    <input
      id="period"
      type="range"
      min="1"
      max="60"
      step="0.5"
      value={$metronomeStore.period}
      on:input={handlePeriodChange}
    />
  </div>
</div>

<style>
  .controls-panel {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 20px;
    background-color: #F0F0F0;
    border-radius: 8px;
    margin: 20px 0;
  }

  .transport-controls {
    display: flex;
    gap: 10px;
    justify-content: center;
  }

  .control-button {
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    font-size: 14px;
  }

  .control-button:hover:not(:disabled) {
    background-color: #0056b3;
  }

  .control-button:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }

  .control-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .control-group label {
    font-weight: bold;
    color: black;
  }

  .control-group input[type="range"] {
    width: 100%;
  }

</style>