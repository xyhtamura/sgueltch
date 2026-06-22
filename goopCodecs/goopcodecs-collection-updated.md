# goopCodecs

*A collection of alternative image, video, and colour-field file formats built for data corruption.*

Every mainstream image codec was optimised to make files small and loss invisible. **goopCodecs does the opposite on purpose.** Each member is a browser-based codec and native file format whose reason to exist is to give *loss a specific shape* — round, cellular, flowing, ringed, spreading, recursive — so that corrupting a file becomes an expressive act rather than an accident. None of these are efficient. That is the point.

The unifying argument: the grid in JPEG's DCT, the scanline order of a raster, 12-TET, Unicode's codepoints — these are *contingent* encoding choices that got naturalised into feeling inevitable. Change the basis geometry (what shape one unit of information covers), the substrate (what kind of body the image is decoded into), and the serialization (which bytes are neighbours), and the morphology of damage changes completely. **The artifact shape is the argument.** goopCodecs is a set of counterfactual standards, each demonstrating a different way the choice could have gone — and a different way loss could feel.

The first three members now form an opening suite:

- `ooid` — Gaussian blobs → **round loss**
- `scute` — Voronoi seed territories → **cellular loss**
- `vermis` — one Hilbert-thread filament → **flowing loss**

Together they establish the rule for the collection: a goopCodec is not just an image effect, nor merely a new visual style. It is a format where the image is reconstituted through a different substrate, and where databending that format reveals the substrate's own way of breaking.

---

## Current status

### Shipped / working

1. **ooid** — `.ooid` / `.ooiv`  
   A Gaussian-blob still, field, and video codec. Images become layered sediment: coloured anisotropic Gaussian blobs composited in record order. Corruption is round: blobs swell, teleport, recolour, spin, dissolve into fog, or relayer when shuffled. Video is stored as independent ooid frames in an `OOIV` container, so corruption is frame-local unless the byte editor deliberately cascades across frame boundaries.

2. **scute** — `.scute`  
   A Voronoi-cell image codec. Images become seed-defined territories: every pixel belongs to its nearest seed. Corruption is cellular: seeds wander, borders buckle, cells annex neighbours, colours flare, and truncation coarsens the partition instead of making holes. Record order carries no meaning, so there is no shuffle operation by design.

3. **vermis** — `.vermis`  
   A Hilbert-thread image codec. Images are sampled along a Hilbert curve as DPCM colour deltas, then repainted not as square cells but as one continuous filament. Corruption flows: a damaged delta integrates downstream as a travelling stain or bruise through the body of the worm.

### Parked / adjacent

- **hilbert** — possible magic `HILB`  
  The earlier Hilbert+DPCM square renderer is *not* a goopCodec. It is important, but it belongs to a neighbouring serialization/adjacency project: same Hilbert ordering and delta body, but decoded back into square pixels. It dequantizes scanline order, not the image substrate. Keeping it parked clarifies the goopCodecs test.

---

## Core thesis

**goopCodecs are not about degrading images. They are about changing what kind of object an image is allowed to be, so that loss inherits a new morphology.**

A normal file format treats visible damage as a failure. goopCodecs treats visible damage as the primary expressive affordance. Each format asks:

- What is the image made of, if not pixels?
- What counts as a neighbouring unit of information?
- Which bytes are allowed to be fragile?
- What kinds of textual or hex edits produce meaningful visual consequences?
- How far can a file be bent before it stops reading?

A codec is not neutral storage. It is a little physics for an image. The format decides what kind of body the picture has, and therefore what kinds of wounds it can receive.

---

## Shared DNA

Every codec in the collection should follow the same patterns, so they read as a family and can share infrastructure:

