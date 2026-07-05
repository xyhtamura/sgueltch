# scute

*A voronoi-cell image codec and alternate file format made for data corruption.*

scute converts an image — or a procedural colour field — into a partition of coloured Voronoi cells, and stores them as a small binary file (`.scute`). Each cell is a single seed: a position and a colour. Every pixel belongs to whichever seed is nearest, so the picture is held not as a grid of pixels, nor as DCT tiles, but as **territory grown from points**. Corrupting the file therefore produces loss that is *cellular*: corrupt a seed's position and the partition itself deforms — borders buckle, cells annex their neighbours, whole regions get re-divided. Where ooid's loss is **round**, scute's is **cellular**. That contrast is the point; efficiency is not a goal.

It runs entirely in the browser. Nothing is uploaded; all encoding, damage, and export happen on your machine.

scute is the second specimen in **goopCodecs**, after ooid. It shares the family's bones — a tiny legible binary format, a 16-byte locked header, byte-class damage sliders, a hands-on byte editor — and deliberately breaks from ooid where the geometry demands it.

---

## Quick start

1. Open `scute.html` in a modern browser (needs WebGL2).
2. It boots into a procedural **sample field** so there's cellular eye-candy to corrupt immediately. To glitch a photo, drop an image onto the canvas (or *Choose image…*). Drop a video to process sampled frames, or drop a `.scute` to re-open a still or processed clip.
3. Tune the cells with **cells**, **detail bias**, and **warp** (see *Source*).
4. Drag the **Damage** sliders to corrupt non-destructively, or open **Corrupt as data** to edit the bytes by hand.
5. **Download PNG** for a flat image, **Record .webm** for a flattened processed clip, or **Download .scute** to keep the glitched still/video in the native format.

Every control has a tooltip — hover on desktop, tap on mobile.

---

## Source

Seeds are scattered onto the image and each cell takes a flat colour. There is one encoder (no quality tiers — scute's fidelity levers are different from ooid's; see *Open threads*). With no image loaded, the same machinery colours seeds from a procedural field instead, which is what the boot specimen is.

| Control | What it does |
|---|---|
| **cells** | How many Voronoi cells (seeds) to scatter. More cells hug the source more closely but render slower — the renderer tests every seed per pixel (see *How it works*). A simple image needs far fewer cells than a blob image needs blobs, because each cell covers a whole region with one colour. |
| **detail bias** | How strongly seeds cluster on edges and detail. 0 = even coverage (uniform cells, a low-poly look); high = tiny cells crowd the detail while flat regions become a few big plates. |
| **warp** | Domain-warps the cell borders. 0 = crystalline hard Voronoi, clean carapace seams; high = borders ooze, interlock and marble — the cells go wet and organic. See *Organic borders*. |
| **Choose image…** | Pick an image file to partition. |
| **Re-seed** | Re-scatter the seeds with a fresh random sampling. |

---

## Video

Dropping a video reveals a small video processor. scute samples the source at the chosen **sample fps**, caps the run with **max frames**, and encodes each sampled frame as an independent `SCUT` still. Playback and scrubbing swap those frames through the same damage/decode/render loop as still images, so slider damage is re-derived per frame and reads as cellular flicker.

Processed clips can be flattened with **Record .webm** or kept native with **Download .scute**. Native video uses a `SCUV` container: a 16-byte video header followed by length-prefixed complete `SCUT` frames. Reopening that `.scute` restores the processed frame set.

---

## Organic borders *(warp)*

A hard Voronoi partition has dead-straight borders — clean, but crystalline, and close to what a mosaic or low-poly filter already does. **warp** un-straightens them by domain-warping the nearest-seed lookup: before each pixel asks which seed is closest, its coordinate is offset by turbulent noise. The displacement is *warp-of-warp* (the field is itself warped by a second noise field), which gives flowing, marbled, fluid borders rather than a single uniform wobble. At 0 the partition is exact and crystalline; pushed up, the cells interlock like puzzle pieces and the whole image reads as wet.

The crucial property: **warp is a render-time lens over the same seed table, not a change to the substrate.** The partition is still a pure function of the seed bytes, so:

- Corruption stays **instant** — drift, recolour, truncate and the byte editor all behave exactly as before; the borders just take a scenic route. At high warp, *drift* reads as a slow wet churn instead of shattering glass.
- The amount is stored in the header (byte 15), so it travels with the `.scute` and a reopened file looks the same. Because it lives in the *locked* header, hand-databending the body can never accidentally clear it.

**What warp cannot do.** Domain warp produces *flowing* borders — smooth curves, however turbulent. It cannot produce the *rough, eroded, lichenous* front of a genuinely grown cell (the fractal raggedness of a bacterial colony). That texture requires a different substrate — stochastic growth, not a noise offset — and that is a different specimen, not a scute setting. See *The sgueltch question*.

