# ![](/favicon.png "40") The PitchGrid Concept

## What Is PitchGrid?

Western music theory captures something real. Scales, keys, modes, modulation, counterpoint — these concepts work because they reflect genuine structure in how tones relate to each other. But somewhere along the way, the piano keyboard collapsed something two-dimensional onto a single line, and we stopped noticing what was lost. The tonal structure of Western music is fundamentally **two-dimensional**, and recognizing this doesn't replace the theory you know — it reveals where it comes from, and unlocks a framework that generalizes far beyond the Western tradition.

<!-- TODO: Replace with animated GIF of PitchGrid plugin skew parameter -->

Here is the core insight. A diatonic scale divides the octave into seven steps of two different sizes — five large (whole tones) and two small (semitones), arranged in a specific cyclic pattern: AABAAAB for major. This two-interval structure means every note can be located on a **two-dimensional lattice**, with one axis for each interval type. Pitch runs diagonally across this grid. Tuning is just the angle of that diagonal.

This is the PitchGrid: a rectangular lattice of notes where:

- **Horizontal movement** corresponds to one interval type (say, whole tones)
- **Vertical movement** corresponds to the other (semitones)
- **Scales** are paths across the grid from a note to its octave
- **Key changes** are single-node displacements of those paths
- **Tuning** is encoded as the slope of the constant-pitch lines — one parameter collapses centuries of temperament history into geometry

On this grid, F♯ and G♭ are genuinely different notes at different positions. Enharmonic equivalence is a special case (12-TET), not a universal truth. Every chord has a fixed geometric shape that sounds the same wherever you place it — the grid is **isomorphic** in both geometry and harmony.

But the framework doesn't stop at Western music. The diatonic scale's (5,2) pattern is one node in an infinite tree of **generalized diatonic scales** — any cyclic pattern of two coprime-count interval sizes, distributed as evenly as possible. Pentatonic scales, the 8-note scales used in some non-Western traditions, Wilson's Moments of Symmetry — all are nodes in this tree, and all can be mapped onto one another through simple linear transformations of the grid. A scale from one system can be projected into any other, providing a compositional bridge between radically different tonal worlds.

The practical payoff is immediate. The PitchGrid lattice morphs into any isomorphic keyboard layout (Wicki, Fokker, Bosanquet, Lumatone) via linear transformation. Mapping generalized scales onto a piano keyboard becomes a concrete procedure. Tuning any regular temperament requires setting exactly two parameters. And the relationship between timbre and tuning — where tuning and spectrum can be jointly optimized for consonance — becomes a natural extension of the framework rather than an exotic footnote.

The B-A-C-H motif (B♭-A-C-B♮ in German notation) turns out to be a sequential walk through a (3,5)-diatonic scale mapped into the Western system — a structure Bach may have intuited three centuries ago.

PitchGrid is a framework for understanding the **structural logic** underlying any scale built from two interval sizes. It separates structure from tuning, makes the geometry of harmony visible, and opens a systematic path to creating new tonal systems — complete with their own key signatures, modes, and modulation spaces.

---

## Deep Dive

The sections below expand on each aspect of the framework. They can be read in order or explored independently.

---

### 1. What the Piano Hid

Western music theory has settled on twelve equal semitones as its foundation. Pick up any introductory textbook and you'll find "an octave has twelve semitones" stated as axiom rather than approximation. This framing — practical as it is — obscures the richer structure underneath and makes non-Western tuning systems seem exotic or arbitrary rather than structurally principled.

The practical consequence is cultural. Cheap digital keyboards with 12-TET hardwired ship worldwide. DAWs assume twelve semitones. MIDI was built around it. Musicians raised in this ecosystem lack tools to conceptualize — let alone perform in — the tuning systems of Gamelan, Indian classical music, Arabic maqam, or the many African traditions that use intervals with no clean 12-TET approximation.

What's needed: instruments that are easy to retune, a theory that accommodates multiple tonal systems within a unified framework, and a way for musicians trained in Western conventions to build intuition about unfamiliar scales. PitchGrid addresses the second and third of these. The first is an engineering challenge — but one that becomes far more tractable once the theory is clear.

---

### 2. Two Orthogonal Insights

PitchGrid rests on two distinct ideas that are worth separating explicitly:

**Insight 1: The prime-dimension structure of harmony.** The number of perceptually relevant prime harmonics in an instrument's overtone series determines the dimensionality of harmonic space. For instruments with harmonic spectra, the first few primes (2, 3, 5, 7…) generate the intervals that the ear can detect as consonant. Two primes give a 2D harmonic space; three give 3D; and so on. This is the domain of just intonation theory and lattice-based harmony (Euler, Riemann, Johnston, etc.).

