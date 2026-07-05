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

1. **propagating front (CSD strain)** — *the deepest unlock.* Right now blooms are cells catching a global curve. A real scotoma **nucleates at a locus and spreads as a wavefront** (cortical spreading depression). Replace/augment the global curve with a **bloom seed + strain**, where the strain is a Pixel Lesions growth algorithm (Lichen / Slime Mold / Perivascular Crawl) governing propagation *over time* instead of space. Welds the two suites at the mechanic, not just the concept. *(Note: for now, global control is deliberately enough — this is the first real extension, not an MVP gap.)*
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
- **cross-clip graft (dual-input donor).**
- **WebM export.**
- Light / photophobic CyberScotoma reskin; `buildGraph()` DAG stub.

**Next (ordered by leverage):**
1. propagating front (CSD strain) — seed + Pixel Lesions growth algorithm over time.
2. edge-vs-interior differentiation — scintillating frontier / blind interior.
3. anticipatory motion (backward flow) + prolepsis stances.
4. whole-clip auto-placement (motion extrema / negative-space, optimal-vs-inverted).
5. rack (multiple scotomata as a DAG).

---

*spine: a scintillating scotoma is the biological form of reading-ahead.*
