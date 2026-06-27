# Rejected candidates — policies.html (phase3 critic)

Candidates handed to this writer under the orchestrator's **REJECTED** bucket
(VERIFIED count for policies.html = 0). Each block records the candidate's
tally (`failedToRefute / total`) and the skeptics' reasons, per the requested
schema.

> **Disposition anomaly (flagged for the orchestrator).** Five of the eight
> candidates below carry `failedToRefute 1 / 1` — i.e. the single skeptic
> **failed to refute** them (`refuted: false`) — yet they were delivered in the
> REJECTED bucket with VERIFIED = 0. By the charities.html convention ("a
> candidate is verified only when it fails to be refuted by a majority of
> skeptics"), an unrefuted 1/1 tally clears the bar, and these five mirror
> findings that ARE written as **verified** on charities.html
> (`docs/audit/findings/phase3/charities/`):
> `h1-eyebrow-occluded-by-fixed-header` ~ `charity-hero-header-overlap`,
> `purebot-panel-aria-hidden-focusable` ~ `purebot-panel-aria-hidden-focus`,
> `eyebrow-coral-contrast-fail` ~ `coral-label-contrast-below-aa`,
> `partial-reduced-motion-coverage` ~ `reduced-motion-incomplete`,
> `missing-canonical-and-og` ~ `head-metadata-canonical-og`. They are persisted
> here as instructed (REJECTED bucket, VERIFIED = 0), but the orchestrator
> should confirm whether these five belong in `policies/<id>.md` as verified.
> The three genuinely refuted candidates (`failedToRefute 0 / 1`) are
> `bespoke-per-page-type-scale`, `sparse-desktop-legal-layout`,
> `footer-mobile-tap-targets`.

---

## h1-eyebrow-occluded-by-fixed-header (REJECTED — per bucket; tally NOT refuted)
**Severity:** high · **Scope:** design · **Tally:** failedToRefute 1 / 1
(skeptic did NOT refute)

**Claim:** The `.eyebrow` ("PureStreets") and the top of the `<h1>` "Policies"
(`policies.html:38-40`) are overlapped by the `position:fixed` header at
>=~1000px and at 375px, but render with correct clearance at 768px. Root cause:
`.legal-page` uses a fixed `padding-top:136px` (`style.css:1944`) while the
header height is driven by the logo width `clamp(78px,8vw,112px)`
(`style.css:72`) and so grows past 136px on wide viewports.

- **Skeptic 1 (failed to refute):** Real layout bug, screenshot- and
  math-confirmed; not taste. Header is `position:fixed` (`style.css:47`) with
  height = padding + logo img height; logo `.brand` width is
  `clamp(78px,8vw,112px)` (`style.css:72`) and `logo.png` is 343x480
  (h/w=1.40), so header height grows from ~137px at <=975px viewports to ~185px
  at 1440, against `.legal-page` fixed `padding-top:136px` (`style.css:1944`).
  Computed overlap +6.6px@1024, +35px@1280, +48.7px@1440. `1440.png` and
  `1280-purebot.png` show the H1 cap-tops clipped and the eyebrow hidden, while
  `768.png` renders both with clearance — a genuine responsive defect
  (`.subpage .site-header` at `style.css:675` only changes colour, not height).
  Fix (scale legal top padding to header height) is sound.

**Disposition:** Not refuted (1/1). Recorded under REJECTED per the orchestrator
bucket; see top-of-file anomaly note — mirrors `charity-hero-header-overlap`
(verified on charities.html).

---

## purebot-panel-aria-hidden-focusable (REJECTED — per bucket; tally NOT refuted)
**Severity:** high · **Scope:** a11y · **Tally:** failedToRefute 1 / 1
(skeptic did NOT refute)

**Claim:** The closed PureBot panel is hidden only via `opacity:0` +
`pointer-events:none` + `transform` (`style.css:1600-1618`), not
`display:none`/`visibility:hidden`, so it stays rendered while carrying
`aria-hidden="true"` (`policies.html:110`). Its quick-prompt buttons, two Tally
links, the text input and Send button (`policies.html:122-131`) remain in the
keyboard tab order. axe reports `aria-hidden-focus` (serious) on
`.purebot-panel`.

- **Skeptic 1 (failed to refute):** Confirmed by the page's own axe run:
  `docs/audit/runs/before/axe/policies.json` reports the single violation
  `aria-hidden-focus`, impact serious, target `.purebot-panel`. Panel carries
  `aria-hidden=true` (`policies.html:110`) but is hidden only via `opacity:0` +
  `pointer-events:none` + `transform` (`style.css:1613-1617`), neither of which
  removes its buttons/links/input (`policies.html:122-131`) from the tab order.
  Real WCAG 4.1.2 failure; the proposed `inert` (or `visibility:hidden`) fix is
  render-neutral and touches no localStorage / data-* contract. Not a taste call.

**Disposition:** Not refuted (1/1), and corroborated by the page's own axe JSON
(the ONLY violation on the page). Recorded under REJECTED per the orchestrator
bucket; mirrors `purebot-panel-aria-hidden-focus` (verified on charities.html).
Strong candidate for re-classification to verified.

---

## eyebrow-coral-contrast-fail (REJECTED — per bucket; tally NOT refuted)
**Severity:** med · **Scope:** a11y · **Tally:** failedToRefute 1 / 1
(skeptic did NOT refute)

**Claim:** The `.eyebrow` uses `color:var(--coral)` `#e6654f` at `0.76rem`
(~12px) weight 800 (`style.css:154-161`) over the `.legal-page` paper gradient
(`style.css:1945`). Measured contrast 3.12:1 on `--paper` `#fbf8ef` / 3.26:1 on
the `#fffdf7` gradient top — both below the 4.5:1 needed for non-large text
(12px bold is not WCAG "large"), failing SC 1.4.3. `policies.html:39`.

- **Skeptic 1 (failed to refute):** Measured, not eyeballed. Independently
  recomputed WCAG contrast of `--coral` `#e6654f` (`style.css:10`) on `--paper`
  `#fbf8ef` (`style.css:4`) = 3.12:1, and on gradient top `#fffdf7`
  (`style.css:1945`) = 3.26:1 — both < 4.5:1. Eyebrow is 0.76rem (~12.2px)
  weight 800 (`style.css:154-161`), below the WCAG large-text floor (18.66px
  bold), so 4.5:1 applies and the label fails SC 1.4.3. The "PureStreets"
  eyebrow (`policies.html:39`) is meaningful text, not decorative. Real a11y
  defect; fix scoped to `.eyebrow`, not the global token.

**Disposition:** Not refuted (1/1). Recorded under REJECTED per the orchestrator
bucket; mirrors `coral-label-contrast-below-aa` (verified on charities.html).

---

## bespoke-per-page-type-scale (REJECTED — refuted)
**Severity:** med · **Scope:** design · **Tally:** failedToRefute 0 / 1
(refuted by the skeptic)

**Claim:** The legal page re-defines heading sizes instead of reusing one scale
— `.legal-page h1` `clamp(3rem,7vw,7rem)` (`style.css:1951`) overriding global
h1 `clamp(3rem,8vw,7.8rem)` (`style.css:205`), and `.legal-copy h2`
`clamp(1.5rem,3vw,2.5rem)` (`style.css:1965`) overriding global h2
(`style.css:211`) — bespoke per-page steps with no single modular ratio
(anti-slop #10).

- **Skeptic 1 (refuted):** Subjective / architectural, not a defensible visual
  defect. Invokes anti-slop #10 which is `[CONDITIONAL]` and requires the
  justification test (>=2 co-occurring tells, OR uniform-no-hierarchy, OR no
  rationale) — none met: the legal page shows a clear descending ladder
  H1(112px) > H2(40px) > body(16px) (`style.css:1951,1965`), the opposite of
  "bigger text = header" with no hierarchy, and a calmer heading scale for a
  text-heavy legal page is a plausible rationale, not slop. Decisively, the
  candidate's own fix is explicitly render-neutral ("reproduce today's rendered
  px... a token refactor, not a resize") — no user-visible problem, only a
  CSS-organization preference. anti-slop-checklist warns: "Do not strip
  intentional craft just because it pattern-matches a tell."

---

## sparse-desktop-legal-layout (REJECTED — refuted)
**Severity:** med · **Scope:** design · **Tally:** failedToRefute 0 / 1
(refuted by the skeptic)

**Claim:** At 1280-1440 the legal content sits in a left column (h1 max-width
900px, `.legal-copy` max-width 860px, left-aligned) leaving the right ~40% of
the canvas blank, reading as unfinished (D1/D9); and `.legal-copy` mixes two
spacing mechanisms — `display:grid;gap:22px` (`style.css:1954-1956`) plus
`.legal-copy h2 margin:26px 0 0` (`style.css:1962-1963`) — an ad-hoc rhythm
(D7).

- **Skeptic 1 (refuted):** Taste call on both prongs. (1) An ~860px
  left-aligned measure with whitespace to the right (`style.css:1949,1957`) is
  standard, intentional typography for a thin legal page; the candidate concedes
  "860px measure is good for readability." Empty canvas is not a defect, and the
  suggested remedy (centre the measure) would push toward centered long-form
  text, which anti-slop #12 flags as a HARD fail. (2) The "dual spacing" claim
  is backwards: grid `gap:22px` (`style.css:1956`) + h2 `margin-top:26px`
  (`style.css:1963`) yields MORE space before each H2 (~48px, separating
  sections) and LESS after (22px, binding the H2 to its paragraph) — textbook
  proximity grouping per design-rules D8, a feature not a flaw. Candidate
  self-labels it "a design call... coordinate with the design owner" — an
  admitted judgment call without a concrete defect.

---

## footer-mobile-tap-targets (REJECTED — refuted)
**Severity:** med · **Scope:** a11y · **Tally:** failedToRefute 0 / 1
(refuted by the skeptic)

**Claim:** Footer text links (`.footer-column a`, no padding, `width:fit-content`,
0.94rem, grid `gap:10px`, `style.css:2006-2024`) give a ~18px-tall hit box, and
the 28x28px social links (`style.css:2115-2117`, `gap:8px 14px`
`style.css:2051`) sit below 44px — short of the comfortable touch target on
mobile (A1 / D17 / D18).

- **Skeptic 1 (refuted):** Meets WCAG 2.2 AA; the claim conflates the AAA
  aspiration with a violation. Footer text links are ~15px font * normal
  line-height (~20px box) with grid `gap:10px` (`style.css:2009,2023`), giving
  ~30px center-to-center; SC 2.5.8 (AA) has an explicit Spacing exception —
  24px-diameter circles centered on each undersized target do not intersect when
  centers are >24px apart, so the links conform (holds even at line-height 1.0:
  ~25px centers). Social icons are 28x28px (`style.css:2116-2117`), already >=
  the 24px AA floor. 44px is the AAA / SC 2.5.5 enhanced target, and coding-rules
  A1 only asks 44px for "primary touch controls" (footer is secondary nav). The
  proposed padding / min-height fix would change rendered footer height/spacing
  for a non-violation.

---

## partial-reduced-motion-coverage (REJECTED — per bucket; tally NOT refuted)
**Severity:** low · **Scope:** a11y · **Tally:** failedToRefute 1 / 1
(skeptic did NOT refute)

**Claim:** Reduced-motion is only partly honored: the `@media
(prefers-reduced-motion: reduce)` block (`style.css:1504-1513`) covers
`.subpage main` / `[data-reveal]` / `.guide-copy` only, while
`html{scroll-behavior:smooth}` (`style.css:20`), the PureBot panel transition
(`style.css:1617`) and the `.site-header` transition (`style.css:58`) stay
ungated — so reduced-motion users still get smooth scroll and panel motion
(C7 / D14 / A5, SC 2.3.3).

- **Skeptic 1 (failed to refute):** Genuine, rule-backed gap. coding-rules C7
  explicitly requires reduced motion to "neutralize scroll-behavior: smooth,
  transitions, reveals", but `html{scroll-behavior:smooth}` (`style.css:20`) is
  ungated and absent from the `@media (prefers-reduced-motion: reduce)` block
  (`style.css:1504-1513`), which only covers `.subpage main` / `[data-reveal]` /
  `.guide-copy`. The PureBot panel transition translateY+scale
  (`style.css:1614-1617`) is genuine vestibular motion and is also ungated. Fix
  only adds rules inside the reduced-motion media query, so default rendering is
  byte-identical; safe and required by C7 / A5 / D14.

**Disposition:** Not refuted (1/1). Recorded under REJECTED per the orchestrator
bucket; mirrors `reduced-motion-incomplete` (verified on charities.html).

---

## missing-canonical-and-og (REJECTED — per bucket; tally NOT refuted)
**Severity:** low · **Scope:** structure · **Tally:** failedToRefute 1 / 1
(skeptic did NOT refute)

**Claim:** The `<head>` has a unique title + meta description
(`policies.html:6-7`) but no self-referential `<link rel="canonical">` and no
Open Graph / Twitter Card tags (`policies.html:3-13`). Lighthouse SEO is 100, so
this is preventative — render-neutral, head-only additions (coding-rules
S2 / S3).

- **Skeptic 1 (failed to refute):** Rule-specified, not taste. `policies.html`
  head (lines 3-13) has title/description but no `rel=canonical` and no Open
  Graph / Twitter tags — directly addressed by coding-rules S2 (self-referential
  canonical) and S3 (OG + twitter:card), both described there as "head-only,
  render-neutral". Additions are invisible (no DOM/visual change) and add no
  page-load network request or new external domain (`og:image` can reuse the
  existing favicon/asset), so they pass the verification gate. Low severity /
  preventative but a legitimate structural finding, not slop or subjectivity.
  (Only caveat: canonical / `og:url` need the production absolute URL — an
  implementation detail, not grounds to refute.)

**Disposition:** Not refuted (1/1). Recorded under REJECTED per the orchestrator
bucket; mirrors `head-metadata-canonical-og` (verified on charities.html).
