# Gurgulator — future paths

*Working notes, 2026-07. Problem: Gurgulator is a granular player with a wet
costume. The buffer never changes; "fermentation" is vocabulary, not mechanism.
Every sibling in the suite earns its substrate claim (Pixel Lesions grows
infection fronts, goopCodecs replaces the lattice, Bakezuri saves process not
pixels). Gurgulator doesn't yet. It also has no output a stranger would keep.*

**Identity target:** still toy-like, stupid, memey, childish, niche — but with
one honest mechanism and one honest use.

## 2026-07-10 Path A implementation note

Path A is now implemented in `index.html`: the live jar keeps a clean original
clone plus a mutable working buffer. While **Ferment** runs, scheduled grains
write residue back into the working buffer, so the source audio changes over
wall-clock time instead of staying a non-destructive playback source.

Current shipped spine:

- Jar age/stage readout: fresh → active → over-fermented → vinegar.
- Culture-specific rot behavior: NATA/LAMBIC/KOMBUCHA/etc. bias write amount,
  smear, fizz/noise, and drift, not just UI sliders.
- **Harvest WAV** exports the current mutated working buffer.
- **Reset Jar** restores the clean original clone if the ferment result is bad.
- Existing **Record** remains a performance capture to `.webm`; Harvest is the
  substrate export.

Findings:

- Direct buffer write-back works well as the conceptual hinge: it gives
  "fermentation" a real substrate mechanism without adding more sliders.
- Reset is better than undo here. It keeps the destructive toy identity, but
  avoids punishing users for experiments.
- Cultures now have room to become personalities: each can own rot behavior and
  later SFX recipes, not merely slider snapshots.
- Next usefulness gap is not more controls; it is faster one-shot output for
  people who need a wet sound and want a WAV immediately.

## 2026-07-10 Path B implementation note

Path B core is now implemented in `index.html`: a compact **Wet SFX Vending**
panel generates short one-shot sounds and exports immediate WAVs.

Current shipped usefulness layer:

- Brew buttons: Potion, Blob Jump, Swamp Step, Stomach, Monster, Bubble Pop.
- Each brew is synthesized in-browser, passed through a small offline rot pass,
  played once, loaded into the jar, and offered as **Save Brew .wav**.
- **Brew Again** rerolls the last selected recipe.
- Brew results become jar material, so the user can keep fermenting, Harvest,
  or Reset from that one-shot.

Findings:

- The useful mode works best as a vending machine, not another parameter panel.
- Recipe personality matters more than exposed controls: each sound should feel
  instantly legible, silly, and exportable.
- Batch export remains open; doing it well wants either a tiny ZIP writer or
  separate multi-download behavior, and should not bloat the first useful pass.

---

## Path A — The sample actually ferments *(the spine)*

Grains write back into the buffer. The source audio is a live culture that
irreversibly transforms while the jar runs: resampled grains, filter residue,
pitch smears get baked into the sample itself. Leave it 10 minutes, come back,
it's a different substance. No undo — only **Harvest** (export what it became).

- Jar age readout ("fermenting 4m 12s · stage: active").
- Ferment stages: fresh → active → over-fermented → vinegar, each biasing the
  rot differently over wall-clock time.
- Why it's the spine: every granular tool is non-destructive by design (DAW
  hygiene). Destructive, time-based, unattended transformation is the actual
  fermentation gesture — and the Sgueltch cut. Also makes cultures (NATA,
  LAMBIC…) mean something: they'd be *rot behaviors*, not slider snapshots.

## Path B — Wet SFX vending machine *(the usefulness)*

Game-jam devs and meme editors endlessly need blob jumps, potion glugs, swamp
steps, stomach growls, monster gurgles. Nobody wants to open a DAW for a
2-second squelch.

- One-shot brew buttons: *potion · blob · swamp step · stomach · monster ·
  bubble pop* — each fires a short synthesized+fermented burst.
- **WAV export** for one-shot brews (main jar now has Harvest WAV; SFX mode
  still wants immediate one-click WAV).
- "Brew again" reroll shipped; batch: brew 10 variations, zip download remains
  open.
- This is the niche where "someone might actually find it useful."

## Path C — Feed it your voice *(the meme)*

Mic input. Talk into the jar; it gurgles you back live.

- Instant soundboard material; kids/streamers loop.
- Doubles as a live FX processor (virtual audio cable → weird pedal).
- Cheap to add: `getUserMedia` → ring buffer → existing grain engine.

## Path D — Culture files *(the suite tie-in)*

Save a jar as a **seedless recipe** (`.gurg` or similar): stores the process —
culture, stage timeline, pad gestures — not the audio. Re-brewing the same
file on new audio ferments differently every time (Bakezuri kinship).

- Shareable: "try my KOMBUCHA-14 culture on your voice memo."
- A shelf of jars UI: pickle shelf, labels handwritten-crooked.

## Path E — Bubble clock *(anti-metrical, smaller)*

Replace `setTimeout` scheduling with a chaotic bubble clock — grain timing
driven by a simulated carbonation model (nucleation, coalescence), never a
BPM subdivision. Mostly invisible but makes the anti-grid claim literal in
the time domain, where the suite currently only fights pitch/space grids.

---

## Recommended order

1. ~~**A + WAV export**~~ — shipped in `index.html` on 2026-07-10.
2. ~~**B core**~~ — Wet SFX Vending shipped in `index.html` on 2026-07-10.
3. **C** — mic in; biggest fun-per-line-of-code.
4. **B batch export** — optional utility pass after recipes feel good.
5. **D, E** — later; D wants A's stage system to exist first.

## What NOT to do

- More sliders. It has 18. Identity comes from mechanism, not parameters.
- More presets that are just slider snapshots.
- MIDI/DAW integration — wrong direction; the point is what the DAW won't do.