---

## Damage

These sliders corrupt an encoded image **non-destructively** — they re-derive from the clean encoding every time, so dragging a slider back to zero cleanly undoes it. Each one targets a specific byte-class, so the loss is categorical rather than mush.

| Operation | Morphology |
|---|---|
| **drift** | Corrupt the position bytes. Seeds wander — and because the partition is rebuilt from the seeds, the borders buckle and cells annex their neighbours. The signature scute damage. |
| **recolour** | Corrupt the colour bytes. Individual cells flare to wrong colours while the partition stays put. |
| **truncate** | Keep only the first share of cells and drop the rest. The survivors flood outward and **annex** the abandoned territory — coarsening, never holes. |
| **corruption** | Random byte flips scattered across all records — mixed drift and recolour speckle. |
| **audio band** | Heavily corrupt one contiguous run through the middle of the file, the way an audio effect chews a band of samples — a stripe of cells goes haywire in both position and colour. |
| **Randomize / Reset** | Set every slider to a random amount / clear all damage. |

**There is no *Shuffle order*.** In ooid, blobs composite alpha-over in record order, so reordering records re-layers the image — shuffle is a real operation there. A hard Voronoi partition has no compositing: every pixel takes its single nearest seed regardless of where that seed sits in the file. Record order carries **no meaning**, so shuffling does nothing, and the operation is absent by design. This absence is the precise inverse of ooid's "order is meaning," and it is one of the things that makes scute its own format rather than ooid with different shapes.

**truncate is annexation, not erasure.** Worth dwelling on, because it differs from ooid. Dropping a blob in ooid leaves the area it covered to fade toward the base colour — detail dissolves into fog. Dropping a cell in scute leaves no hole at all: the partition is rebuilt from the survivors, so the nearest remaining seeds simply expand to swallow the vacated region. The image coarsens, big cells eating small ones, with no empty space anywhere.

---

## Corrupt as data

The hands-on databending surface: open the `.scute` as raw data and glitch it by hand. This is what separates scute from a mosaic filter — there, pixels are addressed by grid position; here, meaning is positional in the **byte stream**, so editing the stream rewrites the geometry.

**The 16-byte header stays locked.** It holds the magic bytes, the dimensions, the cell count, and the warp amount, and it is shown but never editable. This guarantees the file always still decodes no matter how badly you mangle the body. For header-level destruction, download the `.scute` and open it in a real hex editor.

**Two views, switchable:**

- **text** — the body as mojibake. Printable bytes show as characters; control bytes show as small `␀`-style Control-Pictures glyphs so every byte is visible and round-trips exactly. Type to overwrite, exactly like glitching a file in a text editor.
- **hex** — the body as editable hex byte-pairs. Best for surgical single-byte changes.

**Find / replace** runs across the body, with a `text ⇄ hex` toggle for how the boxes are read. A **different-length** replacement makes the body **cascade** — everything after the first match shifts. In scute this is especially violent: because every cell is exactly **8 bytes**, a length-changing edit throws every downstream record off its alignment, so each subsequent cell's bytes get reinterpreted as a *different* seed. The entire partition past the edit point reshuffles into a new cellular landscape. That cascade is the move a grid-addressed filter structurally cannot make. The readout reports matches replaced and how much the body grew or shrank.

**Edit bytes →** *bakes* the current slider damage into the actual bytes and **pauses the sliders** (they grey out). This is deliberate: the sliders are non-destructive and re-derived, byte editing is destructive and stateful, and the two cannot be live at once. Leaving the editor:

- **Back to sliders** — discard the byte edits and return to live parametric damage.
- **Commit as base** — flatten the glitched bytes into a new clean source and re-enable the sliders, so you can keep damaging the already-corrupted version.

A length-changing cascade can occasionally shift the body to where very few whole records survive and the canvas goes sparse — that is the tolerant decoder clamping to `min(declared, records present)`, working as designed, not a crash. Re-seed or reopen to recover.

---

## Export

- **Download PNG** — the current canvas as a flat image. Cells are resolution-independent, so this is rendered at 2× for crisp borders.
- **Record .webm** — for processed video, records the damaged frame playback to a flattened WebM.
- **Download .scute** — the native format, with any slider damage or byte edits baked in. For processed video, this saves a re-openable `SCUV` frame container. The format spec is appended as a plaintext manifest, so anyone who opens it in a hex editor finds a short document explaining what they're looking at. Re-openable here.

---

## The `.scute` format (v1)

