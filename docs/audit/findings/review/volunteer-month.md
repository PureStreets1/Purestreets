---
page: volunteer-month.html
phase: phase6
agent: reviewer
verdict: pass
confirmedFixed: 7
newRegressions: 0
---

# Adversarial review — volunteer-month.html

Compared BEFORE (`docs/audit/screenshots/volunteer-month/`) vs AFTER
(`docs/audit/screenshots-after/volunteer-month/`) at 375 / 768 / 1280 / 1440 plus
nav-open, PureBot-open, and populated-leaderboard states. Cross-checked the diff
(`volunteer-month.html`, `style.css`, `script.js`), the axe/console/lighthouse/flow
mechanical deltas, and the implementation plan's acceptance criteria.

**Result: all 7 fixed findings verified. No unintended degradations found.**

Mechanical deltas (all green):
- axe: 2 violations -> 1. `aria-hidden-focus` (1 node, `.purebot-panel`) removed;
  `color-contrast` dropped from 5 nodes to 2 (the only 2 remaining are inside the
  third-party Tally iframe — out of scope, present before too).
- console (after): `[]` — no new errors. PureBot flow `errs=0`.
- lighthouse: perf 93 -> 93 (flat), a11y 87 -> 95 (improved), best-practices/seo 100.
- flow-test: 10/10 pass, incl. F8 volunteer add (points=60, shapeOk=true),
  F8 section anchors 3/3 resolvable post arrow-removal, F6 PureBot inert flow,
  F4 reduced-motion counters immediate.

---

## Per-finding verdicts

### coral-eyebrow-badge-contrast — FIXED
`--coral-text:#bd4631` added and applied to `.eyebrow` + `.volunteer-hero__badge span`.
axe before listed the 3 in-DOM nodes (`.volunteer-hero__badge > span`,
`.volunteer-board__head > div > .eyebrow`, `.join-form > div:nth-child(1) > .eyebrow`);
axe after lists only the 2 Tally-iframe nodes. Screenshots show "POINTS", "POINT
TRACKER", "NOMINATION FORM", "WhatsApp network" labels in darker coral at all
viewports. Dark-section eyebrows correctly excluded (no `.impact-copy`/`.kit-section`
on this page; the "CURRENT VOLUNTEER OF THE MONTH" lime label is unchanged).

### fixed-header-occludes-hero — FIXED
`.volunteer-hero` top padding now `clamp(132px, calc(11.2vw + 46px), 203px)`;
`html{scroll-padding-top}` added for anchor jumps.
- 1440 (`1440.png`): BEFORE the H1 first line "Celebrate the" is clipped behind the
  translucent header and the badge "POINTS" label is cut off; AFTER the full H1 +
  "POINTS" + eyebrow render below the header.
- 1280 (`1280.png`, `1280-purebot.png`): same fix; AFTER additionally shows the
  "VOLUNTEER OF THE MONTH" eyebrow that was occluded before.
- Page-height delta equals the padding delta exactly (1280: +57px = 132->189;
  1440: +71px = 132->203), so all post-hero content simply shifts down by the
  intended clearance — nothing else moved.
- 768/375: padding floors at 132px (unchanged); screenshots pixel-identical
  before/after (same total heights 3688 / 4057). This matches the plan's explicit
  acceptance ("the <=768 ... renderings stay pixel-identical"; fix targeted 1280 &
  1440). The minor pre-existing eyebrow kiss at <=768 is unchanged — not a regression.
- Anchor jumps still resolve (flow-test 3/3).

### head-meta-canonical-og-missing — FIXED
canonical + og:* + twitter:card + `Organization` JSON-LD added to `<head>`
(volunteer-month.html:8-23). Head-only, render-neutral (screenshots unchanged),
SEO stays 100, no new console error, no new network request (meta/JSON-LD are inert;
og:image reuses an existing same-origin asset path).

### purebot-panel-aria-hidden-focus — FIXED
`panel.inert = true` at `initPureBot()` and `panel.inert = !isOpen` in `setOpen()`
(before `input.focus()`). axe `aria-hidden-focus` gone (was 1 node). flow-test F6:
`closedInert=true open=true focus=true reClosedInert=true errs=0`. PureBot renders
pixel-identical open (`1280-purebot.png`).

### reduced-motion-smooth-scroll — FIXED
`html{scroll-behavior:auto}` added inside the existing
`@media (prefers-reduced-motion: reduce)` block, plus `transform:none` for
button/toggle/team-contact hover and `transition:none` for `.purebot-panel`.
Render-neutral for default-motion users (all captures identical). flow-test
"F4 reduced-motion counters immediate" passes.

### section-arrow-invisible-zero-size — FIXED (removed, path b)
The 3 orphan `<a class="section-arrow...">` nodes removed; `grep section-arrow
volunteer-month.html` = 0. Proven pixel-neutral: the empty inline `<a><span></span></a>`
(no text/border/padding, in a `display:block` `<main>`) is a zero-height line box per
CSS spec, and the measured page-height delta is fully explained by the hero padding
change alone (arrows contributed ~0px). Section IDs remain on the `<section>`s;
anchors resolve 3/3. No empty tab stop remains.

### aria-table-required-children — FIXED
`role="rowgroup"` added to `[data-volunteer-rows]`. Populated board
(`1280-volunteer.png`) renders identically (Aisha row: 1 / 3 / 2 / 60-pill). axe
`aria-required-children` not present in after violations (clean in empty and
populated states). Non-visual; flow-test F8 `shapeOk=true`.

---

## New regressions
None.

## Notes (observations, not degradations)
- **PureBot greeting "i" -> "I"** (volunteer-month.html:216): a gated T13 copy change.
  Verified applied **consistently to all 9 pages** (grep), grammatically correct —
  satisfies the plan's all-9-or-none constraint. Not a degradation.
- **1280-volunteer network section opacity:** BEFORE shows the `[data-reveal]`
  WhatsApp section mid-reveal (faded); AFTER shows it fully revealed. This is a
  capture-timing artifact of the unchanged reveal animation (the will-change change
  is compositor-only and doesn't alter timing or final opacity). AFTER is the correct
  resting state; flow-test F5 `someVisible=true`.
- **logo aspect-ratio (T7.3):** `.brand img{aspect-ratio:343/480;height:auto}` —
  logo renders identically at all viewports (no distortion).
