# SiltCRT

*soft granular signal emulator · an organic reply to the CRT-filter genre*

SiltCRT is a browser-based WebGL instrument for passing images and video through invented phosphor substrates. Conventional CRT emulators reproduce scanlines, shadow masks, and orderly RGB triads. SiltCRT asks what a screen might become if its luminous matter were organized as silt, soft bodies, or competing territories instead of a manufactured lattice.

The instrument is part of the [Sgueltch suite](../sgueltch.md). Its principal technical gesture is not a cosmetic overlay: it changes the geometry by which the source is sampled, then gives that sampled signal a material memory that can persist, rot, and flow between frames.

---

## Current status

SiltCRT currently supports:

- still-image and video specimens;
- four phosphor substrates: **Silt**, **Ooid**, **Scute**, and archival **Block**;
- three independent signal-memory modes: **Dry**, **Remanence**, and **Seep**;
- turbulence, chromatic bleed, positive bloom, subtractive umbra, phosphor tint, tube curvature, vignette, and grain;
- randomized cultures;
- PNG frame export and live WebM/MP4 capture where the browser supports it.

The active implementation is split across:

- [`index.html`](index.html) — interface and control definitions;
- [`style.css`](style.css) — the sediment/plastic instrument housing;
- [`script.js`](script.js) — source handling, shaders, feedback buffers, controls, and export;
- [`block/`](block/) — the untouched earliest implementation retained as a media-archaeological reference.

---

## The two independent axes

SiltCRT factorizes its signal into two choices:

| Axis | Question | Current options |
|---|---|---|
| **Phosphor substrate** | How is luminous space divided or reconstructed? | Silt, Ooid, Scute, Block |
| **Signal memory** | What happens to the previous frame? | Dry, Remanence, Seep |

They are deliberately independent. Ooid can seep; Scute can remain dry; Block can retain phosphor trails. This makes each result a combination of spatial substrate and temporal behaviour instead of a sealed preset.

Each substrate and memory mode remembers its own control values. The first activation of a mode loads an authored starting culture; later switches restore the user's last values for that mode. Switching either axis clears the feedback buffers so remnants from the previous system do not contaminate the new one.

---

## Phosphor substrates

### Silt — probabilistic cells

Silt is the default and the conceptual centre of the instrument. The shader constructs an aperiodic neighbourhood of nine jittered seed points. It calculates inverse-distance weights, then probabilistically selects one seed as the sampling location.

Unlike ordinary nearest-point Voronoi sampling, Silt does not give every fragment a permanently determined owner. Selection changes with time, producing granular instability within the cellular field. **Voronoi softness** changes the distance exponent: low values produce harder local ownership; high values allow more distant cells to intervene.

### Ooid — overlapping soft bodies

An ooid is a small rounded sedimentary body built through accretion. Ooid mode uses the same aperiodic seed neighbourhood but replaces discrete ownership with a Gaussian field. Nearby seed positions contribute according to distance and are blended into a weighted sampling position.

The result is continuous swelling rather than explicit cell boundaries. **Ooid overlap** controls Gaussian falloff: low overlap isolates bodies more strongly; high overlap lets neighbouring bodies merge into soft fields.

This mode is related to the suite's `.ooid` codec but is not a decoder for that format. It translates the codec's round-loss principle into a live screen substrate.

### Scute — pressured territories

Scute mode treats the seed field as a weighted power diagram. Each territory receives an independent temporal phase and a changing pressure value. Ownership is decided by squared distance minus pressure, so territories expand, compress, and displace their neighbours over time.

**Territory pressure** controls how far the weights can deform the underlying Voronoi partition. The source is still sampled at the winning territory's seed, preserving a harder cellular body than Ooid while refusing fixed equal-sized cells.

As with Ooid, this is conceptually adjacent to the `.scute` codec without being the same renderer or file format.

### Block — archival square lattice

Block restores the sampling geometry from the earliest 2024 SiltCRT implementation:

```glsl
phosphorUv = floor(distortedUv * phosphorSize) / phosphorSize;
```

It is retained as the instrument's historical baseline and negative control: the rigid square quantization regime against which the organic substrates argue. Its first-use culture restores the original turbulence, flow, sampling density, and chromatic bleed while neutralizing later bloom, tint, curvature, vignette, and grain additions.

Block is useful both aesthetically and analytically. It makes the difference between changing a filter and changing a substrate immediately visible.

### Density is substrate-relative

The **phosphor size** slider means density in every mode, but its numeric scale is not visually identical across substrates:

- Block uses the value directly as square samples per UV span.
- Silt, Ooid, and Scute divide the value by 20 before constructing their seed field.

For that reason each mode has its own initial and randomized density ranges.

---

## Signal memory

### Dry — replacement

Dry outputs the current processed frame directly. Nothing from the previous frame survives. This is the clearest mode for comparing substrate geometries and the least expensive memory behaviour.

### Remanence — max-decay persistence

Remanence compares the current signal with a decayed copy of the previous output:

```glsl
trail = previous * persistence;
output = max(current, trail);
```

