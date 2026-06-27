# Review — contact.html (Phase 6 adversarial)

Reviewer verdict on the overhaul changes affecting `contact.html`. Evidence cites
the before/after screenshot pairs under
`docs/audit/screenshots[/-after]/contact/`, the axe before/after deltas, and
pixel measurements taken from the captured PNGs (stdlib decoder, no live page —
Chrome in this sandbox could not reach localhost or `file://`).

## Fixed findings — verdicts

### coral-label-contrast-below-aa — FIXED
- `--coral-text: #bd4631` added (style.css:11) and applied to `.contact-options
  span`, `.eyebrow`, etc. Measured contrast of `#bd4631` = **5.14:1 on #ffffff**,
  **5.07:1 on #fffdf7** — both ≥ 4.5:1.
- axe: before had `color-contrast` on `article:nth-child(1..3) > span` (the
  EMAIL/PARTNERSHIPS/SOCIALS labels); after `contact.json` has **no in-page
  `article>span` nodes** (only cross-origin iframe nodes remain).
- 375 row-diff bands at y737-746 / y963-973 / y1217-1227 (x≈24-118) are exactly
  the three label darkenings — the intended change, nothing else in those rows.
- Lighthouse a11y 90 → 100.

### purebot-panel-aria-hidden-focusable — FIXED
- `script.js`: `panel.inert = true` at init and `panel.inert = !isOpen` in
  `setOpen()` before `input.focus()`.
- axe: before listed `aria-hidden-focus` (serious) on `.purebot-panel`; **gone**
  in after `contact.json`.
- flow-test F6 (index/policies/work-with-us) all report `closedInert=true open=true
  focus=true reClosedInert=true errs=0`; counters/PureBot behavior intact.

### contact-form-iframe-dark-bg-contrast — FIXED (residual is cross-origin)
- `.tally-embed--contact iframe { background: var(--white) }` (style.css:2682),
  matching `.tally-embed--work`.
- Before 1440/375: form area is a flat dark-teal box; after: white surface
  (visible in `screenshots-after/contact/1440.png`, and the 375 row-diff band
  y1802-2581 / 768 band y1612-2331).
- Caveat: after axe still lists 9 `color-contrast` nodes, but **every target is
  inside the cross-origin Tally `iframe`** (the form's own text), which this repo
  cannot restyle beyond the iframe background. These match the sanctioned
  work-with-us treatment; Lighthouse a11y still scored 100. Not a site-controllable
  regression. The finding's "in-iframe nodes clear" verification bullet was
  over-optimistic (cross-origin), but the actionable fix is complete and correct.

### missing-canonical-and-og-meta — FIXED
- `<head>` now has canonical + og:type/url/title/description/image + twitter:card +
  JSON-LD Organization (contact.html:14-31). Head-only, render-neutral.
- Lighthouse SEO stayed 100; after console log is empty (no parse errors).

## Issues

### eyebrow-occluded-and-mobile-h1-clipped (INSUFFICIENT — hero-h1-eyebrow-clipped-by-fixed-header)
The H1 decapitation is fixed on desktop, but the finding is **not fully resolved**:

1. **"Contact us" eyebrow still occluded at 1280 & 1440** (fails the plan's own
   desktop acceptance: "eyebrow text AND full H1 cap-height render below
   .site-header").
   - 1440 after (pixel scan): header bottom **y=240** (clean column x=1415,
     251,248,239 → 241,240,233 at y=241); H1 "Speak to" cap-top **y=264** (24px
     clear, good); **0 eyebrow-coral pixels** anywhere in the hero text column
     (x[86,340], y[188,700]) although the coral detector correctly finds the card
     labels at y746-754. Tight 8× crop (`scratchpad/gap_after.png`) shows clean
     paper between the header shadow line and the H1 — no "Contact us".
   - Root cause: `--header-h: clamp(137px, 11.2vw+28, 185px)` (style.css:15) and
     the `.contact-hero` padding-top `clamp(136, 11.2vw+46, 203)` (style.css:1854)
     model the header as ≈185px, but the **rendered header is ≈240px** at 1440
     (before header bottom = 239, after = 240 — unchanged). `.contact-hero` is
     `align-items:center` with **no min-height**, so the eyebrow lands right at the
     header's bottom edge and is painted under the opaque (0.94) blurred header.
   - The eyebrow is so close to the edge it flips visible/occluded between
     captures: `1280-purebot.png` happens to show "CONTACT US", while the
     authoritative page-top `1280.png` and `1440.png` do not.

2. **H1 still clipped at 375 & 768** (mobile padding-top override `118px` at
   style.css:1948 was left unchanged; pages are byte-height-identical before/after
   — 375=3362, 768=2958).
   - 375 after crop (`scratchpad/m375a.png`): top of "Speak to" is cut by the
     header (same as before); 768 crop (`scratchpad/m768a.png`): H1 sits mostly
     behind the header. The 375 hero region shows **zero pixel diff** vs before,
     confirming the eyebrow color change is invisible there (it's occluded).
   - The plan deliberately scoped ≤768 to "stay pixel-identical," so this is a
     pre-existing condition, not a regression — but it means the finding (which
     cited 375/768 as clipped) is not fixed at mobile.

Net: desktop H1 fixed; eyebrow occluded at all four widths; mobile H1 still
clipped. Severity med (the prominent H1 decapitation is resolved on desktop; the
residual eyebrow is a small kicker, and mobile is pre-existing/scoped-out).

### header-2px-jitter-768 (NEW-REGRESSION? — low, likely capture noise)
- 768 row-diff flags the header interior (y83-193, big structured edge deltas,
  maxd=656) and the header-bottom line (y206-207). Measured: logo top 84→86,
  header bottom 206→208, hamburger center 178→179 (~1-2px down in after).
- BUT `logo.png` is exactly **343×480**, so the new `.brand img { aspect-ratio:
  343/480; height:auto }` (style.css:81-84) is mathematically a no-op, and **375
  (identical 78px logo) is pixel-stable** (no header diff at all). The asymmetry
  argues this is backdrop-filter(blur)/sub-pixel **capture nondeterminism** between
  the two runs, within the CLAUDE.md ≤2px tolerance — not a code regression.
  Flagged only for awareness because it coincides with the new `.brand img` rule.

## Not regressions (intended / verified)
- Darker coral labels, +67px (1440) / +53px (1280) hero top padding, white contact
  iframe, head metadata — all intended.
- PureBot greeting "how can i" → "how can I" (contact.html:165) — intended gated
  T13 copy fix; visible only with PureBot open (1280-purebot), correctness change,
  not a visual regression.
- `will-change` moved to `[data-reveal]:not(.is-visible)` and reduced-motion block
  — pixel-neutral at rest; reveals still fire (flow-test F5). 
- No new console errors (after/console/contact.json = []), no new axe violation
  types, Lighthouse perf 94→94 / a11y 90→100 / bp 100 / seo 100.
