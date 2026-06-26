# urumizuri

*A specialized wet field layout codec and snapshot format made for fluid state databending.*

**wet state snapshot · tectonic shear**

---

## What it is

`urumizuri` converts the live, running simulation state of a fluid-ink printing engine into an uncompressed, byte-aligned matrix of spatial cell records. Unlike standard image formats that store finalized pixel values, or process scores that map temporal instructions, `urumizuri` serializes the *vulnerable material physics* of a wet ink bath—preserving active pigment load channels, fluid diffusion potential, and paper-fixing variables at a specific point in time.

Because it maps coordinates linearly across space through fixed-width channel strides, manual byte corruption directly attacks the spatial equilibrium of the fluid. Deleting or adding characters throws the array stride out of phase, forcing downstream records to misalign. The visible result is not blocky compression noise, but a violent geographic disruption—the liquid composite fractures and shears horizontally along fault lines. Poking the raw byte stream creates physical scars in the bath before the simulation even resumes.

`urumizuri` serves as a core environmental member of the **goopCodecs** ecosystem. It shares the suite's fundamental DNA: single-file zero-dependency architecture, a protected 16-byte header, a highly tolerant cascading decoder, an interactive parametric damage panel, and a direct hands-on text/hex editor.

---

## Quick Start

1. Open the specialized `urumizuri` data station in any modern web browser.


2. The workstation operates strictly on layout data; it does not ingest raw images. Drag and drop a native `.urumizuri` snapshot matrix onto the canvas area to expose its cell blocks.


3. Move to the **Damage** panel to parameterize structural decay non-destructively. Drag the sliders to watch fluid layers tear, fix states rot, or pigment loads pool.


4. Open **Corrupt as data** to enter the text or hex editor. Type inside the mojibake view to rewrite localized fluid variables, or execute length-altering find/replace passes to trigger deep tectonic alignment cascades.


5. Click **Download .urumizuri** to export the corrupted binary matrix back into your local workspace, fully prepared to re-perform live inside the `bakezuri` fluid engine.



---

## The Substrate: Spatial Matrix Logic

The format completely strips away nesting compression structures (like DCT spaces or scanline filters) to treat data as a raw physical continuum. The file translates space line-by-line into an uncompressed sequence of **pixel cells** ($W \times H$).

Every cell possesses a rigid, fixed stride of precisely `1 + NUM_INKS` bytes:

* **Byte 0 (The Fix State):** Maps the cell's physical fixation capacity (`fixField`), defining how fast ink binds to paper substrate or remains highly mobile in the water layer.


* **Bytes 1 to N (The Ink Load Layers):** Maps independent load channels for each active ink layer in the current gamut.



The layout relies heavily on strict, deterministic index targeting ($x + y \times W$). This makes the serialization layer and the rendering layer distinct: the binary data maps raw structural properties, while the renderer translates those loads into a subtractive pigment composite over the deep purple ground of the stagnant printing bath.

---

## Damage Morphology

The parametric sliders corrupt an encoded matrix **non-destructively** by re-deriving the fields from a clean base layer upon every manipulation. Because each operation explicitly targets isolated byte classes within the cell blocks, the visual loss maintains a distinct physical identity:

| Operation | Target Byte Class | Visual Morphology |
| --- | --- | --- |
| **wet drift** | Spatial record boundaries

 | Swaps discrete cell blocks within the array, causing fluid maps to tear apart and create localized structural offsets.

 |
| **channel flare** | Ink load channels ($1 \dots N$)

 | Floods saturated values into specific pigment arrays, generating deep, over-saturated ink wells in the printing bath.

 |
| **fix decay** | Fixation channel (Byte 0)

 | Jitters or decays cell boundaries, causing pigment to suddenly dissolve into neighboring channels or petrify prematurely.

 |
| **corruption** | Entire vulnerable body array

 | Scatters arbitrary byte flips uniformly across all records, producing mixed structural anomalies and pixel-level pigment noise.

 |
