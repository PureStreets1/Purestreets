---
id: coral-label-contrast-below-aa
phase: phase3
agent: critic
status: verified
severity: high
scope: a11y
evidence:
  - docs/audit/runs/before/axe/charities.json
  - style.css:10
  - style.css:154-160
  - style.css:2366-2372
  - style.css:2435-2436
  - style.css:2455-2461
  - charities.html:58
  - charities.html:64
  - charities.html:69
source: internal
---

## Claim
The uppercase eyebrow and partner labels use `--coral` (#e6654f,
`style.css:10`) at small sizes: `.eyebrow` is `0.76rem` weight 800
(`style.css:154-160`) and `.partnership-list span` is `0.78rem` uppercase
(`style.css:2366-2372`). Measured contrast is ~3.31:1 on the white
`.partnership-section` background (`style.css:2435-2436`) and ~3.27:1 on the
`#fffdf7` article background (`style.css:2455-2461`) — below the 4.5:1 WCAG AA
threshold for normal-size text (these labels are ~12-12.5px, well under the
18.66px bold large-text exemption). axe confirms it:
`docs/audit/runs/before/axe/charities.json` lists `color-contrast` (serious)
with in-page targets `.partnership-section .eyebrow`
(`charities.html:58`) and both `.partnership-list article span`
(`charities.html:64`, `charities.html:69`). The remaining color-contrast nodes
in the same axe entry live inside the Tally iframe (`.sc-... .tally-text`) and
are third-party / out of scope.

## Why it matters
These labels ("PREVIOUS PARTNERSHIPS", "ISLAMIC RELIEF", "COMMUNITY PARTNER")
carry section meaning but are hard to read for low-vision users at ~3.3:1
(coding-rules A3 / design-rules D11, SC 1.4.3). The inspiration note on Surfers
Against Sewage also flags that coral should be used "only for action", not as
body-label text.

## Recommended action
Raise contrast for these small labels to >=4.5:1 — darken the label coral or
switch them to `--green`/`--ink` — or promote them to large-text size/weight;
reserve coral for genuine accents. This touches only the label color/role
(no JS, data-* hook, localStorage, copy, or asset). Note: the other
color-contrast nodes in the same axe entry are inside the Tally iframe and
cannot be fixed without dropping the third-party embed.

## How to verify it's fixed
Re-run axe and confirm the `color-contrast` node count drops to only the
Tally-iframe nodes. In DevTools, sample the computed label color vs its
background and confirm >=4.5:1 for the eyebrow and both partner spans.

## Vote tally
failedToRefute: 3 / 3

- **Skeptic 1 (failed to refute):** axe-confirmed + math-verified.
  charities.json color-contrast targets include .partnership-section .eyebrow
  and both .partnership-list article span. --coral=#e6654f (style.css:10).
  Computed luminance gives 3.31:1 on #ffffff (.partnership-section bg,
  style.css:2436) and ~3.29:1 on #fffdf7 (article bg, style.css:2461) — below
  4.5:1. Sizes 0.76rem (style.css:157) and 0.78rem weight 800 (style.css:2369)
  are normal-size text (~12px, not large), so 4.5:1 applies. Candidate
  correctly scopes out the Tally-iframe nodes. Minor citation slip (token is
  line 10 not 9) does not affect the value. Real AA failure.
- **Skeptic 2 (failed to refute):** axe before/charities.json flags
  color-contrast (serious) on .partnership-section .eyebrow and both
  .partnership-list article spans. --coral #e6654f (style.css:10) on white
  (.partnership-section bg style.css:2436) and on #fffdf7 (article bg 2461)
  computes ~3.31:1 / ~3.27:1, below the 4.5:1 AA threshold for these
  0.76-0.78rem (style.css:157,2369) bold-but-small labels (12-12.5px < 18.66px
  large-bold exemption). Recoloring/scoping these specific labels touches no
  JS/data/localStorage/copy/asset and is behaviorally safe. Candidate correctly
  excludes the Tally iframe nodes as third-party. Real, measured defect
  (coding-rules A3, design D11).
- **Skeptic 3 (failed to refute):** REAL, measured, tool-confirmed. axe
  charities.json flags color-contrast (serious) with the three in-page targets
  .partnership-section .eyebrow and the two .partnership-list article span.
  --coral #e6654f (style.css:10) on white computes to 3.31:1 and on #fffdf7 to
  3.26:1 (independently recomputed: luminance L=0.267 for coral). The labels are
  0.76rem/0.78rem weight-800 (style.css:157, 2369) = normal text (well under the
  18.66px bold large-text threshold), so the 4.5:1 SC 1.4.3 / coding-rules A3 /
  design-rules D11 threshold applies and fails. Claim correctly excludes the two
  iframe/Tally nodes as third-party. A scoped darken/role-swap is a legitimate
  finding-backed fix.
