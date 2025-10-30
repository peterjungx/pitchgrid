<script lang="ts">
    import Logo from "$lib/components/_Logo.svelte";
    import LogoWithCaption from "$lib/components/_LogoWithCaption.svelte";

</script>

<style>
    :global(body) {
        background-color: #F0F0F0;
        color: black;
    }
    :global(.container) {
        margin: 10px;
    }
</style>


<div class="container">
    <LogoWithCaption size={50} />
    <h1>Welcome to the PitchGrid Homepage</h1>
    <p>
        <b>The tonal structure of Western music is (and always was) two-dimensional.</b>
    </p>
    <p>
        <img src="/docs/images/PitchGrid-Basic-CMajor.png" alt="PitchGrid Basic C-Major" height="200" />
    </p>
    <p>
        The PitchGrid concept clarifies this realization and 
        draws a vision of its potential impact.
    </p>
    <h2>Who is behind the PitchGrid?</h2>
    <p>
        The PitchGrid project is the brainchild of Peter Jung, an independent researcher. Contact me at peter at pitchgrid dot io.
    </p>
    <h2>The PitchGrid Plugin</h2>
    <p>
        Tuning theory and current technology are too complicated and stand in the way of creative exploration. 
        Tuning should be easy and fun. That's why I created the PitchGrid VST/AU plugin, which allows you to explore
        a wide range of tunings simply by turning knobs. It soon will be released in collaboration 
        with <a href="https://node.audio" target="_blank">Node Audio</a>, 
        but you can already 
        <a href="https://www.youtube.com/playlist?list=PLY4_jglyyynCPIssKpbC-ZejFcSrjBemR" target="_blank">watch it in action</a>.
        If you are interested in joining the private beta, please write me an email.
    </p>
    <h2>Music created with PitchGrid</h2>
    <p>
        Here are some musical pieces created with the PitchGrid plugin:
    </p>
    <ul>
        <li>
            <a href="https://beatsbasteln.bandcamp.com/track/tranquil-9-5in17">"Tranquil 9&5in17" by Beats Basteln</a> 
        </li>
    </ul>
    <h2>Theory</h2>
    <ul>
        <li>
            <a href="/info/PitchGrid">The PitchGrid Concept</a>
        </li>
    </ul>
    <h2>Tools</h2>
    <ul>
        <li>
            <a href="https://library.vcvrack.com/PitchGrid/MicroExquis">MicroExquis</a> 
            A VCV Rack module and microtonal interface to the Exquis isomorphic MPE controller by Intuitive Instruments.
            You can find some documentation <a href="/info/MicroExquis">right here</a>.
        </li>
        <li>
            <a href="/diatonic">Diatonic PitchGrid</a> 
            Online exploration tool for different tunings of the diatonic scale and its fully isomorphic layouts. 
            Includes a small applet to tune your SOMA Terra synthesizer.
        </li>
        <li>
            <a href="/scalemapper">PitchGrid Scale Mapper</a>
            Online exploration tool for regular scale systems (recovering Erv Wilson's MOS scales) and mappings between them.
        </li>
        <li>
            <a href="/mosmapper-piano">MOS Piano</a>
            Online exploration tool that maps the PitchGrid to the piano keyboard.
        </li>
    </ul>
    <h2>PitchGrid for Rhythm</h2>
    <p>
        Extending the PitchGrid concept to rhythm generation, PGRhythm is a parametric MIDI sequencer that creates complex rhythmic patterns using mathematical principles.
    </p>
    <ul>
        <li>
            <a href="https://github.com/peterjungx/pgrhythm">PGRhythm on GitHub</a>
        </li>
        <li>
            <a href="https://youtu.be/dhIEhQWGUYo">Demo Video</a>
        </li>
        <li>
            <a href="/helix-metronome">Helix Metronome</a> A special metronome view inspired by <a href="https://sebastiangramss.de/helix/" target="_blank">Sebastian Gramss' Helix</a>.
        </li>
    </ul>
    <h2>Videos</h2>
    <ul>
        <li>
            <a href="https://youtu.be/nl94-T3geNw">Microtonality on the Exquis - The PitchGrid Way</a> Watch me showing the features of the MicroExquis VCV Rack module.
        </li>
        <li>
            <a href="https://youtu.be/ACGUp7ZtsWc">PitchGrid - First Demo</a> Watch me showing off some first impressions of my work on the PitchGrid Rack for VCV and some theoretical background.
        </li>
    </ul>
    <h2>Events</h2>
    <ul>
        <li>
            <a href="https://www.superbooth.com/en/messe-and-exhibitors/exhibitors/pitchgrid.html">PitchGrid exhibits at Superbooth 2025</a>
            Join us at the Superbooth 2025 in Berlin, Germany (May 8th-10th) where I showcase the PitchGrid and its applications. 
        </li>
        <li>
            <a href="https://www.superbooth.com/en/events/details/pro-audio-presentation-intuitive-instruments-pitchgrid-entonal-studio.html">Talk at SuperBooth 2025</a>
            Join us at the joint talk with Intuitive Instruments and Entonal Studio at Superbooth 2025 in Berlin, Germany, May 9th 2:30pm-4:00pm.
        </li>
    </ul>
    <h2>Source Code</h2>
    <p>The sources of the PitchGrid project are publicly available on GitHub. Please get in touch if you'd like to contribute.</p>
    <ul>
        <li>
            <a href="https://github.com/peterjungx/pitchgrid">pitchgrid</a> This Site, including the Diatonic PitchGrid, the ScaleMapper and the MOS Piano.
        </li>
        <li>
            <a href="https://github.com/peterjungx/PitchGridRack">PitchGridRack</a> VCV Rack Plugin, including the MicroExquis module.
        </li>
        <li>
            <a href="https://github.com/peterjungx/scalatrix">scalatrix</a> 
            A library aimed at unifying the algorithmic foundations of the PitchGrid into a single code base. 
            Written in C++, includes Python and WASM bindings. 
        </li>
    </ul> 
    <h2>References</h2>
    <!-- quote newton's "Standing on the shoulders of giants" -->
    <p>
        The PitchGrid is built on the shoulders of giants. 
        I would like to thank the following people for their work and inspiration:
    </p>
    <ul>
        <li>
            <a href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4452394">Musical Tonality (2023)</a> 
            Hans Peter Deutsch, my former employer, who wrote a 500+ page mathematical paper 
            on the quest for the perfect tonal system for Western music, probably while meditating in the Himalayas.
            This was the starting point of my work on the PitchGrid.
        </li>
        <li>
            <a href="https://www.anaphoria.com/wilson.html">The Wilson Archives on Anaphoria Island</a> 
            Erv Wilson, who first discovered the MOS scales (Moments of Symmetry), which I have re-discovered on the PitchGrid 2d-lattice. 
            Kraig Grady, who popularized the MOS scales.
        </li>
        <li>
            <a href="https://sethares.engr.wisc.edu">William Sethares</a> 
            For his profound insights and research on the connection between tuning and the spectrum of sound.
        </li>
        <li>
            <a href="https://nowandxen.libsyn.com">Now and Xen</a>
            Stephen Weigel's podcast proved an invaluable source of information on the current state of microtonality. 
        </li>
    </ul>
    <p>
        If you are a builder of tools for musicians and are interested in integrating the PitchGrid into your product, 
        I would be happy to support you. Please contact me at peter at pitchgrid dot io.
    </p>
</div>