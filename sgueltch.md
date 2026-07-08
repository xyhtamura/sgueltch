# Sgueltch Suite: Technical & Philosophy Architecture Overview
*A Comprehensive System Guide for Large Language Models (LLMs)*

---

## 1. Executive Summary & Epistemic Core

### The Core Thesis
**Sgueltch** (a hybrid neologism emerging between *squelch* and *glitch*) is an organic glitch software suite and artistic research project. The architectural spine of the suite operates against a single technical gesture: **quantization**. Modern digital media systems discretize continuous spaces into rigid, standardized grids or allowed positions—often born from legacy computational scarcity—and propagate them by institutional path-dependence (lock-in). 

Sgueltch operates in the **interstitial spaces** disallowed by these standards. It shifts digital error away from traditional glitch art’s rigid, square, block-based, pixelated fractures (which are merely the codecs congealing and confessing their quantized regimes on schedule) and moves toward continuous, fluid, dynamically unfolding, and biologically inspired substrates: ooze, tissue, silt, weather, viscosity, lesion, flocking, breath, and growth.

### Technical Stratification
The suite models computational commitments as a three-tier stack:
1. **Substrate Layer:** The commitment is baked deeply into the format or codec itself (e.g., JPEG's 8×8 Discrete Cosine Transform block or Unicode's discrete codepoints). Escaping the grid requires building completely alternate substrates.
2. **Tooling / UX Layer:** The commitment exists within software defaults (e.g., the 12-Tone Equal Temperament (12-TET) grid in Digital Audio Workstations or the metrical midi clock). These are structural constraints that can be dynamically subverted or bypassed through specialized counter-tooling.
3. **Belief / Habit Layer:** The constraints are purely imaginary or cultural, dictated by custom (e.g., failing to drive digital synthesis through chaotic mathematical simulations like three-body problems or prime sequences).

---

## 2. Theoretical Framework & Lineage

The Sgueltch suite is not a naive biophilic pursuit or a romantic celebration of "nature" over the machine. It is a rigorous implementation of **format theory**, **decolonial Science and Technology Studies (STS)**, and **media archaeology**. Its conceptual substrate relies on the following key pillars:

* **Format Theory & Perceptual Coding (Jonathan Sterne):** Formats are treated as historical, cultural, and political decisions regarding what data to discard. Traditional glitch breaks a codec but honors its underlying format rules; Sgueltch modifies the substrate to change the nature of the data discard itself.
* **Purity Regimes & The Anthropology of Dirt (Mary Douglas):** Dirt is defined as *"matter out of place."* Quantized grids function as purity regimes designed to enforce computational and epistemic hygiene. Sgueltch intentionally introduces "matter out of place" to destabilize these boundary membranes.
* **Cosmotechnics & Concretization (Yuk Hui & Gilbert Simondon):** Hui's cosmotechnics is scaled down to the micro-level of the **8×8 DCT block, the codepoint, and the semitone**. It shows that file formats embed highly specific, contingent worldviews that congeal into a false sense of absolute necessity via Simondonian *concretization*.
* **Agential Realism & The Apparatus (Karen Barad):** Standards are treated as physical-conceptual apparatuses that execute an *agential cut*, dynamically dictating what is rendered legible or illegible (e.g., Unicode deciding which pre-colonial scripts or marks are digitally "real").
* **Path Dependence & Lock-in (Paul David):** Explains how sub-optimal technical choices (like the Cartesian grid or the QWERTY keyboard) congeal during a format's technological infancy and persist indefinitely via socio-economic inertia.
* **Critical Glitch Dialogues (Rosa Menkman & Legacy Russell):** Sgueltch expands Menkman’s glitch momentum and Russell’s glitch feminism by moving beyond diagnostic critique into structural alternative engineering.

---

## 3. The Sgueltch Software Suite (The Portfolio)

The suite is comprised of specialized tools spanning image processing, typography, audio synthesis, file architecture, acausal video effects, and printing simulation.

