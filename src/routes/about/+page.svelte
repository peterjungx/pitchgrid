<script>
    import DsGrid from '$lib/components/DSGrid.svelte';
import Logo from '../_Logo.svelte';
    import { Anchor } from '@svelteuidev/core';
</script>

<style>
    section {
        font-family: Arial, sans-serif;
        margin: 20px;
    }
    h1 {
        font-size: 2em;
        font-family: 'Futura', sans-serif;
        font-weight:normal;
    }
</style>
<section>

<h1>
    <Logo size={50} /> PITCH GRID [alpha]
</h1>
<p>
    A tool for exploring rank-2 regular temperaments (aka consistent tunings) 
    and isomorphic keyboard layouts for Western music.
</p>
<p>
    <i>
        Note: This software is alpha version and is full of bugs. 
        Nevertheless, feel free to explore and consider giving feedback.
    </i>
</p>
<p>
    Use your computer keyboard or the mouse to play notes, if you are on a desktop, 
    or touch the notes if you are on a mobile device. Use the sidebar menu to 
    configure the temperament and the keyboard layout, to visualize different grids 
    or to select the synth sound. 
</p>


<h2>Is that black key a C# or a Db?</h2>

<p>
    Music is mostly taught using the piano keyboard, so we tend to think that these two notes, 
    C# and Db, are one and the same. But they are not. 
    It is true that on the piano keyboard these two notes necessarily have the same pitch. 
    There is only one key for both of them, after all. 
    But this does not mean they are the same note. 
    In fact, professional violonists will know to play a C# and a Db at slightly different pitches 
    to make them sound best within the context of the piece they are playing.
</p>

<h2>The (d,s)-Lattice</h2>

<p>
    To make this difference explicit, we arrange the notes on a lattice, where one coordinate 
    represents the number of diatonic steps (d) and the other the number of semitones (s) relative to
    a base note, which we pick to be C. On this lattice, 
    C# lives at the coordinates (0,1) whereas Db lives at (1,1).
</p>
<p>
    For the temperament most regularly used in the discussion of Western music, 
    the 12-tone equal temperament (or 12-TET for short),
    the pitches associated with these two notes C# and Db are the same. More generally, in 12-TET, all pitches at the same value on 
    the s coordinate axis are the same.
    But besides 12-TET, there exists an infinite number of alternative
    temperaments. For instance, we can change the direction of constant pitch such that a perfect fifth 
    sounds at the just ratio of 3/2 while still keeping the octave at the just ratio of 2/1, and magically
    all other notes will get the pitches corresponding to the Pythagorean temperament. 
</p>
<p>
    The PitchGrid allows you to set different rank-2 regular temperaments and explore the resulting pitches. 
    In fact, some of the most important temperaments are rank-2 regular (or consistent), 
    like all Meantone temperaments,
    as well as the popular 31-TET (which is very close to the 1/4-comma Meantone).
    
</p>
<p>
    Historically, most temperaments considered keep the octave at the just ratio of 2/1, but 
    we can now explore the possibility of changing this as well. What if we make the most important 
    intervals in Western music, the major and minor thirds, sound at the just ratios of 5/4 and 6/5?
    Magically, the perfect fifth will sound at the just ratio of 3/2, as well. All major and minor chords
    are now just. We thus obtain the Cleantone temperament (also known as the 5-limit tuning), and has been
    <a href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4452394">shown</a> 
    to be the most well sounding temperament for Western music according to certain mathematical measures.
</p>

<h2>Isomorphic Keyboards</h2>
<p>
    According to the arrangement of the notes in such a regular grid, 
    all chords have the same shape, the correct music theoretical accidentals and the same frequency ratios 
    , i.e. they sound the same in all keys,
    no matter where they are played.
    Such a keyboard layout is called isomorphic.
</p>
<p>
    The PitchGrid thus allows you to explore different isomorphic keyboard layouts.
    You can select a layout from the menu, or (if you are on a desktop computer) 
    you can click and drag some special notes 
    (those with a 0 coordinate value on either axis, e.g. C# or Dbb) to reshape the keyboard configuration 
    to any shape you like.
</p>

<h2>Piano Keyboard</h2>
<p>
    In contrast to the PitchGrid, a piano keyboard is one-dimensional. Thus it can only host 
    a subset of all the notes of Western music. For each black key, you would need to decide 
    which of the accidentals it shall represent. As it turns out, you can lay a strip into the 
    PitchGrid, and if the strip hits the center of a note key, that key can be present on the 
    piano. This is what the Piano strip does. You could shift the strip to have a different 
    set of notes on the black keys.
</p>

<h2>Future Work</h2>
<p>
    I intend to add more features to the PitchGrid. Here is a list of some that I am considering:
</p>
<ul>
    <li>Regular MIDI in / MPE out (with pitches adjusted according to the selected temperament) using WebMIDI</li>
    <li>Pitch visualizations for different intervals</li>
    <li>Continuous modification of tunings to enable live morphing between tunings during a performance</li>
    <li>Visualization of a piano keyboard</li>
    <li>Miscellaneous bug fixes</li>
    <li>More educational content</li>
</ul>
<p>
    Have fun! And if you think you've learned something or you want to support my work, please consider
<Anchor href="https://www.buymeacoffee.com/peterjungx">buying me a coffee</Anchor>. 
</p>
<p>
    Cheers, <br/>Peter
</p>

<a href="/">Home</a>

</section>