# ooid

*A gaussian-blob image-and-video codec and alternate file format made for data corruption.*

ooid converts an image — or a colour field you grow from scratch, or every frame of a video — into a sediment of coloured, oriented Gaussian blobs, and stores them as a small binary file (`.ooid`). Because the picture is held as blobs rather than a grid of pixels or DCT tiles, corrupting the file produces loss that is **round**: blobs swell, teleport, recolour, and dissolve, instead of the blocky or scanline artefacts you get from glitching a JPEG or PNG. Efficiency is explicitly *not* a goal. The point is to give loss a different shape.

It runs entirely in the browser. Nothing is uploaded anywhere; all encoding, damage, and export happen on your machine.

---

## Quick start

1. Open `ooid.html` in a modern browser (Chrome, Edge, Firefox, Safari — needs WebGL2).
2. It opens in **Field** mode with a colour field already growing. To glitch a photo instead, switch to **Image** mode and drop a picture onto the canvas. To glitch a clip, drop a **video** — it gets blobbed frame by frame.
3. For a quick result the live encoder fits as you watch. For a closer fit, use **Quality** or **High fidelity** and press Render.
4. Drag the **Damage** sliders to corrupt a still non-destructively, or open **Corrupt as data** to edit the bytes by hand.
5. **Download PNG** for a flat image, **Download .ooid** to keep the glitched file (still or video) in the native format, or **Record .webm** to export a video for sharing.

Every control has a tooltip — hover on desktop, tap on mobile.

---

## Modes

### Image

Drop an image onto the canvas (or use *Choose image…*). The encoder fits Gaussian blobs to it: big coarse masses land first and finer detail accretes on top, so you watch the picture coagulate. There are three encoders, from instant-and-impressionistic to slow-and-close. They share the same blobs and the same format — they differ only in how hard they look at the image before committing.

You can also drop a `.ooid` file here to re-open it — including ones you (or someone else) previously damaged and downloaded, and including videos.

#### The fast fit *(live)*

A single greedy pass at low resolution. Instant, impressionistic, and a look in its own right — soft, painterly, economical. This is the default and the one to reach for when you want the *feel* rather than fidelity.

| Control | What it does |
|---|---|
| **blobs** | How many Gaussians to fit. More blobs hug the original more closely but encode slower. A simple image may use fewer than the slider value — the encoder won't add blobs it doesn't need. |
| **coarse↔fine** | Starting blob size. Left = big soft impressionistic masses; right = small fine grains. |
| **edge pull** | How strongly blobs stretch and align along edges in the image. 0 keeps them round; high values make brushstroke-like streaks that follow contours. |
| **Re-fit** | Run the encoder again with current settings and a fresh random seed. |

#### Quality fit

A middle gear. One pass like the fast fit, but fit against a **higher-resolution target** with the blob budget trailing it, placing each blob with an optimal-colour solver — plus a **reach-back** step that occasionally drops a large corrective blob where a whole region is off, instead of only fine grains. Between fast and HD in both look and cost. Runs offline with a progress bar and a Stop button.

| Control | What it does |
|---|---|
| **quality** | The master dial. Raises the resolution the encoder actually fits against — the real sharpness lever — and lets the blob budget follow it. Higher is sharper but costs roughly the square of this in time. |
| **reach-back** | On: periodically offer a large blob sized to the local error region, kept only when it reduces error, so broad mistints get fixed in one shot. Off: coarse-to-fine only, the way the fast fit behaves. Its effect is as much on *character* — the spread of blob sizes, and so how the file corrupts — as on fidelity. |
| **Render quality** | Run the quality fit; it replaces the current blobs when done. |

#### High fidelity

The encoder pushed toward "almost the original." It fits against an even higher-resolution target with a large blob budget, then runs **refinement sweeps** that recomposite in record order and re-solve every blob's optimal colour and alpha against the live residual. Optionally it also nudges each blob's position, size, and angle by local search — the strongest single fidelity lever, and the slowest. Output renders at up to 2048 px. This is render-button territory: minutes, not seconds, especially with geometry refinement on.

