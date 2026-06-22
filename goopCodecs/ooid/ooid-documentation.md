# ooid

*A gaussian-blob image codec and alternate image file format made for data corruption.*

ooid converts an image — or a colour field you grow from scratch — into a sediment of coloured, oriented Gaussian blobs, and stores them as a small binary file (`.ooid`). Because the picture is held as blobs rather than a grid of pixels or DCT tiles, corrupting the file produces loss that is **round**: blobs swell, teleport, recolour, and dissolve, instead of the blocky or scanline artefacts you get from glitching a JPEG or PNG. Efficiency is explicitly *not* a goal. The point is to give loss a different shape.

It runs entirely in the browser. Nothing is uploaded anywhere; all encoding, damage, and export happen on your machine.

---

## Quick start

1. Open `ooid.html` in a modern browser (Chrome, Edge, Firefox, Safari — needs WebGL2).
2. It opens in **Field** mode with a colour field already growing. To glitch a photo instead, switch to **Image** mode and drop a picture onto the canvas.
3. Drag the **Damage** sliders to corrupt the file non-destructively.
4. For hands-on glitching, open **Corrupt as data** and edit the bytes directly as text or hex.
5. **Download PNG** for a flat image, or **Download .ooid** to keep the glitched file in the native format.

Every control has a tooltip — hover on desktop, tap on mobile.

---

## Two modes

### Image

Drop an image onto the canvas (or use *Choose image…*). The encoder fits Gaussian blobs to it, live: big coarse masses land first and finer detail accretes on top, so you watch the picture coagulate.

| Control | What it does |
|---|---|
| **blobs** | How many Gaussians to fit. More blobs hug the original more closely but encode slower. A simple image may use fewer than the slider value — the encoder won't add blobs it doesn't need. |
| **coarse↔fine** | Starting blob size. Left = big soft impressionistic masses; right = small fine grains. |
| **edge pull** | How strongly blobs stretch and align along edges in the image. 0 keeps them round; high values make brushstroke-like streaks that follow contours. |
| **Re-fit** | Run the encoder again with current settings and a fresh random seed. |

You can also drop a `.ooid` file here to re-open it — including ones you (or someone else) previously damaged and downloaded.

### Field

A standalone colour-field and texture generator — no image needed. Pick three palette colours, choose a field shape, then shape how blobs sample it.

| Control | What it does |
|---|---|
| **palette** | Three colours the field blends between (low → mid → high). |
| **shape** | `gradient` smooth sweep · `radial` concentric rings · `waves` two interfering sine waves · `flow` organic noise · `cells` Voronoi patches. |
| **scale** | Feature size of the field. Higher = finer, busier. |
| **warp** | Distorts the field with noise — pulls straight geometry into liquid, organic shapes. |
| **angle** | Rotates the field (affects gradient and waves). |
| **recipes** | Starting points that set the palette and every slider. Tweak freely after — nothing is locked. |
| **grain · blobs** | How many blobs sample the field. |
| **grain · grain** | Median blob size. |
| **grain · stretch** | 0 = round blobs; higher = streaky blobs aligned to the field's own gradient, so the texture flows. |
| **grain · opacity** | How opaque each blob is. Lower lets blobs layer translucently. |
| **Regrow field** | Re-sample blob positions with a new random seed. |

---

## Damage

These sliders corrupt the encoded file **non-destructively** — they re-derive from the clean encoding every time, so dragging a slider back to zero cleanly undoes it. Each one targets a specific part of the data, so the loss is categorical rather than mush:

| Operation | Morphology |
|---|---|
| **corruption** | Random byte flips scattered across all records — speckled round lesions everywhere. |
| **truncate** | Keep only the first share of records, drop the rest. Because coarse blobs come first, detail dissolves into fog before structure does. |
| **position** | Corrupt only the position bytes — blobs teleport. |
| **size** | Corrupt only the size bytes — blobs swell or deflate in place. |
| **orient** | Corrupt only the orientation byte — anisotropic blobs spin. |
| **hue** | Corrupt only the colour bytes — blobs recolour while staying put. |
| **audio band** | Heavily corrupt one contiguous run through the middle of the file, the way an audio effect chews a band of samples. Note the result is scattered round lesions, not scanlines. |
| **Shuffle order** | Reorder the records. Because blobs paint front-to-back, the coarse-over-fine layering scrambles. |
| **Randomize / Reset** | Set every slider to a random amount / clear all damage. |

---

## Corrupt as data

This is the hands-on databending surface: open the `.ooid` as raw data and glitch it by hand.

Pressing **Edit bytes →** *bakes* the current slider damage into the actual bytes and **pauses the sliders** (they grey out). This is deliberate. The sliders are non-destructive and re-derived; byte editing is destructive and stateful. The two can't be live at once — once you've hand-edited bytes, a slider would have to recompute from the clean source and wipe your edits. So byte-editing is its own mode.

**The 16-byte header stays locked.** It holds the magic bytes, the image dimensions, and the blob count, and it's shown but never editable. This is what guarantees the file always still decodes no matter how badly you mangle the body — which is the only reason you can safely leave byte-editing and return to the sliders, or commit the glitch and keep going. For header-level destruction, download the `.ooid` and open it in a real hex editor.