A tiny, deliberately legible binary format. Little-endian. Fixed-width records, byte-aligned so every field is individually addressable — that addressability is what lets the damage sliders and byte editor target one parameter class at a time.

### Header — 16 bytes

| Offset | Size | Field |
|---|---|---|
| 0 | 4 | magic `"SCUT"` (0x53 0x43 0x55 0x54) |
| 4 | 2 | width (uint16) |
| 6 | 2 | height (uint16) |
| 8 | 2 | cell count (uint16) |
| 10 | 1 | colour mode (0 = flat) |
| 11 | 1 | version (1) |
| 12 | 3 | background RGB (fallback for empty regions) |
| 15 | 1 | warp amount (0–255 → 0–1) |

### Record — 8 bytes each

| Offset | Size | Field | Encoding |
|---|---|---|---|
| 0 | 2 | x | uint16, normalised 0–65535 across width |
| 2 | 2 | y | uint16, normalised 0–65535 across height |
| 4 | 1 | r | 0–255 |
| 5 | 1 | g | 0–255 |
| 6 | 1 | b | 0–255 |
| 7 | 1 | reserved |

File size = 16 + 8 × cell count, plus the optional trailing text manifest (which the decoder ignores).

### Video container — `SCUV` v1

Processed video is stored in the same `.scute` extension with magic `"SCUV"`:

| Offset | Size | Field |
|---|---|---|
| 0 | 4 | magic `"SCUV"` |
| 4 | 2 | output width (uint16) |
| 6 | 2 | output height (uint16) |
| 8 | 2 | frame count (uint16) |
| 10 | 1 | fps (uint8) |
| 11 | 1 | version (1) |
| 12 | 4 | reserved |

The body is `len:u32 + frame bytes` repeated once per frame. Each frame is a complete `SCUT` still, so frame damage remains local.

**The partition is nearest-seed, so record order carries no meaning** — every pixel takes its single nearest seed regardless of order. This is the structural reason there is no shuffle operation, and the philosophical inverse of ooid, where compositing is alpha-over and order *is* meaning. The decoder is **tolerant**: it reads `min(declared count, whole records actually present)`, so a truncated or length-changed file still renders instead of crashing.

**Two reserved spaces are deliberately parked.** The background RGB (bytes 12–14) is only ever shown in the degenerate zero-seed case, since any non-empty partition covers every pixel; it is kept for family symmetry and as a fallback fill. The per-record reserved byte (offset 7) is the natural home for a future **cell weight** — additively or multiplicatively weighted Voronoi, where a cell's pull varies, so corruption could become lopsided (big-pull cells annexing more). Reserving it keeps the record an even 8 bytes and the door open.

---

## How it works, briefly

**Renderer.** WebGL2, a single full-screen pass with a brute-force nearest-seed fragment shader: each pixel reads every seed from a data texture (one row of positions, one row of colours), tracks the minimum squared distance, and takes the winner's colour. The partition is therefore recomputed from the seeds every frame, which is *why* corrupting a seed deforms the visible partition live, for free. **warp** is applied inside this shader by offsetting each pixel's coordinate with two octaves of warped value-noise before the seed loop. The cost is `O(seeds)` per pixel — exact and simple, which is why the cell count caps low for now (see *Open threads* for the jump-flooding upgrade that removes the ceiling).

**Encoder.** The source is downsampled to a fit target, an importance map is built from edge magnitude (plus a uniform floor), and seed positions are importance-sampled from its CDF — so seeds cluster where colour changes fast and thin out where it doesn't. **detail bias** blends the map between uniform and edge-weighted. Each cell takes the **local mean** colour around its seed, which is a good flat-colour proxy *because* importance sampling already makes cells small exactly where colour varies — so the local mean over a small radius closely matches the true cell mean. There is no Lloyd relaxation yet; it is the obvious quality lever and is deferred.

---

## Visual identity

scute is recognisably ooid's sibling — same bones, the same Fraunces italic display and DM Mono body, and the same rule that **orchid is reserved for damage** across the whole family. But it speaks in a colder register suited to hard cells:

- **Palette.** ooid's warm acid-lime primary gives way to a glacial cyan (`#3fe3ea`); the secondary cools toward a blue-teal (`#33c9d6`); the black-green ground shifts a touch bluer (`#070f14`). The orchid disruptor (`#cf5cff`) is unchanged — it is the family constant that keeps the two reading as one cabinet.
- **Geometry.** Where ooid is rounded and soft, scute is faceted and squared: panels and buttons drop to 1 px radii and the slider thumbs are small rotated diamonds rather than round dots. The chrome itself argues "hard partition."
- **Motif.** ooid is *round loss · no grid*; scute is *cellular loss · grown borders*.

---

## The sgueltch question

