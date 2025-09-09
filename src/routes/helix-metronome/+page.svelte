<script lang="ts">
    import SpiralCanvas from '$lib/components/SpiralCanvas.svelte';
    import ControlsPanel from '$lib/components/ControlsPanel.svelte';
    import { metronomeStore, metronomeActions } from '$lib/stores/metronome';
    import { AudioEngine } from '$lib/audio_engine';
    import { calculateTickPositions } from '$lib/helix_math';
    import { onMount } from 'svelte';

    let canvasWidth = 400;
    let canvasHeight = 400;
    let animationFrame: number;
    let audioEngine: AudioEngine;

    // Initialize audio engine
    onMount(() => {
        audioEngine = new AudioEngine();

        // Set up animation loop
        function animate() {
            const state = $metronomeStore;
            if (state.isPlaying) {
                const now = Date.now() / 1000;
                const elapsed = now - state.startTime;
                const newTime = elapsed % state.period;
                const seqNr = Math.floor(state.N_C * elapsed / state.period);
                metronomeActions.updateTime(newTime);

                // Check for tick hits and play audio
                const ticks = calculateTickPositions(state.num, state.den, state.N_C);
                const normalizedTime = newTime / state.period;

                // Check each local playhead position
                for (let p = 0; p < state.N_C; p++) {
                    const currentPosition = p + normalizedTime;

                    ticks.forEach(tick => {
                        if (Math.abs(tick.t - currentPosition) < 0.01) { // Close enough
                            console.log(`Tick hit at segment ${tick.segment}, playhead ${p}`);
                            audioEngine.playTick((p + seqNr + 4) % 4, 0);
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
        };
    });

    // Handle window resize for responsive design
    function handleResize() {
        const minDim = Math.min(window.innerWidth - 40, window.innerHeight - 200);
        canvasWidth = canvasHeight = Math.max(300, minDim);
    }

    onMount(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    });

    // Handle user interaction to resume audio
    function handleUserInteraction() {
        if (audioEngine) {
            audioEngine.resume();
        }
    }

    // Handle ratio changes
    function handleNumChange(event: Event) {
        const target = event.target as HTMLInputElement;
        const value = parseInt(target.value);
        if (!isNaN(value) && value >= 1 && value <= 12 && value !== $metronomeStore.den) {
            metronomeActions.setRatio(value, $metronomeStore.den);
        } else {
            target.value = $metronomeStore.num.toString();
        }
    }

    function handleDenChange(event: Event) {
        const target = event.target as HTMLInputElement;
        const value = parseInt(target.value);
        if (!isNaN(value) && value >= 1 && value <= 12 && value !== $metronomeStore.num) {
            metronomeActions.setRatio($metronomeStore.num, value);
        } else {
            target.value = $metronomeStore.den.toString();
        }
    }
</script>

<svelte:window on:click={handleUserInteraction} />

<div class="container">
    <h1>Helix Metronome</h1>

    <div class="metronome-container">
        <div class="spiral-wrapper">
            <SpiralCanvas
                num={$metronomeStore.num}
                den={$metronomeStore.den}
                N_C={$metronomeStore.N_C}
                currentTime={$metronomeStore.currentTime}
                period={$metronomeStore.period}
                isPlaying={$metronomeStore.isPlaying}
                width={canvasWidth}
                height={canvasHeight}
            />

            <!-- Ratio inputs positioned over center -->
            <div class="ratio-inputs">
                <input
                    type="number"
                    min="1"
                    max="12"
                    bind:value={$metronomeStore.num}
                    on:change={handleNumChange}
                    class="ratio-input"
                />
                <span>:</span>
                <input
                    type="number"
                    min="1"
                    max="12"
                    bind:value={$metronomeStore.den}
                    on:change={handleDenChange}
                    class="ratio-input"
                />
            </div>
        </div>

        <ControlsPanel />
    </div>

    <div class="info">
        <p>Click anywhere to enable audio. The metronome creates accelerating or decelerating rhythms based on the ratio setting.</p>
        <p>Reference: <a href="https://sebastiangramss.de/helix/" target="_blank">Helix Metronome</a></p>
    </div>
</div>

<style>
    .container {
        margin: 20px;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
    }

    .metronome-container {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
    }

    .spiral-wrapper {
        position: relative;
    }

    .ratio-inputs {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        align-items: center;
        gap: 5px;
        background-color: rgba(240, 240, 240, 0.9);
        padding: 8px 12px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        z-index: 10;
    }

    .ratio-input {
        width: 45px;
        text-align: center;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 4px;
        font-size: 16px;
    }

    .ratio-input:focus {
        outline: none;
        border-color: #007bff;
    }

    .info {
        margin-top: 30px;
        text-align: center;
        color: #666;
    }

    .info a {
        color: #007bff;
    }

    /* Mobile responsive */
    @media (max-width: 600px) {
        .container {
            padding: 10px;
        }

        .metronome-container {
            gap: 15px;
        }

        .ratio-inputs {
            padding: 6px 8px;
        }

        .ratio-input {
            width: 40px;
            font-size: 14px;
        }
    }
</style>