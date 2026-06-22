# vermis

*goopCodecs member three. A space-filling image codec that paints the picture as one continuous oozing worm.*

**one thread · the bruise that flows**

---

## What it is

vermis stores an image as a single thread. The pixels are sampled along a **Hilbert curve**, each sample kept as a **delta** from the one before it, and on decode the samples are not laid back into a grid of cells — they are **repainted as one continuous filament** that snakes through the plane and fills it. There is never a square. Thin the thread and the picture resolves; thicken it and the picture dissolves into ooze.

Because the body is a stream of deltas, corruption does not stay where you put it. It integrates forward and **flows down the worm** — a single bad byte becomes a colour stain that travels along the body from the point of damage, a bruise spreading through tissue. That travelling stain is the signature loss; speckle is not the point.

vermis shares the goopCodecs spine — single-file zero-dependency tool, `source → encode → damage → decode → render`, a non-destructive damage panel, a header-locked byte/text editor, a self-describing format with the spec appended as plaintext, and the Sultai palette with orchid reserved for damage.

---

## Design record — what we discovered

vermis arrived through a fork, and the fork is the most important thing to record.

**The Hilbert curve is grid-native.** We first built the obvious thing: walk the pixels along a Hilbert curve, delta-code them, and paint each sample back into its square cell. It worked, it round-tripped losslessly — and it *looked like squares*. That was not a rendering accident to polish away. A space-filling curve is defined as the recursive subdivision of a 2ⁿ square; it is about the most grid-native object in mathematics. Walking the grid in a cleverer order does not leave the grid.

**So the squares version is not a goopCodec.** By the sgueltch test — *to leave the grid you cannot break it, you have to change the substrate* — Hilbert-DPCM-into-cells fails. It keeps the pixel substrate untouched (the collection doc even says so: "Basis: ordinary pixels; the radical move is purely the ordering + delta coding"). What it actually dequantises is the **scanline** — the frozen, inertia-propagated decision that 2D adjacency collapses to 1D in one particular row-major way. That is a real and distinct argument, but it belongs to the *serialization / adjacency* prong of the quantization counter-poetics, beside the time and codepoint exhibits — not beside ooid and scute. **That object was parked under its own non-sgueltch identity** (working name `hilbert`, magic `HILB`), to be written up later as the serialization exhibit it honestly is.

**vermis is the goop-compatible sibling.** Same Hilbert + DPCM core, but the substrate changes at decode: instead of cells, the samples are painted as **one continuous thread** — a 1D continuum embedded in 2D, with girth and softness and a relaxed, corner-rounded path. The rendering primitive is now organic. *That* passes the sgueltch test, and the right-angles of the Hilbert curve — its last visible grid signature — are rounded away by the `relax` control.

**Legibility is a spectrum, not a setting.** The first build was beautiful but illegible: a fat thread low-passes the image, so it reads as pure impression. The discovery was that "see the image" and "pure ooze" are the two ends of one dial, pulled by four controls together — **high thread · thin girth · low bleed · low relax** resolves the picture; the opposite dissolves it. The early build only exposed the oozy half. The fix was to extend the span: raise the thread ceiling so the legible end is actually reachable, make the path wobble self-attenuate at high resolution so cranking thread does not fight you, and add **Resolve / Ooze** presets so the reachable extremes are one click apart.

**The resolution ceiling is a perf decision.** Thread tops out at 256² (Hilbert order 8). A clean image resolves there in ~2,000 painted strokes (instant); 512² is also fine when clean, but under heavy corruption it explodes to ~95,000 strokes and bogs down, where 256² stays around 24,000 and survives. 256² is enough to read an image as a worm, so that is the cap.

**The honest edge.** Even fully resolved, vermis is *painterly*-legible, not pixel-sharp. Pushed further it just becomes pixels and the whole conceit evaporates. That slightly-impressionistic ceiling is arguably the truthful limit of the substrate, and worth keeping rather than engineering away.

Everything in the codec was checked numerically before it shipped: the Hilbert mapping is a true bijection with a curve step of exactly 1 (byte-adjacency really is 2D-adjacency), the DPCM round-trip is bit-exact, the painted path is continuous with no jumps, and truncated bodies decode without throwing.

---

## The pipeline

### Source

The image is cover-fit (centre-cropped) onto a **2ᵒʳᵈᵉʳ square** — a Hilbert curve needs a power-of-two square grid, so vermis is square by construction. With nothing loaded, the tool boots into a procedural **sample field**: smooth gradients and soft blobs in the Sultai ramp, chosen because smooth content makes the deltas small and the flowing stains legible. **Re-roll sample** reseeds it; **Choose image** threads a real picture onto the worm; dropping a `.vermis` file re-opens a specimen.

**thread** (Hilbert order, 4–8 → 16² … 256²) is the main resolution lever. Finer thread samples the image more densely and resolves it; coarser thread reads as a visible snaking worm.

### Filament — the substrate

Three controls shape the *body* of the worm. They are **render-only** — the same bytes can ooze thick or run thin — but they are written into the file header so a specimen re-opens looking the way it was saved.

| control | does | legible end | ooze end |
|---|---|---|---|
| **girth** | thread thickness vs. sample spacing (0.4×–2.6×) | thin (just covers) | thick (overlaps into boundary-less fill) |
| **bleed** | softens the whole worm — wet, melted edges (blur) | 0, crisp ribbon | high, full ooze |
| **relax** | rounds the Hilbert right-angles and lets the path wobble | low, faithful path | high, wandering meander |

`relax` is the control that kills the grid: it rounds the curve's corners so it reads as a meander, not a quantised fractal. Its wobble amplitude scales with sample spacing, so it self-attenuates as thread rises — high resolution stays registered to the image even with relax on.