**Insight 2: The 2D structure of scales.** Any scale built from two interval sizes — regardless of how those intervals are tuned — has an inherent two-dimensional structure. The number of each interval type defines a lattice, and the scale is a path across it. This is PitchGrid's domain.

These insights are **orthogonal**. Insight 1 is about the physics of consonance — why certain frequency ratios sound good. Insight 2 is about the combinatorial structure of scales — how notes relate to each other through transposition and modulation. PitchGrid operates primarily in the world of Insight 2, though the two connect when choosing tunings.

---

### 3. Harmony, Timbre, and the Limits of Just Intonation

The standard account of consonance, following Helmholtz, says: instruments produce harmonic spectra; two notes sound good together when their partials align; simple frequency ratios produce the most alignment. This account is **correct as far as it goes**, but incomplete in important ways.

**What the standard account gets right.** Feedback-driven instruments — bowed strings, blown pipes, the human voice, church organs — produce spectra that are harmonic to excellent approximation. The feedback mechanism locks overtone frequencies to exact integer multiples of the fundamental. For these instruments, just intervals genuinely maximize partial alignment, and the link between simple ratios and consonance is robust.

**Where it needs extension.** Not all instruments are feedback-driven. Many musicians assume that all spectra are harmonic — this is not true, and understanding why matters. Bells, gamelans, metallophones, and xylophones are struck or plucked bodies whose spectra are significantly non-harmonic. Piano strings, due to their stiffness, have partials that deviate slightly but measurably from harmonic — enough that piano tuners working by ear arrive at stretched tunings where octaves are wider than 2:1, better matching the actual partials.

There are also psychoacoustic effects that make the human ear particularly receptive to harmonic spectra. Harmonic sounds are not merely common — they are perceptually privileged. This means we cannot simply pick an arbitrary scale and generate matching timbres that will sound equally natural.

Plomp and Levelt established experimentally (1965) that when two pure sine tones are played together, the perceived dissonance curve is perfectly smooth — no preference for simple ratios. Consonance at specific ratios emerges only when partials are present. This confirms that consonance is a property of the **interaction between timbre and tuning**, not of frequency ratios in isolation.

![Sensory dissonance between two sine tones — smooth, with no preference for simple ratios.](/docs/images/Screenshot_2024-08-20_at_17.08.49.png)

![Sensory dissonance with six harmonic partials — consonance at specific ratios emerges.](/docs/images/Screenshot_2024-08-20_at_17.17.10.png)

The implication: an instrument's timbre and its tuning should ideally be considered jointly. For acoustic instruments with harmonic spectra, the standard just-intonation framework works well. For non-harmonic timbres, the corresponding tunings that maximize consonance will differ from just intonation — as demonstrated by Gamelan music, where the tuning of the gongs and the tuning of the scales have co-evolved over centuries.

![Traditional Gamelan instruments — their non-harmonic spectra co-evolved with their tuning systems.](/docs/images/Traditional_indonesian_instruments04.jpg)

Digital technology opens a new possibility: **jointly optimizing tuning and spectrum**. Rather than starting from a fixed scale and trying to force a timbre onto it (or vice versa), one can treat the problem as a coupled optimization — finding the sweet spot where both tuning and timbre work together for maximum consonance. This is not trivial, and departures from harmonicity face real psychoacoustic limits. But within those limits, it offers a path to genuinely new sonic territory. William Sethares has laid important groundwork in this direction.

The structural framework developed below applies regardless of the tuning chosen or the timbre used — it concerns the **architecture** of scales, which is independent of the specific frequency ratios assigned to intervals.

---

### 4. The Origin of the Diatonic Scale

Two and a half millennia ago, Pythagoras outlined a tuning scheme from the resonances of a vibrating string:

1. Take the first two harmonics: 2:1 and 3:1.
2. Define 2:1 as the octave — the interval of equivalence.
3. Derive the interval 3:2 (the harmonic 3:1 reduced by one octave).
4. Stack this 3:2 interval six times, reducing by octaves as needed.

The resulting seven notes, arranged by ascending pitch, give a scale with a specific interval pattern: five large steps (L ≈ 204 cents) and two small steps (s ≈ 90 cents), distributed as **LLLsLLs** — the Lydian mode. The seven rotations of this pattern yield the seven church modes. Major (LLsLLLs) and natural minor (LsLLsLL) are the most prominent.

That all large steps are exactly equal, and all small steps are exactly equal, is not a coincidence — it's a mathematical necessity, provable via the three-gap theorem (Steinhaus conjecture).

