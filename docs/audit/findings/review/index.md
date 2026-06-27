# Phase 6 adversarial review — index.html

Reviewer verdict on the overhaul changes affecting `index.html`. Evidence is
before/after screenshots in `docs/audit/screenshots{,-after}/index/`, the
`git diff main` of `index.html`/`style.css`/`script.js`, axe before/after,
console-after, lighthouse before/after, and `flow-test.json`. All pixel work was
quantified with Pillow/numpy (max-channel diff, threshold 16) plus
offset-minimisation and magnitude histograms to separate real change from
inter-run font-render noise.

## Mechanical deltas (read)
- **axe**: before = `aria-hidden-focus` + `color-contrast`(11) + `link-name`(1);
  after = `color-contrast`(11) + `link-name`(1). `aria-hidden-focus` REMOVED, no
  new violation id. `link-name` is the Tally iframe (third-party, pre-existing).
- **console-after**: `[]` — no new console errors.
- **lighthouse index**: perf 73 → **83** (+10), a11y 91 → 95, SEO 100 → 100,
  best-practices 100. No regression.
- **flow-test**: 10/10 pass (counters, reveal, reduced-motion counters, PureBot
  inert+flow, competition, volunteer, anchors).

## Verdicts on fixed findings

### hero-lcp-8s — FIXED
`<link rel="preload" as="image" href="assets/img/hero-banner.jpg" fetchpriority="high">`
added (index.html head). Same-origin, same asset already used as the CSS hero
background (style.css:133) → no new request/domain. Lighthouse index perf 73→83.

### missing-canonical-og — FIXED
Head now carries `rel="canonical"`, `og:*`, `twitter:card`, and inline JSON-LD
(Organization + 3 Events). Head-only, render-neutral; SEO stays 100; JSON-LD is
inline so no runtime fetch. Zero body/pixel impact.

### purebot-aria-hidden-focus — FIXED
`panel.inert = true` at `initPureBot()` and `panel.inert = !isOpen` in `setOpen()`
(script.js). axe `aria-hidden-focus` is GONE in after/axe/index.json.
flow-test F6 (index): `closedInert=true open=true focus=true msgs=3
reClosedInert=true errs=0`. 1280-purebot before/after open state is visually
identical (4 changed px in the top 900px) — inert is non-visual as required.

### reduced-motion-incomplete — FIXED
CSS reduced-motion block now adds `html{scroll-behavior:auto}` and
`transform:none` for `.button:hover/.purebot-toggle:hover/.team-contact:hover` +
`.purebot-panel{transition:none}` (style.css ~1533-1556). JS counter short-circuits
to `${target}+` under `prefers-reduced-motion` (script.js ~55-62). flow-test
"F4 reduced-motion counters immediate" = `["42+","18+","96+"]`; default-motion
counters still animate (F4) and reveals still fire (F5).

### eyebrow-coral-contrast-fail — INSUFFICIENT
`--coral-text:#bd4631` applied to `.eyebrow`; dark-section eyebrows kept `--coral`
via `.impact-copy .eyebrow,.kit-section .eyebrow` (style.css ~186-191). Computed
WCAG ratios (verified in code):
- mission "OUR PURPOSE" `#bd4631` on paper `#fbf8ef` = **4.84** PASS (was 3.12).
- join "BRING YOUR INTENTION" `#bd4631` on `#fffdf7` = **5.06** PASS.
- impact "COMMUNITY IMPACT" kept `#e6654f` on `#123c2b` = 3.71 — **intentional**
  (finding + plan: "dark-section eyebrows unchanged"); was failing before too, no
  regression.
- **pickups "UPCOMING ROUTES" `#bd4631` on the schedule section bg `#f4efe1`
  (style.css:432) = 4.476 — still below the 4.5 AA floor.** after/axe/index.json
  STILL lists `#pickups > .section__heading > .eyebrow` under `color-contrast`.
