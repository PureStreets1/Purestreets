---
id: charity-hero-header-overlap
phase: phase3
agent: critic
status: fixed
severity: high
scope: design
evidence:
  - charities.html:16
  - charities.html:18
  - charities.html:38-43
  - style.css:46-58
  - style.css:61-67
  - style.css:69-73
  - style.css:2320-2326
  - style.css:2336-2338
  - assets/img/logo.png
  - docs/audit/screenshots/charities/1280.png
  - docs/audit/screenshots/charities/1440.png
  - docs/audit/screenshots/charities/375.png
source: internal
---

## Claim
Because the logo asset is portrait (343x480, verified via `sips` on
`assets/img/logo.png`), the `position: fixed` header (`style.css:46-58`,
`padding: 14px`) renders its `.brand` logo at its `clamp(78px, 8vw, 112px)`
max width (`style.css:72`) with no height/aspect cap — the global
`img { max-width: 100% }` rule has no `height: auto` and there is no
`.brand img` rule — so the logo renders ~157px tall at >=1400px and the header
band is ~185px tall (157 + 14px*2 padding). But `.charity-hero` only reserves
`padding: 132px ...` at the top (`style.css:2325`), which is shorter than the
rendered header. As a result the `.eyebrow` "Charity partnerships"
(`charities.html:40`) sits inside the 0-185px header band and is entirely
hidden, and the H1 first line ("Bring clean-up...", `charities.html:41`, font
`clamp(2.8rem, 6vw, 5.9rem)` at `style.css:2338`) plus the top of the Islamic
Relief partner card bleed behind the 94%-opaque header
(`rgba(251,248,239,0.94)`, `style.css:61-67`). Confirmed in
`docs/audit/screenshots/charities/1280.png` and `1440.png` (no eyebrow visible;
H1 first line clipped; faint card top above the header line) and at mobile in
`375.png`.

## Why it matters
The eyebrow -> H1 ladder (design-rules D1/D3) is the page's focal entry point.
Hiding the eyebrow and clipping the headline breaks the primary message and
reads as broken at the two most common desktop widths, undermining the first
impression of the charity-partnership pitch. This is a content-obscuring layout
bug, not a taste call — the kind of "actual bug" the on-disk CLAUDE.md overhaul
contract permits fixing via a verified finding.

## Recommended action
Reserve top space equal to the real fixed-header height: either raise
`.charity-hero` `padding-top` to exceed the 343:480 logo-driven header height,
or cap the logo's rendered height (e.g. a `.brand img` height/`aspect-ratio`
rule) so the eyebrow and the full H1 cap-height clear the header. Re-shoot
1280/1440 to confirm the eyebrow is visible. Flag in the PR as an intentional
bug-fix pixel change (named to this finding) per the overhaul contract.

## How to verify it's fixed
Load `charities.html` at 1280 and 1440; confirm the `.eyebrow` text and the
full H1 cap-height render below `.site-header`. In DevTools, confirm
`header.getBoundingClientRect().bottom` <= the H1 first-line top, and that the
Islamic Relief card top no longer bleeds under the header band. Before/after
screenshots at 375 and 1440 isolate the single intended change.

## Vote tally
failedToRefute: 3 / 3

- **Skeptic 1 (failed to refute):** Borne out by CSS + screenshots. logo.png
  intrinsic 343x480 (file cmd); `.brand` width clamp max 112px (style.css:72);
  global `img{max-width:100%}` only, no `.brand img` height cap (grep) => logo
  renders ~157px tall, +14px*2 padding (style.css:56) = ~185px header.
  `.charity-hero` padding-top is 132px (style.css:2325) < 185px. Screenshots
  1280.png and 1440.png both show the "Charity partnerships" eyebrow absent and
  the Islamic Relief card top faintly bleeding under the rgba(251,248,239,0.94)
  header (style.css:64). Math: eyebrow at ~132px sits inside the 0-185px header
  band; h1 (clamp max 5.9rem, style.css:2338) starting ~156px is partly
  clipped. Real desktop layout defect; fix is an intentional bug-fix pixel
  change permitted by the overhaul contract (CLAUDE.md).
- **Skeptic 2 (failed to refute):** Real, evidence-backed layout bug.
  Screenshots confirm it: 375.png shows the H1 "Bring clean-up" first line
  clipped under the header; 1280.png & 1440.png show the "Charity partnerships"
  eyebrow entirely absent and a faint IR card-top bleeding above the header
  band. Logo is 343x480 portrait (sips); at `.brand` width:112px
  (style.css:69-73) it renders ~157px tall and there is NO height cap (global
  `img{max-width:100%}` style.css:30-33; no `.brand img` rule), so header
  ~157px + 14px*2 padding (style.css:56) ~185px, while `.charity-hero` reserves
  only padding-top:132px (style.css:2325). Fix (raise padding-top) touches no JS
  flow, data-* hook, localStorage key/shape, copy, or asset; permitted under the
  on-disk CLAUDE.md overhaul contract (which supersedes the freeze).
  Behaviorally safe.
- **Skeptic 3 (failed to refute):** REAL, deterministic layout bug. logo.png is
  343x480 portrait (verified via file). `.brand` width clamp(78px,8vw,112px)
  (style.css:69-73) + global `img max-width:100%` with NO height/aspect cap
  (verified: no `.brand`/header-img height rule, aspect-ratio only at
  style.css:1452 for an unrelated element) means the logo renders ~143px tall at
  1280 / ~157px at >=1400, so the position:fixed header (style.css:46-58,
  padding 14px) is ~171-185px tall, exceeding `.charity-hero` padding-top:132px
  (style.css:2325). Both standard captures confirm it: 1280.png and 1440.png
  show NO "Charity partnerships" eyebrow, the H1 "Bring" first line clipped, and
  the IR card top bleeding behind the header band. (The 1280-purebot.png anomaly
  is a load/timing artifact and is itself CLS evidence.) Per the operative
  CLAUDE.md (visual-overhaul-via-finding, not a freeze), reserving header-height
  top space is a safe, in-scope bug fix; design-rules D1/D3 (focal eyebrow->H1
  ladder) is broken.
