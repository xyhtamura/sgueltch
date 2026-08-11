# Sgueltch Suite: Technical & Philosophy Architecture Overview
*A Comprehensive System Guide for Large Language Models (LLMs)*

---

## 1. Executive Summary & Epistemic Core

### The Core Thesis
**Sgueltch** (a neologism combining *squelch* and *glitch*) is an organic glitch software suite and media research project. The architectural spine of the suite targets a specific technical limitation: **quantization and format lock-in**. Modern digital media standards discretize spatial, temporal, and spectral domains into rigid grids. When corrupted, these formats fail exclusively along their engineered fault lines—a process analogous to clinical pathology, where biological tissue under stress executes a fixed repertoire of stereotyped responses (swelling, fibrosis, necrosis) dictated by its cellular mechanics. An injured organism inflames; it cannot sprout unrelated structures. Standard glitch operations produce rectangular macroblocks, raster tears, and grid confetti because the underlying substrate prescribes those exact failure modes.

Sgueltch shifts digital error from breaking standardized codecs to constructing alternative computational substrates. By replacing discrete lattices with continuous fields, aperiodic Voronoi cells, and viscous filaments, signal degradation moves as organic seepage rather than raster breakdown. Ooze, tissue, silt, viscosity, lesions, and growth function here as alternative data architectures rather than surface stylizations.

### Technical Stratification
The suite models computational commitments as a three-tier stack:
1. **Substrate Layer:** The commitment is engineered directly into the format or codec (e.g., JPEG 8×8 Discrete Cosine Transform blocks or Unicode codepoints). Escaping the grid requires constructing alternate substrates.
2. **Tooling Layer:** The commitment exists within software defaults (e.g., 12-Tone Equal Temperament tuning or metrical MIDI clocks). These constraints can be bypassed or overridden through custom tooling.
3. **Habit / Epistemic Layer:** The constraints persist through cultural custom (e.g., assuming digital synthesis must follow rectilinear coordinate bounds).

---

## 2. Theoretical Framework & Lineage

Sgueltch relies on **format theory**, **infrastructure studies**, **media archaeology**, and **anthropology of science**:

* **Stereotyped Pathological Responses & Substrate Failure:** Systems under stress do not escape their architecture; they execute hardwired failure modes. Canonical glitch theory analyzes error as a diagnostic gesture—*Rosa Menkman* (interruption exposing system mechanics), *Michael Betancourt* (critical error disrupting operational logic), and *Legacy Russell* (glitch as refusal of normative exclusion). Sgueltch retains this critical positioning but observes its aesthetic limits: diagnostic error on a standard codec merely reproduces the codec's grid.
* **Format Theory & Data Discard (Jonathan Sterne):** Formats are historical and political decisions regarding which data to preserve and which to discard. Standard glitch breaks a codec while preserving its format rules; Sgueltch alters the substrate to reconfigure the nature of the discard.
* **Infrastructure & Backgrounded Habit (Susan Leigh Star):** Technical choices normalize into backgrounded infrastructure, shaping visual and auditory habits without active user awareness.
* **Epistemic Purity Regimes & Dirt (Mary Douglas):** Codecs enforce a schematic purity regime designed to maintain computational hygiene. Dirt—defined as matter out of place—takes on a rectangular geometry when displaced from a rectangular order. Replacing the grid changes the geometry of displacement.
* **Cosmotechnics & Concretization (Yuk Hui & Gilbert Simondon):** Standards embed specific cultural worldviews (cosmotechnics) that congeal into apparent technical necessity through Simondonian concretization at the level of the block, codepoint, and semitone.
* **Agential Realism & The Apparatus (Karen Barad):** Formats act as physical-conceptual apparatuses executing an agential cut, determining what signals are legible within digital systems.
* **Path Dependence & Lock-in (Paul David):** Sub-optimal technical choices (such as the Cartesian grid) persist through economic and infrastructural inertia.

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
* **Documentation:** [`siltcrt/siltcrt.md`](siltcrt/siltcrt.md)
* **Core Substrate:** Reimagines the physical interface of an analog screen by ditching standard linear rows of RGB triads. Its phosphor substrate is selectable: aperiodic probabilistic **Silt** cells, overlapping Gaussian **Ooid** bodies, breathing weighted-Voronoi **Scute** territories, or the archival square **Block** lattice retained as a historical control.
* **Technical Mechanics:**
    * *Phosphor Substrates:* Geometry and signal memory are independent, allowing each spatial substrate to be combined with dry, remanent, or wet-feedback behaviour.
    * *Turbulence & Flow Speed:* Simulates live current flow and signal fluid turbulence drifting across the display interface.
    * *Dual Bleed System:* Combines a positive bright-matter *Kawase Bloom* with a subtractive dark-matter *Umbra* (the mathematical inverse of CRT bloom).
    * *Signal Memory:* **Dry** replaces every frame, **Remanence** models lingering max-decay phosphor trails, and **Seep** advects and diffuses the previous frame through a viscous field before decay.
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

