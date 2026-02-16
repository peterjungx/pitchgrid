<script lang="ts">
  import { metronomeStore, metronomeActions } from '$lib/stores/metronome';
  import { referenceLayerBeats } from '$lib/helix_math';
  import StepperControl from '$lib/components/StepperControl.svelte';
  import { midiStore } from '$lib/midi_engine';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{ midiOutputChange: string | null }>();

  $: refBeats = referenceLayerBeats($metronomeStore.num, $metronomeStore.den, $metronomeStore.N_C, $metronomeStore.N_B);

  function handleCycleChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const value = parseInt(target.value);
    metronomeActions.setCycles(value);
  }

  function handleBpmStep(event: CustomEvent<number>) {
    metronomeActions.setBpm(event.detail);
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

  function handleBarsStep(event: CustomEvent<number>) {
    const newVal = event.detail;
    if (newVal >= 1) {
      metronomeActions.setBars(newVal);
    }
  }

  function handleNumStep(event: CustomEvent<number>) {
    let newVal = event.detail;
    if (newVal === $metronomeStore.den) {
      newVal = newVal > $metronomeStore.num ? newVal + 1 : newVal - 1;
    }
    if (newVal >= 1 && newVal <= 12 && newVal !== $metronomeStore.den) {
      metronomeActions.setRatio(newVal, $metronomeStore.den);
    }
  }

  function handleDenStep(event: CustomEvent<number>) {
    let newVal = event.detail;
    if (newVal === $metronomeStore.num) {
      newVal = newVal > $metronomeStore.den ? newVal + 1 : newVal - 1;
    }
    if (newVal >= 1 && newVal <= 12 && newVal !== $metronomeStore.num) {
      metronomeActions.setRatio($metronomeStore.num, newVal);
    }
  }
</script>

<div class="controls-panel">
  <!-- BPM -->
  <div class="control-row">
    <label>BPM</label>
    <div class="control-right">
      <StepperControl
        value={$metronomeStore.bpm}
        min={20}
        max={400}
        editable={true}
        width={120}
        height={36}
        on:change={handleBpmStep}
      />
      <span class="period-info">Cycle: {$metronomeStore.period.toFixed(2)}s</span>
    </div>
  </div>

  <!-- Ratio -->
  <div class="control-row">
    <label>Ratio</label>
    <div class="control-right">
      <div class="ratio-steppers">
        <StepperControl
          value={$metronomeStore.num}
          min={1}
          max={12}
          width={100}
          height={36}
          on:change={handleNumStep}
        />
        <span class="ratio-separator">:</span>
        <StepperControl
          value={$metronomeStore.den}
          min={1}
          max={12}
          width={100}
          height={36}
          on:change={handleDenStep}
        />
      </div>
    </div>
  </div>

  <!-- Beats (modifies bars internally, displays reference layer beats) -->
  <div class="control-row">
    <label>Beats</label>
    <div class="control-right">
      <StepperControl
        value={$metronomeStore.N_B}
        displayValue={refBeats}
        min={1}
        max={99}
        width={100}
        height={36}
        on:change={handleBarsStep}
      />
    </div>
  </div>

  <!-- Layers -->
  <div class="control-row">
    <label for="cycles">Layers</label>
    <div class="control-right">
      <select id="cycles" value={$metronomeStore.N_C} on:change={handleCycleChange}>
        <option value={2}>2</option>
        <option value={3}>3</option>
        <option value={4}>4</option>
      </select>
    </div>
  </div>

  <!-- Volume pattern -->
  <div class="control-row">
    <label for="volume-pattern">Vol. Pattern</label>
    <div class="control-right">
      <input
        id="volume-pattern"
        type="text"
        value={$metronomeStore.volumePattern}
        on:change={handleVolumePatternChange}
        class="pattern-input"
        placeholder="0-9 digits"
      />
    </div>
  </div>

  <!-- MIDI output selector -->
  {#if $midiStore.available}
    <div class="control-row">
      <label for="midi-output">MIDI Out</label>
      <div class="control-right">
        <select id="midi-output" value={$midiStore.selectedOutputId || ''} on:change={handleMidiOutputChange}>
          <option value="">None</option>
          {#each $midiStore.outputs as output}
            <option value={output.id}>{output.name}</option>
          {/each}
        </select>
      </div>
    </div>
  {/if}

  <!-- Audio mute toggle (only when MIDI is available) -->
  {#if $midiStore.available}
    <div class="control-row">
      <label>Mute</label>
      <div class="control-right">
        <input
          type="checkbox"
          checked={$metronomeStore.audioMuted}
          on:change={() => metronomeActions.setAudioMuted(!$metronomeStore.audioMuted)}
        />
      </div>
    </div>
  {/if}
</div>

<style>
  .controls-panel {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px 20px;
    background-color: #F0F0F0;
    border-radius: 8px;
    margin: 20px 0;
    width: 100%;
    max-width: 420px;
  }

  .control-row {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 36px;
  }

  .control-row > label {
    font-weight: bold;
    color: black;
    font-size: 16px;
    min-width: 100px;
    flex-shrink: 0;
    text-align: right;
  }

  .control-right {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
  }

  .ratio-steppers {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .ratio-separator {
    font-size: 20px;
    font-weight: 700;
    color: #333;
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
</style>