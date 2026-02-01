# ![](favicon.png "50") PitchGrid Mapper

> **⚠️ Requires [PitchGrid Plugin](https://node.audio/products/pitchgrid)** — The Mapper is a companion app for scales defined in the PitchGrid plugin. It does not function standalone.

## Play Any Scale in a Layout That Makes Sense

The piano keyboard was designed for one scale: the diatonic. If you want to play a 9-note scale, an 8-note scale, or any non-Western tuning system, the piano layout fights you — the patterns don't line up, muscle memory doesn't transfer.

**PitchGrid Mapper solves this.** It automatically generates layouts for your 2D grid controller (LinnStrument, Exquis, Lumatone, Launchpad) where:

- **The structure is visible** — see the scale's pattern with your eyes
- **The fingering makes sense** — same shape = same interval, anywhere on the grid
- **Your hands learn the scale** — muscle memory works because the layout is consistent

This is not just visualization. It's a new way to *play* — connecting eyes, fingers, and ears to scales that were previously inaccessible. No other tool on the market does this.

**[Download the latest release](https://github.com/pitchgrid-io/pitchgrid-mapper/releases)**

---

## What You Get

- **Playable layouts** that automatically make structural sense for any PitchGrid scale
- **Visual feedback** — root notes, scale tones, and accidentals are clearly marked
- **Consistent fingering** — the same geometric shape always produces the same musical interval
- **Three layout styles** — isomorphic (hex grid), string-like (rows), or piano-like (strips)
- **Real-time sync** — change the scale in the plugin, the Mapper updates instantly

---

## How It Works

```
Your Controller → PitchGrid Mapper → Your DAW → PitchGrid Plugin → Synth
                        ↑
              OSC scale data from Plugin
```

1. Your **MIDI controller** sends note data to PitchGrid Mapper
2. The Mapper **remaps** those notes according to the current scale (received via OSC from the plugin)
3. Remapped notes go through a **virtual MIDI device** to your DAW and the PitchGrid plugin
4. The plugin applies **tuning via pitch bend** and sends to your synth

The Mapper displays the scale visually: root notes highlighted, scale tones lit, off-scale notes dimmed.

![PG_Mapper_Overview](/docs/images/PG_Mapper_Overview.png)

---

## Supported Controllers

- **Computer Keyboard** — always available, no hardware needed
- **LinnStrument 128** — Roger Linn's expressive grid controller
- **Exquis** — Intuitive Instruments' isomorphic MPE controller
- **Launchpad Mini MK3** — Novation's affordable pad grid
- **Lumatone** — Professional-grade 280-key isomorphic keyboard [Untested]

Don't see your controller? You can add it with a simple YAML config file — see the [GitHub repository](https://github.com/pitchgrid-io/pitchgrid-mapper) for examples.

---

## Layout Types

The Mapper offers three ways to arrange scales on your controller. Each has its own logic — pick the one that fits how you think.

### Isomorphic Layout

![PitchGrid Mapper — Isomorphic Layout](/docs/images/PitchGridMapper-Isomorphic.png)

Notes on a hexagonal grid where **geometric patterns equal musical patterns**. Move in any direction = same interval change. Transpose by shifting your hand — the shape stays the same.

*Best for: Exploring new scales, understanding harmonic relationships, the Exquis and Lumatone.*

### String-Like Layout

![PitchGrid Mapper — LinnStrument String-Like Layout](/docs/images/PitchGridMapper-LinnStrument.png)

Rows act as "strings" — each row starts at a different pitch, and you move up the scale along the row. Familiar to guitarists and string players.

*Best for: String players, guitarists, the LinnStrument.*

### Piano-Like (Mosaic) Layout

![PitchGrid Mapper — Launchpad Piano-Like Layout](/docs/images/PitchGridMapper-LaunchPad.png)

Scale degrees in strips, with accidentals above or below — like a piano, but generalized. A 7-note scale looks like a piano. An 8-note scale gets 8 "white keys."

*Best for: Keyboard players, understanding scale structure, the Launchpad.*

---

## Understanding the Display

The Mapper's grid visualization tells you:

| Color | Meaning |
|-------|---------|
| **Bright (root color)** | Root note and its octave equivalents |
| **Medium (scale color)** | Other notes in your current scale |
| **Dim / Dark** | Off-scale notes (accidentals) |

When you change the scale in the PitchGrid plugin, the Mapper updates to show the new pattern. When you change the layout (isomorphic → string-like), the *intervals stay the same* — only the ergonomic arrangement changes.

---

## Getting Started

### 1. Install

1. Download from [GitHub](https://github.com/pitchgrid-io/pitchgrid-mapper/releases)
2. Run the application
3. A virtual MIDI device "PitchGrid Mapper" is created (automatic on Mac; on Windows, create it manually first)

### 2. Connect to Your DAW

1. In your DAW, set MIDI input to **PitchGrid Mapper**
2. Route to a track with the **PitchGrid plugin**
3. In the plugin, enable **OSC output** (Settings menu)
4. Connect your controller via USB
5. In the Mapper, select your controller from the dropdown

### 3. Play

The Mapper display should now show your controller's grid with the current scale highlighted. Play some notes — they're retuned according to the plugin's settings.

---

## The Interface

- **Controller dropdown** — select your connected device
- **Layout selector** — isomorphic, string-like, or piano-like
- **Labels dropdown** — note names, scale degrees, or MOS coordinates
- **Transform controls** — shift, skew, rotate, reflect the layout
- **Status indicators** — MIDI and OSC connection state

Changes apply in real-time. Adjust the layout while playing to find what works.

---

## Why 2D Controllers Fit These Scales

PitchGrid works with scales that have exactly two step sizes — for example, the Western major scale has 5 large steps and 2 small steps (the pattern LLsLLLs).

These scales are inherently two-dimensional:
- One direction = large steps
- Other direction = small steps

That's why standard notation has both staff position (7 diatonic notes) AND accidentals (sharps/flats). F# and Gb are different positions in this 2D space — they only become "the same note" when you collapse to 12-TET on a piano.

A 2D grid controller maps naturally to this structure. The Mapper shows you how your chosen scale lives on that grid.

For more on the theory, see the [PitchGrid Concept](/info/PitchGrid) or the Plugin User Manual's theory section.

---

## Open Source

PitchGrid Mapper is free and open source. Contributions welcome.

**[View on GitHub](https://github.com/pitchgrid-io/pitchgrid-mapper)**