Bright matter therefore lingers and rots toward black instead of being alpha-blended evenly. The **trail / smear** control determines the survival coefficient. This is phosphor persistence as material decay rather than a conventional motion-blur average.

### Seep — wet feedback

Seep turns persistence into a feedback instrument. Before decay, the previous frame is:

1. advected through a smooth, low-frequency two-dimensional flow field;
2. sampled from the displaced location;
3. diffused through four neighbouring samples;
4. multiplied by persistence;
5. recombined with the current frame through the same bright-matter maximum.

Its controls are:

- **trail / smear** — feedback survival or gain;
- **viscosity** — high values slow and shorten advection; low values produce freer drift;
- **diffusion** — increases neighbour spread and the proportion of softened feedback.

Seep realizes the **Wet Feedback** direction described in the suite architecture: the Paik camera-at-monitor lineage rerouted through a fluid substrate, with gain behaving as persistence and viscosity.

---

## Rendering pipeline

```text
image or video texture
        │
        ▼
CRT pass
  turbulence → phosphor substrate → chromatic assembly
  → Kawase bloom → Kawase umbra
        │
        ▼
scene render target
        │
        ▼
memory pass
  Dry | Remanence | Seep
        │
        ▼
ping-pong feedback targets
        │
        ▼
tube presentation
  curvature → vignette → animated silt grain
        │
        ▼
canvas → PNG frame or MediaRecorder stream
```

### CRT pass

The first fragment shader performs:

1. aspect-corrected noise calculation;
2. time-varying UV turbulence;
3. substrate-specific sample reconstruction;
4. RGB channel sampling with chromatic offsets;
5. twelve-direction, three-radius Kawase-style bloom;
6. an inverse dark-matter Umbra pass;
7. optional bloom tint toward a chosen phosphor colour.

### Memory pass

The processed frame is rendered to `rtScene`. Two same-sized render targets, `rtPrevA` and `rtPrevB`, alternate as the previous and next memory buffers. After every frame their references swap. This avoids reading from and writing to the same WebGL texture.

### Tube presentation

The final pass applies barrel curvature, vignette, and animated grain after feedback. Keeping presentation outside the memory buffer prevents tube distortion and noise from recursively accumulating.

---

## Control reference

### Warping

- **turbulence (log)** — displacement strength. The interface value is cubed before reaching the shader, allowing precise control near zero.
- **flow speed (log)** — rate of the turbulence field, also cubed.

### Phosphor & analog

- **phosphor size** — substrate-relative spatial density.
- **chromatic bleed** — opposing UV offsets for the red and blue channels; green remains centred.
- **softness / overlap / pressure** — a substrate-dependent structural control. It is inactive in Block mode.

### Bloom

- **bloom intensity** — strength of emitted bright matter.
- **bloom threshold** — source luminance required before blooming.
- **bloom radius** — sample offset used by the rotating Kawase disc.

### Umbra

Umbra is negative bloom: nearby darkness spreads inward as a subtractive field.

- **umbra intensity** — subtraction strength.
- **umbra threshold** — luminance below which matter contributes to the field.
- **umbra radius** — spatial reach.

### Signal memory

The memory selector and its controls are described above. Seep reveals viscosity and diffusion; Dry visually disables retention because it does not read the feedback buffer.

### Tube

- **curvature** — barrel distortion applied at presentation time.
- **vignette** — edge darkening.
- **silt grain** — animated high-frequency signal noise.

### Phosphor tint

- **glow hue** — colour toward which bloom is biased.
- **tint amount** — interpolation between source-coloured bloom and the selected phosphor hue.

### Capture

- **duration** — recording duration in seconds.
- **fps** — requested canvas capture frame rate.
- **match video length** — copies the loaded video's duration into the capture control when available.

---

## Loading and transport

The drop zone and **load specimen** buttons accept images and video.

### Images

Images are decoded through a `FileReader` and `THREE.TextureLoader`. The texture uses linear filtering, disables mipmaps, and clamps at the edges.

### Video

Videos are loaded into a muted hidden `<video>` element and exposed to WebGL through `THREE.VideoTexture`. Loading a video reveals play/pause, loop, source dimensions, duration, and the match-length capture shortcut.

### Aspect and resolution

The longest output dimension is capped at 600 pixels. The other dimension is derived from the source aspect ratio. All intermediate render targets are recreated at that exact size, and texel uniforms are updated accordingly.

All source processing happens locally in the browser. The page currently loads Three.js r128 from cdnjs, so opening the interface itself requires access to that dependency unless Three.js is later vendored.

---

## Randomization

**Randomize** changes the active culture while respecting substrate character:

- Block uses a 50–600 density range.
- Ooid uses 120–1800.
- Scute uses 150–3000.
- Silt uses 40–4000.

Other analog controls are randomized within authored bounds. When Seep is active, viscosity and diffusion are randomized too. Randomization does not change the selected substrate or memory mode.

---

## Export

### Save frame

Exports the current canvas as `siltcrt-frame.png`. Nothing is exported until a specimen is loaded.

### Export video

