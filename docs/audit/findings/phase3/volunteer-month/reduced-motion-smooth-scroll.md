---
id: reduced-motion-smooth-scroll
phase: phase3
agent: critic
status: verified
severity: med
scope: a11y
evidence:
  - style.css:20
  - style.css:1504-1513
  - volunteer-month.html:51
  - volunteer-month.html:85
  - volunteer-month.html:129
  - docs/audit/rules/coding-rules.md
  - docs/audit/rules/design-rules.md
source: internal
---

## Claim
`html { scroll-behavior: smooth }` is set globally (`style.css:20`, the only
occurrence), but the `@media (prefers-reduced-motion: reduce)` block
(`style.css:1504-1513`) only neutralizes reveals/page-pan — it resets
`opacity`/`transform`/`animation`/`transition` on `.subpage main`,
`[data-reveal]`, and `.guide-copy > *`, and never resets `scroll-behavior`. So
the page's three `.section-arrow` in-page jumps (`volunteer-month.html:51`,
`:85`, `:129`) and any same-page hash navigation force an animated scroll for
motion-sensitive users. coding-rules C7 explicitly requires neutralizing
`scroll-behavior: smooth` under reduced motion (design-rules D14).

## Why it matters
SC 2.3.3 Animation from Interactions: large animated scroll jumps can trigger
vestibular discomfort. The existing reduced-motion guard is incomplete for a
page built around anchor jumps (coding-rules A5/C7).

## Recommended action
Add `html { scroll-behavior: auto; }` inside the existing
`@media (prefers-reduced-motion: reduce)` block (`style.css:1504`). One line,
render-neutral for users without the preference; no JS, `data-*`, localStorage,
copy, or asset change.

## How to verify it's fixed
Enable OS reduce-motion and click a `.section-arrow`: the view jumps instantly
with no animated scroll. With the preference off, default users still get smooth
scroll, and before/after static captures are pixel-identical.

## Vote tally
failedToRefute: 3 / 3

- **Skeptic 1 (failed to refute):** `html{scroll-behavior:smooth}` is global
  (style.css:19-21); the reduced-motion block (style.css:1504-1513) only
  neutralizes opacity/transform/animation/transition on `.subpage main`,
  `[data-reveal]`, `.guide-copy>*` and never resets scroll-behavior.
  coding-rules C7 EXPLICITLY mandates neutralizing scroll-behavior:smooth under
  reduced motion. The page has same-page anchor jumps (section-arrows href=#...
  HTML:51/85/129) that are keyboard-activatable and trigger animated scroll.
  One-line fix (`html{scroll-behavior:auto}` inside the existing media block) is
  render-neutral for default users. Real, rule-required SC 2.3.3 gap.
- **Skeptic 2 (failed to refute):** REAL and rule-mandated. Confirmed
  `html{scroll-behavior:smooth}` global (style.css:20) and the reduced-motion
  block (1504-1513) only neutralizes `.subpage main`/`[data-reveal]`/
  `.guide-copy>*` — it never resets scroll-behavior. coding-rules C7 and
  design-rules D14 explicitly require neutralizing it. In-page #anchor navigation
  exists (section-arrows + any direct hash). Fix (add `html{scroll-behavior:auto}`
  inside the existing reduced-motion block) is one line, affects only users with
  the preference, is pixel-identical in the static captures, and touches no
  JS/data-*/localStorage/copy. Safe.
- **Skeptic 3 (failed to refute):** Rule-mandated and verified missing.
  style.css:20 `html{scroll-behavior:smooth}`; grep confirms scroll-behavior
  appears ONLY at line 20 and there is exactly ONE
  `@media (prefers-reduced-motion: reduce)` block (style.css:1504-1513) that
  resets reveals/.subpage main/.guide-copy but NOT scroll-behavior. coding-rules
  C7 explicitly requires neutralizing scroll-behavior:smooth under reduced motion
  (SC 2.3.3, design-rules D14). One-line fix is pixel-identical for users without
  the preference. Real, rule-backed, safe.
