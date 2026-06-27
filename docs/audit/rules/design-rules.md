# Design Rules — PureStreets audit (visual-quality heuristics)

For the Phase 3 critics. These are **quality** heuristics — how to judge whether
the design is good — not behavior law (that is `coding-rules.md`) and not the
AI-slop tell list. **The slop tells live in `anti-slop-checklist.md`
(slop-researcher); do not duplicate them here — cross-reference by id.** Every
heuristic has a one-line **Why** with a citation. Critics cite evidence
(screenshot path, repo `style.css`/HTML line, or source URL) for each call.

PureStreets context: a faith-inspired grassroots community litter-picking
movement. Tone target = warm, earnest, human, local — not slick SaaS. Tokens of
record: `style.css:1-13` (`--ink #17201b`, `--green #276447`, `--paper #fbf8ef`,
`--lime #d8f35f`, `--gold`, `--coral`). Font of record: Manrope (`style.css:25`).

---

## 1. Visual hierarchy
- **D1** One unmistakable focal point per view; size, weight, color, and spacing
  should rank elements so the eye lands on the primary message then the primary
  action. Why: clear hierarchy is the core of legible UI
  (https://www.nngroup.com/articles/visual-hierarchy-ux-definition/).
- **D2** Primary vs secondary actions must be visually distinct (the repo has
  `button--primary` / `button--secondary` / `button--outline` / `button--dark`,
  `index.html:47-48`); never show two equal-weight "primary" buttons competing.
  Why: competing CTAs flatten hierarchy (https://www.nngroup.com/articles/visual-hierarchy-ux-definition/).
- **D3** Eyebrow → heading → body → action is a deliberate descending ladder
  (repo uses `.eyebrow` + `h2`, `index.html:60-64`); check each section actually
  steps down in emphasis rather than repeating one weight.

## 2. Modular type scale
- **D4** Type sizes follow ONE modular ratio (e.g. 1.2 minor-third / 1.25 / 1.333
  perfect-fourth), not arbitrary px. Why: a shared ratio creates visual harmony
  (https://www.bounteous.com/insights/2018/03/26/what-font-are-vertical-rhythm-and-modular-scale/).
  Detect: list every `font-size` in `style.css` and check the ratios between
  steps are consistent.
- **D5** Fluid type via `clamp()` should keep the SAME ratio across the min↔max
  range, and may legitimately widen the ratio on larger viewports (e.g. 1.25
  mobile → 1.333 tablet → 1.5 desktop). Why:
  https://timgraf.com/ui/responsive-typography-mastery-fluid-scaling-hierarchy-and-readability-strategies-for-multi-device-ux-ui-in-2026/.
  Repo already uses `clamp()` for headings/spacing (`style.css:56,72,130`).
- **D6** Body copy line length ~45-75 characters and line-height ~1.4-1.6 for
  paragraphs. Why: readability measure (https://www.nngroup.com/articles/legibility-readability-comprehension/).
  Detect: check `max-width`/`measure` on `.intro-copy`, `.hero__text`.

## 3. Spacing rhythm & vertical rhythm
- **D7** Spacing comes from a consistent scale (e.g. 4/8px base or a token set),
  not one-off pixel values. Why: a spacing system creates rhythm and reduces
  visual noise (https://imperavi.com/books/ui-typography/principles/vertical-rhythm/).
  Detect: audit `padding`/`margin`/`gap` values in `style.css` for a coherent set
  vs. scattered magic numbers.
- **D8** Vertical rhythm: related elements are grouped by tighter spacing and
  separated from unrelated blocks by larger spacing (proximity). Why: Gestalt
  proximity communicates grouping (https://www.nngroup.com/articles/gestalt-proximity/).
- **D9** Section padding scales fluidly but proportionally between viewports
  (repo uses `clamp()` section padding, `style.css:130`); flag sections that feel
  cramped at 1440 or bloated at 320.

## 4. Color usage & contrast
- **D10** Restrained, intentional palette: a dominant neutral (paper/ink), one
  brand green, and accents (lime/gold/coral) used sparingly for emphasis — accent
  colors should not compete for attention. Why: limited palettes read as
  considered, not noisy (https://www.nngroup.com/articles/color-enhance-design/).
  Palette tokens: `style.css:1-13`.
- **D11** All text meets WCAG AA contrast — ≥ 4.5:1 normal, ≥ 3:1 large
  (≥ 24px or ≥ 19px bold). Why: SC 1.4.3
  (https://www.digitala11y.com/understanding-sc-1-4-3-contrast-minimum/).
  Highest-risk spots: `--muted` text (`style.css:3`), white nav/hero text over
  imagery (`index.html:44-45`), lime-on-paper, gold-on-white. Critics must
  measure, not eyeball, and cite the ratio.
- **D12** Color is never the ONLY carrier of meaning (e.g. leader/active states
  also use weight/label, not just hue). Why: SC 1.4.1 Use of Color
  (https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html). Check
  `.is-leading` / `.is-active` (`style.css:88-99`).

## 5. Motion restraint
- **D13** Motion is purposeful and brief — ~150-400ms, easing-in, supporting
  comprehension (reveal, state change), never decoration for its own sake. Why:
  150-400ms is the perceptual sweet spot
  (https://blog.pope.tech/2025/12/08/design-accessible-animation-and-movement/).
  Repo motion: scroll reveals + staggered `--reveal-delay` (`mosques-isocs.html:40-46`),
  counter tick (`script.js:51-71`), `is-celebrating` (`script.js:399-402`).
- **D14** ALL non-essential motion has a `prefers-reduced-motion: reduce`
  fallback (currently MISSING repo-wide, `style.css:19-21`). Why: motion-sensitivity
  + WCAG 2.3.3 (https://www.w3.org/WAI/WCAG21/Techniques/css/C39). This is a
  design-quality AND accessibility defect — flag it.
- **D15** Avoid motion overload: many simultaneous staggered reveals can feel
  busy. Critique whether the stagger reads as elegant or as gratuitous
  (cross-ref `anti-slop-checklist.md` on predictable/over-animated entrances).

## 6. Responsive behaviour & tap targets
- **D16** Layout adapts meaningfully (reflow, not just shrink) at 320 / 768 /
  1024 / 1440. Why: these are the audit's capture widths
  (`decisions/orchestration/execution-topology.md`). Detect via the before/after
  screenshots under `docs/audit/runs/`.
- **D17** Touch targets ≥ 44×44px for primary controls (≥ 24×24px hard minimum,
  WCAG 2.2 SC 2.5.8). Why:
  https://tetralogical.com/blog/2022/12/20/foundations-target-size/. Highest-risk:
  the score `+`/`-` buttons (`mosques-isocs.html:177-179`), PureBot close `x`
  (`index.html:222`), nav links on mobile, the `.section-arrow` controls
  (`volunteer-month.html:51`).
- **D18** Adequate spacing between adjacent tap targets (≥ ~8-12px) so users
  don't mis-tap. Why: https://www.siteimprove.com/blog/motor-impairments-and-mobile-ui-the-touch-target-problem/.
  Check the clustered `+ value -` score controls and footer link lists.
- **D19** No horizontal scroll or clipped content at 320px; the mobile nav
  (`.nav-toggle`/`.is-open`, `style.css:101-121`) must be reachable and usable.

## 7. Photography & imagery
- **D20** Imagery is real, specific, and on-message (community/local/people),
  not generic stock filler. Why: authentic imagery builds grassroots trust
  (https://www.nngroup.com/articles/photos-as-web-content/). Repo assets:
  `hero-banner.jpg`, `figure.png`, `video-poster.jpg`, `sisters-southall.mp4`
  (`mosques-isocs.html:49`). Critique fit + quality, but **do not propose
  swapping which assets exist** without a verified finding (`/CLAUDE.md`).
- **D21** Images carry their aspect ratio (sized container or `aspect-ratio`) so
  they don't shift layout, and overlaid text keeps ≥ 4.5:1 contrast via a
  scrim/gradient (repo hero uses a gradient overlay + `.hero__shade`,
  `style.css:133-140`). Why: CLS + contrast
  (https://web.dev/articles/cls; SC 1.4.3).
- **D22** Decorative imagery is marked decorative (`alt=""` + `aria-hidden`),
  meaningful imagery has descriptive `alt`. Why: AT clarity
  (https://www.w3.org/WAI/tutorials/images/decision-tree/). Cross-check with
  `coding-rules.md` H5.

---

## How critics use this file
For each page and viewport, walk sections 1-7, cite the offending
`style.css`/HTML line or screenshot path, name the heuristic id (D-n), state the
quality gap, and give a fix direction. Where a problem is an AI-slop tell, cite
the matching `anti-slop-checklist.md` item instead of re-describing it. Any fix a
critic recommends becomes a finding in `docs/audit/findings/phase3/` (no finding
⇒ no change, per `/CLAUDE.md`).
