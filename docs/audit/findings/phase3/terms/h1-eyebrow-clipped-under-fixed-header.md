---
id: h1-eyebrow-clipped-under-fixed-header
phase: phase3
agent: critic
status: fixed
severity: high
scope: design
evidence:
  - terms.html:16
  - terms.html:17-19
  - terms.html:38-40
  - style.css:46-58
  - style.css:69-73
  - style.css:1943-1946
  - assets/img/logo.png
  - docs/audit/screenshots/terms/1440.png
  - docs/audit/screenshots/terms/1280.png
  - docs/audit/screenshots/terms/768.png
  - docs/audit/screenshots/terms/375.png
source: internal
---

## Claim
`.legal-page` reserves `padding: 136px ...` at block-start (`style.css:1944`),
but `.site-header` is `position: fixed` (`style.css:46-47`) with 14px vertical
padding x2 = 28px chrome (`style.css:56`), and its `.brand` logo width is
`clamp(78px, 8vw, 112px)` (`style.css:72`) over the portrait `logo.png`
(intrinsic 343x480, aspect h/w = 1.40, verified via `sips`). The global
`img { max-width: 100% }` rule (`style.css:30-33`) has no `height: auto` cap and
there is no `.brand img` rule, so the logo's rendered height scales with the
brand width and the header height = `28 + brand_width * 1.40`. That computes to
~143px @1024, ~171px @1280, and ~185px @1440 — all greater than the 136px the
`.legal-page` reserves. The result: the `.eyebrow` "PureStreets"
(`terms.html:39`) and the top of the H1 "Terms & conditions" (`terms.html:40`)
are hidden/clipped behind the fixed header at laptop/desktop widths. It only
looks correct at <=768px because the logo sits at its 78px clamp floor
(header ~137px, just under the 136px reserve). The subpage selector at
`style.css:61-64` only changes the header's color/background — the header stays
`position: fixed`, so the overlap is identical on this page. The same
`.legal-page` rule is shared by `policies.html`, so both legal pages are
affected.

## Why it matters
The page's single focal element — the H1 — and its orienting kicker are
physically cut off on the most common laptop/desktop widths. That is a hard
visual-hierarchy break (design-rules D1: one unmistakable focal point) and a
content-obscuring layout bug, not a taste call: content is lost, not merely
restyled. Confirmed visually in `docs/audit/screenshots/terms/1440.png` (no
"PURESTREETS" eyebrow; tops of the letters in "Terms &" sliced off behind the
header) and `1280.png` (same clipping), while `768.png` and `375.png` show the
eyebrow visible and the H1 intact because the logo is at its clamp floor.

## Recommended action
Make `.legal-page` block-start padding always exceed the fixed header's rendered
height across widths — either drive both the header height and this offset from
one shared `--header-h` variable, or set a fluid block-start padding that tracks
the header (e.g. `padding-block-start: clamp(150px, calc(56px + 11.2vw), 210px)`,
matching ~28px chrome + 1.40 * brand-width). CSS-only; touches no JS flow,
`data-*` hook, localStorage key/shape, copy, or asset. The same fix repairs
`policies.html`, which shares `.legal-page`. Flag in the PR as an intentional
bug-fix pixel change named to this finding, per the on-disk CLAUDE.md overhaul
contract.

## How to verify it's fixed
Re-capture `terms.html` and `policies.html` at 1024 / 1280 / 1440: the eyebrow
plus the full H1 cap-height clear the header with no overlap. In DevTools,
confirm `header.getBoundingClientRect().bottom <=` the eyebrow's top. 375 / 768
stay pixel-identical to before (logo already at the clamp floor there).

## Vote tally
failedToRefute: 3 / 3

- **Skeptic 1 (failed to refute):** Factually correct and visually confirmed.
  `logo.png` is 343x480 (aspect h/w = 1.40, verified via file). `style.css:1944`
  `.legal-page` padding-top = 136px; `:47` `.site-header position: fixed` with
  `:56` padding 14px (28px vertical); `:72` `.brand` width `clamp(78px,8vw,112px)`;
  `.subpage .site-header` (675-677) only changes color, header stays fixed. With
  `img max-width:100%` + auto height, header height = `28 + brand_width*1.40` =
  ~143px@1024, ~171px@1280, ~185px@1440 — all > 136px, matching the cited
  7/35/49px overlaps exactly. Screenshot 1440.png: "PureStreets" eyebrow absent
  and tops of "Terms &" sliced off; 1280.png: eyebrow hidden; 768.png: eyebrow
  visible + H1 intact (logo at 78px floor, header ~137px). Real layout bug, also
  affects policies.html (shares `.legal-page`).
- **Skeptic 2 (failed to refute):** CONFIRMED, not refutable. Screenshots
  terms/1440.png and 1280.png both show the eyebrow absent and the tops of
  "Terms &" sliced behind the fixed header; 768.png shows both intact. CSS math
  verified: `logo.png` is exactly 343x480 (aspect 1.40, confirmed via file/sips);
  `.brand` width `clamp(78px,8vw,112px)` (`style.css:72`) -> logo rendered height
  ~157px @1440, ~143px @1280 vs `.legal-page` padding-block-start 136px
  (`style.css:1944`) and `.site-header position: fixed` + 14px*2 padding
  (`style.css:46-56`) -> header ~185/171px, overlap ~49/35px. Fix is a CSS
  padding/clamp change on `.legal-page` — touches no JS flow, `data-*` hook,
  localStorage, copy, or asset; behavior-safe and no-build-safe. Per design-rules
  D1 this is a real layout/hierarchy break, not a taste call.
- **Skeptic 3 (failed to refute):** Verified against the four rule files and the
  source of truth. Real layout bug. `.site-header` is `position: fixed`
  (`style.css:46-47`) with 28px vertical padding (14px x2, `:56`); `.brand` width
  is `clamp(78px,8vw,112px)` (`:72`) over `logo.png` (confirmed 343x480, ratio
  1.40), so header height = `brand_width*1.40 + 28` = ~143px@1024, ~171px@1280,
  ~185px@1440 — all exceed `.legal-page` padding-top:136px (`style.css:1944`).
  Screenshots confirm: terms/1440.png and 1280.png show NO "PURESTREETS" eyebrow
  and the tops of "Terms &" sliced by the header; 768.png shows eyebrow visible +
  intact H1 (logo at 78px floor -> header ~137px). Lost content / D1 hierarchy
  break, not taste. Fix is CSS-only padding offset.
</content>
</invoke>