The recurring test in goopCodecs is whether a thing belongs in the collection by its **substrate**, not its surface. scute provoked the sharpest case of this so far, around making the cells "squelchier" — less crystalline, more wet and organic.

The honest finding is that there are **two different organic looks** hiding behind one idea, and they are not interchangeable:

- **Domain warp** (offset the lookup with noise) gives *flowing, marbled, liquid* borders. It is cheap, lives in the existing shader, and — crucially — keeps the partition a pure function of the corruptible seed bytes. Corruption stays instant; the byte editor is untouched. **This is still scute.** Arguably *more* scute: a real carapace plate has organic seams, not ruler-straight ones. scute's identity was never "straight borders" — it is "seed-defined territory that annexes its neighbours when corrupted." Wavy borders are a wetter skin on the same skeleton. Shipped as the **warp** slider.

- **Stochastic growth** (the "organic Voronoi" / Eden model — random pixels infecting neighbours until cells fill the space) gives *rough, eroded, lichenous* fronts: fractal raggedness, optional gaps if undergrown. This is a different morphology and a different *substrate*. The partition is no longer a clean deterministic function of a seed table; growth order, infection randomness, and stopping-time become load-bearing, and the result must be **baked**. That breaks scute's defining loop — corrupting a seed would require a slow re-grow to be seen. The natural taming is exactly the **timer** on the growth (and under-running it on purpose is *more* squelchy, not less), but a baked partition is not scute's instant-corruption loop.

So the ruling: **flowing-wet is scute; rotting-wet is a different specimen.** If growth proves to have its own corruption character worth chasing, it earns its own name in the growth/colony register — `thallus` (the undifferentiated body of a lichen — no roots, no stems, just grown tissue) is the leading candidate, with `mycel`, `bloom`, `culture`, and `eden` behind it. The dividing line is not how rough the borders look; it is whether the partition is still a function of corruptible bytes or a baked artefact of a process.

---

## Load-bearing invariants

The things that must not quietly break:

- **The partition is a pure function of the seed bytes.** This is what makes corruption live and the byte editor meaningful. Any feature that bakes the partition (e.g. real growth) leaves this contract and is, by definition, a different format.
- **The 16-byte header is locked in the editor and tolerant on decode.** Magic, dimensions, count, warp. The file always decodes; the decoder reads `min(declared, records present)`.
- **Records are a fixed 8 bytes.** The cascade — a length-changing edit reinterpreting every downstream cell — depends on this fixed stride. It is also why warp had to live in the header rather than the record.
- **Order is not meaning.** No operation may depend on record order, because nearest-seed rendering ignores it. (The inverse of ooid's load-bearing "order is meaning.")
- **orchid is reserved for damage.** Across the whole family. Clean state never uses it.

---

## Open threads

In rough order of how soon they'd pay off:

- **Lloyd relaxation** — iterate seeds toward their cell centroids for even, content-hugging cells (the look good low-poly tools produce). This is scute's real fidelity lever, the analogue of fit-resolution in ooid, and is the obvious "quality tier." Deferred.
- **Border anti-aliasing** — the hard nearest-seed borders are aliased. At a glance this reads as intentional "hard partition," but a light supersample (or warp > 0) softens it where wanted.
- **Jump Flooding (JFA)** — replace the brute-force renderer with a flood that makes cost independent of seed count, lifting the low cell ceiling so large detailed images stay snappy.
- **thallus** — genuine stochastic-growth cells (rough, lichenous fronts) as a *new specimen*, not a scute setting, with a growth-native corruption story (corrupt the growth order, the infection field, the stopping-time, the label bitmap). The timed Eden bake is the way to prototype its texture without breaking scute.
- **Cell weight** — use the reserved record byte for weighted Voronoi, making annexation under corruption lopsided.

---

## Notes and known behaviours

- **Cell count and speed.** The renderer tests every seed per pixel, so very high counts make slider-dragging sticky on weaker GPUs. The default sits low for responsiveness; JFA is the planned fix. Counts are plenty for a recognisable image well before the ceiling, because each cell colours a whole region.
- **Switching source exits byte-editing.** Re-seeding, fitting a new image, or opening a file drops you out of the byte editor, because a fresh encoding makes the old byte buffer meaningless.
- **warp persists; other look-tuning re-fits.** Changing **warp** only patches the header byte and re-renders (no re-encode). Changing **cells** or **detail bias** re-runs the encoder with a fresh sampling.
- **A heavy cascade can go sparse.** A length-changing find/replace can leave too few whole records to fill the frame; the decoder clamps and the canvas thins rather than crashing. Re-seed or reopen.
- **Privacy.** Everything is local to your browser. No image or file ever leaves your machine.

---

*scute · cellular loss · grown borders*
