<script lang="ts">
    import SpiralCanvas from '$lib/components/SpiralCanvas.svelte';
    import ControlsPanel from '$lib/components/ControlsPanel.svelte';
    import InfoDisplay from '$lib/components/InfoDisplay.svelte';
    import { metronomeStore, metronomeActions } from '$lib/stores/metronome';
    import { AudioEngine } from '$lib/audio_engine';
    import { MidiEngine } from '$lib/midi_engine';
    import { calculateTickPositions, referenceTickIndex, referenceLayerBeats } from '$lib/helix_math';
    import { onMount } from 'svelte';

    let canvasWidth = 400;
    let canvasHeight = 400;
    $: refBeats = referenceLayerBeats($metronomeStore.num, $metronomeStore.den, $metronomeStore.N_C, $metronomeStore.N_B);
    let animationFrame: number;
    let audioEngine: AudioEngine;
    let midiEngine: MidiEngine;
    let scheduledTicks: Set<string> = new Set(); // Track scheduled ticks by unique ID
    let scheduledTimeouts: Set<ReturnType<typeof setTimeout>> = new Set(); // Track timeout IDs for cleanup

    // Visual tick activation (timer-based, not position-based)
    const TICK_ACTIVE_MS = 35;
    let activeTickIds: Set<number> = new Set();
    let activeTickTimers: Map<number, ReturnType<typeof setTimeout>> = new Map();

    function activateTick(tickIdx: number) {
        const existing = activeTickTimers.get(tickIdx);
        if (existing) clearTimeout(existing);

        activeTickIds.add(tickIdx);
        activeTickIds = activeTickIds; // trigger Svelte reactivity

        const timer = setTimeout(() => {
            activeTickIds.delete(tickIdx);
            activeTickIds = activeTickIds;
            activeTickTimers.delete(tickIdx);
        }, TICK_ACTIVE_MS);
        activeTickTimers.set(tickIdx, timer);
    }

    function clearActiveTicks() {
        activeTickTimers.forEach(timer => clearTimeout(timer));
        activeTickTimers.clear();
        activeTickIds.clear();
        activeTickIds = activeTickIds;
    }

    // Clear scheduled ticks and active state when playback stops
    $: if (!$metronomeStore.isPlaying) {
        clearScheduledTicks();
        clearActiveTicks();
    }

    // Initialize audio and MIDI engines
    onMount(() => {
        audioEngine = new AudioEngine();
        midiEngine = new MidiEngine();
        midiEngine.init();

        // Set up animation loop
        function animate() {
            const state = $metronomeStore;
            if (state.isPlaying) {
                const now = Date.now() / 1000;
                const elapsed = now - state.startTime;
                const newTime = elapsed % state.period;
                const seqNr = Math.floor( elapsed / state.period ) % 6;
                metronomeActions.updateTime(newTime);

                // Schedule upcoming ticks for all local playheads
                const ticks = calculateTickPositions(state.num, state.den, state.N_C, state.N_B);
                const refIdx = referenceTickIndex(state.num, state.den, state.N_C, state.N_B);
                const normalizedTime = newTime / state.period;
                const currentTimeSec = Date.now() / 1000;

                // Look ahead 1 second for each local playhead
                for (let p = 0; p < state.N_C; p++) {
                    const currentPosition = p + normalizedTime;

                    ticks.forEach((tick, tickIndex) => {
                        // Check if tick is upcoming (within next 1 second of this playhead)
                        const timeToTick = (tick.t - currentPosition) * state.period;
                        if (timeToTick > -0.03 && timeToTick < 0.5) {
                            const triggerTime = now + timeToTick;
                            const envelope = Math.sin(Math.PI * tick.t / state.N_C);
                            const patternPos = ((tickIndex - refIdx) % state.volumePattern.length + state.volumePattern.length) % state.volumePattern.length;
                            const patternDigit = parseInt(state.volumePattern[patternPos]) || 0;
                            const volume = envelope * (patternDigit / 9);
                            scheduleTick(tick, (p + 6 - seqNr) % 6, triggerTime, volume);
                        }
                    });
                }
            }
            animationFrame = requestAnimationFrame(animate);
        }
        animate();

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
            clearScheduledTicks();
            clearActiveTicks();
            if (audioEngine) {
                audioEngine.dispose();
            }
            if (midiEngine) {
                midiEngine.dispose();
            }
        };
    });

    // Handle window resize for responsive design
    function handleResize() {
        const minDim = Math.min(window.innerWidth - 40, window.innerHeight - 200);
        canvasWidth = canvasHeight = Math.min(500, Math.max(300, minDim));
    }

    onMount(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    });

    // Handle user interaction to resume/create audio context (iOS requires gesture)
    async function handleUserInteraction() {
        if (audioEngine) {
            await audioEngine.resume();
        }
    }

    // Re-resume audio after iOS suspends it on tab/app switch
    function handleVisibilityChange() {
        if (document.visibilityState === 'visible' && audioEngine) {
            audioEngine.resume();
        }
    }

    // Clear all scheduled ticks
    function clearScheduledTicks() {
        scheduledTimeouts.forEach(timeoutId => {
            clearTimeout(timeoutId);
        });
        scheduledTimeouts.clear();
        scheduledTicks.clear();
    }

    // Schedule a tick for a specific time
    function scheduleTick(tick: any, playheadIndex: number, triggerTime: number, volume:number=0.5) {
        const tickId = `${tick.idx}-${playheadIndex}`;
        if (scheduledTicks.has(tickId)) return; // Already scheduled

        const currentTimeSec2 = Date.now() / 1000;
        const delay = Math.max(0, triggerTime - currentTimeSec2);

        if (delay < 2) { // Only schedule ticks within 2 seconds
            const timeoutId = setTimeout(() => {
                if (audioEngine && !$metronomeStore.audioMuted) {
                    audioEngine.playTick(playheadIndex, 0, volume);
                }
                if (midiEngine) {
                    midiEngine.sendNoteOn(playheadIndex, volume);
                    setTimeout(() => midiEngine.sendNoteOff(playheadIndex), 30);
                }
                activateTick(tick.idx);
                setTimeout(() => {
                    scheduledTicks.delete(tickId);
                }, 50);

                scheduledTimeouts.delete(timeoutId);
            }, delay * 1000);

            scheduledTicks.add(tickId);
            scheduledTimeouts.add(timeoutId);
        }
    }

    // Single transport button with 300ms stop window after every state change.
    // Double-tap from either playing or paused → stop (reset playhead).
    let showStop = false;
    let stopTimer: ReturnType<typeof setTimeout> | null = null;

    function enterStopWindow() {
        showStop = true;
        if (stopTimer) clearTimeout(stopTimer);
        stopTimer = setTimeout(() => { showStop = false; }, 300);
    }

    function handleTransport() {
        if (showStop) {
            // In stop window → Stop (reset playhead)
            if (stopTimer) clearTimeout(stopTimer);
            stopTimer = null;
            showStop = false;
            metronomeActions.stop();
        } else if ($metronomeStore.isPlaying) {
            // Playing → Pause, enter stop window
            metronomeActions.pause();
            enterStopWindow();
        } else {
            // Paused/Stopped → Play, enter stop window
            metronomeActions.play();
            enterStopWindow();
        }
    }

    function handleMidiOutputChange(event: CustomEvent<string | null>) {
        if (midiEngine) {
            midiEngine.selectOutput(event.detail);
            // Auto-mute audio when a MIDI output is selected
            metronomeActions.setAudioMuted(event.detail !== null);
        }
    }

