# SYNCYTIUM

*the cells don't own their walls — the image does*
internal handle: `syncytium` · diminutive: `syncyt`
lives at: **sgueltch** (home) · hindcasts-adjacent at one hinge (see *lag graft*)
planned address: `https://xyhtamura.github.io/sgueltch/syncytium/`

**Status: specced, unbuilt.** (2026-07-28)

---

## micro-statement

Syncytium detects the edges in a frame and then refuses to draw them. Instead the edge field becomes a **metric**: a cell colony is seeded into the picture and grown outward under a distance that is cheap across flat tissue and expensive across contours. Cells therefore pool *inside* the image's anatomy — a cheek fills with one colony that cannot afford to cross the jawline — and the membranes you see were never drawn, only priced. The result is simultaneously a video effect (it reads the footage) and a generative graphic (it draws its own organism), because the footage supplies the anatomy and the colony supplies the flesh.

---

## the name

A **syncytium** is a tissue whose cells have fused: membranes dissolved, many nuclei sharing one continuous cytoplasm. Skeletal muscle is a syncytium; so is the placental syncytiotrophoblast; so is a slime mold plasmodium.

The name is the mechanic, inverted the way the mechanic is inverted. An ordinary Voronoi cell **owns its boundary by construction** — the wall is defined as the locus equidistant between two seeds, an internal property of the point set, blind to the image. Syncytium dissolves that ownership. The seeds keep their nuclei and lose their walls; the walls come from outside, from the picture. What holds the tissue together is not the cells agreeing on borders but a shared field they are all subject to.

> **a syncytium is a tissue that has given up its own membranes to a field.**

That is the spine, and it is why this is not "a Voronoi filter."

---

## the spine (what lattice it refuses)

Two stock-filter lineages, refused in one move because each is blind exactly where the other sees:

- **Find Edges / toon-shading / Canny-as-ink.** The canon treats edges as *lines to draw*. Edge detection is run, then the edges are inked and everything else is discarded or flat-filled. The image's structure is converted straight into decoration.
- **Crystallize / Stained Glass / Mosaic.** The canon treats cells as *tiles to lay*. Photoshop's Crystallize is already a Voronoi mosaic — non-grid, and therefore superficially Sgueltch-shaped — but its seeds are placed by a random process that has never looked at the picture. It tessellates *over* the image, like frost on a window that happens to have a face behind it.

Syncytium fuses them: **edges become the metric that the cells grow under**, so the tessellation is generated *by* the anatomy rather than laid on top of it. Neither operation survives intact. Edges are never inked; cells never own their boundaries.

The lattice refused at the substrate level is subtler than the raster: it is the **Euclidean metric itself**. Every Voronoi-based member of this suite so far (`.scute`, SiltCRT's Scute phosphor, CyberScotoma's hold regions) partitions space by straight-line distance — an isotropic, image-blind, flat-space assumption inherited from the same Cartesian habit as the pixel grid. Syncytium replaces the metric with an image-derived one. **Anisotropic, inhomogeneous, and locally determined by content.** That is the substrate move; everything below is consequence.

---

## the mechanic

### 1. the edge field

Per frame, compute a **structure tensor** rather than a bare Sobel magnitude:

`J = Gσ * (∇I ⊗ ∇I)` — smoothed outer product of the gradient.

Its eigenvalues give edge *strength*, its eigenvectors give edge *orientation*. Magnitude alone would be enough for isotropic growth; the orientation is what buys the **Grain** control (below), so take the tensor from the start.

Temporal note: per-frame Sobel flickers badly on video. Smooth the tensor field over a short temporal window (or carry it as an exponential accumulator) before it is used as a metric, or the walls will boil independently of the cells and the tissue will read as noise.

### 2. the metric

Slowness field:

`F(x) = 1 + k · ‖edge(x)‖^γ`

Growth cost per step is `F` along the path. `k` = **Fenestration** (see below), `γ` = contrast shaping. Optionally anisotropic: cost along the edge direction stays near 1 while cost across it rises with `k`, which lets colonies run *parallel* to contours like muscle fiber.

### 3. the growth — geodesic Voronoi

Solve the eikonal equation `‖∇u‖ = F` outward from all seeds simultaneously, carrying a label. Each pixel ends up owning (a) a geodesic distance and (b) the identity of the nearest seed *under the metric*. This is the whole engine; everything else is seeding, timing, and paint.

Implementation, in order of preference:

