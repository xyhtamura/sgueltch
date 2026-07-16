# CYBERSCOTOMA

*acausal, non-grid, drawn datamosh — the aura, pinned*
internal handle: `cyberscotoma` · diminutive: `cyscot`
lives at: **sgueltch ∩ hindcasts**

---

## micro-statement

A **scotoma** is a hole in the visual field. A **scintillating scotoma** — the migraine aura — is a hole that isn't empty: it drifts, it shimmers at its leading edge, and it *arrives before the pain it announces*. CyberScotoma is that phenomenon built as a video effect. Held regions of the frame stop refreshing and instead keep receiving the **current motion field** applied to **donor content** — image flowing forward wearing skin from another time. The hole is never blind; it's flooded with grafted tissue.

The name is the mechanic. **scotoma** = the missing region. **cyber** = the synthetic image that colonizes it. The compound *enacts* the two layers of the effect — the blind spot and what fills it — which is why it beat the alternatives (bare *scotoma* read as absence; *prodrome* / stance-names foreclosed the realtime fork).

---

## the spine (why it belongs to both suites)

Sgueltch names its members by **biological substrate** (Pixel *Lesions*, *Silt*CRT, *Gurgul*ator). Hindcasts names its members by **temporal stance** (*Prolepsis*, *Pythia* — precognition). The migraine aura is the single object where those two naming logics are *the same thing*:

