<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let value: number;
  export let min: number = 0;
  export let max: number = 100;
  export let displayValue: number | undefined = undefined;
  export let editable: boolean = false;
  export let width: number = 120;
  export let height: number = 40;

  $: shown = displayValue !== undefined ? displayValue : value;

  const dispatch = createEventDispatcher<{ change: number; directInput: number }>();

  $: isVertical = width / height < 1;
  $: btnSize = isVertical
    ? Math.min(width * 0.85, height * 0.32)
    : Math.min(height * 0.85, width * 0.32);
  $: iconSize = Math.max(12, btnSize * 0.5);
  $: fontSize = Math.max(14, Math.min(isVertical ? width * 0.35 : height * 0.45, 24));

  function increment() {
    if (value < max) dispatch('change', value + 1);
  }

  function decrement() {
    if (value > min) dispatch('change', value - 1);
  }

  function handleDirectInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const val = parseFloat(target.value);
    if (!isNaN(val)) {
      const clamped = Math.min(max, Math.max(min, val));
      dispatch('directInput', clamped);
    } else {
      target.value = String(shown);
    }
  }
</script>

<div
  class="stepper"
  class:vertical={isVertical}
  class:horizontal={!isVertical}
  style="width: {width}px; height: {height}px;"
>
  {#if isVertical}
    <button
      class="step-btn"
      style="width: {btnSize}px; height: {btnSize}px;"
      on:click={increment}
      disabled={value >= max}
      aria-label="Increase"
    >
      <svg viewBox="0 0 24 24" width={iconSize} height={iconSize}>
        <line x1="12" y1="6" x2="12" y2="18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="6" y1="12" x2="18" y2="12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
    </button>
    {#if editable}
      <input
        class="value-input"
        type="number"
        value={shown}
        {min}
        {max}
        on:change={handleDirectInput}
        style="font-size: {fontSize}px;"
      />
    {:else}
      <span class="value-label" style="font-size: {fontSize}px;">{shown}</span>
    {/if}
    <button
      class="step-btn"
      style="width: {btnSize}px; height: {btnSize}px;"
      on:click={decrement}
      disabled={value <= min}
      aria-label="Decrease"
    >
      <svg viewBox="0 0 24 24" width={iconSize} height={iconSize}>
        <line x1="6" y1="12" x2="18" y2="12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
    </button>
  {:else}
    <button
      class="step-btn"
      style="width: {btnSize}px; height: {btnSize}px;"
      on:click={decrement}
      disabled={value <= min}
      aria-label="Decrease"
    >
      <svg viewBox="0 0 24 24" width={iconSize} height={iconSize}>
        <line x1="6" y1="12" x2="18" y2="12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
    </button>
    {#if editable}
      <input
        class="value-input"
        type="number"
        value={shown}
        {min}
        {max}
        on:change={handleDirectInput}
        style="font-size: {fontSize}px;"
      />
    {:else}
      <span class="value-label" style="font-size: {fontSize}px;">{shown}</span>
    {/if}
    <button
      class="step-btn"
      style="width: {btnSize}px; height: {btnSize}px;"
      on:click={increment}
      disabled={value >= max}
      aria-label="Increase"
    >
      <svg viewBox="0 0 24 24" width={iconSize} height={iconSize}>
        <line x1="12" y1="6" x2="12" y2="18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="6" y1="12" x2="18" y2="12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
    </button>
  {/if}
</div>

<style>
  .stepper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2px;
    user-select: none;
  }

  .horizontal {
    flex-direction: row;
  }

  .vertical {
    flex-direction: column;
  }

  .step-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border: 1.5px solid #ccc;
    border-radius: 50%;
    cursor: pointer;
    color: #555;
    transition: all 0.12s ease;
    padding: 0;
    flex-shrink: 0;
  }

  .step-btn:hover:not(:disabled) {
    background: #eef;
    border-color: #9C52F2;
    color: #9C52F2;
  }

  .step-btn:active:not(:disabled) {
    background: #ddf;
    transform: scale(0.9);
  }

  .step-btn:disabled {
    opacity: 0.25;
    cursor: not-allowed;
  }

  .value-label {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    color: #222;
    flex: 1;
    min-width: 0;
  }

  .value-input {
    font-weight: 700;
    color: #222;
    text-align: center;
    flex: 1;
    min-width: 0;
    width: 100%;
    border: none;
    border-bottom: 2px solid #9C52F2;
    background: transparent;
    outline: none;
    padding: 2px 0;
    -moz-appearance: textfield;
  }

  .value-input::-webkit-outer-spin-button,
  .value-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .value-input:focus {
    border-bottom-color: #0D75FF;
  }
</style>