- **Bucketed Dijkstra / fast-marching at half resolution on CPU**, then edge-aware upsample of the label map. Exact, simple, and completely affordable because this is an offline-render tool (house doctrine, inherited from CyberScotoma: *spend computation deliberately, in the render, on the artifact*). Half-res labels upsampled against the full-res edge field lose nothing visible, since the walls are re-derived from the edge field anyway.
- **GPU:** jump-flood for an initial Euclidean guess, then N min-plus relaxation passes over an 8-neighborhood to correct it toward geodesic. Approximate; adequate for the realtime shadow.

Do **not** ship the naive "N relaxation passes only" version — cost propagates ~1px per pass, so large cells need hundreds of passes and the result silently degrades to Euclidean at scale. That degradation is exactly the mosaic collapse described below.

### 4. seeding — three strains

House pattern from Pixel Lesions: named strains, not a mode dropdown.

1. **Epithelial** — seeds placed *on* the edge ridge, growing inward. Cells hug contours and line them like an epithelium lining a lumen. Anatomy reads as the *interior* of the cell field.
2. **Parenchymal** — seeds placed at local maxima of the distance-to-edge field (the **medial axis**). Cells nucleate in the open middle of each region and press outward until they collide. Anatomy reads as the *boundary* between colonies. This is the packing-a-cavity look.
3. **Blastemal** — weighted Poisson-disk stochastic seeding, density driven by local detail. The neutral strain: fine cells where the picture is busy, one fat cell for a sky.

`Nucleate` is a continuous slider between Epithelial and Parenchymal; Blastemal is a separate mixing weight. Seed *count* and detail-weighting are independent controls.

**Relax** — n iterations of Lloyd relaxation *under the geodesic metric* (centroidal geodesic Voronoi), with state carried between frames. Equalizes cell area within anatomical regions and, carried across frames, produces the slow breathing that makes the colony look alive rather than placed.

### 5. metabolism — the temporal question

This is the crux. Everything above is a still-image effect until a cell has an identity across time.

- **Persistent** — seeds are particles that live across frames, advected by the motion field (or by sliding downhill on the edge field), with birth where new detail appears and death where it vanishes. Cells have identity, age, and history. The colony *lives on* the footage.
- **Apoptotic** — seeds recomputed every frame. Boil. Scintillation, rotoscope jitter, a tissue dying and being replaced 24 times a second.

`Turnover` runs continuously between them, with a `half-life` for the persistent end. High turnover should look like the tissue is failing, not like the renderer is.

### 6. paint — the interstitium rule

**The single rule that decides whether this reads as cytology or as stained glass: do not fill the cell.**

Each cell draws a **body** inset from its own wall — a soft blob at the (geodesic) centroid, scaled to a fraction of the cell — and the space between bodies is left as **interstitial fluid**. Polygons filled edge-to-edge always read as mosaic or Gaudí; shrunken bodies with fluid between them read as histology instantly.

- `Turgor` = body fill fraction. Default 0.75–0.9. **Turgor 1.0 is retained as the historical control** (the honest stained-glass filter), the same way SiltCRT keeps the square Block lattice.
- **Membrane** thickness and opacity taken from the *local* edge strength along the wall, so walls that coincide with real image contours are thick and dark while walls that are merely inter-colony collisions are faint. This is what makes the source anatomy legible in the drawing.
- **Organelles** — a second pass of the same solver at smaller scale, masked per cell, plus a nucleus blob at the centroid. Two-level tissue. Cheap, since it is the same code.
- Body colour: mean of the cell's region by default; alternatives are median (flatter, more graphic) and single-sample-at-nucleus (noisier, more alive).

### 7. Fenestration — the leak, kept

When a contour is weak or broken, the wavefront leaks through the gap and one colony floods two regions. The hygienic response is morphological gap-closing. **Refuse it.** A colony herniating through a break in a membrane is a fenestration, and it is the most biologically correct thing the algorithm does on its own.

`Fenestration` = the metric gain `k`, exposed as an aesthetic control rather than a tuning parameter. Low `k`: cells herniate freely, anatomy is a suggestion. High `k`: colonies are sealed in their compartments and the tissue goes rigid, almost cloisonné. The interesting band is where most walls hold and a few give.

---

## the failure mode to design against

**The mosaic collapse.** On footage with weak contour structure — or with the metric gain too low, or with an under-converged solver — the geodesic Voronoi degenerates into an ordinary Euclidean Voronoi, and the tool becomes Crystallize with better paint. It will still look nice. That is what makes it dangerous.

The test, and therefore a required build:

