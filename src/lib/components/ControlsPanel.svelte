<script lang="ts">
  import { metronomeStore, metronomeActions } from '$lib/stores/metronome';
  import { referenceLayerBeats } from '$lib/helix_math';
  import { midiStore } from '$lib/midi_engine';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{ midiOutputChange: string | null }>();

  $: refBeats = referenceLayerBeats($metronomeStore.num, $metronomeStore.den, $metronomeStore.N_C, $metronomeStore.N_B);

  function handleCycleChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const value = parseInt(target.value);
    metronomeActions.setCycles(value);
  }

  function handleBpmChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = parseFloat(target.value);
    if (!isNaN(value)) {
      metronomeActions.setBpm(value);
    }
  }

  function handleMidiOutputChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const value = target.value || null;
    dispatch('midiOutputChange', value);
  }

  function handleVolumePatternChange(event: Event) {
    const target = event.target as HTMLInputElement;
    metronomeActions.setVolumePattern(target.value);
  }

  function handleBarsChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = parseInt(target.value);
    if (!isNaN(value)) {
      metronomeActions.setBars(value);
    }
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

  <!-- Bars selector -->
  <div class="control-group">
    <label for="bars">Bars:</label>
    <input
      id="bars"
      type="number"
      min="1"
      value={$metronomeStore.N_B}
      on:change={handleBarsChange}
      class="bars-input"
    />
  </div>

  <!-- BPM input -->
  <div class="control-group">
    <label for="bpm">BPM:</label>
    <input
      id="bpm"
      type="number"
      min="20"
      max="400"
      value={$metronomeStore.bpm}
      on:change={handleBpmChange}
      class="bpm-input"
    />
    <span class="period-info">Period: {$metronomeStore.period.toFixed(2)}s</span>
    <span class="period-info">Reference Layer Beats: {refBeats}</span>
  </div>

  <!-- Volume pattern -->
  <div class="control-group">
    <label for="volume-pattern">Volume Pattern:</label>
    <input
      id="volume-pattern"
      type="text"
      value={$metronomeStore.volumePattern}
      on:change={handleVolumePatternChange}
      class="pattern-input"
      placeholder="0-9 digits"
    />
  </div>

  <!-- MIDI output selector -->
  {#if $midiStore.available}
    <div class="control-group">
      <label for="midi-output">MIDI Output:</label>
      <select id="midi-output" value={$midiStore.selectedOutputId || ''} on:change={handleMidiOutputChange}>
        <option value="">None</option>
        {#each $midiStore.outputs as output}
          <option value={output.id}>{output.name}</option>
        {/each}
      </select>
    </div>
  {/if}

  <!-- Audio mute toggle -->
  <div class="control-group">
    <label>
      <input
        type="checkbox"
        checked={$metronomeStore.audioMuted}
        on:change={() => metronomeActions.setAudioMuted(!$metronomeStore.audioMuted)}
      />
      Mute Audio
    </label>
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

  .bpm-input {
    width: 70px;
    text-align: center;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 4px;
    font-size: 14px;
  }

  .period-info {
    font-size: 12px;
    color: #666;
  }

  .pattern-input {
    width: 120px;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 4px;
    font-size: 14px;
    font-family: monospace;
    letter-spacing: 2px;
  }

  .bars-input {
    width: 60px;
    text-align: center;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 4px;
    font-size: 14px;
  }

</style>