### A. Pixel Lesions (Organic Pixel Sorter)
* **Classification:** Pixel Sorter / Cellular Automata
* **Core Substrate:** Reimagines pixel sorting as a live biological infection or fungal colonisation. Instead of sorting pixels along uniform rows/columns (which yields typical linear digital fractures), it seeds "lesions" that expand radially or follow texturing forces, sorting pixels exclusively within their organic, expanding frontiers.
* **Growth Strains (Propagation Algorithms):**
    * *Lichen:* A classic stochastic, non-linear frontier expansion.
    * *Slime Mold:* A directional expansion driven by configurable X/Y bias fields and drift forces.
    * *Perivascular Crawl:* An edge-following algorithm that actively tracks high-contrast boundaries using a live Sobel filter matrix.
    * *Sheet Delamination:* A double-frequency sinusoidal noise wavefront that modulates membrane permeability, forming sweeping lobes and bays instead of concentric rings.
    * *Mycelial Rot:* A momentum-based tendril growth that shoots out long-distance aperiodic filaments.
    * *Coral Polyp:* Radial growth controlled by a sinusoidal porosity function, creating gap-riddled, ringed cellular architectures.
    * *Spore Cloud:* Combines local contiguous flood-fills with long-distance stochastic spore jumps, creating satellite clusters.
    * *Vascular Dendrite:* Floating-angle capillary paths completely uncoupled from 8-directional snapping constraints, branching at non-perpendicular angles.
    * *Osmotic Pressure:* Priority-queue wavefront seep modulated by multi-frequency spatial noise to create complex membrane ridges.
* **Effect Modules (Strains):**
    * *Gradient Sort & Radial Sort:* Sorts pixels by luminance, hue, saturation, or RGB channels inside sectors or cellular bounds.
    * *Viscous Smear & Liquefaction:* Remaps neighborhood pixel lookup arrays to simulate churning fluid flow and viscous blending.
    * *Chromatic Seep:* Progressive chromatic aberration split where channel sampling offsets expand dynamically with the lesion size.
    * *Rot Palette & Necrotic Inversion:* Discards native color data to re-map luminance through a specialized three-stop biological decay gradient ( Bruise-Purple Shadows $ightarrow$ Bile Green-Yellow Mids $ightarrow$ Fevered Off-White Highlights ).

### B. SiltCRT (Soft Granular Signal Emulator)
* **Classification:** WebGL Screen Shader / Analog Phosphor Emulator
* **Core Substrate:** Reimagines the physical interface of an analog screen by ditching standard linear rows of RGB triads. It emulates phosphor screen decay using an aperiodic **Voronoi tessellated phosphor cell structure**.
* **Technical Mechanics:**
    * *Turbulence & Flow Speed:* Simulates live current flow and signal fluid turbulence drifting across the display interface.
    * *Dual Bleed System:* Combines a positive bright-matter *Kawase Bloom* with a subtractive dark-matter *Umbra* (the mathematical inverse of CRT bloom).
    * *Persistence Feedback:* Models lingering phosphor decay and chemical trails directly across independent rendering frames, enabling images to "breathe" and rot instead of locking into place.
    * *Tube presentation:* Applies simulated curvature, vignette, and deep organic screen grain (silt grain).

### C. Gurgulator (Wet Granular Resynthesizer)
* **Classification:** Web Audio API Sound Generator / Granular Synthesizer
* **Core Substrate:** Reimagines time-stretching and audio granular resynthesis as fluid fermentation and bodily transformation, stepping away from the standard rigid metrical clocks and grid-snapped sample boundaries found in mainstream DAWs.
* **Technical Mechanics:**
    * *Performance Pad (Petri Dish):* A live X/Y control coordinate map that drives macro axes simultaneously: Horizontal (Dry $\leftrightarrow$ Drenched Goo Reverb) and Vertical (Calm $\leftrightarrow$ Frantic Pitch/Stutter Frenzy).
    * *Peristalsis Modulation:* A slow, undulating visceral modulation cycle that warps sample read heads, sweeps bandpass filters, and shifts formants away from static structural baselines.
    * *Gooey Impulse Response (IR):* A custom convolution matrix synthesized using exponential decay envelopes combined with unstable AM tone swells and localized noise bursts to emulate wet, enclosed acoustic chambers.
    * *Biological Culture Profiles (Presets):*
        * `NATA:` High viscosity, slow bubbling rate, low pitch drift, gentle AM swell.
        * `LAMBIC:` High bubble frequency, short grain, wide pitch drift, intense peristaltic action.
        * `KOMBUCHA:` Aggressive mutation, maximum stutter clusters, high frantic factor.
        * `BILE:` Massive grains, ultra-viscous sluggish response, low deep-formant cast.
        * `CURDLE:` High pitch fragmentation, minimal overlap, erratic bubble pops.
        * `RENNET:` Long evolving drones, maximum grain overlap, high goo drench.

