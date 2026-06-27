---
id: coral-eyebrow-contrast
phase: phase3
agent: critic
status: fixed
severity: high
scope: a11y
evidence:
  - style.css:10
  - style.css:154-160
  - style.css:776-783
  - style.css:739
  - mosques-isocs.html:40
  - mosques-isocs.html:102
  - mosques-isocs.html:115
  - mosques-isocs.html:150
  - mosques-isocs.html:247
source: internal
---

## Claim
The coral (`--coral #e6654f`) used for all `.eyebrow` labels and the
`.partner-grid` role labels is ~3.1–3.7:1 against this page's backgrounds — below
the 4.5:1 WCAG AA minimum for the ~12px bold text it styles.

- `style.css:10` — `--coral: #e6654f`.
- `style.css:154-160` — `.eyebrow { color: var(--coral); font-size: 0.76rem;
  font-weight: 800 }` (~12px, NOT WCAG "large text"). Only override is
  `.hero .eyebrow` → lime (style.css:163-165); no kit-section override exists, so
  every eyebrow on this page renders coral.
- `style.css:776-783` — `.partner-grid span { color: var(--coral);
  font-size: 0.78rem; font-weight: 800 }`.
- Independently computed (WCAG formula): `#e6654f` on `--paper #fbf8ef` = **3.12:1**
  (hero/guide/competition/partnership/kit eyebrows: mosques-isocs.html:40, 102,
  133, 150, 247); on `--white #fff` = **3.31:1** (`.partner-grid` span labels
  Masjids/ISOCs/PureStreets: mosques-isocs.html:115, 120, 125); on the hero
  gradient top `#fffdf7` = **3.26:1**; on `--green-dark #123c2b` = **3.71:1**.
  All < 4.5:1.
- Not in the axe violation list because the hero background is a `linear-gradient`
  (`style.css:739`) and axe marks contrast over gradients/non-body backgrounds as
  `incomplete`, not `violation` — so this passes unnoticed without manual
  measurement.

## Why it matters
WCAG 2.2 SC 1.4.3 (design-rule D11, coding-rule A3): 0.76rem/800 is normal-size
text (not ≥18.66px bold), so the 4.5:1 threshold applies. These eyebrows are the
descending-ladder cue (design-rule D3) on every section, so low-vision users miss
the section framing. axe under-reports it, so it would ship unnoticed.

## Recommended action
This conflicts with the visual overhaul's token reuse and recolors a shared brand
token (`--coral` is also used at style.css:338, 341, 779, 1852+), so flag for
design sign-off rather than a silent edit. Either darken the small-text coral to a
shade ≥4.5:1 on paper/white (e.g. a deeper terracotta) OR reserve coral for
large/non-text accents and recolor the eyebrow token. Do not change copy or which
elements exist. Propose-only.

## How to verify it's fixed
Recompute the three pairings (paper, white, green-dark) in a contrast checker
after any token change; target ≥4.5:1. Before/after screenshot diff at 1440/375
to confirm only the intended hue shift, per CLAUDE.md verification gate.

## Vote tally
failedToRefute: 3 / 3

- **Skeptic 1 (not refuted):** Contrast numbers verified by computation: coral
  #e6654f (style.css:10) on paper #fbf8ef = 3.12:1, on white = 3.31:1, on
  green-dark #123c2b = 3.71:1, on hero-top #fffdf7 = 3.26:1 — all < 4.5:1, matching
  the candidate's ~3.1/3.3/3.7. .eyebrow is 0.76rem(~12px)/weight800
  (style.css:154-160) and .partner-grid span 0.78rem/800 (style.css:776-783) —
  normal-size text (not >=18.66px bold), so 4.5:1 applies (coding-rule A3 /
  design-rule D11). No eyebrow color override exists in kit-section (grep shows
  only .eyebrow + .hero .eyebrow), so the green-dark pairing is real. axe lists no
  contrast violation (only 2 violations), consistent with axe marking
  contrast-over-gradient as `incomplete`. Correctly scoped as propose-only/design
  sign-off per CLAUDE.md. A genuine WCAG 1.4.3 AA failure.
- **Skeptic 2 (not refuted):** Premise is correctly MEASURED, not a behavior
  misread: #e6654f on --paper #fbf8ef recomputes to ~3.12:1, on #fff ~3.3:1, on
  --green-dark ~3.7:1 — all < 4.5:1 for 0.76rem/800 (~12px, not WCAG 'large') text
  at style.css:154-160,776-783. Real SC 1.4.3 fail that axe under-reports because
  the hero bg is a gradient (style.css:739). Recoloring touches no
  JS flow/data-hook/localStorage/copy/asset, so it is behavior-safe; candidate
  correctly scopes it propose-only/design-signoff given --coral is a shared token
  (style.css:156,338,341,779,1852+). Valid under D11/A3; no behavior-regression
  grounds to refute.
- **Skeptic 3 (not refuted):** Verified by independent computation, not eyeball.
  --coral #e6654f (style.css:10) on .eyebrow at 0.76rem/800 (style.css:154-160) and
  .partner-grid span 0.78rem/800 (style.css:776-783). Recomputed ratios: vs --paper
  #fbf8ef = 3.12:1, vs #fff = 3.31:1, vs --green-dark #123c2b = 3.72:1 — all below
  the 4.5:1 AA minimum; 12px bold is NOT 'large text' (needs >=18.66px bold).
  Matches design-rule D11 / coding-rule A3 which demand measured contrast. axe
  under-reports because hero bg is a gradient (style.css:739) -> 'incomplete'.
  Candidate correctly scopes it propose-only for design sign-off. Not a taste call;
  a measured AA failure.