The canvas is recorded through `captureStream()` and `MediaRecorder`. SiltCRT requests VP9, then VP8, generic WebM, and finally MP4 in order of browser support. Video specimens restart from the beginning and loop during capture; image specimens record the evolving shader state.

The default recording bitrate is 12 Mbps. Export is real-time: a six-second capture takes six seconds.

---

## Implementation architecture

### Runtime

- Three.js r128;
- `WebGLRenderer` with drawing-buffer preservation and antialiasing disabled;
- one reusable full-screen quad;
- three shader materials: CRT, feedback, and tube presentation;
- three render targets: processed scene plus two feedback buffers;
- pixel ratio fixed at 1 for predictable cost and export dimensions.

### Mode values

Substrate and memory selectors are sent to their shaders as float uniforms:

| Substrate | Uniform value |
|---|---:|
| Silt | 0 |
| Block | 1 |
| Ooid | 2 |
| Scute | 3 |

| Memory | Uniform value |
|---|---:|
| Dry | 0 |
| Remanence | 1 |
| Seep | 2 |

The shaders use uniform branches so all modes share the same render architecture.

### State management

`SUBSTRATE_PRESETS` and `MEMORY_PRESETS` define first-use cultures. State is captured from the actual controls before leaving a mode and restored by dispatching the same input events used during manual interaction. This keeps displayed values and shader uniforms synchronized.

### Feedback hygiene

Feedback buffers are cleared when:

- the source dimensions change;
- the phosphor substrate changes;
- the signal-memory mode changes.

Without these clears, a new system would inherit luminous matter generated under an incompatible geometry or memory law.

---

## Adding a new phosphor substrate

A substrate should change how luminous space is represented, not merely recolour the result.

Implementation checklist:

1. Add a radio option in `index.html` under `substrate-mode`.
2. Add a numeric entry to `SUBSTRATE_VALUES`.
3. Add a first-use culture to `SUBSTRATE_PRESETS`.
4. Add dynamic labels and explanatory text to `SUBSTRATE_COPY`.
5. Add the sampling branch to the CRT fragment shader.
6. Give Randomize an appropriate density range.
7. Confirm that switching away and back restores its state.
8. Test with both landscape and portrait specimens, images and video.

Promising next substrates include:

- **Mycelium** — anisotropic cells aligned to the turbulence field;
- **Vermis** — continuous filament sampling instead of territorial cells;
- **Polyp** — porous radial colonies with gaps and local growth centres.

## Adding a new signal-memory mode

A memory mode changes the temporal relation between current and previous signal.

Implementation checklist:

1. Add a radio option under `memory-mode`.
2. Add its numeric value, first-use state, and explanatory copy.
3. Add any controls and feedback uniforms.
4. Implement the branch in the feedback fragment shader.
5. Clear feedback on activation.
6. Check static images with turbulence as well as moving video.

Promising next memory modes include:

- **Scar** — decay slows around high-luminance or high-contrast deposits;
- **Slough** — accumulated signal detaches in patches instead of fading uniformly;
- **Osmotic** — signal diffuses according to differences between neighbouring cells.

---

## Conceptual guardrails

SiltCRT is not intended to become a collection of attractive post-processing filters.

Every substrate should answer:

1. **What quantized geometry does this replace or expose?**
2. **What is the new spatial unit of luminous matter?**
3. **How does corruption behave differently because of that unit?**

Every memory mode should answer:

1. **What survives from the previous frame?**
2. **By what material law does it move or decay?**
3. **Why is that more than ordinary blend-mode feedback?**

Hexagonal pixels, triangular pixels, scanline overlays, and palette-only modes are weak additions on their own: they exchange one regular lattice or surface style for another without changing the apparatus. Block already preserves the grid as an explicit historical antagonist.

The strongest additions alter the substrate first and allow aesthetics to emerge from its behaviour.

---

## Known constraints

- The renderer is capped at 600 pixels on the longest side; this keeps the multipass bloom and feedback loops responsive but limits native export resolution.
- Silt's probabilistic ownership, Scute's pressure cycle, turbulence, grain, and Seep are animated; still-image output therefore remains temporally alive.
- Bloom and Umbra each perform 36 neighbouring texture reads per fragment and are the most expensive parts of the CRT pass.
- MediaRecorder format support varies by browser.
- No settings are currently serialized between page reloads.
- There is no offline deterministic video renderer; capture records the live real-time canvas.
- Three.js is loaded from a public CDN rather than vendored locally.

---

## Status summary

**Shipped:**

- Silt probabilistic Voronoi substrate;
- Ooid Gaussian-body substrate;
- Scute breathing weighted-territory substrate;
- Block archival square substrate;
- Dry, Remanence, and Seep signal memory;
- independent substrate/memory composition and per-mode state;
- image and video loading;
- bloom, umbra, tint, tube presentation, randomization, PNG, and video capture.

**Likely next:** visual tuning of the new first-use cultures at several specimen types, followed by Mycelium or Scar if another structural mode is desired.

---

*SiltCRT · the screen as sediment, territory, and memory*
