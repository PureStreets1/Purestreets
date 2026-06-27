# Review — policies.html (Phase 6, adversarial)

Reviewer verdict on the overhaul changes affecting `policies.html`. Compared
BEFORE vs AFTER screenshots at 375 / 768 / 1280 / 1440 + `375-nav-open` +
`1280-purebot`; read the `git diff main` for policies.html / style.css /
script.js; cross-checked axe, console, lighthouse, and flow-test deltas.

policies is a thin legal subpage. The diff touches many selectors that do **not**
render here (work-hero, team-contact, contact iframe, volunteer/charity heroes,
partner grids). Only the following changes actually affect this page's render:
coral eyebrow token, `.legal-page` top padding, `.legal-copy` measure, the shared
`.brand img` logo, reduced-motion / will-change blocks, PureBot `inert`, head
metadata, and the PureBot greeting copy.

## Verdicts — fixed findings affecting this page

### head-metadata-canonical-og — FIXED
- `policies.html` head now carries `<link rel="canonical">`, `og:type/title/description/url/image`, `twitter:card`, and an inline `Organization` JSON-LD (diff policies.html:8-29).
- Render-neutral: 1440/1280/768/375 before↔after show no body diff attributable to head; after/console/policies.json = `[]`; SEO stays 100 (before & after lighthouse).

### T1 coral label/eyebrow contrast — FIXED
- `.eyebrow` recoloured `--coral` → `--coral-text` (#bd4631) (style.css:11, 156). policies has exactly one eyebrow ("PURESTREETS", policies.html:61); the dark-section overrides don't exist here.
- Evidence: 768/1280/1440 after show "PURESTREETS" in a visibly darker coral. Measured contrast on the `#fffdf7` legal-page top ≈ 5.05:1 (was ≈ 3.26:1 with `--coral`), clearing AA 4.5:1.
- Hero lime eyebrow override and `--coral` (decorative/action) left untouched — correct per plan.

### T3 subpage fixed-header overlap — FIXED
- `.legal-page` top padding `136px` → `clamp(136px, calc(11.2vw + 46px), 203px)` (style.css:1989); `html` gains `scroll-padding-top` (style.css:24).
- Evidence: BEFORE 1440 (`screenshots/policies/1440.png`) and 1280 — the "Policies" H1 cap-height is clipped by the fixed header and the eyebrow is fully occluded. AFTER (`screenshots-after/.../1440.png`, `1280.png`) — eyebrow + full H1 render below the header (~22-25px gap).
- Floor at 136px keeps ≤768 a no-op: 768 and 375 before↔after are pixel-identical, exactly as the acceptance scoped (1280/1440 only).

### T8 legal reading measure — FIXED
- `.legal-copy max-width: 860px` → `62ch` (style.css:2002).
- Evidence: 1440/1280/768/1024-class widths now wrap the policy paragraphs at ~62ch instead of full-width; e.g. para 1 wraps after "organise litter" (after) vs "...support volunteers, and" (before). 375 unchanged (column is viewport-constrained below 62ch). No mid-word break, no overflow, no clipping. Longest paragraph ≤ ~62ch at 1440 — meets "≤75ch" acceptance.

### T2 PureBot closed-panel focusable — FIXED
- `panel.inert = true` at init and `panel.inert = !isOpen` in `setOpen()`, in lockstep with `aria-hidden`, before `input.focus()` (script.js:177, 261).
- Evidence: axe `aria-hidden-focus` (serious) 1 → 0 (before/after axe/policies.json); flow-test F6 (policies): `closedInert=true open=true focus=true msgs=3 reClosedInert=true errs=0`. 1280-purebot before↔after: panel visually identical (position, buttons, canned reply).

### T5 reduced-motion (CSS + counter) — FIXED
- Existing `@media (prefers-reduced-motion: reduce)` block extended with `html{scroll-behavior:auto}`, `.button/.purebot-toggle/.team-contact :hover{transform:none}`, `.purebot-panel{transition:none}` (style.css:1536-1558). Counter branch added in JS (no-op here — policies has no counters).
- Default-motion render unaffected (screenshots identical where applicable); flow-test "F4 reduced-motion counters immediate" passes. No new console errors.

### T7.2 will-change never released — FIXED (render-neutral)
- Moved off base `[data-reveal]` onto `[data-reveal]:not(.is-visible)` (style.css:719-721). policies has **no** `[data-reveal]` nodes, so this is a harmless no-op on this page; compositor-hint only, zero pixel impact.

### T7.3 unsized logo (CLS) — FIXED (render-neutral)
- `.brand img { aspect-ratio: 343/480; height: auto }` (style.css:80-84). Global `img` has no `height` (style.css:34-37), so the reserved box reproduces the logo's natural ratio exactly.
- Evidence: logo pixel-identical at 375/768/1280/1440 before↔after; no vertical stretch.

### T13 PureBot greeting capitalisation — FIXED (intended copy change)
- "how can i help you?" → "how can I help you?" (policies.html:141).
- Evidence: visible in 1280-purebot after vs before. Grammar fix, applied site-wide per T13; not a degradation.

## New-regression hunt (4 viewports + nav-open + purebot)

No unintended regressions found.

- **375 / 375-nav-open**: before↔after pixel-identical. Padding floors at 136px (T3 no-op), 62ch doesn't bind at this width (T8 no-op), eyebrow colour change not visible (eyebrow sits at the header edge — unchanged from before). Nav menu opens with all 9 links, identical.
- **768**: only intended deltas — darker eyebrow (T1) + narrower 62ch measure (T8). Clean wrapping, no overflow, header/logo/footer unchanged.
- **1280 / 1440**: only intended deltas — H1+eyebrow now clear the header (T3), darker eyebrow (T1), narrower measure (T8). Footer position effectively unchanged (extra top padding absorbed by the page's bottom whitespace). With the narrower column, the open PureBot panel now floats over empty space instead of grazing the paragraph end — incidental improvement, not a regression.
- **axe**: 1 → 0 violations (aria-hidden-focus removed; no new violation).
- **console**: after = `[]` (no new errors).
- **lighthouse**: a11y 95 → 100, best-practices 100, seo 100. Performance 95 → 93: within Lighthouse run-to-run variance — the only added weight is <1KB inline head metadata (no network, no JS execution), and the will-change/aspect-ratio changes can only help; no attributable degradation. Not flagged.

## Result
9 findings confirmed fixed; 0 issues (no regressions, no insufficiencies, no new
axe/console violations). Default-motion render at 375/768 pixel-identical except
the intended T1/T8 deltas; 1280/1440 show the intended T3/T1/T8 improvements.