| Control | What it does |
|---|---|
| **quality** | The resolution the encoder fits against. Higher resolves finer detail; cost scales with roughly the square of this. |
| **budget** | The most blobs the fit may spend. The format caps at 65,535. With auto-stop on it often uses fewer, once added blobs stop improving the fit. |
| **refine** | Refinement passes after placement. Each pass recomposites in record order and re-solves every blob's optimal colour and alpha. Two to four is usually plenty. |
| **auto-stop** | Stop adding blobs once the residual stops improving, even below the budget. Off spends the whole budget whether or not it keeps helping. |
| **refine geometry** | Also nudge each blob's position, size, and angle by local search. Noticeably sharper, several times slower. |
| **Render HD** | Run the high-fidelity encode; it replaces the current blobs when done. |

**Which to use.** The fast fit is for the look and the speed. Quality is the everyday "make it clearly the same picture" gear. High fidelity, with *refine geometry* on, is for getting as close to the source as blobs allow. Across all of them, the resolution the fit targets — not the raw blob count — is what actually buys fidelity; the count rises productively only because a sharper target gives it something to resolve.

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

### Video

Drop a video (mp4, webm, mov, m4v, ogv) and ooid blobs it **frame by frame**. The clip is sampled at the rate you choose and each frame is encoded to its own blobs, then packed into a single `.ooid`. Because frames are encoded independently — no inter-frame prediction, no keyframes, no motion vectors — corruption stays round and *frame-local*: a mangled frame is just a glitchy still and the next one is fine, so loss reads as **flicker** rather than the smearing you'd get glitching an h.264. It looks like an animation seen through oil — rotoscoping by sediment. It is gloriously inefficient, and that inefficiency is the look.

| Control | What it does |
|---|---|
| **sample fps** | Frames sampled per second of video. Lower = fewer frames and a choppier result; higher = smoother but far more work. |
| **max frames** | A hard cap on how many frames to encode, so a long clip can't run away. |
| **encoder** | `fast` uses the live encoder with the Encoder sliders (seconds per frame). `HD` uses the High fidelity settings (minutes per frame — long clips take a very long time). |
| **Process frames** | Seek through the clip and encode every sampled frame. A Stop button keeps whatever's done so far. |

Once frames exist, a **transport** appears: play / pause, a scrubber, a frame counter, and **Record .webm**. Scrub to any frame; the canvas shows that frame. For video the live damage sliders are disabled — a multi-frame object has no single clean source for them to re-derive from — so corruption is done through the byte editor instead (see *Corrupt as data*).

---

## Damage *(stills)*

