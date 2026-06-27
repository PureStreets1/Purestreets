---
id: reduced-motion-coverage-partial
phase: phase3
agent: critic
status: fixed
severity: low
scope: a11y
evidence:
  - style.css:19-21
  - style.css:58
  - style.css:1504-1513
  - style.css:1617
  - terms.html:110
source: internal
---

## Claim
A `prefers-reduced-motion: reduce` block exists and correctly neutralizes the
subpage entrance and reveals (`style.css:1504-1513` — `.subpage main`,
`[data-reveal]`, `.guide-copy > *`). But three motion sources sit OUTSIDE that
block: `html { scroll-behavior: smooth }` (`style.css:20`), the
`.purebot-panel` open/close transition (`style.css:1617`), and the
`.site-header` background/box-shadow/color transition (`style.css:58`). grep
confirms there is exactly one `prefers-reduced-motion` block in `style.css`
(at line 1504), so on `terms.html` the PureBot open/close animation
(PureBot ships at `terms.html:110`) and the mobile-menu header transition still
play, and in-page anchor jumps still smooth-scroll, for users who requested
less motion.

## Why it matters
Reduced-motion is honored for the big entrance but not for anchor-jump smooth
scroll or the PureBot reveal, so coverage is inconsistent. coding-rules C7
explicitly requires neutralizing `scroll-behavior: smooth`, transitions, and
reveals in that block; this is an incomplete C7 / A5 / design-rules D14
implementation (WCAG SC 2.3.3), not a non-issue — a small but real gap.

## Recommended action
Extend the existing reduced-motion block (do not add a second media query) to
add `scroll-behavior: auto` on `html` and `transition: none` on
`.purebot-panel` and `.site-header` (and any toggle hovers). It only suppresses
motion for users who requested less, so it is render-neutral for the default
capture and preserves the open/close behavior (the panel still opens, just
without the slide/scale).

## How to verify it's fixed
With OS reduced-motion enabled, in-page anchors jump instantly and PureBot opens
with no slide/scale and the header swaps state instantly. With motion allowed,
default behavior is unchanged. Before/after screenshots in the default (motion-
allowed) capture are pixel-identical.

## Vote tally
failedToRefute: 3 / 3

- **Skeptic 1 (failed to refute):** Verified exactly. grep confirms a single
  `prefers-reduced-motion` block at `style.css:1504-1513` neutralizing only
  `.subpage main`, `[data-reveal]`, `.guide-copy > *`. `html scroll-behavior:
  smooth` (`:20`), `.purebot-panel` transition (`:1617`) and `.site-header`
  transition (`:58`) all sit outside that block, so motion still plays under
  reduced-motion. coding-rules C7 explicitly requires neutralizing
  `scroll-behavior: smooth` and transitions in that block. Extending the existing
  media query is render-neutral for default users (only applies when reduce is
  requested). Real, safe, rule-backed gap.
- **Skeptic 2 (failed to refute):** CONFIRMED and behavior-safe. grep shows
  exactly one `@media (prefers-reduced-motion: reduce)` block (`style.css:1504-1513`)
  covering `.subpage main`/`[data-reveal]`/`.guide-copy>*`; it does NOT reset
  `html scroll-behavior:smooth` (`style.css:20`), the `.site-header` transition
  (`style.css:58`), or the `.purebot-panel` transition (`style.css:1617`). On
  terms.html the PureBot open/close transition and the mobile-menu header
  transition still animate for reduced-motion users. coding-rules C7 explicitly
  requires neutralizing scroll-behavior and transitions there; this is an
  incomplete C7/A5/D14 implementation, not a non-issue. Fix = extend the existing
  block with `scroll-behavior:auto` + `transition:none`; it only suppresses
  motion for users who asked for less, affecting no default rendering, flow,
  hook, or storage. Low severity but real and safe.
- **Skeptic 3 (failed to refute):** Factually verified and directly mandated by
  coding-rules C7, which explicitly requires neutralizing "scroll-behavior:
  smooth, transitions, reveals". The reduced-motion block (`style.css:1504-1513`)
  covers only `.subpage main` / `[data-reveal]` / `.guide-copy`, and does NOT
  reset `html{scroll-behavior:smooth}` (`style.css:20`), the `.purebot-panel`
  open/close transition (`style.css:1617` — PureBot ships on `terms.html:110`),
  or the `.site-header` transition (`style.css:58`). Real C7/D14/SC 2.3.3
  coverage gap. The fix (add `scroll-behavior:auto` + `transition:none` inside
  the existing block) only affects reduced-motion users, so it is render-neutral
  for the default capture and preserves open/close behavior.
</content>
