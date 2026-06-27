---
id: reduced-motion-incomplete
phase: phase3
agent: critic
status: verified
severity: med
scope: a11y
evidence:
  - style.css:1504-1513
  - style.css:19-21
  - script.js:51-71
source: internal
---

## Claim
The reduced-motion media block only neutralizes reveals / page-pan, leaving
global smooth scrolling and the `#impact` count-up animation active for users who
asked the OS to reduce motion. The `@media (prefers-reduced-motion: reduce)` block
resets `opacity` / `transform` / `animation` / `transition` only on
`.subpage main, [data-reveal], .guide-copy > *` (`style.css:1504-1513`). It does
NOT reset `html { scroll-behavior: smooth }` (`style.css:19-21`), and the JS
count-up animates `0 -> target` via `setInterval` with no
`matchMedia('(prefers-reduced-motion: reduce)')` check (`script.js:51-71`). On
index both the in-page anchor smooth-scroll (#mission/#pickups/#impact nav) and
the `#impact` counters run unguarded.

## Why it matters
WCAG 2.3.3 and motion-sensitivity guidance require all non-essential motion to be
suppressible; the count-up and smooth anchor glide are exactly the decorative
motion that coding-rules C7 explicitly names ("neutralize scroll-behavior:smooth …
and the counter animation there"), so the current guard is provably partial
(also design-rules D14, coding-rules A5).

## Recommended action
Extend the existing reduced-motion block to set `scroll-behavior: auto` on `html`,
and gate the counter in `script.js` (when
`matchMedia('(prefers-reduced-motion: reduce)').matches`, set the final values
immediately instead of ticking). This is behavior-preserving: anchor clicks jump
instantly and the stats still end at their final values (42+/18+/96+), preserving
the `data-count` contract (HTML 42/18/96). No flow, localStorage key, or shape
change.

## How to verify it's fixed
With OS reduced-motion enabled: anchor clicks jump instantly and `#impact` stats
show final numbers (42/18/96) without counting; axe + console stay clean.

## Vote tally
failedToRefute: 3 / 3

- **Skeptic 1 (failed to refute):** Confirmed against source. The @media
  (prefers-reduced-motion: reduce) block (style.css:1504-1513) resets
  opacity/transform/animation/transition only on '.subpage main, [data-reveal],
  .guide-copy > *'. It does NOT reset html{scroll-behavior:smooth} (line 20) and
  the JS count-up animates via setInterval with no matchMedia('prefers-reduced-motion')
  guard (script.js:51-71). On index both the in-page anchor smooth-scroll
  (#mission/#pickups/#impact nav) and the #impact counters run unguarded.
  coding-rules C7 explicitly requires neutralizing scroll-behavior + the counter;
  design-rules D14. Fix (scroll-behavior:auto in the block + set counters to
  final values when reduced-motion) is behavior-preserving (final values 42/18/96
  still shown).
- **Skeptic 2 (failed to refute):** Verified gap against the project's own law
  (coding-rules C7, which explicitly requires neutralizing scroll-behavior AND
  the counter under prefers-reduced-motion). style.css:1504-1513 resets only
  .subpage main/[data-reveal]/.guide-copy; html{scroll-behavior:smooth} at
  style.css:20 is not reset, and the count-up (script.js:51-64) has no matchMedia
  guard. Fix is behavior-safe: setting scroll-behavior:auto and writing final
  values immediately still ends at '42+/18+/96+', preserving the data-count
  contract (HTML 42/18/96) and changing no flow, key, or copy.
- **Skeptic 3 (failed to refute):** Verified gap. The reduced-motion block
  (style.css:1504-1513) resets only .subpage main / [data-reveal] / .guide-copy>*
  and does NOT reset html scroll-behavior:smooth (style.css:19-21).
  script.js:51-71 animates the #impact counters via setInterval with no
  matchMedia('(prefers-reduced-motion: reduce)') guard. coding-rules C7
  EXPLICITLY names scroll-behavior:smooth and 'the counter animation' as motion
  that must be neutralized in this block, so the current guard is provably partial
  (also A5/D14). Both apply to index (anchor nav #mission/#pickups/#impact + the
  #impact counters). Fix sets scroll-behavior:auto and short-circuits the counter
  to final values (42/18/96) — no flow/key/shape change. Rules-grounded and safe.
