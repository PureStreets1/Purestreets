---
id: fixed-header-occludes-hero
phase: phase3
agent: critic
status: fixed
severity: med
scope: design
evidence:
  - style.css:46-59
  - style.css:61-67
  - style.css:2144-2151
  - style.css:20
  - volunteer-month.html:16
  - docs/audit/screenshots/volunteer-month/375.png
  - docs/audit/screenshots/volunteer-month/1440.png
  - docs/audit/screenshots/volunteer-month/1280.png
  - docs/audit/screenshots/volunteer-month/1280-volunteer.png
source: internal
---

## Claim
The header is `position: fixed; top: 0; z-index: 20` (`style.css:46-59`) and
ships in its opaque `.is-scrolled` state from load — `volunteer-month.html:16`
hardcodes `class="site-header is-scrolled"`, and that state paints
`rgba(251, 248, 239, 0.94)` + `backdrop-filter: blur(14px)` (`style.css:61-67`).
The hero reserves only `padding: 132px …` of top space (`style.css:2149`), which
is about the height of the fixed bar (stacked logo + 14px block padding). As a
result, at first paint the eyebrow "Volunteer of the month" is hidden and the
first H1 line ("Celebrate the …") is clipped behind the bar. There is also no
`scroll-margin`/`scroll-padding` anywhere (`grep` returns none; only
`scroll-behavior: smooth` at `style.css:20`), so the `.section-arrow` and nav
anchor jumps land their target headings under the header too.

The screenshots are decisive: at scroll=0,
`docs/audit/screenshots/volunteer-month/375.png`, `1440.png`, and `1280.png`
all show the coral eyebrow absent and the first H1 line clipped/ghosted behind
the translucent bar, whereas `1280-volunteer.png` (captured with the header
composited lower / PureBot open) shows the full eyebrow + H1 — a clean A/B that
the header is the occluder.

## Why it matters
An opaque chrome bar hiding the section eyebrow and clipping the primary heading
on first paint weakens the most important moment of the page (design-rules
D9/D16). Anchor jumps that then hide the destination heading compound it.

## Recommended action
Increase `.volunteer-hero` top padding so the eyebrow + full H1 clear the fixed
header, and add `scroll-margin-top` on the section targets (or `html
scroll-padding-top`) ~= header height so `.section-arrow` and nav anchor jumps
reveal the target heading. Scope the padding change to this page's hero to avoid
cross-page drift. This is layout/anchor-landing only: no JS, `data-*`,
localStorage, copy, or asset change; this page's header nav links point at
`index.html#…` (cross-page), so on-page scrollspy is not affected.

## How to verify it's fixed
Load at 375 and 1440 with `scrollY = 0`: the eyebrow and every H1 line are fully
visible above the fold, not behind the bar. Click each `.section-arrow`: the
destination heading is not hidden under the header.

## Vote tally
failedToRefute: 3 / 3

- **Skeptic 1 (failed to refute):** Verified header position:fixed top:0
  z-index:20 padding 14px (style.css:46-58), ships opaque is-scrolled (HTML:16;
  style.css:61-66); `.volunteer-hero` padding-top:132px (style.css:2149); zero
  scroll-margin/scroll-padding (grep). Logo is portrait under img{max-width:100%}
  (style.css:30-33) so the header is taller than the 132px hero padding.
  Screenshots are decisive: at scroll=0 (1280.png/1440.png/375.png) the coral
  eyebrow is hidden and 'Celebrate the' is clipped behind the bar, whereas
  1280-volunteer.png (header composited lower) shows the full eyebrow + H1. The
  candidate's '132px ~= header height' is slightly understated (header is larger)
  but the conclusion (insufficient clearance + unoffset anchor jumps) is correct.
  Fix (more hero padding + scroll-margin-top), page-scoped, is safe.
- **Skeptic 2 (failed to refute):** REAL, screenshot-backed content occlusion.
  `.site-header` position:fixed/z-index:20 (style.css:46-58), ships .is-scrolled
  opaque rgba(251,248,239,.94)+blur (61-66; HTML:16) and body.subpage keeps it;
  hero padding-top only 132px (2149) ~ header height; grep confirms NO
  scroll-margin/scroll-padding anywhere. 1440.png and 375.png both show the
  eyebrow absent and the first H1 line ghosted/clipped behind the translucent bar
  on load. Fix is behavior-safe: page-scoped hero padding + scroll-margin-top
  affect only layout/anchor-landing; this page's header nav links target
  index.html#... (cross-page), so on-page scrollspy isn't active and section IDs
  are untouched.
- **Skeptic 3 (failed to refute):** Screenshot-confirmed at first paint.
  1280.png, 1440.png and 375.png all show the eyebrow 'Volunteer of the month'
  hidden and the first H1 line 'Celebrate the' clipped behind the opaque
  is-scrolled header; 1280-volunteer.png (header composited lower, PureBot open)
  shows them visible — a clean A/B that the header is the occluder. CSS: fixed
  opaque header (style.css:46-67) with stacked logo + 14px block padding ~= hero
  padding-top 132px (style.css:2149). grep confirms no scroll-margin/
  scroll-padding, so anchor jumps also land under the header. Real defect;
  findings-driven visual fix is in scope per the Project Contract (D9/D16).
