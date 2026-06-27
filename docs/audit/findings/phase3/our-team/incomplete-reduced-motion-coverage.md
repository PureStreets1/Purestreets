---
id: incomplete-reduced-motion-coverage
phase: phase3
agent: critic
status: verified
severity: low
scope: a11y
evidence:
  - /Users/haidertoha/Code/pure_streets/style.css:1504-1513
  - /Users/haidertoha/Code/pure_streets/style.css:19-21
  - /Users/haidertoha/Code/pure_streets/style.css:58
  - /Users/haidertoha/Code/pure_streets/style.css:2736-2742
  - /Users/haidertoha/Code/pure_streets/script.js:37-71
  - /Users/haidertoha/Code/pure_streets/script.js:460-461
source: internal
---

## Claim
A reduced-motion block exists but only neutralizes `.subpage main`,
`[data-reveal]`, and `.guide-copy > *`; it leaves global `scroll-behavior: smooth`
and component hover transitions unhandled, so motion-sensitive users still get
smooth scrolling and animated hovers.

Verified:
- `@media (prefers-reduced-motion: reduce)` (style.css:1504-1513) targets only
  `.subpage main`, `[data-reveal]`, `.guide-copy > *`.
- `html { scroll-behavior: smooth }` (style.css:19-21) is never neutralized —
  coding-rules C7 explicitly requires neutralizing smooth scroll there.
- `.team-contact` `transition` + `:hover translateY(-2px)` (style.css:2736-2742)
  and the `.site-header` color/background `transition` (style.css:58) sit outside
  the reduce block.
- Honesty caveats confirmed: this page has zero `[data-reveal]` nodes, and the
  `.subpage main` `pagePanIn` entrance IS already gated (covered by the reduce
  block), so the on-page residual is the `.team-contact` hover transform plus the
  global smooth-scroll; the rest of the gap is global/shared.

## Why it matters
Vestibular-sensitive users who opt out of motion should get no smooth-scroll or
animated transforms anywhere; the current partial coverage is a small but real WCAG
2.3.3 / design-rules D14 gap that is cheap to close consistently. Low severity
because the page-specific impact is minor.

## Recommended action
Within the existing reduce block, also neutralize `scroll-behavior` (`html {
scroll-behavior: auto }`) and zero out lingering hover/state transitions
(`.team-contact`, `.site-header`). Purely additive CSS inside the media query — no
default-state change, byte-identical for motion-on users. Scrollspy and counters
use IntersectionObserver / scroll events (script.js:37-71, 460-461) and are
unaffected by `scroll-behavior`.

## How to verify it's fixed
Enable OS "reduce motion", reload, and confirm anchor jumps are instant and
Contact-link / header hovers don't animate. Confirm the default (motion-on)
rendering is byte-identical (zero pixel diff at all four widths).

## Vote tally
failedToRefute: 3 / 3

- failedToRefute: CORRECT. The reduce block (style.css:1504-1513) neutralizes only
  .subpage main / [data-reveal] / .guide-copy>*. html{scroll-behavior:smooth} (line
  20) is never reset (C7 requires it); .team-contact transition + :hover translateY
  (2736-2742) and the .site-header transition (line 58) are outside the block.
  Verified the honesty caveats: zero data-reveal nodes here, and pagePanIn IS gated.
  Residual gap is real but minor/global (D14, WCAG 2.3.3). Fix is purely additive,
  byte-identical for motion-on users.
- failedToRefute: VERIFIED REAL. The reduce block leaves html{scroll-behavior:smooth}
  and component hover transitions live, but C7 EXPLICITLY requires neutralizing
  them (WCAG 2.3.3 / D14). Fix is purely additive inside the existing media query:
  affects ONLY reduced-motion users, leaves default rendering byte-identical, breaks
  no flow — scrollspy and counters use IntersectionObserver/scroll events unaffected
  by scroll-behavior. The .team-contact hover transform is an on-page gap. Safe.
- failedToRefute: Real per C7, which EXPLICITLY requires neutralizing
  scroll-behavior:smooth and transitions inside prefers-reduced-motion. The reduce
  block never sets html{scroll-behavior:auto} and leaves the on-page .team-contact
  hover transition+translateY and header transition animating for motion-opt-out
  users. Fix is purely additive — zero change to default rendering. Low severity /
  partly global, but rule-cited, real, and safe.
