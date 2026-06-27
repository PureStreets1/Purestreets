---
id: reduced-motion-incomplete
phase: phase3
agent: critic
status: verified
severity: med
scope: a11y
evidence:
  - style.css:1504-1513
  - style.css:248-249
  - style.css:58
  - style.css:85
  - style.css:1617
  - style.css:1583-1585
source: internal
---

## Claim
The only `@media (prefers-reduced-motion: reduce)` block on the page
(`style.css:1504-1513`) neutralizes motion for just `.subpage main`,
`[data-reveal]`, and `.guide-copy > *`. Component motion stays ungated for
users who request reduced motion: the button hover-lift
`transform: translateY(-2px)` (`style.css:248-249`), the header background
transition (`style.css:58`), the nav-link transition (`style.css:85`), the
PureBot panel open/close `translateY` + `scale` transition (`style.css:1617`),
and the PureBot toggle hover-lift (`style.css:1583-1585`) all continue to
animate. This is the incomplete reduced-motion guard that design-rules D14
explicitly tells critics to flag, and that coding-rules C7/A5 (WCAG 2.3.3)
require to cover all non-essential motion.

## Why it matters
The page partly honors reduce-motion (the page-load pan on `.subpage main` is
gated) but still animates hover lifts and the PureBot panel transform for
vestibular-sensitive users — an inconsistent and avoidable motion exposure.

## Recommended action
Extend the existing reduced-motion block to also set `transition: none` /
`transform: none` on `.button:hover`, `.purebot-toggle:hover`, and
`.purebot-panel` (the transform-based cases are the priority); the
`.site-header` and `.site-nav a` color/background fades are lower-priority
because they are not vestibular motion. The change lives entirely inside the
reduced-motion query, so it is render-neutral for default-motion users and
breaks no behavior — the panel still reaches its `.is-open` end state, just
instantly.

## How to verify it's fixed
Enable OS reduce-motion, then hover "Open form"/nav links and the PureBot
toggle, and open PureBot — confirm no transform or fade animates (controls jump
straight to end state). Confirm default-motion users see no change via
before/after screenshots.

## Vote tally
failedToRefute: 3 / 3

- **Skeptic 1 (failed to refute):** Verified: the only @media
  (prefers-reduced-motion: reduce) block (style.css:1504-1513) targets just
  .subpage main, [data-reveal], .guide-copy > *. Ungated motion confirmed:
  .button:hover translateY(-2px) (style.css:245,249), .site-header transition
  (style.css:58), .site-nav a transition (style.css:85), .purebot-panel
  transition (style.css:1617), .purebot-toggle:hover transform
  (style.css:1580,1583). coding-rules C7 explicitly mandates neutralizing
  transitions under reduced-motion, so this is a real gap per the repo's own
  law. Extending the block is render-neutral for default users.
- **Skeptic 2 (failed to refute):** Objectively true: @media
  (prefers-reduced-motion) (style.css:1504-1513) gates only .subpage
  main/[data-reveal]/.guide-copy, leaving .button:hover translateY (248-249),
  .site-header transition (58), .site-nav a (85), .purebot-toggle (1580) and
  .purebot-panel (1617) animating. coding-rules C7 mandates gating ALL
  non-essential motion. The fix lives entirely inside the reduced-motion query,
  so it is render-neutral for default-motion users and breaks no behavior (panel
  still opens via .is-open end-state, just instant). Real and safe; med only
  because the residual motion is minor and WCAG 2.3.3 is AAA.
- **Skeptic 3 (failed to refute):** REAL gap, mildly over-scoped. Grep confirms
  exactly ONE @media (prefers-reduced-motion: reduce) block (style.css:1504-1513)
  covering only .subpage main / [data-reveal] / .guide-copy. Transform-based
  motion stays ungated under reduce: .button:hover translateY(-2px)
  (style.css:248-249), .purebot-toggle:hover translateY (1583-1585), and the
  .purebot-panel translateY+scale open/close (1613-1623) — exactly what
  coding-rules C7/A5 and design-rules D14 say to neutralize, and D14 explicitly
  tells critics to flag the incomplete guard. Fix is render-neutral for
  default-motion users. Confidence is med only because the recommendation also
  lists pure color/background fades (.site-header, .site-nav a) which are not
  vestibular motion; the transform cases alone make the finding valid.