- **Single-file, zero-dependency browser tools.** No build step. One HTML file each for now, with the possibility of a shared shell later.
- **The pipeline:** `source → encode → damage → decode → render`.
- **Two corruption surfaces:** a non-destructive parametric **damage panel**, and a destructive hands-on **byte/text editor**.
- **Header-locked byte editing.** The small header stays visible but protected, so the file remains decodable while the body stays open to intervention.
- **Mojibake + hex views.** The body should be editable both as text and as hex. Text view is not cosmetic; it is the databending surface.
- **Find/replace with cascade.** Same-length edits should produce contained mutations. Length-changing edits should produce meaningful downstream reinterpretation rather than simply crashing.
- **Legible binary formats.** Fixed-width, byte-aligned records wherever possible, little-endian, with small headers and tolerant decoders.
- **Self-describing specimens.** The format spec is appended to every native file as a plaintext manifest. A file opened in a hex editor should explain itself.
- **Morphological damage.** Loss must read as a shaped phenomenon, not generic noise. Round, cellular, flowing, ringed, infectious, recursive — each codec needs its own damage grammar.
- **Visual family resemblance.** Sultai / blue-green-black base with orchid reserved for damage; Fraunces + DM Mono; tooltips on every control; a short motif line per codec.
- **Local computation and privacy.** Everything happens in the browser. No image, video, or native file leaves the user's machine.
- **Source and toy world.** Where it makes sense, a codec should support both uploaded images and a generative source mode. Each generator should reveal the codec's substrate rather than just fill the canvas.

Anything `ooid` already solves — the damage panel, the byte editor, the manifest pattern, the design tokens, the encode→damage→decode→render loop — is shared infrastructure that later members should reuse rather than reinvent.

---

## What makes a good databending codec?

goopCodecs are not merely formats that *survive* databending. They are formats made *for* databending: for hex edits, textual replacements, mojibake interventions, length-changing substitutions, byte-class corruption, and repeated destructive play.

A good databending codec should have a high density of visually consequential interventions. In JPEG databending, many textual interventions do create striking results: half an image corrupts, colours drop out, blocks shear, scanlines tear, or spectral artifacts bloom. But many other edits simply delete a chunk of the picture, make the file unreadable, or produce almost the same effect regardless of what was changed. That is understandable for JPEG, because JPEG was not designed as a databending instrument. It was designed for compression. Its interesting failures are accidental affordances.

A goopCodec should make those affordances intentional.

### 1. Most edits should matter

The format should give the databender many possible ways to intervene, and most textual or hex interventions should create some meaningful visual consequence. Not every edit needs to be beautiful, but the user should feel that the file is responsive — that poking the body produces a visible wound, swelling, stain, annexation, flicker, phase-shift, or relayering.

A weak databending format has a narrow magic zone: a few lucky edits work, most do nothing, and many kill the file. A strong databending format has a broad playable body.

### 2. The file should bend before it breaks

The decoder should be tolerant. Truncation, length-changing replacement, stale counts, incomplete records, oversized frame lengths, or missing body data should produce a damaged specimen rather than a blank canvas or a thrown error.

This does not mean the file should be impossible to destroy. It means destruction should be delayed long enough for corruption to have a morphology. The interesting zone is the region between cleanliness and collapse.

### 3. The header should be protected, the body should be vulnerable

The header contains the minimum conditions of readability: magic, dimensions, count, version, and any substrate hints. In the built-in editor, this region should stay locked.

The body, by contrast, should be as exposed as possible. It should be readable as byte classes or records, and those records should map to things the eye can understand: a position, a colour, a size, a delta, an angle, an alpha, a frame length, a growth event, a transform.

### 4. Byte classes should have morphological identities

A good databending codec lets different parts of the body break differently.

- In `ooid`, corrupting position bytes teleports blobs; size bytes swell them; orientation bytes spin them; colour bytes recolour them; record order relayers them.
- In `scute`, corrupting position bytes moves seeds and deforms the partition; colour bytes flare cells; truncation causes surviving territories to annex abandoned space.
- In `vermis`, corrupting delta bytes integrates forward along the thread, so a small edit becomes a travelling stain.

The user should be able to develop an intuition: *this kind of textual intervention tends to create this kind of visual event.*

### 5. Same-length edits and length-changing edits should both be interesting

Same-length edits are contained: a byte is overwritten, a colour shifts, a blob swells, a delta spikes, a seed wanders.

Length-changing edits are cascades: downstream records shift alignment, frame boundaries wander, curve phase changes, or records reinterpret themselves. A good databending codec should make both categories useful. If every length-changing edit simply breaks the file, the text editor becomes less alive.

### 6. Different interventions should not all collapse into the same effect

A format made for databending should avoid visual monotony. If replacing `A` with `B`, deleting a run, flipping random bytes, truncating the body, and editing hex all produce the same generic corruption, then the databender has little reason to keep exploring.

The goal is a large space of distinguishable consequences: fog, lesions, annexation, stains, flicker, relayering, phase shifts, boundary slips, swells, bruises, and so on.