The token was validated against `#fbf8ef/#ffffff/#fffdf7` but the `#pickups`
eyebrow sits on the warmer `#f4efe1`, where it undershoots by 0.024. The plan's
own acceptance ("axe color-contrast no longer lists any `.eyebrow` node") is not
met. Marginal magnitude (visually imperceptible) → med severity, but it is a real
unmet axe AA node. Fix: nudge `--coral-text` ~1 step darker (e.g. `#b8432e`) so it
clears 4.5 on `#f4efe1` too, or give the schedule eyebrow the paper bg.

### hero-h1-clipped-top — INSUFFICIENT
`.hero{align-items:safe end}` + `@media(min-width:1281px){.hero__content
transform: translateY eased -48px→0 by 1440}` (style.css).
- **1440: FIXED.** `cmp_hero1440` — "Clean" is clipped under the header in BEFORE,
  fully visible below it in AFTER (hero H1 region moved down ~48px, 85k px change,
  no shift-collapse = real translate). Buttons + "Cricklewood Litter Pick" card
  still fit inside the hero, no overlap with the mission section.
- **1280 / 768: unchanged** (media query is `min-width:1281px`; offset test shows
  the 1280 H1 best-aligns at (0,0)). 768 was already intact. Matches the plan's
  "preserve 768/1280".
- **375: NOT fixed.** Offset test: 375 hero body (y235-640) = **0 changed px** —
  the mobile hero is pixel-identical before/after, so "Clean streets." is STILL
  clipped under the fixed header (`cmp_hero375`: header → "Shared reward.", first
  line hidden). The mobile override (style.css:639-646) keeps `translateY(0)` and
  `safe end` is a no-op when content fits, so the fix has zero effect at 375. The
  plan's acceptance explicitly required "375×667, 375×812: full 'Clean streets.'
  line visible below the header" — unmet.
- Minor: at 1440 the lime "COMMUNITY ACTION GROUP" eyebrow is still tucked under
  the taller 1440 header (`probe_v1440_eyebrowgap`), though the H1 (primary
  acceptance) is now visible.

## New-regression hunt (all 4 viewports + interactive states)

### logo-header-vertical-jitter — LOW (most likely a fixed-header capture artifact)
The logo raster is byte-identical but vertically translated between runs: extended
offset search gives **0.0%** diff after shifting the after-logo by +7px (375),
+3px (1280), −2px (768), 0px (1440). The cream header band moves with it
(375: up 7px same height; 1280: +3px taller; 768: down 2px). BUT the nav text is
pixel-identical at (0,0) (1280) — a rigid header shift would move the nav too, so
this is NOT a layout shift. `.site-header` is `position:fixed` (style.css:50-52)
with a JS-toggled `.is-scrolled` background; such headers render inconsistently in
full-page screenshots. The only CSS touching the logo is the new
`.brand img{aspect-ratio:343/480;height:auto}` (logo intrinsic is exactly
343×480, so the math predicts ZERO size change — and width is identical at all
viewports). Inconsistent shift direction + identical raster + zero predicted size
change ⇒ almost certainly a fixed-header full-page-capture artifact, not a diff
regression. It exceeds the 2px tolerance at 375, so recommend a **fixed-viewport
(non-full-page) 375 reshoot** to confirm pixel-identity before treating as real.

## Confirmed clean (intended changes verified, not flagged)
- **Coral eyebrow recolor** (mission/pickups/join darker; impact unchanged=0 px) —
  intended.
- **Contact iframe light bg**: `#join` `.tally-embed--contact iframe` dark-teal →
  white (`cmp_join1280`) — intended T9, matches the work form; not broken.
- **1440 hero H1 downward move** — intended (see above).
- **Mid-page text "changes"** at 768/1280/375 (mission heading/body, nav) are
  inter-run font-render noise: mean diff ~1.2 (1280 mission) vs ~22–118 for the
  real changes; no shift-collapse; no CSS recolor touches that text.
- **Logo/team aspect-ratio**: intrinsic logo 343×480, figure 760×701 — match the
  declared `aspect-ratio`, so CLS reservation is size-neutral.
- **Interactive states**: 375 nav-open top = 0 changed px; 1280 PureBot open top =
  4 changed px. Both pixel-identical.
- **Greeting** "how can i help you?"→"how can I help you?" applied in index.html
  (gated copy item; an improvement, not a degradation).