- **as tissue** — cortical spreading depression is a literal wave propagating across the visual cortex. A traveling biological front. (Sgueltch.)
- **as premonition** — the aura precedes the headache; the body forecasting its own event. Reading-ahead. (Hindcasts, superpower #1: precognition.)

> **a scintillating scotoma is the biological form of reading-ahead.**

That sentence is the spine regardless of what the tool is called. The `donor offset` positive value isn't just "future bleeds backward" — it *is* the aura: the disturbance that arrives before the thing it announces.

This also resolves the light-mode aesthetic as **theory, not skin** (see below): CyberScotoma answers the Sgueltch pivot question — *"how do you inhabit the Frutiger Aero hygiene aesthetic from the position of the raw matter it was designed to exclude?"* — in miniature. Take clear-water-glass optimism and make it photophobic. Same skin, the excluded matter (pain, the sick body, the too-bright) returned inside it.

---

## the mechanic — Option B (chosen)

Two candidate mosh mechanics were on the table:

- **A (rejected as default):** cells *freeze* donor content; motion drags it forward. A "smearing hold." Simpler.
- **B (chosen):** cells *continuously* apply the current per-frame motion to donor-descended content. Content flows with the wrong skin — the true mosh bloom, closer to how real datamosh blooms behave. Heavier, but offline makes compute cheap, so no reason not to.

### render loop (offline, sequential, acausal)

Maintain an accumulator `C`. Frame 0 = clean source. For each frame `t`:

1. **cell state** — each Voronoi cell holds when `bloom(t) > cellThreshold[cell]`. Thresholds are spread per-cell, so as the drawn bloom curve rises, cells *progressively catch* — an organic spread, not a switch. `latch` = once held, never releases (perpetual mosh).
2. **advect** — warp `C` by the current motion field × `drag` (backward bilinear warp). This is the moshing: pixels smear along motion they don't own.
3. **compose** per pixel, by its cell:
   - **refresh** (not holding) → overwrite with clean `source[t]` (the "I-frame").
   - **onset** (just started holding) → seed from **donor** at `t + donorOffset` (the acausal graft; positive offset = future).
   - **continue** (still holding) → keep the advected content.
4. cache the frame → instant, acausal scrub.

The clean/moshed boundary is the noised Voronoi edge — non-grid by construction. This is where CyberScotoma refuses the macroblock: classic datamosh is grid-bound because the artifact *is* the DCT block leaking through. We decode to raw frames and compute our own motion field + our own hold-regions, so nothing lives inside a compressed bitstream's lattice.

### why acausal / why non-live

- **acausal** — donor content can come from a *future* frame (or a different file entirely). A live effect can only hold pixels it has already played; CyberScotoma has read the whole clip.
- **non-live** — this is the redistribute thesis, not a limitation. A causal effect must finish inside the buffer window (a silicon budget). An acausal one only costs patience. Render once, scrub forever. **Spend computation deliberately, in the render, on the artifact — never on ambient UI.**

---

## aesthetics — declare character, then get out of the way

Standing position from this session: **UI aesthetics declare voice, lineage, and philosophy** No HTML/CSS motion; **static aesthetics only.**: stay compuntationally cheap where we can but still aesthetically expressive.  

- **light mode, photophobic.** Ground is a *sick pale* — high-lightness, low-chroma, pushed off-neutral (the fluorescent-lit, about-to-faint pallor). **Not** warm cream (#F4F1EA + serif + terracotta is the AI-default light look; it's cozy, wrong). No-zero-chroma rule does the work: every neutral keeps hue. Text in plum-black / ink-blue, never #000.
- **scintillation = chromatic aberration = Chromatic Seep.** The amber/mineral/blurple triad stops being three flat accents and becomes **fringe** — color that appears only at boundaries and shifts with angle. Iridescence-as-stance, and it reads *better* on a light ground than a dark one. The title carries a static aberration split (cyan left, magenta right).
- **glare on light ≠ luminance.** You can't out-bright an already-pale ground. Glare = halo + bloom + prismatic ring + a little overexposure. Spend the boldness in **one** authored glare event — the render control as a **frozen phosphene** (Kawase-style bloom halo + chromatic ring, static). Everything else quiet.
- **aqua-glass Frutiger chrome is what disambiguates "cyber."** Get the chrome right (glossy, beveled, wet, aqua) and the prefix reads as deliberate Y2K/Pacific reclamation — a citation. Drift toward matrix-green hacker chrome and it reads as a 2015 accident, a costume. The chrome does semantic work.
- house controls in irregular-radii **membrane panels**; no hard corporate rectangles, no regular grids or over-pattern. Type: Averia Gruesa (display), Averia Sans (body), Syne Mono (data/labels).

---

## the five superpowers of acausality — which CyberScotoma uses

1. **Precognition** — donor seeded from the future at bloom onset. ✅ core.
2. **Global statistics** — (roadmap) auto-place scotomata at whole-clip motion extrema.
3. **Bidirectionality** — (roadmap) anticipatory motion run backward.
4. **Multi-pass** — not yet.
5. **Whole-signal optimization** — (roadmap) optimal-vs-inverted seed placement (Lloyd–Max logic).

---

## roadmap — the name is the map

Developments push in from both parents. Ordered within each by leverage.

### biology pushing in (scotoma gets more *real* → Sgueltch strains)

1. **propagating front (CSD strain)** — **FIRST STRAIN SHIPPED.** The first implementation adds a seed-centered reaction-diffusion activation field: the bloom curve becomes temporal front progress, while a Gray-Scott-style scalar texture bends cell catch times into a living wavefront. This replaces/augments the old global curve with a **bloom seed + strain** path. Future strains can still come straight from Pixel Lesions growth algorithms (Lichen / Slime Mold / Perivascular Crawl) governing propagation *over time* instead of space.
2. **edge-vs-interior differentiation** — real aura has a bright **scintillating leading edge** and a **blind trailing region**. Advancing frontier gets chromatic seep + brightening (donor onset with aberration); interior decays to mush. Perivascular Crawl already tracks contrast boundaries with Sobel — the edge is where the aura lives.
3. **goop-tissue graft** — donor content sourced from a `.scute` / `.ooid` / `.vermis` file, so the scotoma fills with organic-codec damage rather than photographic frames.

### time pushing in (graft gets more *acausal* → Hindcasts superpowers)

1. **cross-clip graft (dual-input)** — ✅ **SHIPPED.** Donor is a separate file; the scotoma fills with foreign tissue. This is the Pythia control/source dual interface, the suite's shared interface — and the feature that formally makes CyberScotoma a Hindcasts member. `donorOffset` applies into the donor timeline; "use self" reverts to the single-clip behavior.
2. **anticipatory motion** — the hard Hindcasts build. Motion run **backward** so content smears *toward* the event it's about to become — the aura that arrives before the thing it announces. (`prolepsis` gestures at this via feedback-field; the dense per-pixel-flow version is the genuinely-unseen one.)
3. **prolepsis-style stances** — wrap anticipatory motion in the model already built for `prolepsis`: **decay-graft** (trailing blind region), **anticipation-graft** (scintillating precursor), **symmetric** (the full arc around each event). Ports directly.
4. **whole-clip auto-placement** — the tool has read the whole file, so seed scotomata at the biggest motion events — or *perversely* at the **stillest** regions (that's Negative-Space, another Hindcasts member). Optimal-vs-inverted, Lloyd–Max logic. The drawn curve stays as manual override.

### infrastructure (unglamorous, load-bearing)

- **WebM export** — ✅ **SHIPPED.** The difference between a demo and a tool you actually use.
- **DAG / rack** — thin `buildGraph()` stub in place, anticipating the hindcasts shared rack pattern (collapsible DAG, per-cell wet/dry, offline intermediate-caching). Racking = an array of `graft` nodes composited, each its own scotoma (seed + strain + donor + stance). Not built; architecture left open so it slots in without rework.

### the realtime shadow (not priority — but position it right)

CyberScotoma can trivially become a **unidirectional, causal, realtime** effect: past-donor only, a running bloom instead of a drawn curve, webcam-performable. **Don't ship it as the main mode or think of it as a demotion — ship it *beside* the offline one so the difference is felt, not argued.** Its whole job is to be the degraded approximation that the offline version is the ideal of (the live limiter cheating toward acausality). The phenomenon-name survives the fork intact: a scotoma drifting live is still a scotoma. That is exactly why phenomenon-naming beat stance-naming.

---

## future corruptions — beyond the scotoma

The scotoma is the first pathology, not the whole clinic. The engine already factorizes into four orthogonal axes, and every planned `graft` node in the rack is a tuple across them:

| axis | question | current options |
|---|---|---|
| **region** | *where* does the corruption live | Voronoi + drawn bloom; CSD reaction-diffusion front |
| **tissue** | *what* fills the held region | self-donor graft; cross-clip graft |
| **motion** | *how* does held content move | self motion field × drag |
| **time** | *when* does it sample from | `donorOffset` (acausal seed) |

A "new corruption" is rarely a new effect — it's a new option on one axis, composable with everything on the others. That's what keeps this a substrate and not a filter pack. Candidates below, grouped by lineage; each names its axis and its ethos claim.

### visual-field pathologies (the scotoma's siblings)

Neuro-ophthalmology is a whole taxonomy of non-grid corruption already named and clinically described. The aura was only the first borrowing.

1. **metamorphopsia** *(tissue/motion)* — macular distortion: straight lines go wavy. Implement as a continuous low-frequency displacement field that intensifies inside the lesion, zero at the noised boundary. The clinical test for it is the **Amsler grid** — a literal grid whose failure to stay a grid is the diagnosis. The thesis in one image: the corruption *is* the grid refusing to hold. Cheap (one warp pass), high leverage.
2. **palinopsia** *(time)* — pathological afterimage: content persists or *recurs* after its stimulus is gone. Causal half is trailing/echo (kin to Remanence, keep thin). The acausal half is the unseen build: hallucinatory palinopsia run backward — a formed image recurring *before* its first appearance. Whole-clip detection of a salient event, then grafting its ghost into earlier frames. Pure Hindcasts superpower #1 inside a Sgueltch lesion.
3. **oscillopsia** *(motion)* — failed gaze stabilization: the world wobbles because the compensator is broken. We already estimate the motion field; oscillopsia is that estimate turned against the frame — apply ego-motion compensation *wrongly* (lagged, overshooting, ringing) inside the region. The stabilizer, a hygiene tool, exhibited as vestibular illness.
4. **akinetopsia** *(time)* — motion blindness: the world arrives as stills. This is **temporal quantization exhibited as pathology** — the antagonist's own gesture (snap time to a grid of frames) shown as lesion, not neutrality. Held region drops to a stuttering, *aperiodic* refresh (Poisson-timed, never metronomic) while the surround flows. The one candidate that points *at* quantization instead of away from it; frame it as the codec confessing as symptom.
5. **visual snow** *(tissue, minor)* — persistent aperiodic grain, no lattice noise pattern. Small; likely a texture modifier on other tissues rather than its own strain.

### fungal / rot (Pixel Lesions pushing in)

6. **necrotic interior** *(tissue)* — the roadmap's edge-vs-interior split, completed on the decay side: interior tissue rots through the Pixel Lesions **Rot Palette / Necrotic Inversion** gradient (bruise-purple → bile-green → fevered off-white) while reaction-diffusion mush eats structure. Scintillating frontier + necrotic core = the full lesion life cycle.
7. **spore metastasis** *(region)* — scotomata that colonize: a mature lesion seeds satellite regions at *motion-statistically similar* sites elsewhere in the clip (Spore Cloud's jump logic, targeted by superpower #2, global statistics). The lesion stops being a place and becomes a colony.
8. **hyphal motion** *(motion)* — replace the scene's motion field inside the region with a *grown* one: mycelial-tendril / reaction-diffusion flow that ignores what the camera saw. Tissue crawls with biological purpose instead of borrowed optics. (Mycelial Rot's momentum-tendril logic, run as a vector field.)

### pixel-sort descended (the sort without the row)

Classic pixel sort is grid-complicit — it sorts along the raster's own rows/columns. The non-grid sort takes its path from *dynamics*:

9. **streamline sort** *(tissue)* — sort pixels by luminance along the **integral curves of the motion field** — the sort path is the flow itself, not the lattice. Spatial, per-frame, reuses the field we already compute. The direct answer to "pixel sort, but Sgueltch."
10. **trajectory sort** *(time)* — the acausal one: track each pixel's worldline through the whole clip, then sort the samples *along its own trajectory* — each point in space keeps its path but scrambles its history. Time becomes sortable material. Needs whole-clip reads (superpower #5, whole-signal); impossible live, natural offline.

### pure-digital / dynamical (belief-layer claims)

No biology required — the axis is aperiodic/emergent vs. snapped, and math sits on the mess side:

11. **motion possession** *(motion)* — the inverse of cross-clip graft: content stays **self**, motion comes from the **donor**. The frame is puppeted by another clip's kinetics. Nearly free to build (both fields exist), conceptually crisp, and completes the control/source matrix: {self, donor} content × {self, donor} motion.
12. **three-body advection** *(motion)* — motion field driven by a chaotic gravitational sim (or double pendulum, or Lorenz flow). The belief-layer claim made in video: nothing stops us from advecting frames with celestial mechanics but habit.
13. **time membrane** *(region/time — possibly its own tool)* — slit-scan is the canonical time-space swap, but its slit is a straight line: a grid instrument. Generalize: treat the clip as an (x, y, t) volume and resample along an **undulating, drifting curved sheet** — a membrane through the video cube. Non-grid by construction, acausal by construction (needs the whole volume). Big enough that it may be a sibling tool rather than a strain; park the name here.

### selection pressure (which first)

Rank by (leverage ÷ build cost), honoring the existing roadmap order:

- **motion possession** (11) — days, not weeks; completes the dual-input matrix already shipped.
- **metamorphopsia** (2 → item 1) — one warp pass; strongest single thesis-image.
- **streamline sort** (9) — reuses the motion field; the pixel-sort answer.
- **necrotic interior** (6) — rides the already-planned edge-vs-interior work.
- Everything acausal-heavy (palinopsia-backward, trajectory sort, time membrane) waits for the rack, since each wants to be a node, not a mode.

Rule kept from the parents: every candidate must name its **non-grid substrate move** (what lattice it refuses) and its **axis** (so it composes in the rack). A corruption that's just a filter on top of the frame — however gorgeous — is not a strain.

---

## adjacencies (don't re-derive)

- **Pythia** — the flagship; the control/source dual input is the shared interface for the whole suite. Cross-clip graft *is* that interface, which is why it was the highest-value next feature.
- **Pixel Lesions** — the propagating-front strains come straight from here; the scotoma is a *lesion in the visual field* that migrates. Direct Sgueltch kinship.
- **Chromatic Seep** — scintillation and chromatic aberration are the same phenomenon; the light-mode fringe palette is Chromatic Seep applied to the UI.
- **Prolepsis** — shares the anticipation principle and the stance model (wake / anticipation / symmetric); ports to the anticipatory-motion build.
- **SiltCRT** — the naming precedent (organic token + dead/period-tech token); CyberScotoma sits next to it, not next to Pythia.
- **Quantization thesis / Frutiger Aero–Pacific pivot** — the photophobic light mode is the pivot question answered as a design object; "cyber" ties to the Y2K/cybersigilism/Pacific research frame.

---

## status

**Shipped (this session):**
- Option B engine — non-grid Voronoi hold-regions, own motion estimation (block-match on downsampled luma), sequential offline render, instant acausal scrub.
- Drawn bloom curve (paintable; bell / ramp / pulses / clear presets), progressive per-cell threshold catch, latch (perpetual).
- Controls: cells, edge noise, motion drag, donor offset (acausal), show-cells overlay.
- **propagating front (CSD reaction-diffusion strain)** — selectable global vs reaction-diffusion bloom strain, seed X/Y sliders, click-to-seed on the stage, front strain control, and per-cell activation thresholds derived from the reaction field.
- **cross-clip graft (dual-input donor).**
- **motion possession (dual-input kinetics)** — completes the `{self, donor} content` x `{self, donor} motion` matrix.
- **edge-vs-interior differentiation (scintillating frontier / blind trailing interior mush)** — frame-age cell tracking, horizontal chromatic channel-splitting, edge brightening boost, and accumulated feedback neighbor cross-blur.
- **WebM export.**
- **Cartridge Architecture & Presets** — modular visual pathology cartridges with dynamic UI panel hiding and configuration presets (Classic Smear, Scintillating Aura, Heavy Liquefaction).
- **anticipatory motion (backward flow) + prolepsis stances** — bidirectional rendering passes (wake fwd, anticipation bwd), negated temporal flow vector maps, and linear blend composing.
- **whole-clip auto-placement** — kinetics-based automatic bloom curve generation via Direct Motion Peaks, Inverted Stillness (Negative-Space), or 1D Lloyd-Max optimal peak centroids.
- **Metamorphopsia visual cartridge** — continuous low-frequency coordinate displacement ripple warp inside the scotoma that fades to zero at fresh boundaries based on cell age.
- **file dropping mechanics** — dual host & donor drag-and-drop targets with visual glass overlays, shift/alt modifier shortcuts, and multi-clip dropped file routing.
- Light / photophobic CyberScotoma reskin; `buildGraph()` DAG stub.

**Next (ordered by leverage):**
1. rack (multiple scotomata as a DAG).

---

*spine: a scintillating scotoma is the biological form of reading-ahead.*