### D. TypeBojangler (Typographic Irregularity Renderer)
* **Classification:** Typographic Interface
* **Core Substrate:** Designed to actively sabotage the typesetting grid. It is a live browser-based rendering engine that maps text characters as independent vector objects, infusing them with seeded, character-specific noise.
* **Technical Mechanics:** Disrupts standard typesetting kerning and metric tables by continuously jittering baseline positions, angle rotations, color drift, opacity variances, breathing rates, and chromatic ghosting. It directly demonstrates that type can remain highly expressive while completely resisting fixed coordinate grids.

### E. goopCodecs (Databending Custom Formats)
* **Classification:** File Architecture / Custom Binary Codecs
* **Core Substrate:** A collection of specialized image codecs that entirely replace standard pixel-matrix lattices with non-grid geometric representations. When these files are subjected to raw byte damage or text-editor injection, they degrade into fluid, round, or organic lesions rather than typical hard digital compression squares.
* **The Custom Formats:**
    * `.ooid` (Ooid Codec): Encodes image information as an array of Gaussian blob records; damage generates soft swelling, localized clouding, and chemical fog.
    * `.scute` (Scute Codec): Encodes images as territory vectors built over Voronoi seed coordinates; damage causes territorial shifts and cellular cell expansions.
    * `.vermis` (Vermis Codec): Encodes image vectors across a continuous single-filament Hilbert curve thread; damage generates long, thread-like bleeding flows.

### F. Bakezuri — 化け摺り (Wet Print Engine)
* **Classification:** Process Codec / Marbling Simulation
* **Core Substrate:** A unique hybrid printing simulator that merges automated mechanical replication with fluid suminagashi marbling across a single interactive wet ink-field.
* **Technical Mechanics:** Images are ingested and split into quantized ink grids, deposited entirely wet onto the virtual print bed, and left to execute an autonomous performance. Inks bleed, interact, repel, and form misregistrations over time.
* **File Architecture Ecosystem:**
    * `.urumizuri`: Stores vulnerable wet-state matrix coordinate blocks for manual data manipulation.
    * `.bakezuri`: A seedless, process-oriented recipe file format that saves the exact structural timeline of passes and ink bleeds. Because it is seedless, it operates as a live script; every individual performance bleeds uniquely based on real-time execution parameters.

### G. CyberScotoma (Acausal Motion-Field Graft)
* **Classification:** Video Effect / Non-Grid Datamosh / Hindcasts Bridge
* **Public Address:** `https://xyhtamura.github.io/sgueltch/cyberscotoma/`
* **Core Substrate:** Builds a scintillating scotoma as a browser-based video effect. Instead of producing datamosh artifacts by exposing codec macroblocks, it decodes to frames and creates its own non-grid hold regions using Voronoi cells with noised edges.
* **Technical Mechanics:**
    * *Scotoma Regions:* Drawn bloom curves progressively latch cells, creating blind spots that stop refreshing without snapping to the compression grid.
    * *Motion-Field Graft:* Held regions receive the current per-frame motion field, so donor-descended content keeps flowing with motion it does not own.
    * *Acausal Donor Offset:* At onset, each held region can seed from `t + donorOffset`; positive offsets make future frames bleed backward into the present.
    * *Cross-Clip Graft:* A separate donor clip can supply the tissue inside the scotoma, extending the Pythia-style control/source interface into video.
    * *Offline Render & Export:* The effect renders sequentially, caches frames for instant scrub, and exports WebM.
* **Conceptual Role:** CyberScotoma is the hinge between Sgueltch and Hindcasts: as Sgueltch, it is a biological visual-field lesion and a non-grid refusal of macroblock damage; as Hindcasts, it is a precognitive video effect whose aura arrives before the event it announces.

