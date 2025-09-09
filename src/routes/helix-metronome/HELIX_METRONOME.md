We are going to implement a very special metronome at src/routes/helix-metronome/+page.svelte. 

## About the Helix concept

The Helix system and its tempo illusions originally stem from the family of auditory illusions within electronic music, initially applied with overlapping sine waves. The concept is inspired by the research and works of the French composer Jean-Claude Risset and the American computer artist Kenneth Knowlton from the late 1970s. Helix systems are based on the superimposition of several synchronized, fading rhythmic streams, played in parallel at different speeds (subdivisions) and faded in and out at specific points. This creates the impression of a seemingly endless acceleration or deceleration.

An acoustic analogy can be found in the Shepard-Risset glissandi, which give the impression of eternally ascending or descending pitches. A visual analogy can be seen in the Penrose stairs or M.C. Escher’s endless waterfall.

Unlike conventional music forms, which are usually based on a uniform predetermined tempo, the musical flow in the Helix system has no fixed, stable base tempo. All musical parameters such as pitch, melody, harmony, dynamics, and timbral events are executed on the basis of simple or multiple accelerandi and ritardandi with seemingly infinite progression.

Through the simultaneous use of various subdivisions within the overarching metabar structures, a spiral-like tempo perception with more or less pronounced self-similarity is created. This produces a never-ending, captivating effect (accelerando) or, in the case of a ritardando, a kind of continuous braking effect.

In electronic and computer-generated music, the basic Helix form (as a Risset rhythm) is sometimes used with a 2:1 ratio. Since 2022, this concept has also been implemented with live musicians. The practical interpretative implementation of the Helix concept with musicians in an ensemble context is a compositional and improvisational research project by the Cologne music groups “STATES OF PLAY” and “METEORS.”

## Ratio

Positive Ratio (accelerando): 2:1 = Accelerando with an initially half tempo layer, which then accelerates to double tempo, until another half tempo layer fades in again.

Other Positive Ratios (accelerando): 3:2; 5:4; 5:3, 7:2, etc.


Negative Ratio (ritardando): 1:2 = Ritardando with an initially double tempo layer, which then slows down to half tempo, until another double tempo layer fades in again.

Other Negative Ratios (ritardando): 2:3; 4:5; 3:5; 2:7, etc.


## About the metronome

The Helix Metronome is intended to be a tool for musicians who want to practice within the Helix framework. The URL pitchgrid.io/helix-metronome should be loadable from a mobile device like an iPhone, i.e. it should have a responsive design. The user can start/stop the metronome and configure different parameters which are rather special, since they need to accommodate for the special needs of the concept. 

## Mathematics of the Helix Metronome

The metronome implements increasing/decreasing tempo with a constant rate of tempo change for consecutive beats.

On an axis denoting linear time progression, we can draw tick marks representing beat events. For an increasing tempo, the tick mark density increases on the axis. For a decreasing tempo, the tick mark density decreases. Since the rate of change is constant in any case,  the tick mark positions can be calculated by the logarithm of a scaled and shifted array of the integers.  

## UI

To build a metronome, we display a portion of this time axis with tick marks wound up as a spiral. Time is represented by a global playhead that runs clockwise in a circle like the pointer of an anaolog stop watch. The spiral is wound up two to four times. This setting (number of cycles) is configured by the user. Equal angles thus correspond to equal time. On the spiral, beat tick marks are displayed for every beat. For increasing tempo (accelerando), the spiral winds from the inside to the outside (in clockwise direction, i.e. with the flow of time), since the larger radius farther away from the center can better accommodate from the increasing frequency of tick marks. For decreasing tempo (ritardando) the spiral winds from the outside to the inside. The radius of the spiral (distance from center at a given angle) should linearly increase with time (angle). This means, that the distance between two consecutive cycles of the displayed portion of the time axis (the spiral) have constant distance. While playing, the global playhead crosses the spiral at two to four locations at any given time. These crossing points represent two to four local playheads on the time axis. Local playheads appear when the global playhead reaches the start of the spiral and vanish when the global playhead reaches the end of the spiral. The time axis (when unrolled, i.e. in code) thus always has as many local playheads as the spiral has cycles. These local playheads move with the same speed on the time axis. 

Whenever a local playhead hits a tick mark, the playback of a metronome tick sound sample is played. We should have at least four different metronome tick sounds. A local playhead is always associated with one particular tick sound, and the tick sounds should be assigned in a round-robin fashion.

In the UI, i.e. the spiral view, tick marks are represented by small circles. When the playhead hits such a tick mark, its visual representation should change in size and color for a short period of time, visually indicating the beat.

The display area for the spiral is between two circles, an inner circle (radius R/2) and an outer circle (radius R) where R denotes the radius of the full helix display area, around 90% of the smaller window dimension. Let's define the number of cycles as N_C. N_C range can be 2, 3 or 4, depending on user setting. The spiral starts and ends at angle 0 (12 o clock). We can divide the spiral into spiral segments, representing the N_C cycles. The next spiral segment starts where the previous spiral segment ends. Spiral segments always run from angle 0 to angle 0 (or 2 pi), i.e. start and end at 12 o clock. To find the exact start and end coordinates of the spiral (at angle 0) we need to divide the helix display area (running from R/2 to R) into N_C+1 parts. Measured from the center of the circles (the origin), for increasing tempo, the first segment starts at R/2 + 0.5 * (R-R/2)/(N_C+1), and ends at R/2 + 1.5 * (R-R/2)/(N_C+1). Its radial coordinate increases linearly with angle. So at pi (6 o clock) it runs through    R/2 + 1.0 * (R-R/2)/(N_C+1). More generally, a spiral segment's curve at angle $\alpha$ and for segment number $0 < n < N_C$ is defined by the distance of the spiral segment from the origin, which is given by $d_s(\alpha, n)=R/2+(n + 0.5 + \alpha/(2 \pi))*(R-R/2)/(N_C+1)$, for accelerando. 

For ritardando, the spiral reverses and runs to the inside. The formula then reads $d_s(\alpha, n)=R - (n + 0.5 + \alpha/(2 \pi))*(R-R/2)/(N_C+1)$.

## Positions of tick mark beats

Positions of tick mark beats are given in units of $\alpha/(2 \pi)$. For numbers $0 \leq t < 1$, ticks belong to the first spiral segment (n=0), for $1 \leq t < 2$ to the next spiral segment etc. The displayed tick marks thus have allowed values $0 \leq t < N_C$, tick marks outside this range are not displayed. These are the tick marks on the time axis that are represented on the spiral in the helix metronome.

In the middle area (i.e. the area covered by the inner circle with radius R/2) the ratio is displayed and the user can adjust it. Two integers: Numerator num and Denominator den. If $num>den$, the helix is accelerando, if $num<den$, the helix is ritardando. To determine the positions of the tick marks, we can use the formula $t_i = N_C * (log(i)-log(den^N_C))/(log(num^N_C)-log(den^N_C))$ where i takes on values between $den^N_C$ and $num^N_C$, for accelerando, and $t_i = N_C * (log(num^N_C)-log(i))/(log(num^N_C)-log(den^N_C))$ where i takes on values between $num^N_C$ and $den^N_C$. 

## Additional controls

- Play/pause button
- Stop/rewind button 
- Length of period. We need a slider and a coupled numerical value display. Allowed values are 1 second to 60 seconds, continuous. This parameter controls how long it takes for the playhead to go full circle once.