### 7. The body should be textually strange but not textually inert

The mojibake view should not be a gimmick. It should be possible to edit the file as text and feel that text has force. Control characters should be visible; printable bytes should round-trip; find/replace should report how many matches changed and whether the body grew or shrank.

The text surface is where goopCodecs meets electronic literature: the image becomes a readable-unreadable text whose substitutions produce visual events.

### 8. Corruption should preserve the codec's argument

The best corruption is not arbitrary. It demonstrates the format's concept.

- `ooid` corruption should stay blob-like.
- `scute` corruption should stay territorial.
- `vermis` corruption should flow along the filament.
- A future ring codec should fail in rings and wedges.
- A future growth codec should fail like infection, colony, or coral.
- A future fractal codec should fail recursively.

If corruption loses the substrate's identity, the format is not doing enough work.

### 9. The clean file and the damaged file should both be native

A goopCodec should not treat damage as an external screenshot effect. The damaged native file should remain a native specimen: downloadable, reopenable, editable again, and carrying its own manifest. PNG or WebM is the flattened export. The native file is the actual artifact.

### 10. The interface should teach the format

The UI should not hide the file structure. It should make the codec legible through controls, tooltips, readouts, byte editors, and export behavior. A user should gradually learn what the format is by damaging it.

This is why the damage panel and byte editor coexist. The sliders are like labelled laboratory interventions; the text/hex editor is the open wound.

---

## The opening triad

The first three members form a complete conceptual triangle:

| codec | image body | relation to space | meaning of order | signature loss |
|---|---|---|---|---|
| `ooid` | many overlapping blobs | accretion / sediment | record order is compositing order | round lesions, swelling, fog, relayering |
| `scute` | many seed territories | partition / annexation | record order carries no meaning | buckled borders, cellular takeover |
| `vermis` | one continuous filament | path / adjacency / flow | order is the body itself | travelling stain, bruise, downstream drift |

That triangle is important. The first three are not three arbitrary styles; they define three substrate logics:

1. **Composited multiplicity** — many overlapping bodies.
2. **Exclusive multiplicity** — many bodies, but each pixel belongs to one.
3. **Continuous singularity** — one body threaded through the plane.

In other words:

- `ooid` asks what happens when the image is made of soft masses.
- `scute` asks what happens when the image is made of territories.
- `vermis` asks what happens when the image is made of one path.

This gives future goopCodecs a standard to meet. A new member should not merely look organic. It should answer: **what is the new body, and what kind of loss becomes possible only in that body?**

---

## The members

Each entry records the idea, the basis/substrate, serialization, damage morphology, build status, and what the member contributes to the family vocabulary.

### 1. ooid — Gaussian blobs ✦ shipped

**File:** `.ooid` for stills, `.ooiv` for videos  
**Motif:** *round loss · no grid*  
**Body:** coloured anisotropic Gaussian blobs  
**Substrate logic:** accretion, sediment, painterly mass  
**Serialization:** fixed-width records for blob position, scale, orientation, colour, alpha, and reserved fields; alpha-over in record order  
**Order:** meaningful; blobs paint front-to-back, coarse-to-fine  
**Status:** v1 complete: image encoder, field generator, video container, fast / quality / high-fidelity fitting, damage sliders, byte editor, native export, PNG/WebM export, documentation.

`ooid` establishes the collection. It converts images, generated colour fields, or video frames into a sediment of coloured Gaussian blobs. Since the image is held as overlapping soft bodies rather than pixels or DCT tiles, corruption becomes round: lesions, swelling, recolouring, deflation, teleportation, relayering, and fog.

The important structural fact is that **order is meaning**. Because blobs composite alpha-over in record order, shuffling records is a real damage operation. This makes `ooid` the format where corruption can act on layering itself.

`ooid` also establishes several family patterns:

- generative field mode as a toy world
- still and video support
- byte-class damage sliders
- destructive byte editor with commit/back behavior
- native files with appended plaintext manifests
- inefficiency as part of the aesthetic

### 2. scute — Voronoi cells ✦ shipped

**File:** `.scute`  
**Motif:** *cellular loss · grown borders*  
**Body:** seed-defined Voronoi territories  
**Substrate logic:** partition, adjacency, annexation  
**Serialization:** fixed-width records for seed position and colour; warp lives in the locked header  
**Order:** not meaningful; every pixel takes its nearest seed regardless of record order  
**Status:** v1 complete: image/sample-field encoder, detail-biased seed scattering, warp, damage sliders, byte editor, native export, documentation.