This cyclic pattern of two interval sizes is the structural backbone of Western music. Everything that follows builds on it.

---

### 5. Changing Keys and the Twelve-Tone Compromise

A distinctive feature of Western music is modulation — changing keys by altering a single note. Raising the F in C-major to F♯ shifts the pattern from LLsLLLs to LLLsLLs, yielding G-major. Lowering B to B♭ gives F-major. Each modulation swaps two adjacent intervals (an Ls pair becomes sL, or vice versa), preserving the overall structure.

The desire to modulate freely motivated adding black keys to the keyboard. Five black keys allow six different keys. But the seventh creates a problem: F♯ and G♭, which in Pythagorean tuning differ by about 24 cents, must share a single key.

The 12-tone equal temperament resolves this by slightly adjusting all intervals so F♯ and G♭ coincide exactly. The gain: unlimited modulation through all twelve keys. The cost: the identification F♯ = G♭ became so deeply embedded that we forgot it was an approximation. DAWs, MIDI, notation software, even mathematical music theory — all assume twelve semitones per octave.

But F♯ and G♭ **are** different notes. In any tuning other than 12-TET, they have different pitches. Western notation already knows this — it has double sharps and double flats, which would be meaningless in a twelve-tone world. The notation system is faithful to the underlying 2D structure. It's the instruments and the software that lost track.

Let us abandon the identification, and see where the mathematics leads.

---

### 6. The PitchGrid: A Two-Dimensional Lattice of Notes

Once we accept that F♯ ≠ G♭, the note space becomes two-dimensional. Every note occupies a unique position on a rectangular lattice defined by two axes:

- **Horizontal (a-axis):** movement by the larger diatonic interval
- **Vertical (b-axis):** movement by the smaller diatonic interval

Adding a sharp to any note means moving one step in the direction (−1, +1); adding a flat means (+1, −1). Notes at different lattice positions may happen to have similar pitches — we call them **enharmonic** — but they are structurally distinct.

![The PitchGrid lattice with note positions.](/docs/images/Screenshot_2024-08-08_at_20.19.39.png)

![Note names on the lattice — each position is unique.](/docs/images/Screenshot_2024-08-08_at_20.20.33.png)

Pitch is one-dimensional; the lattice is two-dimensional. So there exists a **direction of constant pitch** across the grid. In 12-TET, this direction aligns with the enharmonic direction (−2, +1), making F♯ and G♭ identical in pitch. In Pythagorean tuning, the constant-pitch direction tilts slightly. In quarter-comma meantone, it tilts further.

**This is the key geometric insight: tuning is the angle of the constant-pitch lines.** A single parameter — the slope — encodes any rank-2 regular temperament. Pythagorean, all meantone variants, 31-TET, 19-TET — each corresponds to a specific tilt. Centuries of temperament history collapse into geometry.

![Constant-pitch lines on the lattice — their angle encodes the tuning.](/docs/images/Screenshot_2024-08-08_at_20.52.36.png)

The lattice also makes the octave assignment explicit: a **scale** is a path from the origin (0,0) to the octave node (5,2), stepping along lattice edges. The seven modes of Western music are the seven distinct shortest paths. A **key change** displaces exactly one node on the path.

![A diatonic scale as a path across the lattice.](/docs/images/Screenshot_2024-08-20_at_22.09.59.png)

![Key changes displace a single node on the path.](/docs/images/Screenshot_2024-08-20_at_22.16.56.png)

#### Tuning as Geometry

The tuning of the entire lattice is determined by assigning frequency ratios to exactly two intervals. All other ratios follow from regularity (consistency). For the Western system:
- Fix the octave at a chosen ratio (traditionally 2:1)
- Fix one other interval (the fifth at 3:2 for Pythagorean; the major third at 5:4 for quarter-comma meantone)

Every note's pitch is then determined. No lookup tables, no case-by-case reasoning — just two numbers and a grid.

---

### 7. Isomorphic Layouts and the Piano Strip

The PitchGrid is inherently isomorphic: every chord has a fixed geometric shape, and translating it anywhere on the lattice preserves both the shape **and** the frequency ratios (given consistent tuning). This makes the grid a natural model for isomorphic keyboards.

