# Review — charities.html (Phase 6, adversarial)

Reviewer verdict on the overhaul changes affecting `charities.html`. Diff reviewed:
`git diff main -- charities.html style.css script.js`. Mechanical deltas read:
axe before/after, after console, lighthouse before/after, flow-test. Screenshots
compared before vs after at 375 / 768 / 1280 / 1440 + `375-nav-open` + `1280-purebot`.

## Summary
All six fixed findings that affect this page are **confirmed fixed**. No unintended
regressions found at any of the 4 viewports or the 2 interactive states. axe in-page
violations dropped from 2 (aria-hidden-focus + color-contrast w/ 3 in-page nodes) to
1 (color-contrast, 10 nodes — **all** inside the third-party Tally iframe, pre-existing
and out of scope). After console = `[]`. Lighthouse charities improved
(perf 90→94, a11y 90→100; best-practices/seo stay 100). flow-test 10/10 pass.

The desktop page is taller after the fix (1280: 2702→2760px; 1440: 2697→2768px) — this
is the **expected** consequence of reserving real fixed-header height in the hero top
padding, not a degradation. Mobile heights are unchanged (768: 3052→3052; 375:
3792→3792), confirming the ≤768 pixel-identity the plan mandated.

## Finding verdicts

### charity-hero-header-overlap — FIXED (high, design)
- BEFORE `screenshots/charities/1280.png` + `1440.png`: the "CHARITY PARTNERSHIPS"
  eyebrow is entirely absent, the H1 "Bring" first line is clipped by the header band,
  and the Islamic Relief card's red "IR" tile is hidden under the header.
- AFTER `screenshots-after/charities/1280.png` + `1440.png`: eyebrow visible, full H1
  cap-height clears the header, and the IR card (red tile) is fully visible.
- Mechanism (style.css:2365-2372): `.charity-hero` padding-top is now
  `clamp(132px, calc(11.2vw + 46px), 203px)`; `.brand img` gets `aspect-ratio:343/480;
  height:auto` (style.css:80-82) so the logo box (hence header height) is reserved
  before load — this also removes the CLS that produced the inconsistent
  `1280-purebot.png` baseline. Computed clearance: 1440 ≈ 203px top vs ~185px header
  (+18px); 1280 ≈ 189px vs ~171px (+18px). Matches the screenshots.
- Caveat (NOT a regression): at ≤768 the padding clamp floors at 132px, so 375/768 are
  pixel-identical to before by design (plan acceptance criteria explicitly preserves
  ≤768; CLAUDE.md hard-rule pixel-identity at 320/768). The small mobile cap-tuck that
  persists at 375 is pre-existing and unchanged — the finding's own "how to verify"
  gate is 1280/1440, both of which pass.

### coral-label-contrast-below-aa — FIXED (high, a11y)
- axe before (`runs/before/axe/charities.json`): `color-contrast` (serious) lists
  in-page targets `.partnership-section .eyebrow` and both `.partnership-list article
  span`. axe after (`runs/after/axe/charities.json`): those three in-page nodes are
  GONE; the remaining 10 color-contrast nodes are all `["iframe", …]` Tally nodes
  (third-party, explicitly scoped out by the finding).
- Mechanism: new `--coral-text:#bd4631` token (style.css:11) applied to `.eyebrow`
  (style.css:155) and the label spans (`.partner-logo span`/`.partnership-list span`
  style.css:2414, plus `.contact-options`, `.partner-grid`, `.team-grid`,
  `.volunteer-hero__badge`, `.work-hero__panel`). Measured contrast of #bd4631 ≈
  5.1:1 on #fff, 5.06:1 on #fffdf7, 4.8:1 on #fbf8ef — all ≥4.5:1. Dark-section
  eyebrows kept `--coral` (style.css:188-190) so nothing on dark green regressed.
- Visual: AFTER 1280/1440/768/375 show the labels darker brick-red (intended).

### head-metadata-canonical-og — FIXED (low, structure)
- Diff adds `<link rel="canonical">`, `og:*`, `twitter:card`, and inline
  `Organization` JSON-LD to the head (charities.html:8-17). Head-only; og:image points
  at a same-origin asset; JSON-LD is non-executed → no new request/domain (after
  console `[]`, SEO stays 100). Before/after screenshots pixel-identical in the body —
  render-neutral as required.

### iframe-title-mislabel — FIXED (low, content)
- Diff (charities.html:92): `title="PureStreets contact form"` →
  `"PureStreets charity partner form"`, matching the section's "Partner form" eyebrow
  (charities.html:87) and the footer/PureBot "Partner form" links. Non-visual
  (title attr) → screenshots unchanged; not read by script.js → no behavior change.

### purebot-panel-aria-hidden-focus — FIXED (high, a11y)
- axe before lists `aria-hidden-focus` (serious) on `.purebot-panel`; axe after no
  longer lists it (violationCount 2→1). Mechanism: `panel.inert = true` at
  `initPureBot()` (script.js:176) and `panel.inert = !isOpen` in `setOpen()`
  (script.js:261), set before `input.focus()`. flow-test F6 (index/policies/
  work-with-us, shared markup): `closedInert=true open=true focus=true msgs=3
  reClosedInert=true errs=0`. `1280-purebot` before/after panels are structurally
  identical (header, greeting, prompts, input/Send) — render-neutral.

### reduced-motion-incomplete — FIXED (med, a11y)
- Diff extends the single `@media (prefers-reduced-motion: reduce)` block
  (style.css:1535-1557): adds `html{scroll-behavior:auto}` and `transform:none` for
  `.button:hover`/`.purebot-toggle:hover`/`.team-contact:hover` plus
  `.purebot-panel{transition:none}`. Lives entirely inside the reduced-motion query →
  default-motion users unaffected (before/after screenshots identical). flow-test
  "F4 reduced-motion counters immediate" passes.

## Regression hunt (4 viewports + 2 states) — NONE found
- 1440 / 1280: only intended deltas (eyebrow now shown, H1/IR-card un-clipped, white
  contact iframe, darker coral labels, taller page). IR card clears header (+18px).
- 768 / 375: pixel-identical to before except the intended iframe bg (dark→white) and
  coral darkening; image heights unchanged.
- 375-nav-open: hamburger dropdown identical (same items, "Charities" active in green);
  only the intended iframe/coral deltas behind it.
- 1280-purebot: panel identical; greeting "i"→"I" is the intended T13 content change.
- Cross-checks: index-only `.hero`/`.hero__content` changes (align-items:safe end,
  >1281px transform) do NOT apply here — charities uses `.charity-hero` (grep:
  `class="hero"` = NONE). `.brand img` aspect-ratio reproduces the logo's existing
  rendered size (no distortion). No new axe violation, no new console error, no
  Lighthouse drop, no new network domain.