`scute` is the first sibling and the first strong contrast to `ooid`. It converts the image into a partition of territories grown from points. Corrupting a seed coordinate does not smear the picture; it rewrites jurisdiction. Borders buckle, cells annex neighbours, and truncation causes surviving cells to flood into abandoned territory rather than leaving holes.

The important structural fact is that **order is not meaning**. A Voronoi partition does not care where a seed appears in the file; it only cares where the seed is in space. Therefore `scute` has no shuffle operation, and that absence is part of the format's identity.

`scute` also clarifies the difference between surface and substrate. The `warp` slider makes borders wet, marbled, and organic, but it remains a render-time lens over the same seed table. This is still scute because the partition remains a pure function of corruptible seed bytes. Genuine stochastic growth, by contrast, would be a different specimen.

### 3. vermis — Hilbert filament ✦ shipped

**File:** `.vermis`  
**Motif:** *one thread · the bruise that flows*  
**Body:** one continuous painted filament  
**Substrate logic:** path, adjacency, integration, flow  
**Serialization:** Hilbert-curve order; 3-byte RGB deltas from the previous sample; small header with anchor and substrate hints  
**Order:** order is the body; samples only make sense as a continuous sequence  
**Status:** v1 complete: image/sample-field source, Hilbert+DPCM encoding, filament rendering, girth/bleed/relax substrate controls, Resolve/Ooze presets, damage sliders, byte editor, native export, documentation.

`vermis` is the hinge member. It began as a Hilbert-curve pixel codec that round-tripped cleanly but still painted samples back into square cells. That version was parked because it did not pass the goopCodecs test: it changed serialization but not substrate.

The shipped version keeps the Hilbert+DPCM core but changes the decoded body. Samples are repainted as one continuous worm rather than restored to square cells. Thin the thread and the image resolves; thicken and soften it and the image dissolves into ooze. Corruption flows because the body is a stream of deltas: a single damaged byte integrates forward as a travelling stain, a bruise spreading through tissue.

`vermis` clarifies the collection's rule: **to leave the grid, it is not enough to reorder it. The decode substrate must change.**

---

## Adjacent but not goopCodecs

### hilbert / HILB — square Hilbert-DPCM

**Status:** parked  
**Body:** ordinary square pixels  
**Serialization:** Hilbert order + DPCM  
**Why it matters:** it dequantizes scanline order  
**Why it is not goopCodecs:** the substrate remains the pixel grid

The square Hilbert version is conceptually valuable but belongs beside other serialization/adjacency works, not inside goopCodecs proper. It directly answers why image-as-audio databending so often produces scanlines: raster order makes horizontally adjacent bytes neighbours. A Hilbert curve makes byte adjacency more spatially two-dimensional. But if the samples are decoded back into square cells, the image is still a grid.

This distinction is useful enough to keep. It proves that serialization and substrate are separable layers.

---

## Future members

These are still speculative. The opening triad should be treated as the standard: each future member needs a new body and a new damage morphology, not merely a new shader.

### 4. otolith / annulus — polar or log-polar DCT

**Loss shape:** rings and wedges  
**Body:** radial blocks, annular sectors, iris/vinyl/growth-ring fields  
**Basis:** DCT, but run on a polar or log-polar domain rather than a rectangular one  
**Serialization:** quantised DCT coefficients per `(r, θ)` block, plus one or more centres  
**Damage morphology:** ring banding, wedge artifacts, swirl, warped centres, interfering radial systems  
**Difficulty:** medium-high

This is the strongest conceptual counterpoint to JPEG because it keeps a DCT-like premise but warps the domain. The blocks still exist, but in image space they become rings and wedges instead of squares. Corrupting a centre coordinate could swirl the whole image; corrupting radial bands could create growth-ring lesions.

`otolith` is a strong name because otoliths are small calcified ear stones with growth rings. It keeps the biological/geological vocabulary and suggests listening, balance, accretion, and rings.

### 5. thallus — stochastic growth / colony codec

**Loss shape:** infection, lichen, colony, coral, rot  
**Body:** a grown region map or propagation front  
**Basis:** stochastic growth, Eden-like infection, residuals in growth order, or a baked colony partition  
**Serialization:** seeds + growth order + residuals / labels / stopping-time  
**Damage morphology:** corruption inherits the shape of a growth process; wounds spread like infection or colony fronts  
**Difficulty:** medium-high