### H. Remanence (Magnetic Print-Through) — *kin, Hindcasts-home*
* **Classification:** Acausal Tape-Decay Effect / Audio + Video / Hindcasts Bridge
* **Address:** `hindcasts/remanence/` · full spec in `hindcasts/remanence/remanence.md`
* **Core Substrate:** A wound reel imprints itself — loud moments print onto neighbouring wraps as **pre-echo** (the ghost that arrives before the sound). Remanence turns magnetic print-through into an effect that has read the tape before it plays; the same reel engine runs on audio (multi-tap delay with negative taps) and on video (frame composite, print's spatial LF bias as ghost-blur).
* **Why it is kin, not core:** By the **suite placement rule**, a corruption-forward app with a *specially organic* substrate (ooze / tissue / lesion / mycelium / marbling / Voronoi) is Sgueltch; an app whose main idea is whole-file analysis, with glitch a side effect or *not specially organic* (Prolepsis), is Hindcasts. Remanence's damage is **analog-magnetic / nostalgic**, not biological-organic, and its spine is whole-file acausality (print-through needs the future) — so it lives in Hindcasts and is kept here as **kin**, the mirror of how CyberScotoma lives in Sgueltch and is kept as kin in Hindcasts. Same hinge status, opposite primary homes.
* **Contact point with Sgueltch:** it degrades rather than restores, and VHS is where audio and video share one substrate — the tape-decay aesthetic and the a/v collapse are Sgueltch-adjacent even though the engine is a Hindcasts acausal analysis.

---

## 4. The Conceptual Frontier (Unbuilt & Future Works)

The unbuilt frameworks within the Sgueltch project are intentional technical failures, where the boundary wall of existing computer architecture functions directly as the medium:

1.  **Pain / Scream:** A typographic installation where the required glyphs and semantic markings reside explicitly in the mathematical void *between* standardized Unicode codepoints. Because the Unicode Consortium has no available allocation slots for these characters, the piece cannot physically exist as software; the installation is the documented, violent collision with the codepoint wall.
2.  **Cloud Conference:** A piece built around the limits of algorithmic computing, requiring authentic external environmental entropy. It acts as an open critique of machine-enclosed pseudo-randomness by demanding live oceanic or atmospheric forces to generate its unpredictable, mutating vectors.

---

## 5. Architectural Synthesis: The Pivot to Frutiger Aero & The Pacific

The ultimate evolution of the Sgueltch framework serves as the structural underpinnings of a deeper aesthetic and political inquiry: the **Frutiger Aero / Pacific Pivot**.

* **Frutiger Aero as Visual Ideology:** Sgueltch identifies the Frutiger Aero aesthetic (dominant in mid-2000s to early-2010s operating systems, characterized by clear glass interfaces, glossy bubbles, clinical green/blue colors, and pristine water elements) as the ultimate **visual mask of computational hygiene**. It is the aesthetic skin of the clean, quantized purity regime.
* **The Pacific as the Refusal:** The ocean represents the definitive un-griddable, continuous, dynamically-unfolding medium. The Pacific Ocean, housing the Great Pacific Garbage Patch, represents **matter out of place at a planetary scale**—the ultimate return of the dirty "mess" that computational hygiene attempts to simulate away.
* **The Cosmotechnical Question:** Sgueltch leverages its portfolio of tools to answer a core aesthetic problem: *"How do you inhabit the Frutiger Aero hygiene aesthetic from the position of the raw matter it was explicitly designed to exclude?"* Sgueltch transitions from abstract format critique into a tactical platform where the wave functions as a counter-poetics to the colonial land instrument of the grid.

---
### Context Checklist
* **Substrate Rule:** Sgueltch is *not* a post-processing visual filter. It changes the underlying media substrate (Voronoi vs. lattice, float angle vs. snap, blob vs. block).
* **Antagonists:** Traditional glitch art (complicit with grids), quantization matrices, Unicode codepoints, 12-TET tuning, and standard block-based compression algorithms.
* **Core Terminology:** Interstitial space, rotware, cosmotechnics of the codec, purity regimes, wet granular resynthesis, seedless recipes, matter out of place.
