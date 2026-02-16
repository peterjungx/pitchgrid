import { writable } from 'svelte/store';
import { referenceIntervalDt } from '$lib/helix_math';

export interface MetronomeState {
  num: number;
  den: number;
  N_C: number;
  N_B: number; // Number of bars
  bpm: number; // Beats per minute (reference beat)
  period: number; // seconds (derived from bpm)
  audioMuted: boolean;
  volumePattern: string; // Digits 0-9, cyclic velocity pattern
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

/** When the period changes, adjust timing so the current angular
 *  position (phase) is preserved — both while playing and paused. */
function preservePhase(state: MetronomeState, newPeriod: number): { startTime: number; currentTime: number } {
  if (state.isPlaying) {
    const now = Date.now() / 1000;
    const elapsed = now - state.startTime;
    const phase = (elapsed % state.period) / state.period; // 0-1
    return { startTime: now - phase * newPeriod, currentTime: state.currentTime };
  } else {
    const phase = (state.currentTime % state.period) / state.period; // 0-1
    return { startTime: state.startTime, currentTime: phase * newPeriod };
  }
}

const baseState = {
  num: 2,
  den: 1,
  N_C: 3,
  N_B: 4,
  bpm: 120,
};

const initialState: MetronomeState = {
  ...baseState,
  period: computePeriod(baseState),
  audioMuted: false,
  volumePattern: '8252',
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
      const newPeriod = computePeriod(next);
      return { ...next, period: newPeriod, ...preservePhase(state, newPeriod) };
    });
  },

  setCycles: (N_C: number) => {
    if (N_C < 2 || N_C > 4) return;
    metronomeStore.update(state => {
      const next = { ...state, N_C };
      const newPeriod = computePeriod(next);
      return { ...next, period: newPeriod, ...preservePhase(state, newPeriod) };
    });
  },

  setBars: (N_B: number) => {
    if (N_B < 1 || !Number.isInteger(N_B)) return;
    metronomeStore.update(state => {
      const next = { ...state, N_B };
      const newPeriod = computePeriod(next);
      return { ...next, period: newPeriod, ...preservePhase(state, newPeriod) };
    });
  },

  setBpm: (bpm: number) => {
    if (bpm < 20 || bpm > 400) return;
    metronomeStore.update(state => {
      const next = { ...state, bpm };
      const newPeriod = computePeriod(next);
      return { ...next, period: newPeriod, ...preservePhase(state, newPeriod) };
    });
  },

  setVolumePattern: (pattern: string) => {
    const cleaned = pattern.replace(/[^0-9]/g, '');
    if (cleaned.length === 0) return;
    metronomeStore.update(state => ({ ...state, volumePattern: cleaned }));
  },

  setAudioMuted: (muted: boolean) => {
    metronomeStore.update(state => ({ ...state, audioMuted: muted }));
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
