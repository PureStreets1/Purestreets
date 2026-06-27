---
id: reduced-motion-smooth-scroll
phase: phase3
agent: critic
status: fixed
severity: med
scope: a11y
evidence:
  - style.css:19-21
  - style.css:1504-1513
  - mosques-isocs.html:44
  - mosques-isocs.html:147
source: internal
---

## Claim
The reduced-motion media query resets reveal transforms/animations/transitions
but leaves `html { scroll-behavior: smooth }` active, so reduced-motion users
still get an animated scroll when using "Open the counter" (`#competition`) and
other in-page anchors.

- `style.css:19-21` — `html { scroll-behavior: smooth }` (the only occurrence in
  the file).
- `style.css:1504-1513` — `@media (prefers-reduced-motion: reduce)` resets
  `opacity` / `transform` / `animation` / `transition` on `.subpage main`,
  `[data-reveal]`, `.guide-copy > *` but does NOT target `html` or reset
  `scroll-behavior`, so smooth scroll stays active under reduced motion.
- `mosques-isocs.html:44` — hero CTA `<a href="#competition">Open the counter</a>`
  triggers an animated jump to the `#competition` section (`mosques-isocs.html:147`).
- coding-rule C7 explicitly requires neutralizing `scroll-behavior: smooth` under
  reduced motion.

## Why it matters
WCAG 2.3.3 / coding-rule C7: a long animated scroll-jump is exactly the
vestibular trigger reduced-motion is meant to suppress. The otherwise-good
reduced-motion block has a hole on the one motion users most often invoke — the
anchor CTA.

## Recommended action
Inside the existing `@media (prefers-reduced-motion: reduce)` block
(style.css:1504-1513) add `html { scroll-behavior: auto }`. Purely behavioral,
one CSS line, no-build, no visual change to the static layout at rest.

## How to verify it's fixed
Enable "Reduce motion" in OS settings, click "Open the counter" — the jump to
`#competition` should be instant, not animated. Confirm no layout/pixel change at
rest at 1440/375.

## Vote tally
failedToRefute: 3 / 3

- **Skeptic 1 (not refuted):** Verified. style.css:19-21 sets
  html{scroll-behavior:smooth}. The only @media(prefers-reduced-motion:reduce)
  block (style.css:1504-1513) resets opacity/transform/animation/transition on
  .subpage main, [data-reveal], .guide-copy>* but does NOT target html or reset
  scroll-behavior, so smooth scroll stays active under reduced motion. HTML:44
  `<a href="#competition">` triggers an animated jump to the #competition section
  (HTML:147). coding-rule C7 explicitly requires neutralizing scroll-behavior:smooth
  under reduced motion. Fix (add html{scroll-behavior:auto} inside the existing
  block) is behavioral-only, zero pixel change at rest. Real and safe.
- **Skeptic 2 (not refuted):** Real gap vs coding-rule C7:
  html{scroll-behavior:smooth} (style.css:20) is NOT neutralized inside the @media
  (prefers-reduced-motion: reduce) block (style.css:1504-1513), which only resets
  reveal opacity/transform/animation/transition. Reduced-motion users still get an
  animated jump on the href=#competition CTA (html:44). Fix is one CSS line
  (html{scroll-behavior:auto}) inside the existing query — pure CSS, no-build, zero
  rest-state pixels, affects only reduced-motion scrolling. Safe and
  behavior-preserving.
- **Skeptic 3 (not refuted):** Verified real. scroll-behavior:smooth (style.css:20)
  is the ONLY occurrence in the file; the @media(prefers-reduced-motion:reduce)
  block (style.css:1504-1513) neutralizes opacity/transform/animation/transition
  but NOT scroll-behavior. coding-rule C7 explicitly requires neutralizing smooth
  scroll there. In-page CTA `<a href='#competition'>` (HTML:44) triggers the
  animated jump. Adding html{scroll-behavior:auto} inside the existing block is
  purely behavioral, zero pixels at rest. WCAG 2.3.3 hole, safe fix.
