---
id: eyebrow-coral-contrast-fail
phase: phase3
agent: critic
status: fixed
severity: high
scope: a11y
evidence:
  - docs/audit/runs/before/axe/index.json
  - style.css:154-160
  - style.css:10
  - style.css:4
  - style.css:163-166
source: internal
---

## Claim
The section eyebrow labels (e.g. "Our Purpose", "Upcoming routes", "Community
impact", "Bring your intention") are coral `#e6654f` on paper `#fbf8ef` at
~12px / weight 800, measuring ~3.12:1 against the 4.5:1 required for small text.
`.eyebrow` sets `color: var(--coral)`, `font-size: 0.76rem` (~12px),
`font-weight: 800` (`style.css:154-160`); `--coral` is `#e6654f` (`style.css:10`)
and `--paper` is `#fbf8ef` (`style.css:4`), giving a computed contrast of 3.12:1
— well below the 4.5:1 floor for normal-size text (12px bold is NOT WCAG large
text). axe confirms it: `docs/audit/runs/before/axe/index.json` lists
`color-contrast` (serious, 11 nodes) with in-page targets
`.eyebrow.is-visible[data-reveal="down"]` and
`#pickups > .section__heading > .eyebrow`.

The hero eyebrow is overridden to lime on the dark hero (`style.css:163-166`) and
is not the failing case. The remaining `color-contrast` nodes and the separate
`link-name` axe violation sit inside the Tally iframe (third-party, not fixable
in this repo). Note: any fix must be scoped to on-paper eyebrows only — darkening
the `--coral` token itself would worsen the coral-on-dark-green eyebrow that
appears elsewhere.

## Why it matters
Eyebrows are the first word of each section's hierarchy ladder (design-rules D3);
below-AA contrast makes them hard to read for low-vision users and is a confirmed
serious axe violation that drags the page's accessibility score (91). This is a
measured defect per coding-rules A3 / design-rules D11 (WCAG SC 1.4.3), not
subjective taste.

## Recommended action
Raise the eyebrow text color on paper to >=4.5:1 (darken the coral while keeping
the warm hue, or use `--green` `#276447` for on-paper eyebrows); leave the hero
lime-on-dark eyebrow untouched. Scope the change to on-paper eyebrows so the
dark-section eyebrow is not regressed. No JS reads eyebrow color, so the change
is behavior-neutral; it touches no `data-*` hook, localStorage, copy, or asset.

## How to verify it's fixed
Re-run axe; the `.eyebrow` nodes drop out of `color-contrast`; verify the chosen
color measures >=4.5:1 on `#fbf8ef` in a contrast checker; confirm only the
eyebrow color changed and the hero/dark-section eyebrows are unaffected.

## Vote tally
failedToRefute: 3 / 3

- **Skeptic 1 (failed to refute):** Confirmed. .eyebrow color var(--coral)=#e6654f
  (style.css:156,10), 0.76rem=12.16px, weight 800 (157-158) on --paper #fbf8ef
  (4). Computed luminance contrast = 3.12:1 (matches claim) < 4.5:1 required for
  small bold text (12px bold is NOT WCAG large text). axe/index.json
  color-contrast (serious) explicitly lists '.eyebrow.is-visible[data-reveal="down"]'
  and '#pickups > .section__heading > .eyebrow'. Hero eyebrow correctly noted as
  lime-override (163-166) and remaining nodes correctly attributed to the Tally
  iframe. One imprecise example: "Community impact" sits on the dark-green
  .impact-section (no eyebrow override exists, so coral-on-dark-green ~3.72:1),
  not paper — but the other three examples and both axe-listed selectors are
  genuinely coral-on-paper at 3.12:1. Finding stands; fix must scope to on-paper
  eyebrows (darkening the token would worsen the dark-section eyebrow).
- **Skeptic 2 (failed to refute):** Confirmed serious axe violation:
  docs/audit/runs/before/axe/index.json color-contrast targets
  '.eyebrow.is-visible[data-reveal="down"]' and
  '#pickups > .section__heading > .eyebrow'. Computed coral --coral #e6654f
  (style.css:10) on --paper #fbf8ef (style.css:4) = 3.12:1, below the 4.5:1
  required for .eyebrow text (style.css:154-160: 0.76rem/weight 800 — not
  large-text exempt). Fix is a scoped eyebrow color change; no JS reads eyebrow
  color, so it is behavior-neutral and is the finding itself.
- **Skeptic 3 (failed to refute):** Confirmed axe 'color-contrast' serious
  violation in before/axe/index.json with explicit eyebrow targets
  ('.eyebrow.is-visible[data-reveal="down"]', '#pickups > .section__heading >
  .eyebrow'). Verified the math: --coral #e6654f (style.css:10) on --paper
  #fbf8ef (style.css:4) computes to 3.12:1, below the 4.5:1 required for small
  text (.eyebrow is 0.76rem ~12px weight 800, style.css:154-161 — not WCAG large
  text, so 4.5:1 applies). Hero eyebrow correctly overridden to lime
  (style.css:163-166) and excluded. Real, measurable a11y defect per coding-rules
  A3 / design-rules D11; the color change is scoped to the finding itself. Not
  slop/taste.