These sliders corrupt an encoded still **non-destructively** — they re-derive from the clean encoding every time, so dragging a slider back to zero cleanly undoes it. Each one targets a specific part of the data, so the loss is categorical rather than mush. (They're disabled while a video is loaded; use the byte editor for video.)

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

This is the hands-on databending surface: open the `.ooid` as raw data and glitch it by hand. It works on both stills and video, with a per-frame surface for the latter.

**The 16-byte header stays locked.** It holds the magic bytes, the dimensions, and the blob count, and it's shown but never editable. This is what guarantees the file always still decodes no matter how badly you mangle the body. For header-level destruction, download the `.ooid` and open it in a real hex editor.

**Two views, switchable:**

- **text** — the body as mojibake. Printable bytes show as characters; control bytes (including newlines) show as small `␀`-style glyphs so every byte is visible and round-trips exactly. Type to overwrite, exactly like glitching a file in a text editor.
- **hex** — the body as editable hex byte-pairs. Best for surgical single-byte changes.

**Find / replace** runs across the body. The `text ⇄ hex` toggle reads the find/replace boxes as either characters or hex values. If the replacement is a **different length** than what you searched for, the body **cascades** — everything after the first match shifts, which is where the big wandering glitches come from. The readout reports how many matches were replaced and how much the body grew or shrank.

### Stills

Pressing **Edit bytes →** *bakes* the current slider damage into the actual bytes and **pauses the sliders** (they grey out). This is deliberate. The sliders are non-destructive and re-derived; byte editing is destructive and stateful. The two can't be live at once. Leaving the editor:

- **Back to sliders** — discard the byte edits and return to live parametric damage.
- **Commit as base** — flatten the glitched bytes into a new clean source and re-enable the sliders, so you can keep damaging the already-corrupted version.

### Video *(per-frame)*

For a video the sliders are already disabled, so **Edit bytes →** opens a **per-frame** editor instead. The current frame's body is shown with its 16-byte frame header locked, exactly like a still — because every frame *is* a still. **prev / next** (and the transport scrubber) walk through frames; edits to a frame are kept as you move between them. **Revert all** restores every frame to how it was when you entered; **Done** returns to the transport.

The new idea here is the contained-vs-cascade choice, which the container format makes possible:

- **Contained** *(any same-length edit)* — the glitch stays inside its frame. Flip bytes, recolour, scramble records: the frame breaks, its neighbours don't. Each frame is independently length-delimited, so nothing leaks across the boundary.
- **Cascade** *(the "Cascade length into following frames →" button)* — takes a frame whose length you've changed and leaves its length prefix *stale*, so the edit bleeds past the frame boundary and the following frames **wander** — boundaries shift, frames merge or split, the count can change. It's the temporal version of the whole-file cascade you get from a length-changing find/replace on a single image. The decoder always finds its footing again, so the result glitches rather than crashes.

---

## Export

- **Download PNG** — the current canvas as a flat image (for video, the current frame). Blobs are resolution-independent, so this is rendered at full size.
- **Download .ooid** — the native format. A still saves as a single-frame file; a video saves as the multi-frame container, with any byte edits baked in. The format spec is appended to the file as a plaintext manifest, so anyone who opens it in a hex editor finds a short document explaining what they're looking at. Both are re-openable.
- **Record .webm** *(video)* — plays the blobbed, damaged frames in real time and records them to a `.webm` you can download. This is the *flattened* export, the way PNG is for a still: the shareable screenshot of the specimen, not the specimen itself. The native artifact is the `.ooid`; the webm is its render.

---

## The `.ooid` format (v1)

A tiny, deliberately legible binary format. Little-endian. Fixed-width records, byte-aligned so every field is individually addressable — that addressability is what lets the damage sliders and byte editor target one parameter class at a time. A **still** is a bare file; a **video** is a thin container holding N stills. A still is exactly the N = 1 case, so every older `.ooid` decodes unchanged.

### Still — `"OOID"`

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

Still file size = 16 + 12 × blob count, plus the optional trailing text manifest (which the decoder ignores).

**Compositing is alpha-over in record order**, which means record order is meaningful: blobs paint front-to-back, coarse-to-fine, so reordering records visibly re-layers the image. This is why *Shuffle order* is a damage operation in its own right. The decoder is also tolerant: it reads `min(declared count, whole records actually present)`, so truncated or length-changed files still render instead of crashing.

### Video container — `"OOIV"`

**Header — 16 bytes**

| Offset | Size | Field |
|---|---|---|
| 0 | 4 | magic `"OOIV"` (0x4F 0x4F 0x49 0x56) |
| 4 | 2 | width (uint16) |
| 6 | 2 | height (uint16) |
| 8 | 2 | frame count (uint16) |
| 10 | 1 | fps (uint8) |
| 11 | 1 | version (1) |
| 12 | 4 | reserved |

**Then, per frame:**

| Size | Field |
|---|---|
| 4 | frame length (uint32) |
| *length* | a complete `"OOID"` still (its own 16-byte header + records) |

…followed by the optional trailing manifest.

Each frame is a self-contained `.ooid` you could slice out and open on its own. The **uint32 length prefix** is the load-bearing part: it lets the decoder walk frame boundaries even through a corrupted body, and it's what makes byte-edits either stay inside a frame or — when a length is changed and its prefix left stale — **cascade** across the boundary into the frames that follow. The decoder is tolerant here too: an oversized or truncated length is clamped to what's actually present, so a mangled container still yields a run of frames rather than throwing.

The field bit-depths are themselves the quality/quantisation knobs. Position is stored at 16 bits, σ and θ at 8 — coarsening any of these snaps blobs to discrete classes. Quality settings here are morphological decisions, not efficiency ones.

---

## How it works, briefly

**Renderer.** WebGL2, one instanced quad per blob, with a fragment shader evaluating the anisotropic Gaussian falloff and premultiplied alpha-over blending. Handles tens of thousands of blobs live so damage can be applied with sliders rather than a render button.

**Encoder (Image mode).** A residual-driven greedy fit. Each step builds an error map between the target and the current blob composite, importance-samples a high-error location, reads the local orientation and anisotropy from the image's structure tensor (so blobs elongate *along* edges), and solves the blob's colour and alpha that minimise squared error in closed form. The fast fit does this once at low resolution. The Quality fit does it against a higher-resolution target with the budget trailing the resolution, and periodically tries a scale-laddered **reach-back** candidate — a large blob sized to the local error region, accepted only if its closed-form gain beats the alternatives, so it can never muddy an already-solved area. High fidelity adds **refinement sweeps** that recomposite in order and re-solve each blob's colour and alpha against the live residual, and an optional geometry pass that perturbs each blob's position, size, and angle and keeps the change only when squared error drops. Fitting runs at reduced resolution for speed; output is rendered at full resolution since Gaussians are resolution-independent.

**Field generator (Field mode).** Blobs sample a procedural field built from the palette, shape, scale, warp, and angle, taking their colour from the field and (when stretch > 0) their orientation from the field's local gradient.

**Video pipeline.** The clip is loaded into a hidden video element and seeked frame by frame; each frame is drawn to a scratch canvas and run through the chosen encoder, producing one clean `.ooid` per frame. Playback and recording are decoupled from encoding: frames are cached, so the transport plays and the webm records at true frame rate no matter how long a single frame took to fit.

---

## Notes and known behaviours

- **Blob count on simple inputs.** Every encoder stops adding blobs once they stop reducing error, so a flat image can finish well under the budget. That's the fit being economical, not a bug — and raising the *fit resolution*, not the blob count, is what creates more detail for blobs to resolve.
- **Resolution per tier.** The fast fit fits at up to 340 px and outputs at up to 1024 px on the longest side. Quality fits higher (up to ~640 px) and outputs larger; High fidelity fits up to 768 px and outputs at up to 2048 px. Very large uploads are downsampled before fitting.
- **Cost.** Fit time scales with roughly the fit resolution squared times the blob count, so the higher tiers are the expensive ones — Quality is seconds to tens of seconds, High fidelity is tens of seconds to minutes, and geometry refinement multiplies that again. Every long fit has a Stop button that keeps what's done so far.
- **Reach-back is a small fidelity effect.** Because the coarse-to-fine schedule already places large blobs early and the optimal-colour solver mops up the rest, reach-back's effect on the numbers is modest. Its real value is the look — the spread of blob scales, and so how the file corrupts. It can only ever help or do nothing; it never degrades the fit.
- **Video is large, by design.** Independent frames mean no temporal compression — a many-frame `.ooid` is large, and the editor holds all frames in memory. The max-frames cap is the guardrail. (Temporal coherence — predicting frames from their neighbours — is a future direction, and would be the first time a frame isn't fully independent.)
- **Switching source exits byte-editing.** Regrowing a field, fitting a new image, processing a clip, or opening a file drops you out of the byte editor, because a fresh encoding makes the old byte buffer meaningless.
- **Reopening a video** lands you in the transport at the first frame, paused. There's no source clip to re-sample from, so *Process frames* is unavailable until you load a new video; everything else — scrub, play, record, byte-edit, export — works.
- **`.webm` support.** Recording uses the browser's media recorder (VP9/VP8). Where that's unavailable, recording is disabled and the per-frame `.ooid` / PNG exports remain.
- **Privacy.** Everything is local to your browser. No image, video, or file ever leaves your machine.

---

*ooid · round loss · no grid*
