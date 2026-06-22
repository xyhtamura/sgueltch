# goopCodecs

*A collection of alternative image file formats built for data corruption.*

Every mainstream image codec was optimised to make files small and loss invisible. **goopCodecs does the opposite on purpose.** Each member is an image format whose entire reason to exist is to give *loss a specific shape* — round, cellular, ringed, spreading, recursive — so that corrupting a file becomes an expressive act rather than an accident. None of these are efficient. That is the point.

The unifying argument: the grid in JPEG's DCT, the scanline order of a raster, 12-TET, Unicode's codepoints — these are *contingent* encoding choices that got naturalised into feeling inevitable. Change the basis geometry (what shape one unit of information covers) and the serialization (which bytes are neighbours), and the morphology of damage changes completely. **The artifact shape is the argument.** goopCodecs is a set of counterfactual standards, each demonstrating a different way the choice could have gone — and a different way loss could feel.

`ooid` (Gaussian blobs → round loss) is the first member and is shipped. This document specs the family it belongs to.

---

## Shared DNA

Every codec in the collection should follow the same patterns, so they read as a family and can share infrastructure:

- **Single-file, zero-dependency browser tools.** No build step. One HTML file each (or eventually one shell hosting many).
- **The pipeline:** `source → encode → damage → decode → render`, with a non-destructive parametric **damage panel** plus a hands-on **byte/text editor** (header-locked, mojibake + hex, find/replace with cascade).
- **Legible binary formats.** Fixed-width, byte-aligned, little-endian, with a small locked header (magic + dimensions + count) so a damaged file always still decodes. The format spec is **appended to every file as a plaintext manifest** — each file is a self-describing specimen.
- **A consistent visual identity.** Sultai palette (blue-green-black) with a single disruptor hue reserved for damage; Fraunces + DM Mono; tooltips on every control; "round loss · no grid"-style motif per codec.
- **Loss must read as morphology, not noise.** Strangeness disciplined; instability that reads as precision; the biological and synthetic treated as phases of one material process.
- **Two source paths where it makes sense:** fit an uploaded image, *and* generate the substrate from scratch (ooid's Field mode). Each codec's "generate" mode is a different toy world.

Anything ooid already solves — the damage panel, the byte editor, the manifest pattern, the design tokens, the encode→decode→render loop — is shared infrastructure the next member should reuse rather than reinvent.

---

## The members

Each entry: the idea, the basis geometry, how bytes are serialized, the **damage morphology** that results, build difficulty, what it reuses from ooid, and a candidate name (the collection's vocabulary is biological–geological, like `ooid` itself — an ooid is a spherical accreted sediment grain).

### 1. ooid — Gaussian blobs ✦ *shipped*

**Loss shape:** round. Soft circular/elliptical lesions; truncation dissolves detail into fog; corruption teleports, swells, recolours, spins blobs.
**Basis:** sum of coloured anisotropic Gaussians, alpha-over in paint order.
**Status:** v1 complete. Image encoder + Field generator + full damage + byte editor + docs.

### 2. Voronoi cells — grown, not gridded

**Idea:** partition the image into stochastic Voronoi cells from scattered seed points; store each cell's seed plus a low-order colour function (flat, linear gradient, or a small radial term).
**Basis:** a stochastic partition of the plane — the grid replaced by something that looks *grown*.
**Serialization:** one fixed-width record per seed (`x, y, colour, gradient terms`).
**Damage morphology:** cellular and organic. Corrupting a *seed coordinate* deforms the partition itself — cells annex their neighbours, borders buckle. Corrupting colour makes a single tile flare. Truncation drops cells, leaving holes that adjacent cells flood into.
**Difficulty:** medium. Needs a Voronoi/Delaunay build (or a fragment-shader nearest-seed evaluation, which is easier and GPU-native — for each pixel, find nearest seed). The shader approach reuses ooid's render scaffold closely.
**Reuses:** damage panel, byte editor, format/manifest, design tokens. New: the partition renderer and a seed-fitting encoder (k-means-ish placement on error).
**Name ideas:** `areole`, `reticulum`, `schist`.

### 3. Space-filling serialization — the bruise that spreads

**Idea:** keep pixels, but serialize them along a **Hilbert curve** instead of raster order, storing **deltas** (DPCM) rather than absolute values. This is the direct answer to "why does glitching an image in an audio editor always make scanlines?" — because raster order makes horizontally-adjacent bytes neighbours. Walk a space-filling curve instead and byte-adjacency becomes *2D spatial* adjacency.
**Basis:** ordinary pixels; the radical move is purely the ordering + delta coding.
**Serialization:** the curve order; each byte a delta from the previous along the curve.
**Damage morphology:** two effects. (a) Editing or audio-processing a contiguous byte run hits a **compact fractal blob** of the image, not scanlines. (b) Because values are deltas, a single corrupted byte **propagates forward** as a wandering, branching stain that follows the curve — a bruise spreading through tissue.
**Difficulty:** low — the cheapest member to build, and the most immediately compatible with the existing "image through audio" databending workflow. No fitting; it's a transform.
**Reuses:** everything; it's almost pure serialization. New: Hilbert index ↔ (x,y) mapping and DPCM encode/decode.
**Name ideas:** `vermis`, `meander`, `serpentine`.

### 4. Polar / log-polar DCT — rings and wedges

**Idea:** resample the image into polar coordinates around one or more centres, run conventional block-DCT in (r, θ) space, then map back. The blocks still exist, but in image space they are **annular sectors**.
**Basis:** DCT — but on a warped domain, so the grid becomes radial.
**Serialization:** quantised DCT coefficients per (r, θ) block, plus the centre(s).
**Damage morphology:** concentric **ring banding** and **wedge** artifacts — growth-ring, iris, or vinyl-warp. Multiple centres with blended domains give interfering ring systems. Corrupting a centre coordinate swirls the whole field.
**Difficulty:** medium-high. Requires a DCT implementation and careful polar resampling/interpolation, but it's the member that most directly *rhymes with and rebukes* JPEG, which is conceptually valuable.
**Reuses:** damage panel, byte editor, format/manifest. New: polar resampler + DCT.
**Name ideas:** `otolith` (ringed ear-stone), `annulus`, `dendron`.

### 5. Region-growing predictive — coral / infection

**Idea:** flood-fill outward from seed pixels, predicting each newly-reached pixel from already-decoded neighbours and storing only the residual, in growth order.
**Basis:** a propagation front over the image, shaped by the image's own structure.
**Serialization:** seeds + residuals in growth order.
**Damage morphology:** corruption hits a residual and the error **inherits the growth front's shape** — damage spreads like infection or crystal growth from the wound site, and the spread pattern is determined by the original image's content. Different images bruise in different patterns.
**Difficulty:** medium-high. The growth scheduler and neighbour predictor are the work; decode must replay growth deterministically.
**Reuses:** damage panel, byte editor, format/manifest. New: the growth engine.
**Name ideas:** `thallus`, `mycelium`, `polyp`.

### 6. (stretch) Fractal / IFS — self-similar mutation

**Idea:** store the image as a set of **transformations of itself** (the old, near-dead fractal-compression idea): each block encoded as a contracted, transformed copy of another region.
**Basis:** the image as its own basis — recursion.
**Damage morphology:** corruption mutates a transform, and the change **recurs** — self-similar patches propagate the glitch at every scale. Strange, structural, and unusually on-theme for a mutation-over-hybridity stance, since the codec literally defines the image in terms of transformed copies of itself.
**Difficulty:** high (the encoder search is expensive), but the artifacts are unlike anything else in the set.
**Name ideas:** `rhizome`, `frond`, `clade`.

---

## Suggested build order

1. **Space-filling serialization** (member 3) — cheapest, highest immediate payoff, validates how much of ooid's shell is reusable for a non-blob codec.
2. **Voronoi cells** (member 2) — a different visual world, GPU-friendly, builds the "second member" muscle and forces the shared-infrastructure refactor.
3. **Polar DCT** (member 4) — the strongest conceptual counterpoint to JPEG.
4. **Region-growing** (member 5), then **Fractal/IFS** (member 6) as the ambitious finale.

When the second codec lands, factor the shared parts (damage panel, byte editor, format/manifest helpers, design tokens) into a small common include or a shell that hosts each codec as a module. Until then, copy-and-adapt from ooid is fine.

---

## The collection's identity

**Working name:** goopCodecs — viscous, organic, anti-crystalline; the right register for formats that ooze where others tile. Keep it unless something stronger arrives. Alternatives in the same spirit, if wanted: *softcodecs*, *wetware formats*, *the gel suite*, *malware* in the literal "malleable-ware" sense (probably too loaded), *sediments*.

**One-line frame:** *file formats that were designed for their loss.*

**What holds it together:** not a shared algorithm but a shared refusal — every member declines the efficiency mandate and treats the encoding standard as an aesthetic instrument. Each is a small, legible, self-describing counterfactual: *here is a way images could have been stored, and here is the different way they would then break.* Collected, they make the argument by accumulation — that the grid was never the only option, and neither was invisible loss.
