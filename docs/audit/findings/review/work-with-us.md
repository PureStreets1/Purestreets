# Review — work-with-us.html (Phase 6, adversarial)

Reviewer verdict on the overhaul changes touching this page. Compared
`screenshots/` vs `screenshots-after/` at 375 / 768 / 1280 / 1440 + nav-open +
purebot, the `git diff main` for work-with-us.html / style.css / script.js, the
phase3 `status: fixed` findings, and the mechanical deltas (axe, console,
lighthouse, flow-test).

## Mechanical deltas (read)
- **axe**: before 2 violations (`aria-hidden-focus` ×1 on `.purebot-panel`;
  `color-contrast` 11 nodes incl. in-scope `.work-hero__panel > span`) →
  after 1 violation (`color-contrast` 10 nodes, **all** under the Tally `iframe`,
  out of scope). Both targeted in-scope violations removed; **no new** violation.
- **lighthouse** work-with-us: a11y **90 → 100**; perf 94 → 94; bp 100; seo 100.
- **console** after: `[]` (no errors/warnings).
- **flow-test**: F6 PureBot inert+flow on work-with-us = `closedInert=true open=true
  focus=true msgs=3 reClosedInert=true errs=0`; F4 reduced-motion counters pass.

---

## Per-finding verdicts

### coral-small-text-contrast (high, a11y) — FIXED
- Panel "TEAM AREAS" (`.work-hero__panel span`) recoloured from `--coral`
  (`#e6654f`, sampled ~(220,97,76), ~3.3:1 on white) to `--coral-text` `#bd4631`
  (sampled exactly (189,70,49) in after at 1440 y360; computed **5.11:1** on #fff,
  ≥4.5:1).
- axe in-scope node `.work-hero__panel > span` is **gone** (before list → after
  list has only `iframe`-prefixed Tally nodes). a11y 90→100.
- Note (not a defect): the two `.eyebrow`s ("Work with us", "Register interest")
  render in `--muted #607068`, not coral, in **both** before and after — because
  `.work-hero p` / `.work-form-section p` (specificity 0,1,1) override `.eyebrow`
  (0,1,0). The finding's "eyebrow is coral" sub-claim was inaccurate, but the
  axe-confirmed node (panel span) is the real violation and it is fixed.

### panel-word-breaks-mid-word (med, design) — FIXED
- Before: panel rendered "Environme"/"nt" (1280 & 1440). After: "Environment" is a
  single unbroken line above "Tech"/"Design" at **1280 and 1440** (verified in the
  full-page after shots + panel crops). `overflow-wrap:anywhere` removed; size
  reduced via `@media (min-width:921px) .work-hero__panel strong`.
- No horizontal overflow at 375/768 (single-column panel, word fits).

### purebot-aria-hidden-focusable (high, a11y) — FIXED
- `panel.inert = true` at init + `panel.inert = !isOpen` in `setOpen()`.
- axe `aria-hidden-focus` removed (1→0). flow-test F6 on this page passes incl.
  `reClosedInert=true` and `focus=true` (open still focuses input); console clean.
- Open panel renders correctly at 1280 (header, greeting, "Upcoming events" reply,
  5 quick prompts, input+Send) — inert does not break the open state.

### missing-canonical-og-meta (low, code) — FIXED
- Head now has `<link rel="canonical">`, `og:type/site_name/url/title/description/
  image`, `twitter:card`, and JSON-LD `Organization` (work-with-us.html:8-30).
  Render-neutral; SEO stays 100; no new external origin (og:image reuses existing
  asset URL, not fetched by the page).

### hero-h1-clipped-under-fixed-header (high, design) — INSUFFICIENT
- **Primary defect FIXED:** the sliced H1 first line is gone. "Bring your skills"
  renders **fully** below the header at 1280 and 1440 (before: top half sliced;
  after H1 cap-top at y≈272 vs header bottom ≈y238 at 1440 — fully clear). This is
  the high-severity break and it is resolved.
- **Acceptance not fully met (eyebrow):** the finding requires "the 'Work with us'
  eyebrow must be fully visible." The eyebrow (muted `#607068`) sits right at the
  header boundary and is **occluded at 1440** (gap between header and H1 is empty —
  muted-text scan x170-380 above H1 = NONE; visual crop empty), **mostly clipped at
  1280** (only glyph-tops peek out below the header), and only **fully visible in
  the 1280-purebot capture** (muted rows at y198-211). i.e. visibility is
  borderline/inconsistent, not reliably "fully visible" at the finding's primary
  width (1440).
- **No regression:** the eyebrow was hidden before the fix too, so nothing got
  worse; the residual is a minor, low-emphasis muted label. At ≤768 the hero
  padding is intentionally floored at 132px (unchanged), so the pre-existing minor
  H1-graze there is identical before/after (not in scope, not a regression).
- Verdict: insufficient (secondary acceptance unmet), **low** severity given the
  high-severity H1 clip is resolved and there is no regression.

---

## Global findings affecting this page's render
- **Reduced-motion (T5):** CSS added inside the existing `@media (prefers-reduced-
  motion)` block (`html{scroll-behavior:auto}`, `transform:none` for `.button`/
  `.purebot-toggle`/`.team-contact` hover, `.purebot-panel{transition:none}`).
  Additive, no default-state pixel change; flow F4 reduced-motion passes. OK.
- **will-change (T7.2):** moved to `[data-reveal]:not(.is-visible)`. Pixel-neutral;
  reveal still fires (F5). OK.
- **CLS logo (T7.3):** `.brand img{aspect-ratio:343/480;height:auto}`. logo.png is
  exactly 343×480 so it is size-neutral; **proven** by 375-nav-open before/after
  being byte-identical (0 changed px) — the fully-loaded logo is unchanged.

## New-regression hunt — investigated, BENIGN (not flagged)
- **Header logo + PureBot toggle vertical shift at 375/768 nav-closed** (≈6-11px;
  diff regions y54-187 & y782-853 at 375, mirrored at 768). Concluded **capture
  artifact, not a CSS regression**, because: (1) the PureBot toggle's `figure.png`
  received **zero** CSS changes yet also moved → the shift mechanism is full-page-
  screenshot fixed-element/image-load timing, not the diff; (2) 375-nav-open is
  byte-identical before/after; (3) logo.png is exactly 343:480 so `aspect-ratio` is
  mathematically neutral. The coral label recolour in those same diffs (375 y569,
  768 y458) is the intended change.
- **Tally iframe blank in 1280-purebot-after:** third-party iframe load-timing
  fluke (the plain 1280-after renders the iframe content fine). Out of scope, benign.
- **768 y1854 single 1px full-width row:** sub-pixel AA at a section edge; benign.

## Summary
4 of 5 page findings cleanly fixed (coral contrast, word-break, PureBot inert,
head metadata) with axe/lighthouse/flow corroboration and no new console or axe
violations. The hero-clip finding is **insufficient**: the high-severity sliced-H1
is fully resolved, but the muted "Work with us" eyebrow remains occluded (1440) /
clipped (1280) — borderline and unchanged from before, so low severity / no
regression. The header/toggle position shifts at 375-768 are full-page-screenshot
capture artifacts (figure.png moved despite no CSS change; nav-open byte-identical),
not degradations. No genuine new regression found.