| **truncation** | Terminal cell array boundaries

 | Cuts the data stream short. The tolerant decoder stops painting mid-stride, leaving the remaining canvas space to render as blank, bone-dry paper.

 |

---

## Corrupt as Data: The Cascade Move

Selecting **Edit bytes →** bakes all current parametric damage into the active buffer, pauses the live sliders, and opens the open data wound for manual intervention.

The body can be parsed through two switchable views:

* **text:** Maps the uncompressed body array as legible mojibake. Control characters translate into non-destructive Unicode Control-Pictures glyphs, allowing printable text adjustments to write values directly back into the cell data.


* **hex:** Maps the cell fields into addressable, surgical hex byte-pairs.



### The Alignment Shift

Because each cell expects a rigid sequence of `1 + NUM_INKS` bytes, length-changing find/replace substitutions introduce a catastrophic **index phase shift**.

If a text replacement changes the byte length of a cell block, it shifts the structural alignment of every single downstream cell record. A byte that previously dictated an ink load is suddenly reinterpreted as a paper fixation property, and vice versa. The entire layout past the edit point fractures horizontally, sliding out of register to produce deep, path-coherent tectonic shear lines across the printing plane.

---

## The `.urumizuri` Format Specification (v1)

A minimal, entirely uncompressed, byte-aligned binary architecture. Little-endian.

### Header — 16 bytes (Protected)

The header occupies a fixed 16-byte boundary at the front of the file stream. In the built-in data editor, this region remains permanently locked to prevent structural breakage.

| Offset | Size | Field | Encoding |
| --- | --- | --- | --- |
| 0 | 4 | magic | `"URMZ"` (0x55 0x52 0x4D 0x5A)

 |
| 4 | 2 | width | uint16, flat pixel dimensions

 |
| 6 | 2 | height | uint16, flat pixel dimensions

 |
| 8 | 1 | ink count | uint8, total active ink layers (`NUM_INKS`)

 |
| 9 | 1 | version | uint8, format iteration tracking (1)

 |
| 10 | 6 | reserved | Null-filled padding for future expansion vectors

 |

### Body — Repeating Cell Records

The body immediately follows the header boundary. The total record size per coordinate cell is dynamically bounded by the `NUM_INKS` variable declared in byte 8 of the header.

| Offset | Size | Field | Encoding / Quantization Range |
| --- | --- | --- | --- |
| 0 | 1 | fix state | uint8, $0 \dots 255 \to 0.0 \dots 1.0$ fixation coefficient

 |
| 1 | 1 | ink 0 load | uint8, $0 \dots 255 \to 0.0 \dots 12.0$ volume capacity

 |
| 2 | 1 | ink 1 load | uint8, quantized dynamic load channel $\dots$<br> |
| $\dots$ | 1 | ink N load | uint8, trailing active load channels up to `NUM_INKS`<br> |

Total file size = $16 + (W \times H \times (1 + \text{NUM\_INKS}))$ bytes, followed by the optional trailing plaintext manifest.

---

## Load-Bearing Invariants

The fundamental architecture parameters that must remain intact:

* **The header remains small and locked:** The front 16 bytes cannot be touched inside the manual data views. Protecting the width, height, and channel ceiling fields guarantees that a heavily corrupted or truncated file always still maps smoothly to canvas boundaries.


* **The decoder is highly tolerant:** The inner processing loops evaluate data using a strict truncation guard (`if (bIdx >= u8Body.length) break;`). If text deletion or aggressive shortening slices the body file array early, the layout parser drops out of serialization routines without throwing unhandled exceptions—filling the remaining canvas slots with zeroes to render smooth, clean, dry paper.


* **Cell strides match gamut width:** The data stride depends completely on the ink count header variable. This ensures that the format can scale between simple monochromatic fields and dense 8-ink setups while maintaining identical databending alignment vulnerabilities.


* **Verdigris is reserved for structural fixation:** Within the system's design tokens, verdigris is structurally bound to the fix state. Active pigment records composite subtractively, but any cell with an active fix coefficient passes through a verdigris outline layer to display the structural architecture of the file.