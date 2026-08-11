# Gurgulator — what carries over from the album work

*Written 2026-07-31 by Claude Code, from building
`ephemeralrenders/undigested/` (a Desiderata track-4 tool that forked
Gurgulator's rot). This is the transferable residue: things that were found by
measurement while making something else, which Gurgulator should have whether or
not it is ever reworked.*

Companion to [gurgulator-paths.md](gurgulator-paths.md), which holds the design
paths. This file holds **defects and mechanisms**, with line references into
`index.html` as it stands today.

Also relevant: `ephemeralrenders/undigested 2/` (Codex, 2026-07-29) is a faithful
Node port of the same engine, so **it inherits every defect in section 1**.
Fixing Gurgulator without fixing that port leaves two copies diverging.

---

## 1. Four defects in the current engine

All four are in or around `fermentWriteBack` (`index.html:867`). They are ranked
by how much they distort the result.

### 1.1 The saturator is a gain stage — `index.html:110` area, and 576 in the port

```js
const foldNorm = Math.tanh(fold);
const baked = Math.tanh(fizzed * fold) / foldNorm;
```

Normalising so that input 1.0 maps to output 1.0 means **small signals are
multiplied by roughly `fold`**. At `fold = 3.2` a 0.05 sample comes back at 0.4.
It is a gain stage wearing a saturator's name.

Invisible in Gurgulator only because `write` caps at 0.062, so each pass barely
nudges. Raise `write` and it pins everything to full scale — measured at 99.8% of
samples clipped once `write` reached 0.65.

**Fix.** Use a level-preserving shape and restore the level by *measuring* the
transfer on the material, not modelling it:

```js
// unity at small signal, squashes loud material — the squash IS the distortion
const baked = (y / (1 + fold * Math.abs(y))) * makeup;
```

where `makeup` is computed per pass from a sparse sample (every 64th) of the
slice: run those samples through the same curve and take
`sqrt(sumIn / sumOut)`. Modelling it instead — any closed-form makeup — boosts
everything below RMS, which in peaky vocal material is most samples, and that
compounds across passes.

### 1.2 The smear is inert — `index.html:107`

```js
const neighbour = (d[(si+n-1)%n] + d[(si+1)%n]) * 0.5;
```

"Neighbour" is **±1 sample**. At 44.1kHz that is a one-sample lowpass — a faint
treble tilt, not a smear. The largest-looking coefficient in the model does
almost nothing, which is a large part of why `smear` never sounds like anything.

**Fix.** Make the reach a *time*, not a sample: read at `±lag` where
`lag = smearSeconds * sampleRate`, reaching tens of milliseconds. Then it is a
real temporal blur and comb.

### 1.3 Mixing without asking about correlation — the subtle one

Once the smear reaches real distances, the weights matter, and **there is no
fixed correct normalisation**:

- weights summing to 1 attenuate *decorrelated* taps by `sqrt(Σw²)` — about
  5.4dB per pass at full smear, compounding toward silence;
- weights with `Σw² = 1` amplify *correlated* taps — and a sustained tonal drone
  at 60ms lag is very correlated, giving ~1.5× per pass.

Both were tried and both ran away, in opposite directions. The answer depends on
the material, so it has to be measured: keep the weights raw and fold the
correction into the same measured `makeup` from 1.1.

Bisecting found this — forcing `smearMix = 0` dropped the level ratio from 13.4×
to 1.9× and named the culprit immediately. Worth keeping an `override` hook on
the rot parameters for exactly this reason.

### 1.4 `carry` is an unnecessary feedback path — `index.html:108`, `295`, `315`

`carry` feeds the previous *output* sample back into the residue. On top of a
real ±lag smear it contributes nothing but another path that can run away, and
it cannot be sparsely sampled (it is sequential), which blocks the measured
makeup in 1.1. Dropping it cost nothing audible.

### Also: the ceiling is unreachable

`FERMENT_STAGES` (`index.html:~140`) tops out at `write: 0.062`, and rot dose is
a function of grain density because `fermentWriteBack` is called from inside
`scheduleGrain` (`index.html:940`). Together these mean **"light" and "heavy"
fermentation are barely distinguishable** — the complaint that started all of
this. See section 2.

---

## 2. The one architectural change worth making

**Decouple rot from grain scheduling.**

Today `fermentWriteBack` is invoked from `scheduleGrain` and throttled by
wall-clock (`lastWriteBackMs`, 24–79ms). So:

- dose is a side effect of grain density — dense grains rot fast, sparse grains
  rot slowly, and neither can be chosen independently;
- light fermentation is unreachable at any setting;
- nothing can be rendered offline, because the schedule is `setTimeout` against
  a live clock.

Separating them gives, in one move:

- an explicit dose, with light rot actually available;
- offline rot — 10 minutes of wall-clock ageing in ~200ms;
- the same fermented buffer usable by *two different players* (the gurgle
  granulator, or something else entirely);
- `.gurg` as **fermented audio + playback recipe**, which is Path D from
  gurgulator-paths.md finally made cheap.

A dose curve that keeps both ends useful: drive the low end linearly and the top
quadratically (`d` and `d²`), and derive pass count from a *coverage* target
rather than setting it independently — slices lengthen at high dose, and without
that inversion the top of the range is just white noise.

Verified reachable in the fork: correlation with the source falls to 0.004 at
full dose, while 0.05 and 0.15 remain genuinely light.

---

## 3. Sonic range: the bandpass is why it has one sound

`index.html:719-724` — the dry path is unconditional:

```
grainBus → bandpass (Q up to 9) → peaking formant EQ
```

A wandering high-Q bandpass carves everything into a single resonant band. That
is the whole reason Gurgulator "tends towards particular frequencies", and it is
why the fork had to remove it to get a full-spectrum result.

**Cheapest fix that keeps the identity:** make it a **throat** control — 0 open
(bypass or gentle tilt), 1 the current constriction. If it takes over `sweep`'s
job it adds no slider, and an open throat is still a throat, so the toy survives.

Two other cheap range wins the fork confirmed:

- **No stereo anywhere.** Every grain sums to `preMaster` dead-centre. A
  `StereoPannerNode` per grain took measured L/R correlation to 0.11 — the single
  biggest "is this a field or a texture" lever.
- **Nothing modulates slower than ~1 second.** `wanderFilter` (140–1100ms),
  `formantWander` (240ms), `squelchWobble` (80–300ms) are all flutter. A layer of
  smooth value noise with 17–90s periods is what makes material *evolve*. Rate
  must be separable from depth.

---

## 4. If bubbles or one-shots get built (Path B)

Path B synthesises SFX today. Two things learned the hard way, both of which
produce clicks:

**Bubbles are not noise.** A bubble is a damped sinusoid whose pitch *rises* as
it collapses; Minnaert gives `f₀ ≈ 3/r`, so radius *is* pitch and one control
runs continuously from carbonation to stomach. Damping climbs steeply with
frequency, which is why small bubbles tick and large ones glug.

**Two click sources, both measured in the fork:**

1. An oscillator started at random phase and full amplitude **steps** on its
   first sample — measured 0.23 out of silence, once per bubble. Fix: a ~0.4ms
   raised-cosine onset window, far shorter than any ring, so the attack still
   reads as instant.
2. A decaying envelope that has not reached zero at the end of its window gets
   *held* by `setValueCurveAtTime` and then cut by `node.stop()`. Measured 0.094
   for a 200Hz bubble in a 0.5s grain — and it is worst at low frequencies, i.e.
   exactly where a "stomach" setting lives. Fix: force a raised-cosine tail to
   exactly zero.

Also: parameterise a size *distribution* as **centre and width**, not as a band
with endpoints. A band plus a skewed draw put the median in the upper half of
its own range, so asking for big bubbles gave mostly small ones.

---

## 5. Renderability, and why it is worth the trouble

Everything above is easier if the engine has no wall clock. Concretely:

- no `setTimeout` for scheduling, no `performance.now()` for ageing — drive
  everything from a time cursor;
- keep the engine in its own `.js` exporting a pure function, with the page a
  thin skin over it;
- add `{"type":"module"}` in a `package.json` and Node can then import the same
  file the browser does, with no build step.

That is what made the fork's engines scriptable, and it is what let Codex build
an offline batch renderer at all. It also makes A/B testing possible, which is
how every defect in section 1 was actually found — none of them are audible as
"a bug", they are audible as "this is a bit dull".

---

## Suggested order

1. **1.1 and 1.2** — the saturator and the smear. Small, local, and they change
   what every existing preset sounds like for the better.
2. **2** — decouple rot from scheduling. Unlocks dose, offline, and Path D.
3. **3, the throat control** — biggest sonic-range gain per line.
4. **Per-grain stereo, then the slow layer.**
5. **4** — only if bubbles get built.

Sections 1 and 5 apply equally to `ephemeralrenders/undigested 2/render.js`;
whoever fixes one should fix both or record the divergence in
[DEPENDENCIES.md](../../DEPENDENCIES.md).

## Provenance

Everything above was measured, not heard — no audio monitoring was available.
Figures come from render analysis: RMS ratios, correlation against source,
per-band energy, sample-to-sample discontinuity rates, and clip counts. The
fork's own log is
[ephemeralrenders/undigested/undigested.md](../../ephemeralrenders/undigested/undigested.md).