</script>

<svelte:window on:click={handleUserInteraction} on:touchstart={handleUserInteraction} on:pointerdown={handleUserInteraction} on:visibilitychange={handleVisibilityChange} />

<div class="container">
    <h1>Helix Metronome</h1>

    <div class="metronome-container">
        <div class="spiral-wrapper">
            <SpiralCanvas
                    num={$metronomeStore.num}
                    den={$metronomeStore.den}
                    N_C={$metronomeStore.N_C}
                    N_B={$metronomeStore.N_B}
                    currentTime={$metronomeStore.currentTime}
                    period={$metronomeStore.period}
                    isPlaying={$metronomeStore.isPlaying}
                    volumePattern={$metronomeStore.volumePattern}
                    {activeTickIds}
                    width={canvasWidth}
                    height={canvasHeight}
                />

                <!-- Transport button in center -->
                <div class="transport-overlay">
                    <button class="transport-btn" on:click={handleTransport}>
                        {#if showStop}
                            <!-- Stop icon (during 300ms window) -->
                            <svg viewBox="0 0 24 24" width="36" height="36">
                                <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/>
                            </svg>
                        {:else if $metronomeStore.isPlaying}
                            <!-- Pause icon -->
                            <svg viewBox="0 0 24 24" width="36" height="36">
                                <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"/>
                                <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"/>
                            </svg>
                        {:else}
                            <!-- Play icon -->
                            <svg viewBox="0 0 24 24" width="36" height="36">
                                <polygon points="8,5 20,12 8,19" fill="currentColor"/>
                            </svg>
                        {/if}
                    </button>
                </div>
        </div>

        <div class="info-overlay" style:top="{canvasHeight - 168}px">
            <InfoDisplay
                bpm={$metronomeStore.bpm}
                num={$metronomeStore.num}
                den={$metronomeStore.den}
                {refBeats}
            />
        </div>

        <div class="controls-area">
            <ControlsPanel on:midiOutputChange={handleMidiOutputChange} />
        </div>
    </div>

    <div class="info">
        <p>Click anywhere to enable audio. The metronome creates accelerating or decelerating rhythms based on the ratio setting.</p>
        <p>Reference: <a href="https://sebastiangramss.de/helix/" target="_blank">Helix Metronome</a></p>
    </div>
</div>

<style>
    :global(body) {
        background-color: #F0F0F0 !important;
    }

    .container {
        padding: 20px;
        background: #F0F0F0;
        color: #222;
    }

    .metronome-container {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
    }

    .info-overlay {
        position: absolute;
        left: 0;
        z-index: 10;
    }

    .controls-area {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        gap: 16px;
    }

    .spiral-wrapper {
        position: relative;
    }

    .transport-overlay {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10;
    }

    .transport-btn {
        width: 78px;
        height: 78px;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #FFAB00;
        color: white;
        transition: transform 0.1s ease, box-shadow 0.15s ease;
        box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    }

    .transport-btn:hover {
        transform: scale(1.08);
        box-shadow: 0 3px 10px rgba(0,0,0,0.25);
    }

    .transport-btn:active {
        transform: scale(0.95);
    }

    .info {
        margin-top: 30px;
        text-align: center;
        color: #666;
    }

    .info a {
        color: #9C52F2;
    }

    /* Mobile responsive */
    @media (max-width: 600px) {
        .container {
            padding: 10px;
        }

        .metronome-container {
            gap: 15px;
        }

    }
</style>