`thallus` is the natural continuation of the scute question. Scute can do flowing-wet borders through domain warp, but it should not absorb truly rotting-wet borders. A real stochastic growth front is a different substrate: growth order, infection randomness, label maps, stopping-time, and baked morphology become load-bearing.

This would be the member where corruption can act on growth itself: corrupt the infection field, corrupt the stopping-time, corrupt the frontier, corrupt the labels, undergrow the organism, overgrow it, or make colonies invade each other.

### 6. rhizome / frond / clade — fractal or IFS codec

**Loss shape:** recursive mutation  
**Body:** the image as transformed copies of itself  
**Basis:** fractal compression / iterated function systems  
**Serialization:** transforms, source regions, target regions, recurrence instructions  
**Damage morphology:** a corrupted transform recurs across scales; mutations echo structurally  
**Difficulty:** high

This is the ambitious finale direction. The old fractal-compression idea becomes newly useful if efficiency is no longer the goal. The artifact would be uniquely on-theme: the file defines the image as a set of self-relations, and corruption mutates those relations recursively.

The danger is encoder complexity. It should only be pursued if the recursive damage morphology is strong enough to justify the cost.

---

## Development priorities now

The first three members have changed the project from a speculative list into a real suite. The next work is less "build member two" and more "stabilise the family."

### 1. Consolidate shared infrastructure

The following systems are now clearly shared:

- damage slider conventions
- byte editor
- locked header display
- text/hex view
- find/replace and cascade reporting
- manifest appending
- export buttons
- tooltip system
- readout/status language
- visual design tokens

These can remain copy-pasted for now, but the suite is ready for a shared shell or small common include if maintenance gets painful.

### 2. Write a collection page

The first three deserve a cabinet page: not just a list of links, but a way to compare their substrate logics. It should introduce the triad:

- accretion
- partition
- filament

Then each codec can be opened as a specimen.

### 3. Sharpen the databending rubric

The "good databending codec" section should become a design rubric. Every new codec can be checked against it:

- Do most edits matter?
- Does the file bend before it breaks?
- Do byte classes have distinct visual consequences?
- Are same-length and length-changing edits both interesting?
- Does corruption preserve the substrate's argument?
- Is the native damaged file still reopenable?

### 4. Decide the next specimen by missing morphology

The next codec should add a loss shape not covered by the opening triad.

Best candidates:

- **otolith** if the suite wants a direct JPEG/DCT rebuke: rings, wedges, radial compression artifacts.
- **thallus** if the suite wants to deepen the biological side: growth, infection, colony, lichenous fronts.
- **rhizome/frond/clade** only if the recursive artifacts become compelling enough to justify the encoder.

---

## The collection's identity

**Working name:** goopCodecs  
Viscous, organic, anti-crystalline; the right register for formats that ooze where others tile. Keep it unless something stronger arrives.

**One-line frame:**  
*File formats designed for their loss.*

**Longer frame:**  
goopCodecs is a collection of counterfactual image formats: small, legible, self-describing codecs that reject compression efficiency and instead treat the encoding standard as an aesthetic instrument. Each member asks what images could become if they were stored as blobs, territories, threads, rings, colonies, or recursive self-relations — and what new forms of damage would follow.

**What holds it together:**  
Not a shared algorithm, but a shared refusal. Every member declines the efficiency mandate and treats storage as poetics. The collection argues by accumulation: the grid was never the only option, scanline order was never inevitable, and invisible loss was never the only possible ideal.

**Short motifs so far:**

- `ooid` — *round loss · no grid*
- `scute` — *cellular loss · grown borders*
- `vermis` — *one thread · the bruise that flows*

---

## Open questions

- How far should the shared visual identity go before it makes the members feel too similar?
- Should there eventually be one goopCodecs shell hosting modules, or should the single-file specimen model remain part of the work?
- How much should native files preserve generative/source settings versus only encoded bodies?
- Should the collection include adjacent non-goop serialization formats, like `hilbert`, in a sibling cabinet?
- How textual should the text editor become — purely byte-level, or increasingly poetic/literary?
- What is the threshold where a new visual effect deserves a new codec rather than another slider?

---

*goopCodecs · file formats designed for their loss*
