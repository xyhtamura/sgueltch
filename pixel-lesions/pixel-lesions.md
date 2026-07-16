# Pixel Lesions — Development Roadmap

> Sgueltch // Instrument 001 — organic pixel corruption instrument.
> Pixel sorting reimagined as a biological process: lesions spread across a canvas
> like lichen or slime mold and distort the pixels inside their boundary.

## Where it stands

Single-file app (`index.html`). Clean **cartridge architecture** — the engine, render,
and UI never need touching to add new behavior:

- **Growth cartridges** (`availableGrowths`) — *how the lesion spreads*. Each implements
  `init()` + `step(batchSize, opts)`, returning newly-infected coords per frame.
  Currently 11: Lichen, Slime Mold, Perivascular Crawl, Sheet Delamination, Mycelial Rot,
  Coral Polyp, Spore Cloud, Vascular Dendrite, Osmotic Pressure.
- **Effect cartridges** (`availableEffects`) — *how pixels inside the lesion are manipulated*.
  Each implements `apply(lesionCoords, imageData, opts)`, returning one color per coord.
  Currently 9: Gradient Sort, Fate Sort, Pixel Shuffle, Viscous Smear, Chromatic Seep,
  Rot Palette, Radial Sort, Liquefaction, Crystalline Fault, Necrotic Inversion.
- **Render path** — WebGL `GL_POINTS` blit for lesion pixels, composited over a static
  base canvas; CPU bounding-box fallback. Per-frame cost is O(N lesion pixels), not O(W×H).

The bones are solid. The roadmap widens the *expressive range* — most of it plugs into the
existing cartridge slots; a few items need small, well-scoped engine changes.

---

## Design philosophy — the constraint is the statement

Pixel Lesions works **inside the world of pixel sorting** on purpose. This is a position,
not a limitation.

**The rule:** every output pixel is a **real pixel that existed somewhere** — relocated,
reordered, or recolored by lawful mapping. Never a synthesized or corrupted byte.
Pixel sorting as *displacement of the true*, not fabrication.

**Explicitly out of scope:** substrate / stream corruption — byte-mangling, DCT artifacts,
codec datamosh. That aesthetic is real but belongs to **`sgueltch/goopcodecs/`**, not here.
Importing it would collapse Pixel Lesions into generic glitch. Refusing it is the point.

**The axis we do develop** — a spectrum of authorship, all of it staying pixel-true:

```
authored ───────────────────────────────────► accident
sort / recolor  →  ecological emergence  →  data-sourced unpredictability
(you paint)        (you set rules)           (a second image / an imperfect
                                              process decides)
```

The "unexpected" (Menkman) is reached **lawfully** — from the collision of two ordered
things, or from an incomplete operation — never from breaking the machine. Every future
cartridge should be placeable on this axis.

---

## Phase 1 — Pure cartridges (no engine changes)

Drop straight into the existing slots.

- [ ] **Reaction-Diffusion / Gray-Scott** (growth) — real Turing patterns (spots, stripes,
  labyrinths). Gold-standard organic look. `_step`-driven, fits the frame loop. Highest-want.
- [ ] **DLA — Diffusion-Limited Aggregation** (growth) — random walkers stick on contact.
  Fractal frost / coral, distinct from current tendrils.
- [ ] **Flow Field** (growth) — Perlin/sine noise vector field steers the frontier. Marbled,
  directional current. (Connects to the Jaffer-marbling exploration.)
- [ ] **Fate Growth** — mirror Fate Sort: randomly draw a growth strain on seed. Combined
  with Fate Sort = full slot-machine specimen.
- [ ] **Mutating Strain** (effect) — sort criteria drifts *during* spread, not just per-seed.
  Starts sorting by hue, ends by blue. The boundary between orderings is where it glitches.
- [ ] **Lying Comparator** (effect) — sort function noisy / occasionally inverts. Partial
  order, streaks that almost-resolve. The accident = an imperfect sort.
- [ ] **Aborted Sort** (effect) — bail mid-sort at a random depth, leave it half-ordered.
  Interrupted process as aesthetic.

## Phase 2 — Engine changes that unlock a class

Small, well-scoped core changes; each opens a family.

- [ ] **Donor image (cross-infection)** — load a second image B; make its `imageData`
  available to `apply()`. *The marquee direction.* The second image is a genuine entropy
  source — unpredictability without corrupting anything. Unlocks:
  - [ ] **Transplant** — lesion coords from host A, colors sampled from B at same (x,y).
    Foreign skin grafted into the wound.
  - [ ] **Carrier** — growth reads B's structure (edges / brightness) to steer A's frontier,
    but deposits A's own sorted pixels. B is the vector, not the payload.
  - [ ] **Cross-body sort** — pool A-coords + B-coords, sort the merged set, redistribute.
    Two images bleed into one ordering.
  - [ ] **Contact diptych** — A and B side by side; lesions spread across the seam and
    exchange pixels where they meet.
- [ ] **Per-pixel state buffer** — a `Map` of infection age / status per pixel. Substrate for
  ecological models below and for:
  - [ ] **Pixel Necrosis** — pixels age and decay toward black, punching hollow rot-holes.
  - [ ] **Pulse** — effect intensity oscillates with age; the lesion breathes.
- [ ] **Multi-seed / persistent lesions** — refactor the single global `lesionCoords` into a
  lesion array so concurrent infections (different strains) coexist and collide.

## Phase 3 — Ecological dynamics & interaction (biggest, most novel)

Depends on the Phase 2 state buffer + multi-seed. Rule-set, not outcome-set: you define local
law, emergence does the rest.

- [ ] **SIR epidemic** — susceptible → infected → recovered. Recovered pixels gain immunity,
  can't reinfect. Lesion burns out on its own, leaves scar topology. Self-terminating,
  on-theme, cheap once the state buffer exists.
- [ ] **Lotka-Volterra predator-prey** — two strains, one eats the other. Coverage oscillates;
  waves chase each other across the image. The prime reason to build multi-seed.
- [ ] **Life on lesion mask** — infected pixels live/die by neighbor count (Conway). Lesion
  flickers, blinks holes, gliders crawl out of the wound.
- [ ] **Logistic + carrying capacity** — growth slows as it crowds; density-dependent
  saturation.
- [ ] **Cross-contamination** — one lesion's sorted output re-seeds another. Lesions infect
  each other's *rules*, not just their pixels.
- [ ] **Metastasis** — a lesion's output color feeds back as a new seed; infection
  self-propagates without further clicks. Controlled runaway.

---

## Quick reference — where things plug in

| Add a… | Do this | Engine change? |
|--------|---------|----------------|
| Growth pattern | push object to `availableGrowths` (`init` + `step`) | none |
| In-bounds effect | push object to `availableEffects` (`apply`) | none |
| Cross-infection effect | Phase 2 donor-image `imageData` in `apply()` | small |
| Time / ecological model | Phase 2 per-pixel state buffer | small–medium |
| Colliding infections | Phase 2 multi-seed refactor | medium |

## Suggested first sitting

Reaction-Diffusion + Lying Comparator (both pure Phase-1, zero engine risk), then the
**donor-image** contract to unlock Transplant + Cross-body sort — the highest-payoff
direction and the cleanest source of lawful unpredictability.

---

*Suite context: part of the Sgueltch organic-glitch suite. Substrate/stream corruption lives
in `sgueltch/goopcodecs/` by design — Pixel Lesions stays pixel-true. Pixel Lesions is
self-contained; nothing above touches shared artifacts, so no `DEPENDENCIES.md` update needed.*
