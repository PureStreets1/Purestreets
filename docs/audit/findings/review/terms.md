# Review — terms.html (Phase 6, adversarial)

Reviewer verdict: **PASS**. All 6 fixed findings affecting this page are
genuinely fixed; no unintended regression at 375 / 768 / 1280 / 1440 or in the
nav-open and PureBot-open interactive states. Mechanical deltas corroborate:
axe `violationCount` 1 → 0, console-after empty, Lighthouse terms perf 93 → 93
(no drop), a11y 95 → 100, SEO 100.

## Fixed-finding verdicts

### eyebrow-coral-contrast-fail (T1) — FIXED
- `style.css` `.eyebrow` color `var(--coral)` → `var(--coral-text)` (new token
  `--coral-text: #bd4631`). The terms eyebrow is `.legal-page > .eyebrow` — not
  in `.hero`, `.impact-copy`, or `.kit-section`, so it correctly resolves to the
  darker token (the dark-section override and hero lime override don't apply).
- Computed WCAG contrast of `#bd4631`: **5.05:1 on `#fffdf7`** (the gradient's
  top stop where the eyebrow sits) and **4.84:1 on `#fbf8ef`** — both ≥4.5:1,
  up from the finding's measured 3.12–3.22:1.
- Visual: `screenshots-after/terms/1280.png` & `1440.png` show "PURESTREETS"
  rendered in a clearly darker coral; before/after at 768 shows the same label a
  shade darker. No `color-contrast` node in axe-after.

### h1-eyebrow-clipped-under-fixed-header (T3) — FIXED
- `.legal-page` block-start padding `136px` →
  `clamp(136px, calc(11.2vw + 46px), 203px)`. Header height ≈ `11.2vw + 28`
  (28px chrome + 78–112px brand × 1.40), so clearance = `46 − 28 = 18px`,
  constant across the fluid range; the 136px floor leaves 375/768 unchanged.
- Before vs after is decisive: `screenshots/terms/1440.png` shows NO eyebrow and
  the tops of "Terms &" sliced by the header; `1280.png` same. `screenshots-after/
  terms/1440.png` & `1280.png` show the eyebrow fully visible and the complete
  "Terms & conditions" H1 sitting below the header with ~18px clearance.
- 768/375 padding clamps to the 136px floor (`11.2vw+46 < 136` there) so those
  renders are unchanged — matches the finding's acceptance.

### head-missing-canonical-og-jsonld (T6) — FIXED
- `terms.html:8-29` adds `<link rel="canonical">`, `og:type/title/description/
  url/image`, `twitter:card`, and an inline `Organization` JSON-LD. All
  head-only and well-formed (console-after empty → JSON-LD parses without
  error). `og:image` and JSON-LD `logo` point at existing local assets; `sameAs`
  reuses the footer socials — no new origin. Render-neutral: every viewport's
  body is pixel-identical aside from the separately-tracked T1/T3/T8 changes.
  Lighthouse SEO stays 100.

### legal-copy-measure-too-wide (T8) — FIXED
- `.legal-copy` `max-width: 860px` → `62ch`. At 1440 the longest line ("This
  website shares PureStreets information, resources, event details, and") is
  ~72 characters — within the ≤75ch target (was ~100–115ch).
- Confirmed in `screenshots-after/terms/1440.png`, `1280.png`, and `768.png`
  (paragraphs now wrap to a narrower column; para 2 reflows 2→3 lines at 768).
  The 62ch measure does not bind at 375 (content ~330px < 62ch), so 375 wrapping
  is unchanged. The wider H1 vs narrower body column is the intended design (the
  finding kept `.legal-page h1` width separate).

### purebot-aria-hidden-focus (T2) — FIXED
- `script.js`: `panel.inert = true` at `initPureBot()` and `panel.inert = !isOpen`
  in `setOpen()` (before `input.focus()`), in lockstep with `aria-hidden`.
- axe-after `aria-hidden-focus` gone: terms `violationCount` 1 → 0, passes 18.
  `flow-test.json` F6 (inert+open+focus+3 msgs+re-close) passes on the shared
  PureBot, 0 errors. Render-neutral: `screenshots-after/terms/1280-purebot.png`
  shows the panel at identical position/size/styling with all controls intact.

### reduced-motion-coverage-partial (T5) — FIXED
- The single `@media (prefers-reduced-motion: reduce)` block is extended (not
  duplicated) with `html{scroll-behavior:auto}`, `.purebot-panel{transition:none}`,
  and `transform:none` on `.button:hover`/`.purebot-toggle:hover`/`.team-contact:hover`.
- `flow-test.json` confirms reduced-motion counters resolve immediately
  (`42+/18+/96+`). Render-neutral for the default (motion-allowed) capture —
  all terms screenshots are unaffected. (Note: terms itself has no same-page
  anchors and no `[data-reveal]`, so the scroll/reveal halves are no-ops here;
  the PureBot + hover suppression is the page-relevant part.)

## Regression hunt — none found

Checked all 4 viewports + nav-open + PureBot-open:
- 375 & 375-nav-open: pixel-identical except the darker eyebrow (T1). Padding
  floor and 62ch both no-ops at this width; dropdown menu unchanged.
- 768: only the intended darker eyebrow + narrower measure; header clearance
  preserved (logo at clamp floor).
- 1280 / 1440 + 1280-purebot: intended T1/T3/T8 only; PureBot panel renders
  identically.
- Global CSS that reaches this page is render-neutral here: `.brand img`
  `aspect-ratio:343/480; height:auto` reproduces the logo's exact rendered size
  (CLS-only); `[data-reveal]:not(.is-visible)` and `scroll-padding-top` have no
  target on terms.
- No new axe violation (1→0), no new console error (after = `[]`), no perf
  regression (93→93), no new network request/domain.

## Intended change noted (not a regression)
- PureBot greeting `…how can i help you?` → `…how can I help you?`
  (`terms.html:141`) is the gated T13 copy fix (finding
  `purebot-greeting-lowercase-i`), visible in `1280-purebot.png`. It is a
  finding-driven typo correction, not a degradation — flagged here only for
  transparency since it is a rendered copy change.
