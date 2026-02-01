# ![](favicon.png "50") PitchGrid Mapper

**PitchGrid Mapper** is a universal bridge between PitchGrid's microtonal scales and isomorphic MIDI controllers. It lets you play PitchGrid scales on hardware controllers like the LinnStrument, Exquis, Launchpad, and Lumatone — with real-time visualization and configurable layouts.

**[Download the latest release](https://github.com/pitchgrid-io/pitchgrid-mapper/releases)**

---

## How It Works

PitchGrid Mapper sits between your physical controller and the PitchGrid plugin in your DAW:

1. Your **MIDI controller** sends note data to PitchGrid Mapper
2. The Mapper **remaps** those notes according to the current PitchGrid scale (received via OSC from the plugin)
3. The remapped notes are sent out through a **virtual MIDI device** to your DAW and the PitchGrid plugin

This means any supported controller becomes a microtonal instrument — playing the exact scale you've dialed in with PitchGrid, with consistent fingering patterns within your chosen scale.

![PG_Mapper_Overview](/docs/images/PG_Mapper_Overview.png)


## Supported Controllers

- **Computer Keyboard** — always available, no hardware needed
- **LinnStrument 128** — Roger Linn's expressive grid controller
- **Exquis** — Intuitive Instruments' isomorphic MPE controller
- **Launchpad Mini MK3** — Novation's affordable pad grid
- **Lumatone** — Professional grade Bosanquet layout controller [Untested]

Additional controllers can be added through simple YAML configuration files. If your controller isn't listed, you can define its grid dimensions, MIDI mapping, and physical layout to get it working.

## Layout Types

PitchGrid Mapper offers three fundamentally different ways to map scales onto your controller's grid:

### Isomorphic Layout

![PitchGrid Mapper — Isomorphic Layout](/docs/images/PitchGridMapper-Isomorphic.png)

The isomorphic layout arranges notes on a hexagonal honeycomb grid where **geometric patterns equal musical patterns**. Moving in one direction always means the same interval change. Transpose by shifting your hand — the shape stays the same.

*Best for: Exploring new scales, understanding harmonic relationships, the Exquis and Lumatone.*

Controls: root position, skew, rotate, reflect.

### String-Like Layout

![PitchGrid Mapper — LinnStrument String-Like Layout](/docs/images/PitchGridMapper-LinnStrument.png)

Rows act as "strings" tuned to different intervals — like a guitar or bass, but generalized to any PitchGrid scale. If you play a stringed instrument, this will feel familiar.

*Best for: String players, guitarists exploring new tunings, the LinnStrument.*

Controls: string orientation, row offset, root position.

### Piano-Like (Mosaic) Layout

![PitchGrid Mapper — Launchpad Piano-Like Layout](/docs/images/PitchGridMapper-LaunchPad.png)

Scale degrees are arranged in strips with accidentals placed above or below — like a piano keyboard, but generalized to any scale. A 7-note scale looks like a piano. An 8-note scale gets 8 "white keys" per octave.

*Best for: Keyboard players, understanding scale structure, the Launchpad.*

Controls: strip orientation, strip width, accidental direction, root position.

## The Lumatone

![PitchGrid Mapper — Lumatone Isomorphic Layout](/docs/images/PitchGridMapper-Lumatone.png)

The 280-key Lumatone is the ultimate canvas for PitchGrid scales. With its enormous hexagonal grid, it can display multiple octaves of any scale with room to spare, making it ideal for exploring the full range of PitchGrid's tuning possibilities.

## Getting Started

### Installation

1. Download the latest release from [GitHub](https://github.com/pitchgrid-io/pitchgrid-mapper/releases)
2. On Windows, create a virtual MIDI device called "PitchGrid Mapper" (automatically created on Mac)
3. Run the application. (On Mac, a virtual MIDI device called "PitchGrid Mapper" is created automatically)
4. In your DAW, set MIDI input to "PitchGrid Mapper"
5. Route that to the PitchGrid plugin
6. In the PitchGrid plugin, enable OSC output
7. Connect your controller via USB
8. Choose your controller from the Controllers dropdown 

### Using the PitchGrid Isomorphic Controller Mapper UI

Once PitchGrid Mapper is running:

- **Controller selection** — choose your connected controller
- **Layout type** — switch between isomorphic, string-like, and piano-like
- **Labels** — Select which type of labels should be shown on the pads in the UI
- **Transformation controls** — shift, skew, rotate, and reflect the layout
- **Connection status** — virtual MIDI and OSC connection indicators

Changes apply in real-time — adjust the layout while playing and hear the results immediately.

## Open Source

PitchGrid Mapper is open source and available on [GitHub](https://github.com/pitchgrid-io/pitchgrid-mapper). Contributions are welcome — whether that's adding support for new controllers, improving layouts, or enhancing the web UI.