**Resolve →** and **← Ooze** snap all four (thread + the three substrate controls) to the two ends of the spectrum.

### Damage

Every operation acts on the delta body, so its effect is shaped by the curve and reads as flow along the worm.

| slider | what it does | how it reads |
|---|---|---|
| **delta drift** | nudges every delta a little; the nudges accumulate as the thread integrates them | slow colour drift wandering along the body — *the signature* |
| **spikes** | flips a handful of delta bytes hard | discrete stains, each flowing downstream from its flip point — the clearest bruise-through-tissue |
| **audio band** | heavily corrupts one contiguous run, the way an audio effect chews a band of samples | a compact, melted patch of the worm — never a scanline |
| **truncate** | cuts the thread short | the worm simply stops being painted partway — an unfinished, trailing-off path; the rest is bare substrate |
| **corruption** | scatters random byte replacements across the body | overlapping flowing stains fill the worm |

**Randomize** sets them all; **Reset** returns to the clean thread.

### Corrupt as data

**Edit bytes →** bakes the current slider damage into the bytes and opens them for hand-editing, pausing the sliders (the stateless re-derive and the stateful destructive edit cannot coexist live). The body is shown as **text** (printable bytes as characters, control bytes as Unicode Control-Pictures glyphs, so nothing is silently normalised) or as **hex** for surgical single-byte changes — drop one spike and watch it flow.

The **16-byte header stays locked** — magic, dimensions, order, anchor, and substrate hints — so the file always still decodes. A length-changing **find/replace** cascades: it shifts the **curve phase** of everything downstream, so colour reassigns to new positions along the thread and scrambles in a path-coherent way. **Commit as base** flattens the edits into a new clean base and re-enables the sliders; **Back to sliders** discards them.

### Export

- **Download PNG** — the painted worm as a flat image.
- **Download .vermis** — the native format, with the current substrate baked into the header and the spec appended as a plaintext manifest. Re-openable here.

---

## The `.vermis` format (v1)

Little-endian. A small locked header followed by a flat stream of three-byte delta records, one per sample, in Hilbert-curve order. Deliberately legible, so a damaged file always still decodes.

### Header — 16 bytes

| Offset | Size | Field |
|---|---|---|
| 0 | 4 | magic `"VERM"` (0x56 0x45 0x52 0x4D) |
| 4 | 2 | width (uint16) — equals the grid side S |
| 6 | 2 | height (uint16) — equals S (square by construction) |
| 8 | 1 | Hilbert order (uint8) — grid side S = 2ᵒʳᵈᵉʳ |
| 9 | 1 | version (1) |
| 10 | 3 | anchor RGB — mean colour, the DPCM seed |
| 13 | 1 | girth (uint8) — render hint, (girth − 0.4) / 2.2 × 255 |
| 14 | 1 | bleed (uint8) — render hint, bleed × 2.55 |
| 15 | 1 | relax (uint8) — render hint, relax × 2.55 |

### Body — 3 bytes per sample

| Offset | Size | Field | Encoding |
|---|---|---|---|
| 0 | 1 | dR | (R − R_prev) & 255 |
| 1 | 1 | dG | (G − G_prev) & 255 |
| 2 | 1 | dB | (B − B_prev) & 255 |

Samples are in Hilbert-curve order. `prev` is seeded from the header anchor, so the first sample is a delta from the mean. Sample count = S² = (2ᵒʳᵈᵉʳ)². File size = 16 + 3·S², plus the optional trailing manifest, which the decoder ignores.

---

## Load-bearing invariants

- **The header is small and locked.** Magic, dimensions, order, anchor, and substrate hints are never editable in the byte editor, so a damaged file always decodes. The anchor in particular seeds the entire delta integration — protect it and the whole worm still reconstructs.
- **The decoder is tolerant.** It reads `min(declared samples, samples actually present)`. A truncated or length-changed file does not crash; the thread simply stops where the bytes run out, and the rest of the canvas is left as bare substrate.
- **The curve is implicit, not stored.** Sample *positions* come from the order alone, regenerated on decode — they are never in the file. So corruption can only touch *colour*, never *geometry*; the worm always traces a valid Hilbert path, and damage flows as discolouration rather than scrambling the route. (This is the deliberate counterpart to the squares object, where the same body would scramble cells.)
- **Substrate bytes are hints.** girth / bleed / relax change how the thread is painted, never what the body means. The body is identical whether it oozes or resolves — the serialization layer and the substrate layer are cleanly separable, which is the layer model made literal.
- **Square by construction.** Hilbert requires a 2ⁿ square, so the source is cover-fit and centre-cropped. This is a property of the substrate, not a limitation to apologise for.

---

## Where it sits, and what is still open

vermis is the **goop** reading of the Hilbert-curve idea. It has a parked twin: the **squares** renderer (`hilbert`, magic `HILB`), the same codec painted into cells, which is *not* sgueltch and is waiting for its own non-sgueltch identity as the serialization / adjacency exhibit. Keeping both is the point — they prove that serialization and substrate are different layers by running the same bytes through different bodies.

Open threads:

- **The parked squares object** needs its identity written up — the broader-than-sgueltch frame for an exhibit about the contingency of scan order.
- **CSS / visual unification** across all goopCodecs pages is still deferred until the set is complete; vermis currently reuses the scute shell verbatim.
- **A sharper render mode** (a thinner girth floor, or a second renderer) is technically possible but deliberately resisted — the painterly ceiling is the honest edge of the thread.
- **Order 9 (512²)** could be unlocked if the corrupted-render stroke path were optimised (batching or a points pass at high order).
