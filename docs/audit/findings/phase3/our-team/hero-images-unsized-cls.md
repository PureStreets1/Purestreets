---
id: hero-images-unsized-cls
phase: phase3
agent: critic
status: verified
severity: low
scope: perf
evidence:
  - /Users/haidertoha/Code/pure_streets/our-team.html:18
  - /Users/haidertoha/Code/pure_streets/our-team.html:44
  - /Users/haidertoha/Code/pure_streets/style.css:30-33
  - /Users/haidertoha/Code/pure_streets/style.css:69-73
  - /Users/haidertoha/Code/pure_streets/style.css:2664-2667
  - /Users/haidertoha/Code/pure_streets/assets/img/logo.png
  - /Users/haidertoha/Code/pure_streets/assets/img/figure.png
  - /Users/haidertoha/Code/pure_streets/docs/audit/runs/before/lighthouse-summary.json
source: internal
---

## Claim
Neither the masthead logo nor the hero figure carries `width`/`height` (or
`aspect-ratio`), so the browser reserves no vertical space before they load — an
avoidable CLS contributor even though page perf is otherwise 94.

Verified:
- `our-team.html:18` `<img src="assets/img/logo.png" alt="PureStreets" />` and
  `our-team.html:44` `<img src="assets/img/figure.png" … />` have no
  `width`/`height`/`aspect-ratio` attributes.
- Sizing is CSS-only: logo via `.brand width: clamp(78px, 8vw, 112px)`
  (style.css:69-73); figure via `.team-hero img width: min(100%, 260px)`
  (style.css:2664-2667).
- Intrinsic sizes: `logo.png` 343x480, `figure.png` 760x701.
- coding-rules P1 asks for explicit media dimensions/aspect-ratio to protect CLS;
  lighthouse-summary.json confirms our-team perf 94 (CLS not separately failing).

IMPLEMENTATION CONSTRAINT (carried from skeptic review — must be honored or this
fix becomes a visual regression): the global `img` rule is `display: block;
max-width: 100%` with NO `height: auto` (style.css:30-33), and author CSS overrides
only `width`. Adding raw `width`/`height` attributes would set the presentational
height hint (480px / 701px) while CSS caps width, distorting the images
(aspect-ratio-from-attributes does NOT apply when height is non-auto). The fix MUST
either pair the attributes with `height: auto` (or `aspect-ratio`) in CSS, or set
`aspect-ratio` in CSS alone, so the rendered box reproduces the current size
exactly.

## Why it matters
Unsized images can shift the hero (the LCP region) as they decode, hurting CLS and
the first impression. Reserving space is render-neutral once the ratio matches the
current layout. Severity is low because perf is already 94 and the hero grid row
height is largely driven by the taller text column.

## Recommended action
Reserve space without distortion: add `width`/`height` matching the intrinsic
ratios (logo 343x480, figure 760x701) AND ensure CSS keeps `height: auto`, OR set
`aspect-ratio` on `.brand img` / `.team-hero img` in CSS. Pick whichever reproduces
the current rendered size exactly. No DOM-order, copy, asset, or JS-hook change.

## How to verify it's fixed
Throttle the network and reload: the hero region must not jump as images decode.
Confirm rendered dimensions match the before screenshots at all four widths and
that CLS stays <=0.1 in Lighthouse; confirm the logo is not vertically stretched.

## Vote tally
failedToRefute: 2 / 3

- failedToRefute: Factually correct. our-team.html:18 (logo) and :44 (figure) carry
  no width/height/aspect-ratio; sizing is CSS-only (brand clamp at 72, figure
  min(100%,260px) at 2664-2667). Intrinsic ratios confirmed via sips (343x480,
  760x701). P1 calls for explicit media dimensions; lighthouse confirms perf 94.
  Adding attributes is render-neutral because CSS continues to control the rendered
  box. CLS magnitude somewhat overstated (hero row height driven by the text
  column), hence med confidence — but the finding and remedy stand.
- failedToRefute: Real per P1. Sizing is CSS-only; adding width/height matching
  intrinsic ratios reserves space and is render-neutral IF paired with height:auto
  or CSS aspect-ratio (otherwise the presentational height hint distorts the logo,
  since no CSS sets img height) — the candidate's recommendedAction/howToVerify
  explicitly require reproducing current rendered size, so the pitfall doesn't
  refute the finding. Low severity (perf already 94) but rule-grounded and safe.
- refuted: REFUTED — primary recommended fix is unsafe in THIS codebase and the
  premise is imprecise. The global img{display:block;max-width:100%} (style.css:30-33)
  has NO height:auto, and author CSS overrides width only; adding raw width/height
  attributes sets the height hint (480/701px) while CSS caps width, yielding
  distorted images (a visual regression). "Reserves no space" is also wrong: width
  is already reserved; only the figure's height is unreserved. The logo sits in a
  position:fixed header (out of flow) so its load shifts no in-flow content. No
  evidence of an actual CLS failure (perf 94). The only safe sliver (figure
  aspect-ratio in CSS) is low-value.
  [Critic note: this dissent is incorporated as the binding IMPLEMENTATION
  CONSTRAINT above — the finding is retained because the safe CSS-aspect-ratio /
  height:auto remedy still closes the P1 gap.]