**Two views, switchable:**

- **text** — the body as mojibake. Printable bytes show as characters; control bytes (including newlines) show as small `␀`-style glyphs so every byte is visible and round-trips exactly. Type to overwrite, exactly like glitching a file in a text editor.
- **hex** — the body as editable hex byte-pairs. Best for surgical single-byte changes.

**Find / replace** runs across the body. The `text ⇄ hex` toggle reads the find/replace boxes as either characters or hex values. If the replacement is a **different length** than what you searched for, the body **cascades** — everything after the first match shifts, which is where the big wandering whole-file glitches come from. The readout reports how many matches were replaced and how much the body grew or shrank.

**Leaving the editor:**

- **Back to sliders** — discard the byte edits and return to live parametric damage.
- **Commit as base** — flatten the glitched bytes into a new clean source and re-enable the sliders, so you can keep damaging the already-corrupted version. (Because the header is preserved, the committed file still decodes.)

---

## Export

- **Download PNG** — the current canvas as a flat image. Blobs are resolution-independent, so this is rendered at full size.
- **Download .ooid** — the current file (including any damage or byte edits) in the native format. The format spec is appended to the file as a plaintext manifest, so anyone who opens it in a hex editor finds a short document explaining what they're looking at. Re-openable in Image mode.

---

## The `.ooid` format (v1)

A tiny, deliberately legible binary format. Little-endian. Fixed-width records, byte-aligned so every field is individually addressable — that addressability is what lets the damage sliders target one parameter class at a time.

**Header — 16 bytes**

| Offset | Size | Field |
|---|---|---|
| 0 | 4 | magic `"OOID"` (0x4F 0x4F 0x49 0x44) |
| 4 | 2 | width (uint16) |
| 6 | 2 | height (uint16) |
| 8 | 2 | blob count (uint16) |
| 10 | 1 | compositing mode (0 = alpha-over) |
| 11 | 1 | version (1) |
| 12 | 3 | base colour RGB |
| 15 | 1 | reserved |

**Record — 12 bytes each**

| Offset | Size | Field | Encoding |
|---|---|---|---|
| 0 | 2 | x | uint16, normalised 0–65535 across width |
| 2 | 2 | y | uint16, normalised 0–65535 across height |
| 4 | 1 | σ₁ | log scale, 0.5 px … 0.45·min(W,H) |
| 5 | 1 | σ₂ | log scale (same range) |
| 6 | 1 | θ | 0–255 maps to 0–π |
| 7 | 1 | r | 0–255 |
| 8 | 1 | g | 0–255 |
| 9 | 1 | b | 0–255 |
| 10 | 1 | α | 0–255 |
| 11 | 1 | reserved |

Total file size = 16 + 12 × blob count, plus the optional trailing text manifest (which the decoder ignores).

**Compositing is alpha-over in record order**, which means record order is meaningful: blobs paint front-to-back, coarse-to-fine, so reordering records visibly re-layers the image. This is why *Shuffle order* is a damage operation in its own right. The decoder is also tolerant: it reads `min(declared count, whole records actually present)`, so truncated or length-changed files still render instead of crashing.

The field bit-depths are themselves the quality/quantisation knobs. Position is stored at 16 bits, σ and θ at 8 — coarsening any of these snaps blobs to discrete classes. Quality settings here are morphological decisions, not efficiency ones.

---

## How it works, briefly

**Renderer.** WebGL2, one instanced quad per blob, with a fragment shader evaluating the anisotropic Gaussian falloff and premultiplied alpha-over blending. Handles thousands of blobs live so damage can be applied with sliders rather than a render button.

**Encoder (Image mode).** A residual-driven greedy fit. Each step builds an error map between the target and the current blob composite, importance-samples a high-error location, reads the local orientation and anisotropy from the image's structure tensor (so blobs elongate *along* edges), picks the local mean colour, and solves the alpha that minimises squared error in closed form. Blobs are placed in batches across animation frames, so you watch it converge coarse-to-fine. Fitting runs at reduced resolution for speed; output is rendered at full resolution since Gaussians are resolution-independent.

**Field generator (Field mode).** Blobs sample a procedural field built from the palette, shape, scale, warp, and angle, taking their colour from the field and (when stretch > 0) their orientation from the field's local gradient.

---

## Notes and known behaviours

- **Blob count on simple inputs.** The encoder stops adding blobs once they stop reducing error, so a flat image can finish well under the slider value. That's the fit being economical, not a bug.
- **Switching source exits byte-editing.** Regrowing a field, fitting a new image, or opening a file drops you out of the byte editor, because a fresh encoding makes the old byte buffer meaningless.
- **Large hex bodies.** A 9,000-blob file is ~100 KB of hex in the editor. It works, but find/replace is the smoother tool for broad strokes; the hex grid is best for targeted pokes.
- **Resolution.** Encoding fits at up to 340 px and outputs at up to 1024 px on the longest side. Very large uploads are downsampled before fitting — invisible for this aesthetic, but worth knowing.
- **Privacy.** Everything is local to your browser. No image or file ever leaves your machine.

---

*ooid · round loss · no grid*
