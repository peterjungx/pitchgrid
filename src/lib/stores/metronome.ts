import { writable } from 'svelte/store';
import { referenceIntervalDt } from '$lib/helix_math';

export interface MetronomeState {
  num: number;
  den: number;
  N_C: number;
  N_B: number; // Number of bars
  bpm: number; // Beats per minute (reference beat)
  period: number; // seconds (derived from bpm)
  isPlaying: boolean;
  currentTime: number;
  startTime: number; // When playback started
}

function computePeriod(state: { num: number; den: number; N_C: number; N_B: number; bpm: number }): number {
  const dt = referenceIntervalDt(state.num, state.den, state.N_C, state.N_B);
  if (dt !== null && dt > 0) {
    return 60 / (state.bpm * dt);
  }
  return 1; // fallback
}

const baseState = {
  num: 2,
  den: 1,
  N_C: 2,
  N_B: 1,
  bpm: 60,
};

const initialState: MetronomeState = {
  ...baseState,
  period: computePeriod(baseState),
  isPlaying: false,
  currentTime: 0,
  startTime: 0
};

export const metronomeStore = writable<MetronomeState>(initialState);

export const metronomeActions = {
  setRatio: (num: number, den: number) => {
    if (num === den || num < 1 || num > 12 || den < 1 || den > 12) return;
    metronomeStore.update(state => {
      const next = { ...state, num, den };
      return { ...next, period: computePeriod(next) };
    });
  },

  setCycles: (N_C: number) => {
    if (N_C < 2 || N_C > 4) return;
    metronomeStore.update(state => {
      const next = { ...state, N_C };
      return { ...next, period: computePeriod(next) };
    });
  },

  setBars: (N_B: number) => {
    if (N_B < 1 || !Number.isInteger(N_B)) return;
    metronomeStore.update(state => {
      const next = { ...state, N_B };
      return { ...next, period: computePeriod(next) };
    });
  },

  setBpm: (bpm: number) => {
    if (bpm < 20 || bpm > 400) return;
    metronomeStore.update(state => {
      const next = { ...state, bpm };
      return { ...next, period: computePeriod(next) };
    });
  },

  play: () => {
    metronomeStore.update(state => ({
      ...state,
      isPlaying: true,
      startTime: Date.now() / 1000 - state.currentTime
    }));
  },

  pause: () => {
    metronomeStore.update(state => ({ ...state, isPlaying: false }));
  },

  stop: () => {
    metronomeStore.update(state => ({
      ...state,
      isPlaying: false,
      currentTime: 0,
      startTime: 0
    }));
  },

  updateTime: (currentTime: number) => {
    metronomeStore.update(state => ({ ...state, currentTime }));
  }
};