### H. Syncytium (Geodesic Cell Growth) — *specced, unbuilt*
* **Classification:** Video Effect / Generative Tissue / Image-Derived Metric
* **Documentation:** [`syncytium/syncytium.md`](syncytium/syncytium.md)
* **Core Substrate:** Detects edges and then refuses to draw them. The edge field becomes a **metric** rather than ink: a cell colony is grown outward under a distance that is cheap across flat tissue and expensive across contours, so cells pool inside the image's own anatomy and their membranes are never drawn, only priced. Simultaneously a video effect (it reads the footage) and a generative graphic (it draws its own organism). The lattice refused is not the raster but the **Euclidean metric** underneath every Voronoi elsewhere in the suite — `.scute`, Scute phosphor, CyberScotoma hold-regions all partition space by image-blind straight-line distance.
* **Technical Mechanics:**
    * *Geodesic Voronoi:* eikonal solve outward from all seeds under slowness `F = 1 + k·‖edge‖^γ`, derived from a temporally smoothed structure tensor; labels carried with the wavefront.
    * *Seeding Strains:* **Epithelial** (nucleate on contours, grow inward), **Parenchymal** (nucleate at medial-axis maxima, press outward), **Blastemal** (detail-weighted stochastic). Lloyd relaxation runs under the geodesic metric, with state carried across frames.
    * *Metabolism:* Persistent (seeds as advected particles with age, birth, death) ↔ Apoptotic (per-frame rebirth — boil) on one Turnover control.
    * *Interstitium Rule:* cell bodies are drawn **inset** from their own walls with fluid between them — the rule that separates cytology from stained glass. Turgor 1.0 retained as the honest stained-glass control, the way SiltCRT keeps the Block lattice.
    * *Fenestration:* broken contours let colonies herniate between compartments; the leak is exposed as an aesthetic control rather than closed morphologically.
* **Conceptual Role:** Answers the Crystallize/Mosaic filter genre, whose cells have never looked at the picture. Its planned *lag graft* (bodies filled from `t ± lag` while walls track the present) is the Hindcasts contact point, but the organic substrate dominates, so the home is Sgueltch under the placement rule.

