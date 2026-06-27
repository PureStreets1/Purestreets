---
id: coral-label-contrast-below-aa
phase: phase3
agent: critic
status: verified
severity: high
scope: a11y
evidence:
  - docs/audit/runs/before/axe/contact.json
  - style.css:5
  - style.css:10
  - style.css:154-161
  - style.css:1810
  - style.css:1835
  - style.css:1851-1856
  - docs/audit/screenshots/contact/1440.png
source: internal
---

## Claim
The uppercase coral kicker labels on the white option cards compute to ~3.31:1
against white — below the 4.5:1 required for this small bold text — and the same
token drives the hero eyebrow. `.contact-options span` is
`color: var(--coral); font-size: 0.78rem; font-weight: 800`
(`style.css:1851-1856`) on `.contact-options` `background: var(--white)`
(`style.css:1835`). With `--coral: #e6654f` (`style.css:10`) and
`--white: #ffffff` (`style.css:5`), the measured contrast is 3.31:1 (relative
luminance L=0.267 -> 1.05 / 0.317 = 3.31), and 0.78rem (~12.5px) bold is NOT
WCAG large text (large = >=24px, or >=18.66px bold), so the 4.5:1 threshold
applies and fails. axe confirms it: `docs/audit/runs/before/axe/contact.json`
lists `color-contrast` (serious) with in-page targets
`article:nth-child(1)>span`, `:nth-child(2)>span`, and `:nth-child(3)>span` —
i.e. the "EMAIL" / "PARTNERSHIPS" / "SOCIALS" labels, which read faintly in
`docs/audit/screenshots/contact/1440.png`. The same `--coral` drives the
`.eyebrow` (`style.css:154-161`) on the near-white hero gradient `#fffdf7`
(`style.css:1810`) at ~3.26:1 — the same shortfall, though not an axe-listed
node.

## Why it matters
These labels are the only categorisation of the three contact channels
(design-rules D11 / coding-rules A3, SC 1.4.3); low-vision users on phones in
sunlight cannot reliably read them. axe rates it serious, and because the
shortfall recurs site-wide via `--coral`, fixing the token/usage has broad
payoff.

## Recommended action
Darken the coral used for small label text to reach >=4.5:1 on white (e.g. a
deeper brand red as a dedicated label token), or increase these labels'
size/weight to the large-text threshold. Keep `--coral` for large/decorative
uses where it already passes. This touches only the label color/role — no JS,
`data-*` hook, localStorage, copy, or asset — and stays no-build. Treat as a
finding-approved change (it shifts a hue) per `/CLAUDE.md`.

## How to verify it's fixed
Run a contrast checker on the chosen color vs `#ffffff` (target >=4.5:1) and
re-run axe on `contact.html` expecting the three `article>span` `color-contrast`
nodes to clear. In DevTools, sample the computed label color vs its background
and confirm >=4.5:1 for the labels and the hero eyebrow.

## Vote tally
failedToRefute: 2 / 2

- **Skeptic 1 (failed to refute):** Correct. style.css:10 --coral #e6654f on
  style.css:5 --white #ffffff computes to 3.31:1 (relative luminance L=0.267 ->
  (1.05)/(0.317)=3.31), matching the claim. style.css:1851-1856 labels are
  0.78rem/800 = ~12.5px bold, below WCAG large-text thresholds (24px /
  18.66px-bold), so 4.5:1 is required and not met. axe contact.json independently
  flags color-contrast (serious) on article:nth-child(1..3)>span, corroborating
  that axe treats these as normal text. The secondary note that .eyebrow reuses
  --coral (style.css:156) on #fffdf7 (~3.26:1) is also true, though not in the axe
  list. Core claim solidly evidenced (coding-rules A3 / design-rules D11).
- **Skeptic 2 (failed to refute):** Verified: --coral #e6654f on --white #ffffff
  computes to 3.31:1; the labels are .contact-options span at 0.78rem/800
  (style.css:1851-1856) = ~12.5px bold, which is NOT WCAG large text, so 4.5:1 is
  required. axe flags color-contrast (serious) on article:nth-child(1..3)>span
  (contact.json). Fix is a CSS color/token change with no impact on JS flows,
  data-* hooks, localStorage shape, copy, or assets, and stays no-build.
