---
id: header-overlaps-hero-h1
phase: phase3
agent: critic
status: verified
severity: high
scope: design
evidence:
  - /Users/haidertoha/Code/pure_streets/docs/audit/screenshots/our-team/1440.png
  - /Users/haidertoha/Code/pure_streets/docs/audit/screenshots/our-team/1280-purebot.png
  - /Users/haidertoha/Code/pure_streets/style.css:46-58
  - /Users/haidertoha/Code/pure_streets/style.css:69-73
  - /Users/haidertoha/Code/pure_streets/style.css:2647
  - /Users/haidertoha/Code/pure_streets/our-team.html:16
  - /Users/haidertoha/Code/pure_streets/our-team.html:37-45
  - /Users/haidertoha/Code/pure_streets/assets/img/logo.png
source: internal
---

## Claim
At the 1440 capture width the always-opaque fixed header overlaps the top of the
`.team-hero`, cutting off the first line ("The people") of the page's primary
headline. The same headline renders fully clear at 1280, proving this is a
header-height vs hero-padding collision, not a screenshot artifact.

Mechanism (all verified against source):
- `.site-header` is `position: fixed` with `padding: 14px clamp(18px, 4vw, 54px)`
  (style.css:46-58) and is opaque from page load because `our-team.html:16`
  carries `is-scrolled` on the `<body class="subpage">` page (`.is-scrolled`
  background at style.css:61-67).
- `.brand` width is `clamp(78px, 8vw, 112px)` (style.css:72). `logo.png` is
  intrinsically 343x480, so at its 112px clamp max (reached at 1440) it renders
  ~157px tall; with 2x14px header padding the header is ~185px tall.
- The hero clears the header only via a hard-coded `padding: 132px …` top value
  (style.css:2647), which is far less than the ~185px header at 1440. At 1280 the
  logo is only ~143px (clamp 8vw), so the ~171px header just clears the headline.
- The hero `<section class="team-hero">` is the first `<main>` child
  (our-team.html:37-45), so nothing else absorbs the overlap.

## Why it matters
The H1 is the single focal point of the page (design-rules D1) and the likely LCP
element. Occluding its first line at a primary audit width undermines visual
hierarchy and looks broken on the widest, most common desktop viewport. The
control screenshot at 1280 (`1280-purebot.png`) shows the full headline with
clearance, isolating the defect to the larger viewport.

## Recommended action
Make the hero's top clearance track the real header height instead of a
hard-coded 132px. Options: expose a `--header-h` custom property (or cap the
subpage logo image height) and derive `.team-hero` `padding-block-start` /
`scroll-padding-top` from it so it always clears the header. Change only the
hero's top spacing — do not alter header design, logo asset, the `.brand` clamp
that other pages rely on, or any copy. This is an evidence-backed visual fix
permitted under the overhaul mandate (CLAUDE.md).

## How to verify it's fixed
Re-screenshot our-team at 1440 and 1280: the full H1 first line "The people" must
be visible with a clear gap below the header at both widths. Diff the rest of the
page (320 / 768 / 1024 / 1440) for zero unintended pixel change, and confirm no
header, logo, or copy regression.

## Vote tally
failedToRefute: 3 / 3

- failedToRefute: Read coding-rules.md, design-rules.md, anti-slop-checklist.md,
  CLAUDE.md and skimmed inspiration/ (10 peer files). Screenshot-confirmed:
  1440.png clips "The people" behind the opaque fixed header; 1280-purebot.png
  shows the full headline with clearance — a viewport-dependent header-vs-padding
  collision, not an artifact. Math verified: .brand clamp max 112px, logo 343x480
  renders ~157px tall + 28px padding = ~185px header > the 132px hero top padding
  (style.css:2647). D1/LCP-relevant; fix bounded to hero top spacing.
- failedToRefute: VERIFIED REAL. 1440.png clips the H1 first line; 1280 control
  clears it. Math confirms a viewport-specific collision (logo ~157px at 1440,
  ~143px at 1280; header ~185px vs ~171px against 132px top padding). Header is
  fixed/opaque from load. Fix = increase `.team-hero` padding-block-start /
  derive from `--header-h`: CSS-only, no data-* hook, localStorage, copy, or asset
  touched; no JS-flow impact.
- failedToRefute: Real structural collision. `.site-header` is position:fixed
  (style.css:47); the hero clears it only via padding-top:132px (style.css:2647).
  Logo at `.brand` clamp renders ~143px (1280) / ~157px (1440); header height
  ~171px/~185px + padding > 132px. The plain 1280.png also clips the tops of "The
  people" while 1280-purebot.png is near-clear — the clip scales with viewport/logo
  size exactly as the mechanism predicts, ruling out a screenshot artifact. H1 is
  the LCP focal point (D1); fix is page-scoped to `.team-hero` top padding.