### I. Remanence (Magnetic Print-Through) — *kin, Hindcasts-home*
* **Classification:** Acausal Tape-Decay Effect / Audio + Video / Hindcasts Bridge
* **Address:** `hindcasts/remanence/` · full spec in `hindcasts/remanence/remanence.md`
* **Core Substrate:** A wound reel imprints itself — loud moments print onto neighbouring wraps as **pre-echo** (the ghost that arrives before the sound). Remanence turns magnetic print-through into an effect that has read the tape before it plays; the same reel engine runs on audio (multi-tap delay with negative taps) and on video (frame composite, print's spatial LF bias as ghost-blur).
* **Why it is kin, not core:** By the **suite placement rule**, a corruption-forward app with a *specially organic* substrate (ooze / tissue / lesion / mycelium / marbling / Voronoi) is Sgueltch; an app whose main idea is whole-file analysis, with glitch a side effect or *not specially organic* (Prolepsis), is Hindcasts. Remanence's damage is **analog-magnetic / nostalgic**, not biological-organic, and its spine is whole-file acausality (print-through needs the future) — so it lives in Hindcasts and is kept here as **kin**, the mirror of how CyberScotoma lives in Sgueltch and is kept as kin in Hindcasts. Same hinge status, opposite primary homes.
* **Contact point with Sgueltch:** it degrades rather than restores, and VHS is where audio and video share one substrate — the tape-decay aesthetic and the a/v collapse are Sgueltch-adjacent even though the engine is a Hindcasts acausal analysis. Its MELT preset marks the crossover door; the Sgueltch-home continuation is **Tape as Tissue** (§5.1).

---

## 4. The Reply Map: Canon and Response

The suite divides into two species of work. **Replies** are mutations of canonical glitch-art processes: an existing, recognized glitch gesture is taken up and transplanted onto an organic substrate, so the piece speaks *back* to a tradition. **Original instruments** apply glitch-like processes where no glitch canon exists — media territories nobody had thought to corrupt this way. Both are Sgueltch; the distinction is dialogic position, not membership.

| Tool | Species | Replies to (canon) | The mutation |
|---|---|---|---|
| **Pixel Lesions** | reply — *core glitch statement* | Pixel sorting (the Asendorf `ASDFPixelSort` lineage of row/column luminance sorts) | Sorting confined inside expanding biological frontiers (lichen, mycelium, dendrite) instead of raster rows — the sort loses its axis |
| **goopCodecs** | reply — *core glitch statement* | Databending: hex editing, text-editor injection, WordPad-bending of raw bytes | The substrate itself is replaced, so identical byte damage yields blobs, cell-territory shifts, and thread-bleeds instead of raster tearing and block confetti |
| **CyberScotoma** | reply | Datamosh (I-frame removal / P-frame bloom, the Murata–Paper Rad lineage) and lag/buffer-hold artifacts | Hold regions are noised Voronoi scotomata with grafted motion fields, refusing the macroblock grid the canon depends on |
| **SiltCRT** | half-reply | The CRT-filter / scanline-shader genre (retro display emulation) | The genre lovingly reproduces the RGB-triad row grid; SiltCRT replaces it with aperiodic Voronoi phosphor and lets persistence rot across frames |
| **TypeBojangler** | half-reply | Zalgo / Unicode-abuse text glitch and kinetic typography | Where zalgo stacks combining marks *within* Unicode's rules, TypeBojangler abandons the metric tables entirely — continuous per-glyph drift off the typesetting grid |
| **Syncytium** | reply — *specced, unbuilt* | The 1990s filter-pack pair: *Find Edges* / toon-outline (edges as ink) and *Crystallize* / *Stained Glass* / *Mosaic* (cells as tiles) | The two are fused so each corrects the other's blindness — edges are never drawn, they become the metric the cells grow under, so the tessellation is generated by the picture's anatomy instead of laid over it |
| **Gurgulator** | original instrument | — (granular replies to glitch *music* live outside the suite, in `tabota/binlod` and `hindcasts/pythia`; cf. BT's Stutter Edit / BreakTweaker) | Granular resynthesis as fermentation rather than as edit-grid stutter |
| **Bakezuri** | original instrument | — (no glitch canon for print processes) | Mechanical replication misregistration as a live wet performance |
| **Remanence** | reply — *Hindcasts-home, Sgueltch-kin* | VHS / analog tape-decay aesthetic; generation-loss nostalgia | Print-through as acausal instrument; its organic push beyond the MELT preset belongs to Sgueltch (see §5.1, "Tape as Tissue") |

---

## 5. The Conceptual Frontier (Unbuilt & Future Works)

### 5.1 Replies Owed — canonical processes not yet answered

Ranked by thesis-fit. Each pairs a canonical glitch(-adjacent) process with its organic-substrate mutation.

**Recently realized:** Wet Feedback now lives inside SiltCRT as the **Seep** signal-memory mode. It advects and diffuses the previous frame through a viscous flow field before returning it to the decay buffer, independently combinable with every phosphor substrate.

1.  **Tape as Tissue (the Remanence push).** Remanence (`hindcasts/remanence/`) already models print-through, wear, wow/flutter, and head-switch, and its MELT preset is explicitly flagged as "the Sgueltch crossover — a future zone, not a new home": louder print-through stays analog-nostalgic; real melt requires the substrate to go organic. The Sgueltch-home piece takes that step. Its material is the *body* of the tape rather than its memory: **sticky-shed syndrome** (binder hydrolysis — the polyurethane binder absorbs moisture and the tape literally turns to goo, squealing and shedding until it is baked back to playability), **fungal colonization** of stored reels (tape mold is a real archival pathology), and **oxide shed as silt**. Where Remanence asks what the reel *remembers*, this asks what the reel is *made of*. Division of labor per the suite placement rule: acausal whole-file analysis stays Hindcasts; corruption-forward goo/mold/silt substrate is Sgueltch.
2.  **Organic Dither (error diffusion).** Floyd–Steinberg error diffusion is the most intimate quantization ritual in the canon: a serpentine raster scan pushing quantization error through a fixed four-neighbor kernel. It is quantization confessing per-pixel. The reply lets the error *seep* — diffusion across Voronoi neighborhoods or a reaction–diffusion substrate, error as osmotic pressure pooling in basins instead of marching down scanlines. Ties backward to the halftone/print lineage and therefore to Bakezuri.
3.  **Fermented Generation Loss.** The canon: VHS dub chains, "I copied this video 1000 times," and the ur-text, Lucier's *I Am Sitting in a Room* (whose room resonance is a physical impulse response — direct kin to Gurgulator's gooey IR). The reply is cheap to build: iterative re-encoding through the existing `.ooid` / `.scute` / `.vermis` codecs, so each generation *ferments* instead of blockifying.
4.  **The Mis-Healing Player (CD-skip error correction).** Yasunao Tone's Scotch-taped CDs and Oval's prepared discs are the founding playback-error works — distinct from granular territory, so no overlap with binlod/pythia. The Reed–Solomon interpolate-or-mute strategy is the codec's hygiene response to damage. The reply: a player that mis-heals — interpolation as tissue graft, filling error bursts with wrong flesh instead of silence. The audio sibling of CyberScotoma's graft logic.
5.  **Mycelial Slit-Scan.** Slit-scan and rolling-shutter work (Trumbull; Levin's slit-scan catalog; CMOS jello) marches a straight one-dimensional aperture at constant rate — a 1D grid in time. The reply: the scan aperture as a wandering filament with peristaltic rate. *Placement caution:* a time-displacement spine may pull this Hindcasts-ward under the suite rule; the deciding question is whether the organic aperture or the temporal smear dominates.
6.  **Mesh Rot.** The newer canon of photogrammetry failure and corrupted 3D scans. The reply: non-manifold growth and vertex drift driven by strain fields — Pixel Lesions in three dimensions, *at the surface*. *Not to be confused with Schaum* (root-level, see `../schaum/schaum.md`), which is volumetric: irregular space-filling cells with life and coarsening rules run over them. Both have been described as "Pixel Lesions in three dimensions" and they mean different things by it — Rot corrupts a mesh's skin, Schaum divides a solid. Schaum is also constructive and therefore outside the suite by the placement rule, the same way Mesh Mutator is; when built, it is a substrate Mesh Rot could consume rather than a competitor. *Not to be confused with Mesh Mutator either* (penciled outside the suite, see root `mesh-mutator.md`): Mutator is a constructive geometry-dequantization utility (jitter, polyps, asymmetry as a making tool), Rot is the corruption-forward glitch reply. Same likely substrate, opposite intent — the placement rule draws the line at growth vs. rot.
7.  **Reaction–Diffusion Halftone.** The CMYK rosette and its screen angles are a grid-on-grid interference pattern (moiré as the grid confessing twice). The reply: Turing-pattern halftoning. Belongs in the Bakezuri print family.
8.  **Felt (glitch textiles).** Weaving is the ultimate lattice — the Jacquard loom is computing's origin myth, and glitch-textile work (weave-draft corruption) stays inside the warp/weft grid. The reply is one word: **felt** — a non-woven fabric with no grid to corrupt. Likely a conceptual piece rather than software.

Deliberately skipped: chromatic aberration (already inside Pixel Lesions as Chromatic Seep), scanline emulation (SiltCRT's territory), zalgo (Pain/Scream is the deeper answer to Unicode), circuit bending (hardware-bound, weak browser fit).

### 5.2 Intentional Failures — where the wall is the medium

The unbuilt frameworks below are intentional technical failures, where the boundary wall of existing computer architecture functions directly as the medium:

1.  **Pain / Scream:** A typographic installation where the required glyphs and semantic markings reside explicitly in the mathematical void *between* standardized Unicode codepoints. Because the Unicode Consortium has no available allocation slots for these characters, the piece cannot physically exist as software; the installation is the documented, violent collision with the codepoint wall.
2.  **Cloud Conference:** A piece built around the limits of algorithmic computing, requiring authentic external environmental entropy. It acts as an open critique of machine-enclosed pseudo-randomness by demanding live oceanic or atmospheric forces to generate its unpredictable, mutating vectors.

---

## 6. Architectural Synthesis: The Pivot to Frutiger Aero & The Pacific

The ultimate evolution of the Sgueltch framework serves as the structural underpinnings of a deeper aesthetic and political inquiry: the **Frutiger Aero / Pacific Pivot**.

* **Frutiger Aero as Visual Ideology:** Sgueltch identifies the Frutiger Aero aesthetic (dominant in mid-2000s to early-2010s operating systems, characterized by clear glass interfaces, glossy bubbles, clinical green/blue colors, and pristine water elements) as the ultimate **visual mask of computational hygiene**. It is the aesthetic skin of the clean, quantized purity regime.
* **The Pacific as the Refusal:** The ocean represents the definitive un-griddable, continuous, dynamically-unfolding medium. The Pacific Ocean, housing the Great Pacific Garbage Patch, represents **matter out of place at a planetary scale**—the ultimate return of the dirty "mess" that computational hygiene attempts to simulate away.
* **The Cosmotechnical Question:** Sgueltch leverages its portfolio of tools to answer a core aesthetic problem: *"How do you inhabit the Frutiger Aero hygiene aesthetic from the position of the raw matter it was explicitly designed to exclude?"* Sgueltch transitions from abstract format critique into a tactical platform where the wave functions as a counter-poetics to the colonial land instrument of the grid.

---
### Context Checklist
* **Substrate Rule:** Sgueltch is *not* a post-processing visual filter. It changes the underlying media substrate (Voronoi vs. lattice, float angle vs. snap, blob vs. block).
* **Antagonists:** Traditional glitch art (complicit with grids), quantization matrices, Unicode codepoints, 12-TET tuning, and standard block-based compression algorithms.
* **Core Terminology:** Interstitial space, rotware, cosmotechnics of the codec, purity regimes, wet granular resynthesis, seedless recipes, matter out of place.
