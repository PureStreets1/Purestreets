---
page: mosques-isocs.html
phase: phase6
agent: reviewer
verdict: all-fixed
confirmedFixed: 7
issues: 0
---

# Phase 6 review — mosques-isocs.html

Reviewed the overhaul diff (`git diff main -- mosques-isocs.html style.css script.js`)
against before/after screenshots at 375 / 768 / 1280 / 1440 plus interactive states
(nav-open, competition counter, PureBot), and the mechanical deltas (axe, console,
lighthouse, flow-test).

## Mechanical deltas (this page)
- **axe:** before 2 violations (`aria-hidden-focus` ×1 on `.purebot-panel`,
  `aria-prohibited-attr` ×2 on `.campaign-hero__video` + `.poster-scenes`) →
  **after 0 violations**, passes 25 → 26. No new violations.
- **console (after):** `[]` — no errors/warnings.
- **lighthouse:** perf **82 → 86**, a11y **93 → 100**, best-practices 100, seo 100.
  No regression.
- **flow-test:** 10/10 pass, incl. this page's F7 competition counter+shape+reset
  (`store={brothers:2,sisters:0} total=2 clearedAfterReset=true`), F6 PureBot
  inert+flow (shared markup, errs=0), F4 reduced-motion counters immediate.

## Fixed-finding verdicts

### coral-eyebrow-contrast — FIXED
- `style.css:11` adds `--coral-text:#bd4631`; `.eyebrow` (style.css:175) and the six
  label spans (incl. `.partner-grid span` style.css:810) switch `--coral`→`--coral-text`.
- Computed contrast of `#bd4631`: **4.85:1** on `#fbf8ef`, **5.14:1** on `#ffffff`,
  **5.03:1** on `#fffdf7` — all ≥4.5 AA (matches the finding's acceptance target).
- Dark-green-section eyebrows intentionally keep `--coral` via the new
  `.kit-section .eyebrow` override (style.css:189-192); verified `.kit-section`
  is `background:var(--green-dark)` (style.css:768) — darkening would *lower* its
  contrast (`#bd4631` on `#123c2b` = 2.40:1 vs `#e6654f` = 3.72:1). This matches the
  plan's documented carve-out ("dark-section eyebrows unchanged").
- a11y 93→100, 0 contrast violations; before/after pixel-identical at every visible
  label (hero eyebrow sampled (97,113,105) before vs (96,112,104) after = AA noise).
- Note (not a regression): several eyebrows the finding listed as coral are actually
  `--muted` via more-specific `.<section> p` rules — `.campaign-hero p` (781),
  `.competition-head p` (852), `.guide-copy p` (1474), `.isoc-partnership-section p`
  (2390) all set `--muted` and beat `.eyebrow` (0,1,1 > 0,1,0). The genuinely-coral
  element that the fix darkens on this page is `.partner-grid span`
  (Masjids/ISOCs/PureStreets), which is below-fold/unrevealed in the captures. The
  green-dark kit eyebrow ("Run it well") remains 3.72:1 — **unchanged**, deliberately
  scoped out; not a new degradation.

### div-aria-label-prohibited — FIXED
- `mosques-isocs.html:76` `.poster-scenes` gains `role="img"` (its `aria-label`
  becomes valid); `mosques-isocs.html:48` `.campaign-hero__video` loses the redundant
  `aria-label`. axe `aria-prohibited-attr` 2 → 0. Non-visual (screenshots identical).

### head-metadata-canonical-og — FIXED
- Head adds `<link rel=canonical>`, `og:type/url/title/description/image`,
  `twitter:card`, and inline JSON-LD `Organization` (mosques-isocs.html:14-23).
  Head-only, render-neutral; SEO stays 100; no new console error/request.

### purebot-aria-hidden-focusable — FIXED
- `script.js:177` `panel.inert = true` at init; `script.js:261` `panel.inert = !isOpen`
  in `setOpen()` (in lockstep with `aria-hidden`, before `input.focus()`). axe
  `aria-hidden-focus` 1 → 0. flow-test F6 closedInert=true/open=true/focus=true/
  reClosedInert=true/errs=0. PureBot panel renders identically (1280-purebot pair).

### purebot-greeting-lowercase-i — FIXED
- `mosques-isocs.html:337` "how can i help you?" → "how can I help you?" (gated copy,
  applied). Confined to one glyph; visible in the open-panel state.

### reduced-motion-smooth-scroll — FIXED
- `@media (prefers-reduced-motion: reduce)` now resets `html{scroll-behavior:auto}`
  (style.css:1536-1538) plus `.button/.purebot-toggle/.team-contact :hover{transform:none}`
  and `.purebot-panel{transition:none}`. flow-test F4 reduced-motion immediate passed.
  Default-motion at-rest layout unchanged (screenshots identical).

### will-change-never-released — FIXED
- `will-change:opacity,transform` moved off base `[data-reveal]` onto
  `[data-reveal]:not(.is-visible)` (style.css:719-722), so the hint drops when JS adds
  `.is-visible`. Compositor-only; perf 82→86; flow-test F5 reveal passed; pixel-neutral.

## New-regression hunt — NONE found
All four viewports + nav-open/competition/PureBot states reviewed.
- **1280 default:** whole-image row mean-abs-diff = 0.18 (≈identical); peak 16.9 on the
  H1 row = sub-pixel text antialiasing between the two capture runs.
- **375 default / nav-open:** all differing rows are **above y≈1857**; everything below
  is byte-identical ⇒ **no layout shift** (a shift would propagate to the page bottom).
  The diffs decompose into known capture artifacts: (a) the `position:fixed` site
  header stamped at a different scroll-y in the two full-page captures (y148-364);
  (b) the autoplay `<video>` showing a different frame (y664-1250, peak mad 124);
  (c) reveal-animation stagger + text antialiasing in the hero/poster. The nav menu
  (rows 0-586) is pixel-identical.
- **Hero/header:** `.campaign-hero` padding unchanged in the diff; hero + header render
  identically. The `.brand img{aspect-ratio:343/480;height:auto}` CLS reservation is
  pixel-neutral (global `img` sets no height, so logo size is unchanged).
- **Competition leaderboard:** renders correctly in after (current-leader banner, full
  table, TOTAL badges, Reset scores); UCL(2)/KCL(1)/Imperial(0)/Queen Mary(0) rows at
  identical absolute y. The PureBot/header overlay offset between runs is fixed-position
  capture behaviour, not a layout change.
- The expected intended changes (darker coral labels, role=img, inert, reduced-motion,
  will-change, head metadata, greeting capitalisation) are present and correct; none
  introduced a layout break, clip, overlap, new axe violation, console error, or perf
  drop.
