---
id: coral-labels-fail-contrast
phase: phase3
agent: critic
status: verified
severity: high
scope: a11y
evidence:
  - /Users/haidertoha/Code/pure_streets/docs/audit/runs/before/axe/our-team.json
  - /Users/haidertoha/Code/pure_streets/style.css:10
  - /Users/haidertoha/Code/pure_streets/style.css:154-161
  - /Users/haidertoha/Code/pure_streets/style.css:2709-2714
  - /Users/haidertoha/Code/pure_streets/style.css:2669-2673
  - /Users/haidertoha/Code/pure_streets/style.css:2688-2696
  - /Users/haidertoha/Code/pure_streets/our-team.html:49
  - /Users/haidertoha/Code/pure_streets/our-team.html:53-80
source: internal
---

## Claim
The "MEET THE TEAM" eyebrow and the four small uppercase role labels (COMMUNITY
LEAD / PARTNERSHIPS / DIGITAL DESIGN / TECHNOLOGY) are coral `#e6654f` on
near-white surfaces, measuring ~3.3:1 — below the 4.5:1 required for this small
bold text. These are exactly the 5 nodes axe flags as `color-contrast` (serious).

Verified:
- axe `our-team.json` lists `color-contrast` (serious) with exactly 5 nodes:
  `.team-section__head > .eyebrow` and `article:nth-child(1..4) > span`.
- `--coral: #e6654f` (style.css:10). `.eyebrow` is `color: var(--coral);
  font-size: 0.76rem; font-weight: 800` (style.css:154-161). `.team-grid span` is
  `color: var(--coral); font-size: 0.78rem; font-weight: 800; text-transform:
  uppercase` (style.css:2709-2714).
- Backgrounds: `.team-section` is `var(--white)` = `#ffffff` (style.css:2669-2673);
  cards are `#fffdf7` (style.css:2688-2696). Recomputed WCAG luminance: coral on
  `#ffffff` = 3.31:1; on `#fffdf7` = 3.26:1 — matching the claim.
- Text is ~12.2-12.5px bold (0.76rem / 0.78rem) = NOT WCAG "large text" (which
  needs >=18.66px bold or >=24px), so the 4.5:1 threshold applies (coding-rules A3,
  design-rules D11). ~3.3:1 fails.

## Why it matters
The role labels are the only thing distinguishing the four cards' function; failing
contrast makes them hard to read for low-vision users. This is a confirmed serious
a11y violation contributing to the page's accessibility score (90, per
lighthouse-summary.json).

## Recommended action
Raise the contrast of these small-label uses to >=4.5:1 — e.g. darken the coral
used for label text (introduce a darker brand-coral token) or switch these labels
to `--green` / `--green-dark`. Keep the hue family so the brand reads unchanged.
This is a deliberate, finding-backed visual change permitted under the overhaul
mandate; it touches no JS hook, localStorage key, copy, or asset.

## How to verify it's fixed
Sample the new label color over `#ffffff` and `#fffdf7` with a contrast tool (or
re-run axe) and confirm >=4.5:1 and zero `color-contrast` nodes; visually confirm
the labels still read as the coral accent family and no other text regressed.

## Vote tally
failedToRefute: 3 / 3

- failedToRefute: axe-confirmed — color-contrast serious with exactly the 5 cited
  nodes. Recomputed WCAG luminance: coral on #ffffff = 3.31:1, on #fffdf7 = 3.26:1.
  At 12.16/12.48px bold this is NOT large text (needs >=18.66px bold), so 4.5:1
  applies and ~3.3:1 fails (A3 / D11). Genuine serious violation; darkening the
  label hue is finding-backed and in scope.
- failedToRefute: VERIFIED REAL. axe flags color-contrast (serious, 5 nodes) on
  exactly `.team-section__head > .eyebrow` and `article:nth-child(1..4) > span`.
  ~3.31:1 on #ffffff (eyebrow) and ~3.26:1 on #fffdf7 (span), both small bold text
  (<18.66px bold), so 4.5:1 applies. Fix (darker coral or --green) touches no JS
  hook, localStorage, copy, or asset. Real and safe.
- failedToRefute: Confirmed by axe (5 nodes). Coral #e6654f on white #ffffff =
  3.31:1; on card #fffdf7 = 3.26:1 — both < 4.5:1. Eyebrow 0.76rem/800 and span
  0.78rem/800 are ~12px bold = NOT large text (needs 18.66px bold), so 4.5:1
  applies (A3 / D11). Objective WCAG fail, not taste; finding-backed visual fix is
  in scope.
