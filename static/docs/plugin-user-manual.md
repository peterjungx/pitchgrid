# ![](favicon.png "50") PitchGrid Plugin User Manual

_Version: 2026-02-01_

---

## Quick Start

Get PitchGrid running in under 5 minutes.

### 1. Install

- **Download** from [node.audio/products/pitchgrid](https://node.audio/products/pitchgrid)
- **Run the installer** (Windows: .exe, Mac: .pkg)
- **Rescan plugins** in your DAW

### 2. Load in Your DAW

- Create a MIDI track
- Add PitchGrid as a **MIDI effect** (before your synth)
- Add any synth after PitchGrid

> **[SCREENSHOT NEEDED: PitchGrid in DAW signal chain — Controller → PitchGrid → Synth]**

### 3. Play

- Play some notes — you'll hear standard 12-tone tuning (the default)
- Now turn the **Skew** knob slowly to the left or right
- Listen: the intervals change. You're now in a different tuning system.

> **[SCREENSHOT NEEDED: Before/after grid comparison — default 12-TET vs. skewed tuning, with Skew knob highlighted]**

### 4. Explore

- Try the **Depth** knob to change how many notes are in your scale
- Load different **Presets** from the dropdown to hear historical and experimental tunings
- That's it — you're making microtonal music!

---

## What Is PitchGrid?

PitchGrid is a plugin that lets you **explore tuning systems beyond standard 12-tone equal temperament**.

Instead of the 12 notes per octave you're used to, you can play scales with 5, 7, 8, 10, 19, 31, or any number of notes — each with its own harmonic character.

### What Makes It Different

Most microtonal tools make you pick from a list of predefined scales or edit individual pitches. PitchGrid takes a different approach:

- **Turn knobs to explore** — the tuning parameters are continuous, like a synth. Sweep through tuning space and hear what sounds good.
- **Structure is preserved** — as you change tunings, you keep the musical structure: modes, transposition, and chord relationships still make sense.
- **Visual feedback** — the grid shows you the pitch relationships, so you can see what you're hearing.

### Who Is It For?

- Composers looking for fresh harmonic territory
- Electronic musicians who want new sounds
- Players of isomorphic controllers (LinnStrument, Lumatone, Exquis)
- Anyone curious what music sounds like outside 12-tone
- Theorists exploring tuning systems

### Key Features

- **Visual tuning design** — see pitch relationships on an interactive lattice
- **Real-time control** — change tunings while playing; automate parameters in your DAW
- **Full MIDI support** — works with regular MIDI, MPE, and MTS-ESP
- **Preset library** — factory presets for historical and experimental tunings
- **VST3/AU formats** — works in most major DAWs

---

## Installation

### System Requirements

- **OS**: Windows 10/11 (64-bit) or macOS 10.15+
- **CPU**: Intel Core i5 or Apple M1 (or equivalent)
- **RAM**: 4 GB minimum
- **Storage**: 30 MB

### Supported Formats

- **VST3**: Windows and macOS
- **Audio Units (AU)**: macOS only

### Installation Steps

**Windows:**
1. Run the .exe installer
2. Install to the default VST3 folder (`C:\Program Files\Common Files\VST3`)
3. Open your DAW and rescan plugins

**macOS:**
1. Open the .pkg installer
2. Follow the prompts — plugins install to `/Library/Audio/Plug-Ins/`
3. Open your DAW and rescan plugins

### Authorization

On first launch, you'll see a licensing dialog:

- **Trial**: Click "Start Trial" for 15 days of full functionality
- **Activate**: Enter your email and license key (from your purchase confirmation)

One license allows 3 activations (3 different computers). For issues, contact support@node.audio.

---

## DAW Setup

### Logic Pro

1. Create a new **Software Instrument** track
2. In the channel strip, click the **MIDI FX** slot
3. Select **PitchGrid**
4. Add your synth in the **Instrument** slot below
5. If using an MPE controller, set PitchGrid's Input Mode to **MPE**

> **[SCREENSHOT NEEDED: Logic Pro channel strip with PitchGrid in MIDI FX slot]**

### Ableton Live

1. Create a new **MIDI track**
2. Add **PitchGrid** as an instrument on that track
3. Create a second MIDI track with your synth
4. Set the synth track's **MIDI From** to the PitchGrid track
5. Arm the PitchGrid track; monitor the synth track

> **[SCREENSHOT NEEDED: Ableton routing — PitchGrid track → Synth track]**

### Reaper

1. Create a new track
2. Add **PitchGrid** to the FX chain
3. Add your synth after PitchGrid in the same FX chain
4. Route your MIDI controller to this track

### FL Studio

1. Add **PitchGrid** to the Channel Rack
2. Use **Patcher** to route MIDI: Controller → PitchGrid → Synth

---

## Interface Guide

> **[SCREENSHOT NEEDED: Full interface with numbered callouts (1-6) for each area described below]**

The PitchGrid interface has six main areas:

### 1. Header Area

![PG_HeaderArea](images/PG_HeaderArea.png)

- **Logo**: Click to open this manual
- **MIDI Input menu**: Select input type (Regular MIDI or MPE)
- **Presets menu**: Load and save tunings
- **Preset controls**: New, Save, Delete
- **MIDI Output menu**: Select output type
- **Settings**: Additional options

### 2. Control Area

![PG_ControlArea](images/PG_ControlArea.png)

The main tuning controls:

| Knob | What It Does |
|------|--------------|
| **Depth** | How many notes in your scale (changes structure) |
| **Root Freq** | Base frequency (default 440 Hz) |
| **Stretch** | Expand or compress all intervals proportionally |
| **Skew** | Tilt the tuning — the most important sound-shaping parameter |
| **Mode Offset** | Shift which mode of the scale you're playing |
| **Steps** | How many notes per octave get mapped to your keyboard |

### 3. Info Area

![PG_InfoArea](images/PG_InfoArea.png)

Shows properties of your current scale:

- **MOS System**: Number of large (L) and small (s) steps
- **Large Step / Small Step**: Size of each step in cents
- **Equave**: The interval where the scale repeats (usually octave = 1200 cents)
- **Step Sequence**: The pattern of large and small steps (e.g., LLsLLLs for major)

### 4. Pitch Ruler

![PG_RulerArea](images/PG_RulerArea.png)

The vertical ruler on the right shows reference pitches:

- **Prime Limit**: Just intervals (simple frequency ratios like 3:2, 5:4)
- **Harmonic Series**: Overtones of a fundamental
- **Equal Divisions**: EDO steps (12-TET, 19-TET, etc.)

Use this to see how close your tuning is to pure intervals.

### 5. The Grid

![PG_GridArea](images/PG_GridArea.png)

The central visualization:

- **Yellow nodes**: Root note and its octave equivalents
- **White nodes**: Other notes in your scale
- **Grey nodes**: Off-scale notes (accidentals)
- **Zig-zag path**: Your current scale, connecting the nodes

The grid is a map of pitch relationships. Horizontal movement = one type of step; vertical = another. As you adjust Skew and Stretch, the grid morphs to show the new relationships.

### 6. Piano Mapping

![PG_MappingArea](images/PG_MappingArea.png)

Shows how notes map to a standard MIDI keyboard:

- Each key displays its note name and pitch
- Colors match the grid (yellow = root, white = scale, grey = off-scale)
- When your scale has 7 notes, it aligns with white keys; other scales won't match the piano layout

---

## Common Workflows

### "I want to try a different equal temperament"

**Goal**: Switch from 12-tone to 19-tone equal temperament.

1. Load PitchGrid with the default preset
2. Set **Steps** to **19** (this maps 19 notes per octave to your keyboard)
3. Adjust **Depth** until the Info Area shows "12L 7s" (the 19-tone MOS)
4. Play — you now have 19 equally-spaced notes per octave

> **[SCREENSHOT NEEDED: Grid showing 19-TET configuration]**

**Tip**: The factory preset "19-TET" does this automatically.

### "I want just intonation"

**Goal**: Tune intervals to pure frequency ratios.

1. Start with any preset
2. In the **Pitch Ruler Marks** section, select **Prime Limit** and set it to show 5-limit ratios
3. The ruler now shows just intervals (3:2, 5:4, etc.)
4. Click **Optimize** and select the intervals you want to be pure
5. PitchGrid adjusts Skew and Stretch to align your scale with those ratios

> **[SCREENSHOT NEEDED: Optimization dialog with just intervals selected]**

### "I want to use my LinnStrument / isomorphic controller"

**Goal**: Play PitchGrid scales on a grid controller with proper layout.

1. Download [PitchGrid Mapper](https://github.com/pitchgrid-io/pitchgrid-mapper/releases) (free, open source)
2. Run PitchGrid Mapper — it creates a virtual MIDI device
3. In PitchGrid plugin, enable **OSC output** (Settings menu)
4. In your DAW, set MIDI input to "PitchGrid Mapper"
5. Your controller now shows the scale layout with lit pads for scale tones

See the [PitchGrid Mapper documentation](/info/PitchGridMapper) for details.

### "I want to automate tuning changes"

**Goal**: Change tunings during a track using DAW automation.

1. In your DAW, open the automation lane for the PitchGrid track
2. PitchGrid exposes all parameters: Skew, Stretch, Depth, Steps, etc.
3. Draw automation curves — the tuning changes in real-time as the track plays

**Example**: Automate Skew from 0.5 to 0.7 over 8 bars for a gradual tuning drift.

---

## MIDI Configuration

### Input Modes

**Regular MIDI**
- Standard note on/off with global pitch bend
- Works with any MIDI keyboard
- Set **Pitch Bend Range** to match your controller (usually ±2 semitones)

**MPE (MIDI Polyphonic Expression)**
- Per-note pitch bend, pressure, and slide
- For expressive controllers: Seaboard, LinnStrument, Continuum
- Set **Input Pitch Bend Range** to match your controller (often ±48 semitones)

### Output Modes

| Mode | Description | Use When |
|------|-------------|----------|
| **None** | No MIDI output (visualization only) | Testing/exploring |
| **Mono** | Single channel with pitch bend | Simple setups, mono synths |
| **Poly** | Multiple channels (up to 16 voices) | Polyphonic non-MPE synths |
| **MPE** | Full MPE output | MPE-capable synths |
| **MTS-ESP** | Tuning data via MTS protocol | Multi-plugin tuning sync |

### Signal Flow

```
Your Controller
      ↓
  [MIDI In to DAW]
      ↓
  [PitchGrid Plugin]
      ↓
  [Retuned MIDI/MPE Out]
      ↓
  [Your Synth]
```

PitchGrid receives standard MIDI and outputs retuned MIDI with pitch bend data that makes your synth play the correct microtonal pitches.

---

## Presets

### Factory Presets

PitchGrid includes presets for common tunings:

| Preset | Description |
|--------|-------------|
| **12-TET** | Standard Western tuning (default) |
| **Pythagorean** | Pure fifths (3:2), historical tuning |
| **1/4-Comma Meantone** | Pure major thirds, Renaissance standard |
| **19-TET** | 19 equal steps, smooth and bright |
| **31-TET** | 31 equal steps, excellent just approximations |
| **Just Intonation 5-limit** | Pure intervals from the 5-limit |
| **Bohlen-Pierce** | Non-octave scale based on 3:5:7 |

### Saving Your Own

1. Adjust parameters to taste
2. Click the **Save** icon in the header
3. Name your preset
4. It appears in the User section of the preset menu

### Preset Contents

Presets store:
- All tuning parameters (Depth, Skew, Stretch, Steps, etc.)
- Mode offset
- Root frequency

Presets do NOT store:
- MIDI input/output settings
- Window size

---

## Understanding the Theory (Optional)

This section explains the concepts behind PitchGrid. **You don't need this to use the plugin** — but if you're curious about why it works the way it does, read on.

### Why Tuning Theory Exists

There's a fundamental tension in music between two desirable properties:

**Justness**: Intervals sound most consonant when their frequencies form simple ratios. A perfect fifth (3:2) sounds pure because the third harmonic of one note matches the second harmonic of the other. The simpler the ratio, the stronger the consonance.

**Regularity**: Music relies on repetition and transposition. We want to play a melody in different keys and have it sound "the same." This requires intervals to be consistent throughout the scale.

The problem: **you can't have both perfectly.** A scale built entirely from just intervals won't transpose cleanly. A perfectly regular scale (like 12-TET) sacrifices some justness.

Every tuning system is a compromise between these two goals.

### The PitchGrid Approach

Traditional tuning theory starts with just intervals and then "tempers" them (adjusts them slightly) to achieve regularity.

PitchGrid inverts this: **start with a regular structure, then see which just intervals it approximates.**

This has a practical advantage: regular scales can be controlled with continuous parameters. Turn a knob, and all the pitches shift together while maintaining their structural relationships.

### MOS Scales

The scales PitchGrid works with are called **MOS scales** (Moments of Symmetry), discovered by theorist Erv Wilson.

A MOS scale has exactly two step sizes (Large and Small), distributed as evenly as possible. Examples:

- **5L 2s**: The familiar diatonic scale (major, minor, modes)
- **2L 5s**: Inverted diatonic
- **3L 4s**: "Mosh" — a 7-note scale with different character
- **7L 5s**: 12-note chromatic (when tuned to 12-TET)

The Western diatonic scale is just one MOS among infinitely many. PitchGrid lets you explore the others.

### The Two Dimensions

Why is PitchGrid a 2D grid?

Because MOS scales have two step sizes, they naturally live on a 2D lattice:
- One axis = Large steps
- Other axis = Small steps

This is also why standard music notation has two components: staff position (the 7 diatonic notes) and accidentals (sharps/flats). F# and Gb are different points on the lattice — they only collapse to the same pitch in 12-TET.

Isomorphic controllers (LinnStrument, Lumatone) are ideal for these scales because they're also 2D grids.

### Glossary

| Term | Meaning |
|------|---------|
| **Cents** | Logarithmic pitch unit; 100 cents = 1 semitone in 12-TET |
| **EDO** | Equal Division of the Octave (e.g., 12-EDO = 12-TET) |
| **Equave** | The interval where a scale repeats (usually octave, but can be other ratios) |
| **Generator** | The interval used to build a MOS scale (e.g., fifth for diatonic) |
| **Just Intonation** | Tuning based on simple frequency ratios |
| **MOS** | Moment of Symmetry — a scale with two step sizes, evenly distributed |
| **Temperament** | A tuning system where some intervals are adjusted from just |

---

## Notable Scales

Here are some historically important and experimentally interesting scales you can create in PitchGrid, with exact parameter values.

### Western Diatonic Scales (5L 2s)

These all use the familiar 7-note scale structure — 5 large steps and 2 small steps.

| Scale | Depth | Skew | Stretch | Character |
|-------|-------|------|---------|-----------|
| **12-TET** | 5L 2s | ~0.583 | 1.0 | Standard Western tuning. The default. |
| **Pythagorean** | 5L 2s | ~0.585 | 1.0 | Pure fifths (702.0ct). Bright, medieval. |
| **1/4-Comma Meantone** | 5L 2s | ~0.579 | 1.0 | Pure major thirds (386.3ct). Renaissance organs. |
| **19-TET** | 5L 2s | ~0.579 | 1.0 | 19 equal steps. Smooth, close to meantone. |
| **31-TET** | 5L 2s | ~0.581 | 1.0 | 31 equal steps. Excellent just approximations. |

*Tip: Load the 12-TET preset, then slowly turn Skew to hear the transition between these tunings.*

### Beyond Western (Different Scale Structures)

Change **Depth** to explore scales with different numbers of notes.

| Scale | Depth | Notes | Character |
|-------|-------|-------|-----------|
| **Pentatonic** | 2L 3s | 5 | The "black keys." Universal folk scale. |
| **Mavila** | 2L 5s | 7 | Inverted diatonic. Pelog-like, gamelan feel. |
| **Porcupine** | 7L 1s | 8 | 8 notes, unusual thirds. |
| **Orwell** | 4L 5s | 9 | 9 notes, good 7-limit approximations. |
| **Bohlen-Pierce** | 5L 4s | 9 | Non-octave scale (repeats at 3:1). Alien but consonant. |

*For Bohlen-Pierce: Set Stretch so the equave is ~1902ct (a perfect twelfth, ratio 3:1).*

### Creating These Scales

1. **Load a preset** if available — this sets all parameters
2. **Or dial manually**: Set Depth first (this changes the scale structure), then adjust Skew (this changes the tuning)
3. **Watch the Info Area** — it shows the step pattern (e.g., "LLsLLLs") and interval sizes in cents
4. **Use the Pitch Ruler** — set it to show just intervals, then adjust Skew until scale notes align with the ruler marks

---

## Experiments to Try

The best way to understand PitchGrid is to play with it. Here are some exercises:

### 1. Hear the Difference Between Tunings

1. Load **12-TET** (the default)
2. Play a major chord (root, major third, fifth)
3. Now load **1/4-Comma Meantone**
4. Play the same chord — notice the third sounds smoother, more "at rest"
5. Load **Pythagorean** — the fifth is purer, but the third is sharper

*What you're hearing: the tradeoff between just intervals.*

### 2. Sweep Through Tuning Space

1. Start with any preset
2. Play a sustained chord or drone
3. Slowly turn **Skew** from one extreme to the other
4. Listen: intervals expand and contract. Some settings sound consonant, others tense.

*The "sweet spots" are where intervals align with just ratios.*

### 3. Change the Scale Structure

1. Start with 12-TET (5L 2s diatonic)
2. While holding a chord, change **Depth** to 7L 5s (chromatic)
3. Now try 2L 3s (pentatonic)
4. Notice: the same keys now play different notes in the scale

*Depth changes how many notes exist; Skew changes how they're tuned.*

### 4. Automate a Tuning Drift

1. Record a simple chord progression or loop
2. Open automation for the **Skew** parameter
3. Draw a slow curve over 16 bars
4. Play back — the tuning gradually shifts throughout the progression

*This creates a sense of harmonic motion that's impossible in fixed tuning.*

### 5. Find Your Own Scale

1. Set **Depth** to something unfamiliar (try 3L 4s or 4L 3s)
2. Play random notes — find combinations that sound good to you
3. Adjust **Skew** until the intervals feel right
4. Save as a preset — this is now your scale

*There are no wrong answers. Trust your ears.*

---

## Advanced Features

### MTS-ESP Integration

MTS-ESP lets multiple plugins share a tuning.

1. Set PitchGrid's Output Mode to **MTS-ESP**
2. PitchGrid becomes the tuning "master"
3. Other MTS-ESP-compatible plugins receive the tuning data
4. All your instruments play in the same tuning

Useful for orchestral or layered sounds where multiple synths need to match.

### OSC Control

Control PitchGrid parameters remotely via Open Sound Control.

1. Enable OSC in the Settings menu
2. Default ports: 8000 (receive), 8001 (send)
3. Send messages like `/pitchgrid/skew 0.65` to change parameters
4. Use TouchOSC, Lemur, or any OSC-capable app

### Network Grid View

Share your grid visualization over the network.

1. PitchGrid starts a WebSocket server automatically
2. Connect from a browser: `ws://localhost:5174`
3. Remote viewers see the grid in real-time
4. Useful for collaboration or external displays

---

## Troubleshooting

### Plugin doesn't appear in DAW

- Rescan plugins in your DAW's preferences
- Check that you installed the correct format (VST3 for Windows, AU for Logic)
- On Mac, check System Preferences > Security if the installer was blocked

### No sound

- Check MIDI routing: Controller → PitchGrid → Synth
- Make sure Output Mode is not set to "None"
- Verify your synth is receiving on the correct MIDI channel

### MPE not working correctly

- Set Input Mode to **MPE**
- Match the **Input Pitch Bend Range** to your controller's setting
- Ensure your DAW has MPE mode enabled for the track

### Grid appears blank or frozen

- Try Window > Reset View in the plugin menu
- Update your graphics drivers
- Restart the plugin

### High CPU usage

- Reduce **Depth** to lower values
- Disable OSC if not using it
- Close the network visualization if active

### DAW-Specific Issues

**Ableton Live**: PitchGrid must route to another track; Live doesn't support MIDI effects directly on instrument tracks.

**Logic Pro**: Use the MIDI FX slot, not the Instrument slot.

**Bitwig**: Limited compatibility due to Bitwig's internal MPE handling. Use MTS-ESP mode instead.

### Getting Help

- Documentation: [pitchgrid.io](https://pitchgrid.io)
- Email: support@node.audio
- Community: [PitchGrid Discord](https://discord.gg/pitchgrid)

---

## Licensing

### Trial

- 15 days, full functionality
- No watermarks or limitations during trial

### Full License

- One-time purchase from [node.audio](https://node.audio/products/pitchgrid)
- Perpetual license with free updates for version 1.x
- 3 activations per license (3 computers)

### Activation

1. Launch PitchGrid in your DAW
2. Enter your email and license key
3. Click Activate

To transfer to a new computer: deactivate on the old machine first (Settings > Deactivate License).

---

## Legal

© 2025-2026 Node Audio and Peter Jung. All rights reserved.

PitchGrid is a trademark of Peter Jung. This software is provided under license; see [node.audio/eula](https://node.audio/eula) for terms.

VST is a trademark of Steinberg. Audio Units is a trademark of Apple. All other trademarks are property of their respective owners.

---

*For the latest version of this manual, visit [pitchgrid.io/info/plugin-user-manual](https://pitchgrid.io/info/plugin-user-manual)*
