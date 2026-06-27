# Review — our-team.html (Phase 6, adversarial)

Branch `feat/polish-no-slop` vs `main`. Verdict: **7/7 fixed findings confirmed FIXED; 0 real regressions.**
Mechanical deltas: axe 2→0 violations; console after = `[]`; Lighthouse a11y 90→100, perf 94→93 (noise), bp/seo 100; flow-test 10/10.

## Fixed-finding verdicts

### coral-labels-fail-contrast (high, a11y) — FIXED
- axe before: `color-contrast` serious, 5 nodes (`.team-section__head > .eyebrow` + `article:nth-child(1..4) > span`). axe after: **0**. Lighthouse a11y 90→100.
- `style.css`: new `--coral-text:#bd4631`; applied to `.eyebrow`, `.team-grid span` (+ the other 5 label spans). Dark-section eyebrows kept `--coral` (none exist on this page). Hero lime `panel-label` untouched.
- Screenshots (375/768/1280/1440): the 5 labels render visibly darker coral, still reading as the coral accent family. No other text regressed.

### purebot-panel-aria-hidden-focusable (med, a11y) — FIXED
- axe before: `aria-hidden-focus` serious on `.purebot-panel`. axe after: **0**.
- `script.js`: `panel.inert = true` at `initPureBot()` (ships closed) + `panel.inert = !isOpen` in `setOpen()` before `input.focus()`.
- flow-test F6: `closedInert=true open=true focus=true reClosedInert=true errs=0`. 1280-purebot screenshot: panel visually identical (inert is non-visual).

### header-overlaps-hero-h1 (high, design) — FIXED
- Authoritative DOM rects (deviceScaleFactor 1), `H1.top − header.bottom` / `eyebrow.top − header.bottom`:
  - 1440: H1 **−7.2 → +63.8**; eyebrow **−51.7 → +19.3**.
  - 1280: H1 +6.2 → **+62.5**; eyebrow **−38.3 → +18.1**.
- Screenshots 1280/1440 after: full "The people …" headline AND "OUR TEAM" eyebrow now clear the fixed header (BEFORE clipped "The people").
- `style.css`: `.team-hero` padding-block-start → `clamp(132px, calc(11.2vw + 46px), 203px)` (= header height + 18px), `--header-h` token, `scroll-padding-top`.
- 375/768: padding clamp **floors at 132px = original**; rects pixel-identical before/after — matches the finding's "≤768 stays pixel-identical" criterion.

### head-missing-canonical-og-jsonld (med, content) — FIXED
- `our-team.html` head: `rel=canonical`, `og:title/description/type/url/image`, `twitter:card`, and **valid** `Organization` JSON-LD (parses; 7 member `Person`s for the visible roster). Head-only, render-neutral.
- Referenced assets exist (`hero-banner.jpg`, `logo.png`). After network hosts: self + `fonts.googleapis.com`/`fonts.gstatic.com` only; 0 failures; **no new domain** (og/canonical absolute URLs are not fetched on render).

### hero-images-unsized-cls (low, perf) — FIXED
- `style.css`: `.brand img{aspect-ratio:343/480;height:auto}`, `.team-hero img{aspect-ratio:760/701;height:auto}` — reserves CLS box pre-load.
- **Proven render-neutral**: brandImg rect identical before/after (78×109.14 @375; 112×156.73 @1440); same-Chromium non-scrolled clip diff = **0px**; binding "no distortion / reproduce current size" constraint satisfied.

### incomplete-reduced-motion-coverage (low, a11y) — FIXED
- `style.css` reduce block extended: `html{scroll-behavior:auto}`, `.button:hover/.purebot-toggle:hover/.team-contact:hover{transform:none}`, `.purebot-panel{transition:none}`. `script.js` counters write final values under reduce.
- Additive inside the existing `@media`; default (motion-on) byte-identical. flow-test "reduced-motion counters immediate" = pass. (`.team-contact` hover is the on-page residual the finding called out.)

### contact-links-small-tap-target (med, a11y) — FIXED
- `style.css`: `.team-contact{position:relative}` + `::before{height:44px;top:50%;translateY(-50%)}` transparent hit strip.
- Measured @375: visible pill **unchanged** (h=38, w=80.61, pad 9px 12px); effective tap target ≥44px; card height 393.58 / `min-height:300px` **unchanged** (no reflow).

## Regression hunt — no real regressions

**Investigated and DISMISSED — downscaled-raster nondeterminism (NOT a regression).** Audit screenshots show 10–32% pixel diffs in the header logo (and to a lesser extent the hero figure + PureBot avatar) across viewports. Proven to be headless-Chromium GPU image-downscale **nondeterminism between capture runs**, not the code:
- DOM rects for logo/figure are byte-identical before/after; flat fills + all body text + the hamburger are identical; only raster-image edges differ (sub-pixel resampling).
- Determinism control (same Chromium, scrolled): **same code rendered twice** varies 0–35% (before-A vs before-C = 34.8%); **cross before/after = 0%** (before-A vs after-B/C). Audit `1280-purebot` logo diff = 0%.
- The `aspect-ratio` additions are render-neutral (non-scrolled clip diff = 0). No layout/position/size/color change. The logo is visually identical at 6× zoom.

**Pre-existing, unchanged (not a regression).** At 375/768 the hero "OUR TEAM" eyebrow's top ~5px tucks under the fixed header (`eyebrow.top − header.bottom = −5.1` in BOTH before and after — padding floor = original 132px). Out of scope for header-overlap (targets 1280/1440; requires ≤768 pixel-identical). H1 is clear (+34px) at these widths.

**Intended changes (not flagged):** darker coral labels; increased hero top padding (1280/1440); PureBot greeting "i"→"I" (T13 copy fix, visible in 1280-purebot); head metadata. Lighthouse perf 94→93 is run-to-run noise (avg perf improved 90→91; only inline JSON-LD/meta added).
