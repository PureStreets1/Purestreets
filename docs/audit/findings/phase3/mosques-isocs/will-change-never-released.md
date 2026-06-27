---
id: will-change-never-released
phase: phase3
agent: critic
status: verified
severity: med
scope: perf
evidence:
  - style.css:685-692
  - style.css:714-717
  - script.js:73-86
  - mosques-isocs.html:40
  - docs/audit/runs/before/lighthouse-summary.json:21-26
source: internal
---

## Claim
`[data-reveal]` sets `will-change: opacity, transform` on all 41 reveal elements
and it is never removed after the animation completes, holding dozens of
compositor layers alive for the life of the page.

- `style.css:685-692` — `will-change: opacity, transform` sits on the **base**
  `[data-reveal]` selector (line 691), not gated to an animating state.
- 41 `[data-reveal]` elements on the page (`grep -o data-reveal | wc -l = 41`;
  e.g. mosques-isocs.html:40).
- `script.js:73-86` — `revealObserver` adds `.is-visible` and `unobserve()`s the
  element (`:77-78`), but nothing removes `will-change` afterward. Grep confirms
  no `will-change` / `transitionend` handling anywhere in `script.js`.
- At rest the visible state is `opacity: 1; transform: translate3d(0,0,0)`
  (style.css:714-717) — identical paint regardless of the hint.
- `docs/audit/runs/before/lighthouse-summary.json:21-26` — mosques-isocs perf 82
  (second-weakest after index 73).
- MDN guidance: `will-change` held on many elements wastes GPU memory; it should
  be applied sparingly/transiently.

## Why it matters
Persistent `will-change` on ~41 nodes keeps that many promoted layers and GPU
memory reserved long after the one-shot entrance is done, raising memory pressure
and compositing cost — counterproductive on the page Lighthouse already scores
second-lowest.

## Recommended action
Drop `will-change` once the reveal is done — e.g. on `transitionend` (or right
after adding `.is-visible`) clear it, or move `will-change` into a transient class
only present while animating. Behavior and pixels unchanged: at rest the element
is `opacity:1, transform:none`, so de-promoting the layer causes no perceptible
repaint.

## How to verify it's fixed
In DevTools Layers/Rendering, confirm the promoted-layer count drops after the
entrance completes. Re-run Lighthouse; perf should not regress. Visual diff at
1440/375 = 0.

## Vote tally
failedToRefute: 3 / 3

- **Skeptic 1 (not refuted):** Verified. style.css:691 sets
  will-change:opacity,transform on the BASE [data-reveal] selector (not gated to an
  animating state), applied to all 41 reveal elements (grep). script.js:74-82 adds
  .is-visible and unobserve()s but never clears will-change, so the hint persists
  for the page lifetime — a documented MDN anti-pattern (use sparingly/transiently).
  Fix (clear will-change on transitionend or after .is-visible) is non-visual and
  behavior-preserving: at rest the element is identical (opacity:1, transform:none),
  de-promoting the layer causes no perceptible repaint. Real perf-hygiene issue
  with a safe fix; impact is modest, hence med confidence.
- **Skeptic 2 (not refuted):** Premise is accurate (will-change on the [data-reveal]
  BASE selector, never released — style.css:691; reveal observer unobserves without
  clearing it — script.js:74-82) and the fix is pixel-SAFE: the at-rest visible
  state keeps transform:translate3d(0,0,0) (style.css:716), which independently
  establishes the stacking context/layer, so dropping will-change does not change
  paint order or rest-state pixels. No JS-flow/data-hook/key/copy/asset impact. From
  the behavior-regression lens there are no grounds to refute. Low confidence only
  because the perf payoff may be marginal (the translate3d itself can keep layers
  promoted), which is a perf cost/benefit question, not a behavior break.
- **Skeptic 3 (not refuted):** Verified real. will-change:opacity,transform sits on
  the base [data-reveal] selector (style.css:691), not gated to the animating state,
  across 41 elements (grep). script.js:73-83 adds .is-visible and unobserve()s but
  never clears will-change (grep confirms no will-change/transitionend handler
  anywhere in script.js). Per MDN, will-change held on many elements wastes GPU
  memory and should be transient; the one-shot reveal completes yet ~41 promoted
  layers persist for page life on the perf-82 page. Removing the hint after the
  transition is provably non-visual (compositor hint only) and behavior-preserving —
  a clean, safe perf-hygiene fix. Impact is modest, hence med.
