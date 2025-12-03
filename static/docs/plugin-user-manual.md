# ![](favicon.png "50") PitchGrid Plugin (BETA) User Manual

_Author: Peter Jung (peter@pitchgrid.io)_ 
_Version: 2025-12-02_

Information in this manual is subject to change without notice and does not represent a commitment on the part of Node Audio. The software described in this manual is furnished under a license agreement. The software may be used only in accordance with the terms of this license agreement. It is against the law to copy this software on any medium except as specifically allowed in the license agreement. No part of this manual may be copied, photocopied, reproduced, translated, distributed or converted to any electronic or machine-readable form in whole or in part without prior written approval of Node Audio or Peter Jung.

©2025 Node Audio and Peter Jung. All rights reserved. 

Program Copyright ©2025 Node Audio and Peter Jung. All rights reserved. 

PitchGrid is a Trademark of Peter Jung. Windows is a registered trademark of Microsoft Corporation in the United States and other countries. Mac OS and Audio Units are registered trademarks of Apple Corporation. VST Instruments and ASIO are trademarks of Steinberg Soft Und Hardware GmbH. AAX is a registered trademark of Avid Technology Inc. All other product and company names are either trademarks or registered trademarks of their respective owners. Unauthorized copying, renting or lending of the software is strictly prohibited. Visit Node Audio on the World Wide Web at [node.audio](https://node.audio). Visit PitchGrid on the World Wide Web at [PitchGrid.io](https://pitchgrid.io).

## Introduction

Welcome to PitchGrid, the innovative MIDI plugin that brings the power of microtonal music to your digital audio workstation (DAW)! Whether you're a composer exploring alternative tunings, a producer seeking unique sonic landscapes, or a performer wanting precise control over pitch, PitchGrid is your gateway to a world of harmonic possibilities.

### Overview
PitchGrid is a MIDI processing plugin designed specifically for creating and performing with alternative scales and tuning systems. At its core is the PitchGrid — a visual, two dimensional lattice representation of musical intervals that allows you to map a large variety of scales and tunings to your controller. This intuitive interface lets you understand the relationships between the scale degrees and frequency ratios and to intuitively explore a huge space of tuning systems and their structural and harmonic possibilities.

![PitchGridPluginUI](/docs/images/PitchGridPluginUI.png "500")

Unlike traditional microtonal plugins, PitchGrid uses knobs to retune the whole scale, making sure that pitch relationships are structurally consistent. Its flexible lattice system is inspired by meantone and just intonation principles. It generalizes the structure of the Western tonal system, including the familiar sheet music notation logic, and extends it to any MOS scale and Just Intonation "approximations" thereof. The tuning parameter knobs are exposed to the host DAW and thereby allow real-time tuning adjustments during your composition or performance.

The PitchGrid plugin processes incoming MIDI notes and pitch bend data from your controller (a raw, or untuned MIDI signal) and transforms it into a tuned MIDI MPE signal, making sure that your synth is playing the right pitches. Alternatively, PitchGrid also can serve as an MTS-ESP master, sending out tuning information to other plugins and synths in your DAW.

PitchGrid is available in VST3 and AU formats, as well as a standalone application, ensuring compatibility with some of the most popular DAWs. (Unfortunately, Bitwig Studio is an exception, as it has a special handling of MPE signals that conflicts with the way PitchGrid works.)

### Purpose
The primary goal of PitchGrid is to democratize the use of alternative musical scales. No more struggling with cumbersome retuning or limited preset scales—PitchGrid empowers you to design your own tunings visually and hear them in real-time. It's perfect for genres like ambient, experimental, world music, and contemporary classical where non-standard tunings add emotional depth and harmonic richness. It also makes it easier than ever for you to kick off your own genre based off a scale implying its own music theory and your own harmonic rules.  

### Key Benefits
- **Visual Tuning Design**: Drag, select, and optimize pitches on an interactive lattice for intuitive scale creation.
- **Seamless DAW Integration**: Supports VST3 and AU formats, working natively in popular DAWs like Ableton Live, Logic Pro, and Reaper.
- **Advanced MIDI Handling**: Full support for MPE (MIDI Polyphonic Expression), polyphonic aftertouch, and MTS-ESP (Multipitch Tuning Standard - Extended Scale Pricing) for professional workflows.
- **Real-Time Performance**: Low-latency processing ensures tuning changes are instantly reflected in your playing.
- **Preset Library**: Start with factory presets for common tunings like 12-TET, Pythagorean, and 31-TET, then save your own.
- **OSC and Networking**: Control parameters remotely via OSC or share your grid view over the network for collaborative sessions.
- **Trial-Friendly**: Try it out with full functionality for 15 days before activation.

With PitchGrid, you'll discover new ways to think about music, breaking free from the constraints of 12-tone equal temperament. Let's dive in and start creating!

## Installation and Setup

Getting PitchGrid up and running is straightforward. Follow these steps to install and configure it in your DAW.

### Formats and DAW Integration
PitchGrid is available in the following plugin formats:
- **VST3**: Compatible with Windows (64-bit) and macOS (Intel and Apple Silicon).
- **Audio Units (AU)**: macOS only.
- **AAX**: For Pro Tools (coming soon).

It integrates seamlessly as a MIDI effect or instrument plugin in most DAWs. Place it on a MIDI track before your synthesizer or sampler to process incoming MIDI data.

**Supported DAWs**:
- Ableton Live 10+
- Logic Pro X+
- Reaper 6+
- FL Studio 20+
- Cubase 11+
- And many more—check the [system requirements](https://pitchgrid.io/requirements) for full compatibility.

### System Requirements
- **Operating System**: Windows 10/11 (64-bit) or macOS 10.15+ (Catalina or later).
- **CPU**: Intel Core i5 or equivalent; Apple M1 or later recommended for macOS.
- **RAM**: 4 GB minimum (8 GB recommended).
- **Storage**: 30 MB free space.
- **MIDI Interface**: Standard USB MIDI or built-in DAW MIDI routing.

No additional drivers are needed—PitchGrid uses standard plugin protocols.

### Installation Steps
1. **Download**: Visit [pitchgrid.io/download](https://pitchgrid.io/download) and get the installer for your platform.
2. **Run Installer**:
   - **Windows**: Double-click the .exe file and follow the wizard. Install to the default VST3 folder (usually `C:\Program Files\Common Files\VST3`).
   - **macOS**: Open the .pkg file, agree to the license, and install. It will place files in `/Library/Audio/Plug-Ins/` for AU and VST3.
3. **Rescan Plugins**: In your DAW, go to Preferences > Plugins and rescan or validate plugins. PitchGrid should appear in the MIDI effects or instruments list.
4. **Trial Activation**: Launch PitchGrid in your DAW. A trial window will appear—click "Start Trial" to begin your 14-day evaluation. For full activation, see the Licensing section.

**Tip**: If the plugin doesn't appear, check your DAW's plugin paths and ensure no security software is blocking the scan.

### Authorization
PitchGrid uses IndieKey for secure licensing. On initial launch, you will be greeted with a licensing dialogue. 
You can either start a 15-day trial, or enter your email address that you used to purchase the plugin, along with the personal license key you received.  
If you started a trial, the licensing dialogue will appear again after the trial period ends. 
Upon entering your email and license key, the key will be validated online, and your plugin will be activated. 
One license key is limited to 3 activations (3 different computers).
For offline activation or issues, contact support@node.audio.

**Warning**: Do not share your license key. The license key is tied to one user. Sharing it may result in the key being revoked.

## Getting Started

Congratulations on installing PitchGrid! Let's load it up and explore the basics.

### Loading the Plugin in Your DAW
The process of loading the plugin in your DAW depends on the DAW you are using.

#### Logic Pro
1. Open Logic Pro and create a new MIDI track.
2. Insert PitchGrid as a MIDI effect (before your instrument plugin). 
3. If you use an MPE controller, set PitchGrid Input Mode to MPE and set the input pitch bend range to the same value that your controller uses. (Some DAWs do not require the first two steps.)
4. If your instrument is MPE capable, make sure MPE is enabled on your 
5. Arm the track for recording or enable MIDI input from your controller.
6. Play some notes—PitchGrid will process them in real-time using the default 12-TET tuning.

#### Ableton Live
1. Open your DAW and create a new MIDI track.
2. Different DAWs have different ways to load the PitchGrid plugin.
   - In Logic Pro, insert PitchGrid as a MIDI effect (before your instrument plugin). 
   - In Ableton Live, add it as a MIDI instrument and route your MIDI controller to it, then route the outgoing MIDI signal from PitchGrid to your instrument.  
3. If you use an MPE controller, make sure your DAW is configured to process your controller's MPE signal, enable MPE mode on the Track and set PitchGrid Input Mode to MPE. (Some DAWs do not require the first two steps.)
4. If your instrument is MPE capable, make sure MPE is enabled on your 
5. Arm the track for recording or enable MIDI input from your controller.
6. Play some notes—PitchGrid will process them in real-time using the default 12-TET tuning.


If you see a black screen or WebView loading, wait a moment for the interface to initialize.

### Basic Interface Tour
The PitchGrid interface is divided into three main areas: the Pitch Grid (center), Controls (sides), and Toolbar (top).

- **Toolbar**:
  - Preset dropdown: Load/save tunings.
  - MIDI I/O indicators: Green lights show active input/output.
  - License status: Shows trial days left or "Activated."
  - Help button: Access this manual and tooltips.

- **Pitch Grid (Central Lattice)**:
  - A hexagonal or square grid visualizing pitches as nodes.
  - Horizontal axis: Octaves or generators (e.g., perfect fifths).
  - Vertical axis: Another generator (e.g., major thirds).
  - Selected nodes glow blue; play them to hear the tuning.
  - Zoom/pan with mouse wheel or trackpad.

- **Left Panel - Tuning Parameters**:
  - Dials for Steps, Offset, Depth, Skew, Stretch, Base Tune.
  - Adjust these to shape your scale—changes update the grid instantly.

- **Right Panel - MIDI Settings**:
  - Input Mode dropdown: Regular MIDI or MPE.
  - Output Mode: Choose Mono, Poly, MPE, or MTS.
  - Channel selectors and pitch bend range sliders.

- **Bottom Bar**:
  - Status messages (e.g., "MTS Connected").
  - OSC/Network toggle for advanced control.

**Step-by-Step First Tune**:
1. Load the default preset (12-TET).
2. Play a C major scale on your keyboard—notes should sound in standard tuning.
3. Turn the "Steps Mapped" dial to 19 (for 19-TET). The grid updates, and your playing now uses 19 equal steps per octave.
4. Select a few nodes on the grid (click to highlight) to create a custom mode.
5. Save as "My First Tuning" via the preset menu.

**Tip**: Hover over any control for a tooltip explaining its function. Use the spacebar to toggle play/pause for testing without your DAW.

**Warning**: High "Depth" values (>5) can create very dense grids—zoom out to navigate.

## The Pitch Grid

The heart of PitchGrid is the Pitch Grid, a visual map of musical intervals that makes tuning design as easy as drawing.

### Lattice Visualization
The grid is a lattice diagram where each node represents a pitch class relative to the root. By default, it's a meantone-style lattice:
- **Generators**: The horizontal axis uses the "fifth" generator (702 cents in 12-TET), vertical uses the "third" (386 cents).
- **Nodes**: Small circles or hexagons, colored by interval quality (consonant green, dissonant red).
- **Lines**: Connect related pitches; thickness shows strength of relationship.

As you adjust parameters, the lattice morphs—nodes move to reflect the new tuning ratios.

### Node Selection
Click nodes to select/deselect them for your active scale:
- **Single Click**: Toggle a node on/off.
- **Shift+Click**: Select a range (e.g., for a mode).
- **Ctrl+Click (Cmd on Mac)**: Multi-select non-adjacent nodes.
- Selected nodes form your playable scale; unselected ones are silent or detuned.

The grid shows 3-7 octaves by default, but you can scroll to explore more.

### Optimization
Once nodes are selected, click the "Optimize" button (magnifying glass icon) to refine the tuning:
- **What it Does**: Minimizes beating and maximizes consonance within your constraints (e.g., pure fifths).
- **Options**: Choose "Best Fit" for overall smoothness or "Pure Octaves" to lock 2:1 ratios.
- **Result**: Nodes snap to optimal positions; a preview plays the scale automatically.

**Tip**: Start with a simple selection like the Pythagorean comma (7 fifths up) to hear the wolf interval resolve.

**Warning**: Optimization can alter your manual selections—save a copy first via presets.

## Tuning Parameters

PitchGrid's parameters let you fine-tune your lattice with precision. All are accessible via dials in the left panel, with values shown in cents or ratios.

### Steps Mapped
- **Range**: 3-36 steps per octave.
- **Default**: 12 (standard semitones).
- **How to Adjust**: Turn the dial or type a value. This sets how many divisions fit in an octave.
- **Effect**: Higher steps create finer microtonal divisions (e.g., 31 for Bohlen-Pierce approximations).
- **Tip**: For xenharmonic scales, try 19 or 22 steps—listen for smooth melodies.

### Offset
- **Range**: 0-1 (fraction of the generator cycle).
- **Default**: ~0.458 (5/12 for fifth-based).
- **How to Adjust**: Drag the dial; the grid rotates visually.
- **Effect**: Shifts the mode's starting point on the lattice, useful for modal interchange.
- **Example**: Offset 0 starts on the root; 0.5 inverts the scale.

### Depth
- **Range**: 0-7 layers.
- **Default**: 3.
- **How to Adjust**: Increase to add more octaves/generators.
- **Effect**: Expands the lattice depth, revealing higher harmonics or extended modes.
- **Tip**: Keep at 3-4 for performance; higher for composition exploration.

### Skew
- **Range**: 0.5-1 (asymmetry factor).
- **Default**: ~0.583.
- **How to Adjust**: Skew the dial to tilt the lattice.
- **Effect**: Distorts the grid for asymmetric tunings, like skewed meantone.
- **Warning**: Extreme skew (>0.9) can make navigation tricky—use zoom.

### Stretch
- **Range**: 0.1-2.2 (compression/expansion).
- **Default**: 1.0 (linear).
- **How to Adjust**: Stretch the dial outward for expansion.
- **Effect**: Scales intervals non-linearly, simulating piano stretch or electronic detuning.
- **Tip**: 1.1-1.2 adds warmth to acoustic simulations.

### Base Tune
- **Range**: A=415-466 Hz (or -100 to +100 cents from 440).
- **Default**: 440 Hz.
- **How to Adjust**: Fine-tune the root frequency dial.
- **Effect**: Sets the reference pitch for the entire tuning.
- **Example**: 432 Hz for a relaxed, historical feel.

**Step-by-Step Adjustment**:
1. Set Steps to your base division (e.g., 12).
2. Adjust Offset to position your tonic.
3. Increase Depth for range.
4. Fine-tune Skew and Stretch for timbre.
5. Set Base Tune last.

All changes update in real-time—play along to hear!

## MIDI Input and Output

PitchGrid excels at transforming MIDI data for microtonal performance. Configure I/O in the right panel.

### Configurations
- **Input**: Receives standard MIDI notes (0-127) or MPE data.
- **Output**: Remaps to your tuning, sending note-ons, pitch bends, and poly pressure.
- **Routing**: Input from DAW/keyboard; output to synths on the same track.

### Input Modes
- **Regular MIDI**: Standard note + velocity + pitch bend (global).
  - Select via dropdown.
  - Pitch Bend Range: 1-96 semitones (default 12); adjusts sensitivity.
- **MPE**: Polyphonic expression per note.
  - Enable for controllers like Seaboard.
  - Input Pitch Bend Range: Separate control for per-note bends.
  - Pitch Bend Mode: "Toward Scale" (bends to nearest note) or "Along Mapped" (follows grid paths).

**Tip**: For MPE, ensure your controller sends on multiple channels (e.g., 1-15).

### Output Modes
Choose how tuned MIDI is sent:
- **None**: Processes internally for visualization only.
- **Mono**: Single channel output with pitch bend for microtones.
  - Channel: 1-16.
- **Poly**: Multi-channel notes (up to 16 voices).
  - Start/End Channel: Define range (e.g., 1-8 for octophonic).
- **MPE**: Polyphonic output with per-note expression.
  - Zone: Lower (ch 1 master, 2-16 members) or Upper (ch 16 master, 1-15 members).
  - Num Channels: 1-15 voices.
- **MTS-ESP**: Integrates with MTS master (see Advanced Features).

**Avoid Duplicates**: Toggle to prevent multiple notes on the same output channel—useful for poly modes.

**Step-by-Step Setup**:
1. Set Input Mode to match your controller.
2. Choose Output Mode (start with MPE for expressivity).
3. Adjust channels to avoid conflicts with other tracks.
4. Test: Play a glissando—pitch bends should follow your tuning.

**Warning**: In Poly mode, exceeding channel limits mutes notes. Monitor the status bar.

## Preset Management

Presets let you save and recall tunings quickly.

### Loading/Saving
- **Load**: Dropdown in toolbar > Select preset > Click "Load."
- **Save**: "Save As" > Name it > Choose thumbnail (auto-generated from grid).
- **Overwrite**: Right-click a preset > "Overwrite."

Presets store tuning parameters and node selections, but not global MIDI settings.

### Factory Presets
Start with these:
- **12-TET**: Standard Western tuning.
- **Pythagorean**: Pure fifths with wolf intervals.
- **1/4-Comma Meantone**: Renaissance consonance.
- **Just Intonation**: Pure intervals based on harmonics.
- **19-TET**: Bright, smooth alternative.
- **Bohlen-Pierce**: Acoustic scale in 3:5:7 ratios.
- And more—over 20 included.

Thumbnails show a mini lattice preview.

**Tip**: Organize into banks (e.g., "Xenharmonic," "Historical") via the preset editor.

**Warning**: Factory presets are read-only—duplicate before editing.

## Advanced Features

For pros, PitchGrid offers deep integration options.

### MTS-ESP Integration
MTS-ESP allows sharing tunings across plugins.
- **Enable**: Set Output Mode to MTS.
- **Master/Slave**: PitchGrid can act as master (broadcasts tuning) or slave (follows external master).
- **Setup**: Install MTS-ESP master plugin first; PitchGrid auto-detects.
- **Benefits**: Sync tunings across instruments in your project.

If conflict (another master), a dialog prompts to resolve.

### OSC Control
Open Sound Control for remote parameter tweaks.
- **Enable**: Toggle "OSC" in bottom bar.
- **Port**: Default 8000 (incoming), 8001 (outgoing).
- **Mapping**: Send `/pitchgrid/steps 19` to set steps to 19.
- **Apps**: Use TouchOSC or Lemur on iPad for wireless control.

Broadcasts status changes to connected clients.

### Networking
Share your grid view:
- **WebSocket Server**: Auto-starts on load (port 5174+).
- **Connect**: From browser or app, go to `ws://localhost:5174`.
- **Features**: Remote node selection, parameter control, live playing notes.
- **Use Case**: Collaborate with a tuner while you perform.

**Tip**: Firewall may block—allow incoming on the port shown in status.

**Warning**: Networking is local-only; no internet required.

## Licensing and Trial

PitchGrid offers a generous trial and flexible licensing.

### Activation
- **Trial**: 14 full days, all features unlocked.
- **Full License**: One-time purchase ($99), perpetual use, free updates v1.x.
- **Process**: Enter key in plugin > Activate offline.
- **Transfer**: Deactivate on old machine via menu > Reactivate on new.

### Restrictions
- Trial: Watermark on audio after 14 days; no saving presets.
- License: Non-transferable without deactivation; no resale.
- Educational discounts available—contact sales@node.audio.

Support includes email and community forum.

## Troubleshooting

Encounter issues? Here's help.

### Common Issues
- **Plugin Not Loading**: Rescan in DAW; check format compatibility.
- **No Sound**: Ensure MIDI routing: Controller > PitchGrid > Synth. Check output mode != None.
- **Grid Not Updating**: Restart plugin; clear cache (toolbar > Reset View).
- **MPE Glitches**: Verify controller channels; set Input Range to match device.
- **MTS Not Connecting**: Run as admin (Windows); check MTS master is loaded first.
- **High CPU**: Reduce Depth; disable OSC if unused.
- **WebView Blank**: Update graphics drivers; try different browser engine if available.

### Support
- **Docs**: [pitchgrid.io/manual](https://pitchgrid.io/manual)
- **Forum**: community.pitchgrid.io
- **Email**: support@node.audio
- **Updates**: Check for new versions in plugin menu.

**Tip**: Enable debug logging (advanced settings) and share logs with support.

### DAW-Specific Tips
- **Ableton Live**: Use as MIDI effect on instrument track. Enable "Monitor In" for live input.
- **Logic Pro**: Insert in MIDI FX slot. For MPE, set track to "MPE Enabled."
- **Reaper**: Add to track FX; route MIDI via sends if needed.
- **FL Studio**: Place in MIDI settings > Effects. Use Patcher for complex routing.

If problems persist, our team is here to help—happy tuning!

# End User License Agreement

[Standard EULA text - abbreviated for manual]

This license agreement governs your use of PitchGrid. By installing, you agree to...

(Full EULA available at pitchgrid.io/eula)