- **Histology view** — render walls only, no bodies, no colour. If the source image's anatomy is not legible in the wall pattern alone, the effect is not doing its job and no amount of paint will fix it.

Ship the histology view as a first-class toggle, not a debug flag. It is also, plainly, a good-looking output in its own right.

---

## controls (first pass)

| control | what it does |
|---|---|
| **Nucleate** | Epithelial ↔ Parenchymal seeding |
| **Blastemal** | stochastic detail-weighted seed mix |
| **Density** | seed count; detail-weighting amount |
| **Fenestration** | metric gain `k` — how sealed the compartments are |
| **Grain** | anisotropy; growth along-contour vs across |
| **Relax** | Lloyd iterations under the geodesic metric |
| **Turnover** | Persistent ↔ Apoptotic, + half-life |
| **Turgor** | body inset / interstitium width (1.0 = stained-glass control) |
| **Membrane** | wall thickness + opacity, scaled by local edge strength |
| **Organelles** | second-level packing depth, nucleus size |
| **Histology** | walls-only view |

---

## roadmap

Ordered by leverage ÷ cost.

1. **Core engine** — structure tensor, half-res bucketed Dijkstra, three strains, Persistent/Apoptotic turnover, interstitium paint, histology view, offline render + frame cache + WebM export. That is the tool.
2. **Lag graft** *(the Hindcasts hinge)* — a cell's body fills with colour sampled at its nucleus at `t − lag` **or `t + lag`**, while walls track the present. Bodies carry stale or premature content inside membranes that are current. Remanence's move applied to *territory* instead of tape; CyberScotoma's `donorOffset` applied to *tissue* instead of hold-regions. Nearly free once the engine exists, and it is the feature that earns the kinship.
3. **Anisotropic growth (Grain)** — the structure tensor is already computed; using its eigenvectors gives fibrous, muscle-like colonies that flow parallel to anatomy. Strong second-order look for little cost.
4. **Cross-clip anatomy** — walls from one clip, bodies from another. The Pythia control/source dual interface, which is the shared interface across both suites. One clip supplies the skeleton, another supplies the flesh.
5. **Necrosis / age** — persistent cells accumulate age; old cells lose turgor, desaturate through the Pixel Lesions Rot Palette, and eventually lyse and are re-seeded. Turnover becomes visible as a life cycle rather than a rate.
6. **Realtime shadow** — webcam mode on the GPU (JFA + relaxation, Apoptotic-biased). Per house doctrine, ship it *beside* the offline render, not instead of it, so the approximation is felt rather than argued.
7. **Syncytial fusion (the name, taken literally)** — let adjacent cells *fuse*: dissolve the wall between two colonies whose bodies are similar enough, producing multinucleate territories that span anatomical regions. The tool becomes its own name at the top of the parameter range.

---

## adjacencies (don't re-derive)

- **Pixel Lesions** — *Perivascular Crawl* already tracks contrast boundaries with a live Sobel matrix. The difference is decisive and should be stated in any writeup: Crawl makes edges a **path to follow**; Syncytium makes edges a **cost to pay**. One is a curve, the other is a field.
- **CyberScotoma** — nearest architectural sibling (video, Voronoi, offline sequential render, WebM). Its cells are hold-regions with Euclidean walls; Syncytium's cells are geodesic and always refreshing. The `donorOffset` logic ports directly into *lag graft*.
- **goopCodecs `.scute`** — encodes images as Voronoi territory vectors. A geodesic variant is a natural future codec: territories defined against the image's own metric, so byte damage shifts anatomy rather than tiles.
- **SiltCRT Scute phosphor** — same Euclidean-Voronoi assumption; the same metric replacement would give a phosphor substrate that deforms around picture content.
- **Remanence** — the lag graft is print-through applied to territory.
- **Reaction–Diffusion Halftone / Organic Dither** (§5.1 unbuilt) — both want a non-lattice neighbourhood to diffuse across. Syncytium's geodesic cell adjacency graph is exactly that structure, and could be the shared substrate.

---

## reply-map position

**Species:** reply.
**Replies to:** the 1990s filter-pack pair — *Find Edges* / toon-outline (edges as ink) and *Crystallize* / *Stained Glass* / *Mosaic* (cells as tiles).
**The mutation:** the two filters are fused so each corrects the other's blindness — edges stop being drawn and become the metric the cells grow under, so the tessellation is generated by the picture's anatomy instead of laid over it. The lattice refused is not the raster but the **Euclidean metric** underneath every Voronoi in the suite so far.

---

*spine: a syncytium is a tissue that has given up its own membranes to a field.*
