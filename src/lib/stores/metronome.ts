import { writable } from 'svelte/store';

export interface MetronomeState {
  num: number;
  den: number;
  N_C: number;
  period: number; // seconds
  isPlaying: boolean;
  currentTime: number;
  startTime: number; // When playback started
}

const initialState: MetronomeState = {
  num: 2,
  den: 1,
  N_C: 2,
  period: 10,
  isPlaying: false,
  currentTime: 0,
  startTime: 0
};

export const metronomeStore = writable<MetronomeState>(initialState);

export const metronomeActions = {
  setRatio: (num: number, den: number) => {
    if (num === den || num < 1 || num > 12 || den < 1 || den > 12) return;
    metronomeStore.update(state => ({ ...state, num, den }));
  },

  setCycles: (N_C: number) => {
    if (N_C < 2 || N_C > 4) return;
    metronomeStore.update(state => ({ ...state, N_C }));
  },

  setPeriod: (period: number) => {
    if (period < 1 || period > 60) return;
    metronomeStore.update(state => ({ ...state, period }));
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