Any isomorphic keyboard layout — Fokker, Wicki-Hayden, Bosanquet, Lumatone, Striso — can be obtained from the PitchGrid by a linear transformation (scaling and shearing the axes). The [PitchGrid web app](https://pitchgrid.io) implements this directly, with presets for common layouts.

![Fokker organ keyboard — an early isomorphic layout for 31-TET.](https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Fokker_organ_keyboard_design.png/200px-Fokker_organ_keyboard_design.png)

![Wicki-Hayden layout — note that F♯ and G♭ are explicitly different keys.](https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Wicki-Hayden_Musical_Note_Layout.png/400px-Wicki-Hayden_Musical_Note_Layout.png)

The PitchGrid can be morphed into any of these layouts by shearing:

![Shearing along the horizontal axis...](/docs/images/Screenshot_2024-08-20_at_22.28.24.png)

![...and then along the vertical axis yields a compact isomorphic layout.](/docs/images/Screenshot_2024-08-20_at_22.37.58.png)

**The Piano Strip.** Mapping the 2D lattice onto a 1D piano keyboard requires projecting a strip of the lattice — running parallel to the octave direction, twelve notes wide — onto the keys. The strip's lateral position determines which enharmonic variant each black key gets: shifting it decides whether the key between F and G is F♯ or G♭. This choice is only forced by the piano's constraint of twelve keys per octave. On an isomorphic keyboard, no such compromise is necessary.

![The piano strip — a 12-note-wide projection of the 2D lattice onto 1D.](/docs/images/Screenshot_2024-08-15_at_21.58.52.png)

---

### 8. Generalized Diatonic Scales

Why seven notes? The number is not mathematically privileged — it's a cognitive sweet spot, roughly matching the number of items humans hold in working memory. The structural properties that make diatonic music work depend not on the number seven specifically, but on having **two coprime counts of two interval sizes, distributed as evenly as possible**.

This is our definition:

> **Generalized diatonic scale:** A cyclic pattern of two different interval sizes whose counts are coprime, distributed as evenly as possible.

The Western scale is the (5,2) case: 5 large and 2 small intervals. But (2,3) gives a 5-note scale, (3,5) gives an 8-note scale, (5,7) gives a 12-note scale — each with its own modes, key signatures, and modulation logic. These are the same structures Erv Wilson catalogued as Moments of Symmetry (MOS), arrived at here through a construction that cleanly separates structure from tuning.

![The Western (2,5) diatonic scale on the lattice.](/docs/images/Screenshot_2024-08-15_at_17.11.19.png)

#### The Coprime Tree

All possible generalized diatonic scales can be generated from the pair (1,1) by two operations:

- **f:** (a, b) → (a, a+b)
- **g:** (a, b) → (b, a+b)

Starting from (1,1) and applying these recursively (removing one duplicate at the first step) produces every pair of coprime positive integers — the complete catalogue of generalized diatonic scales:

```
(1,1) → (1,2) → (1,3), (2,3) → (1,4), (3,4), (2,5), (3,5) → ...
```

The Western diatonic scale sits at node **(2,5)**. Each arrow in this tree corresponds to a linear transformation of the lattice, meaning any scale can be mapped into any other. This is the engine behind the [PitchGrid Scale Mapper](https://pitchgrid.io/scalemapper).

---

### 9. The B-A-C-H Discovery

The mapping between scale systems produces striking results. Take the (3,5)-diatonic scale (8 notes per octave, pattern ABBABBAB) and map it into the Western (2,5) system. Walking this scale sequentially from C yields: C–B–D–F–E–G–B♭–A–C.

Starting on B recovers the famous **B-A-C-H motif** (B♭–A–C–B♮ in German notation):

```
B♭ → A → C → B♮
```

<!-- TODO: Add lattice diagram showing (3,5) scale path mapped into (2,5) with B-A-C-H highlighted -->

This is not a coincidence — it's a sequential walk through a (3,5)-diatonic scale projected into Western pitch space. The motif's melodic appeal comes precisely from its use of only two interval sizes. We can speculate that Bach himself intuited these inter-scale structures.

Walking the mapped scale further produces naturally compelling melodic lines, suggesting the PitchGrid mapping as a **practical compositional tool** — a systematic way to generate melodic material from unfamiliar scale structures, rendered in familiar notation.

---

### 10. The Generalized Major Scale

To label notes consistently across all generalized diatonic scales, we need to designate one mode as "major" for each (a,b). In Western music, C-major is the reference — the mode closest to Lydian that contains both the perfect fourth and perfect fifth.

Generalizing:

> **The generalized major scale** is the second mode starting with the interval type that has the larger count.

This definition yields a unique major mode for every (a,b) with a ≠ b (the (1,1) case, having equal counts, is the sole exception). From the major mode, all other modes are reached by adding accidentals — exactly as in Western music.

The generalized equivalents of F and G — the perfect fourth and fifth — are always the two notes whose lattice positions lie closest to the straight line connecting the base note to the octave. They are the first and last notes to modulate in any key-change sequence.

---

### 11. Mapping Between Scale Systems

Since each step in the coprime tree is a linear transformation, any (a,b)-scale can be projected into any other. The [PitchGrid Scale Mapper](https://pitchgrid.io/scalemapper) implements this directly.

![Mapping a (3,5)-scale into the Western (2,5) system — a three-step transformation.](/docs/images/Screenshot_2024-08-15_at_17.09.17.png)

**Example:** Map a (3,5)-scale into the Western (2,5) system.

1. Invert the tree step (2,3) → (3,5) to get back to (2,3)
2. Apply the tree step (2,3) → (2,5) to arrive in Western space

Each note in the source lattice maps to a unique note in the target. The mapped scale can be played on a standard instrument, notated in standard notation, and analyzed with standard theory — while carrying the structural logic of its origin system.

This procedure works for any pair of systems and provides a concrete bridge between tonal traditions that otherwise seem incommensurable.

---

### 12. What Does This Mean for a Musician?

<!-- TODO: Add screenshot of PitchGrid app or Scale Mapper in action -->

**For composers:** PitchGrid provides a systematic way to explore scales beyond the Western diatonic system while leveraging existing musical intuition. Map an unfamiliar scale into your system, and it becomes a new collection of intervals you can walk, arpeggiate, and harmonize — with guaranteed structural coherence (key changes work, modes exist, transposition is consistent).

**For instrument builders:** The lattice framework gives a principled basis for isomorphic keyboard design. Any generalized diatonic scale has a canonical isomorphic layout. The relationship between layout geometry and tuning is explicit. Supporting multiple tuning systems becomes a matter of changing one parameter rather than redesigning the instrument.

**For theorists:** The clean separation of structure from tuning resolves confusions that plague discussions mixing temperament with scale theory. Questions like "what makes a scale diatonic?" and "how do key changes generalize?" get precise, system-independent answers.

**For performers:** Isomorphic layouts mean that chord shapes and fingering patterns learned for one key work in every key — and, with PitchGrid's framework, can transfer across scale systems entirely. The geometric invariance is both visual and muscular.

---

### 13. Advanced Topics

#### The Piano Strip for Generalized Scales

Any generalized diatonic scale with 12 or fewer notes per octave can be mapped onto a piano keyboard by projecting through an appropriately positioned strip. The strip's width accommodates the note count; its position determines which enharmonic variants appear. This makes non-Western scales playable on existing instruments, albeit with the structural compromises inherent in dimensional reduction.

#### Scales Within Scales

The 22 shrutis of Indian classical music can be generated by an outer (5,7) Pythagorean scale where each large step is subdivided by a (1,2) inner scale tuned to the syntonic comma. This recursive structure produces three distinct step sizes — no longer diatonic in the generalized sense, but accommodable in a three-dimensional PitchGrid extension where the constant-pitch direction becomes a plane.

Indian ragas select subsets (typically 7) of the 22 shrutis, forming sub-scales that modulate by changing single notes — a structure analogous to Western key changes but operating within a richer parent system.

#### The Dual Lattice

The coprime tree's first step uses only one of the two generating functions. The omitted branch produces **dual lattices** — structurally distinct systems for each (a,b) that are related by swapping the roles of the two interval types. For any (a,b), the dual (a,b)′ is obtained by unwinding to (1,1), reflecting across the a = b line, and rewinding.

#### Choice of Octave

The interval of equivalence need not be 2:1. Assigning the generalized octave to a Western perfect fifth, perfect eleventh, or any other interval creates systems that overlap partially with familiar scales but diverge in their modulation logic — each implying a distinct music theory.

#### Notation

Western staff notation can represent any generalized diatonic scale via the PitchGrid mapping, since accidentals are unlimited. For practical performance, the PitchGrid app can generate appropriate mappings for both standard notation and piano-keyboard assignment.

---

### References and Further Reading

- Helmholtz, H. von. *On the Sensations of Tone* (1863/1895)
- Plomp, R. & Levelt, W.J.M. "Tonal Consonance and Critical Bandwidth" (1965)
- Sethares, W.A. *Tuning, Timbre, Spectrum, Scale* (1998)
- Wilson, E. "Moments of Symmetry" — [anaphoria.com](https://www.anaphoria.com/mos.pdf)
- Deutsch, H.-P. "Musical Tonality" (the Cleantone temperament paper)
- von Schweinitz, W. "The 22 Shrutis" (2006) — [plainsound.org](https://www.plainsound.org/pdfs/srutis.pdf)
- The [PitchGrid web app](https://pitchgrid.io) and [Scale Mapper](https://pitchgrid.io/scalemapper)
