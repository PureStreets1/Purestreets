---
id: coral-small-text-contrast
phase: phase3
agent: critic
status: verified
severity: high
scope: a11y
evidence:
  - work-with-us.html:40
  - work-with-us.html:45
  - work-with-us.html:52
  - style.css:10
  - style.css:154-161
  - style.css:2580
  - style.css:2591-2596
  - docs/audit/runs/before/axe/work-with-us.json
source: internal
---

## Claim
The coral "TEAM AREAS" panel label (and the same coral `.eyebrow` token used for
"REGISTER INTEREST" / the hero eyebrow) does not meet the 4.5:1 minimum for small
text on its light background.
`docs/audit/runs/before/axe/work-with-us.json` reports `color-contrast`, impact
`serious`, with in-scope target `.work-hero__panel > span` (the remaining 10
nodes are inside the third-party Tally iframe and are out of scope).
`.work-hero__panel span` is `color: var(--coral); font-size: 0.78rem;
font-weight: 800` (`style.css:2591-2596`) over the panel's `background:
var(--white)` (`style.css:2580`). `--coral` `#e6654f` (`style.css:10`) on
`--white` `#ffffff` computes ~3.31:1 — below the 4.5:1 required for ~12.5px text.
The same failure applies to `.eyebrow` (`color: var(--coral); font-size: 0.76rem;
font-weight: 800`, `style.css:154-161`) used for "REGISTER INTEREST"
(`work-with-us.html:52`) and the hero eyebrow (`work-with-us.html:40`): coral on
`--paper` `#fbf8ef` computes ~3.12:1. By contrast `--muted` body copy computes
~5.1:1 and is correctly not flagged, confirming the issue is specific to the
coral-on-light small text.

## Why it matters
These labels are the section eyebrows that orient the user; failing SC 1.4.3
(design-rules D11; coding-rules A3) means low-vision users may not read them, and
it is the second of the two serious axe violations holding this page's a11y score
at 90. Both ratios were computed, not eyeballed, per design-rules D11.

## Recommended action
Use a darker coral (or a darker token) specifically where coral is small text on
light surfaces so the ratio reaches >= 4.5:1, or increase weight/size to qualify
as large text; verify the chosen value still meets AA. Keep the coral brand
accent intact for larger / decorative uses. The color value is not a JS / data-*
/ localStorage / copy / asset dependency, so the change is behavior-safe.

## How to verify it's fixed
Compute contrast of the new color against `#ffffff` and `#fbf8ef` (>= 4.5:1),
then re-run axe — `color-contrast` must drop the `.work-hero__panel > span` node
(remaining nodes are inside the Tally iframe and out of scope).

## Vote tally
failedToRefute: 3 / 3

- **Skeptic 1 (failed to refute):** Confirmed.
  runs/before/axe/work-with-us.json color-contrast (serious) explicitly targets
  ".work-hero__panel > span". Computed --coral #e6654f on --white #ffffff =
  3.31:1 (matches claim ~3.31), on --paper #fbf8ef = 3.12:1 (matches claim ~3.1);
  both < 4.5:1. Text is small: span 0.78rem (style.css:2593) weight 800; .eyebrow
  0.76rem (style.css:157) weight 800 = ~12px, below the 18.66px-bold large-text
  threshold, so 4.5:1 applies and fails. Cross-check: --muted body copy computes
  ~5.1:1 and is correctly NOT flagged, confirming the issue is coral-specific.
  Eyebrow extension is math-confirmed even though only the panel span appears in
  the axe node list. Real, fixable with a darker coral on light surfaces.
- **Skeptic 2 (failed to refute):** Real serious axe violation.
  work-with-us.json color-contrast lists in-scope node .work-hero__panel > span
  (the other 10 nodes are inside the Tally iframe = out of scope). Verified:
  --coral #e6654f on --white #ffffff ~3.31:1, below the 4.5:1 needed for the
  0.78rem/~12.5px weight-800 "TEAM AREAS" label (style.css:2591-2593 over
  background --white style.css:2580). The .eyebrow extension is also objectively
  failing (coral on --paper ~3.12:1, style.css:154-161). Fix is color-only
  (darker coral for small-text-on-light, or larger/bolder to qualify as large
  text); no JS/data-*/localStorage/copy/asset dependency on the color value, so
  behavior-safe.
- **Skeptic 3 (failed to refute):** axe-confirmed and math-confirmed for the
  primary target. docs/audit/runs/before/axe/work-with-us.json color-contrast
  (serious) explicitly targets .work-hero__panel > span. That span is --coral
  #e6654f, 0.78rem (~12.5px), weight 800 (style.css:2591-2596) on --white
  (style.css:2580); #e6654f-on-#ffffff computes 3.31:1, below the 4.5:1 needed for
  non-large text. Not large text (12.5px bold < 18.66px). The eyebrow-on-paper
  extension (~3.13:1) is not in the axe list, but the core panel-span failure
  alone makes the finding real and safe to fix via a darker token for small coral
  text.
