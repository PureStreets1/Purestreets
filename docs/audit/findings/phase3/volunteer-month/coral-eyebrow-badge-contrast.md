---
id: coral-eyebrow-badge-contrast
phase: phase3
agent: critic
status: fixed
severity: high
scope: a11y
evidence:
  - docs/audit/runs/before/axe/volunteer-month.json
  - style.css:10
  - style.css:154-161
  - style.css:163-166
  - style.css:2177-2182
  - volunteer-month.html:40
  - volunteer-month.html:45
  - volunteer-month.html:59
  - volunteer-month.html:92
  - docs/audit/screenshots/volunteer-month/1280-volunteer.png
source: internal
---

## Claim
The coral token `--coral: #e6654f` (`style.css:10`) is applied to every
`.eyebrow` (`color: var(--coral)`, `font-size: 0.76rem`, `font-weight: 800`,
uppercase — `style.css:154-161`) and to the hero badge's "Points" label
(`.volunteer-hero__badge span`, `color: var(--coral)`, `0.78rem`, weight 800,
uppercase — `style.css:2177-2182`). Those sit on the paper/white surfaces at
roughly 3.1-3.3:1, below the 4.5:1 WCAG AA threshold for this small text.
Measured: `#e6654f` on `#fbf8ef` ~= 3.12:1, on `#ffffff` ~= 3.31:1 — both below
4.5:1. The rendered text is ~12.16px (0.76rem) / ~12.48px (0.78rem) at weight
800, which is NOT WCAG large text (large-bold needs >= 18.66px), so the 4.5:1
threshold applies. The `.hero .eyebrow` lime override (`style.css:163-166`)
selects `.hero`, not `.volunteer-hero`, so these eyebrows stay coral.

axe independently confirms this: `docs/audit/runs/before/axe/volunteer-month.json`
lists `color-contrast` (impact serious) on exactly the in-DOM nodes claimed —
`.volunteer-hero__badge > span` (`volunteer-month.html:45`),
`.volunteer-board__head > div > .eyebrow` (`volunteer-month.html:59`), and
`.join-form > div:nth-child(1) > .eyebrow` (`volunteer-month.html:92`; the hero
eyebrow at `volunteer-month.html:40` shares the same rule). The remaining 2 of
the 5 color-contrast nodes are inside the third-party Tally iframe and are out
of scope. The orange eyebrows / "POINTS" label are visible in
`docs/audit/screenshots/volunteer-month/1280-volunteer.png`.

## Why it matters
Eyebrows are the first rung of the eyebrow -> heading -> body ladder on every
section of this page (design-rules D3); the badge "Points" label sits above the
hero's primary stat. Low-vision users cannot reliably read text at ~3.1-3.3:1.
This is a measured, axe-confirmed SC 1.4.3 failure (coding-rules A3,
design-rules D11), not a taste call.

## Recommended action
Darken the coral used for small text so it clears 4.5:1 on both `#fbf8ef` and
`#ffffff`, or switch the eyebrow/label text to `--green-dark`/`--ink`, reserving
coral for large text only. Adjust the token *usage* for these small labels — the
brand `--coral` itself need not change. This touches only label color/role: no
JS, `data-*` hook, localStorage, copy, or asset is affected.

## How to verify it's fixed
Re-run axe and confirm the `color-contrast` node count drops to only the two
Tally-iframe nodes (our three in-DOM nodes resolved). In DevTools, sample the
chosen label color against `#fbf8ef` and `#ffffff` and confirm >= 4.5:1 for the
hero eyebrow, the board/form eyebrows, and the badge "Points" span.

## Vote tally
failedToRefute: 3 / 3

- **Skeptic 1 (failed to refute):** Verified `--coral #e6654f` (style.css:10);
  `.eyebrow color var(--coral)` 0.76rem/800 (style.css:154-161; the
  `.hero .eyebrow` -> lime override at 163-166 does NOT apply to
  `.volunteer-hero`, so eyebrows stay coral); badge span `var(--coral)` 0.78rem/
  800 (style.css:2177-2182). Computed relative-luminance contrast: `#e6654f` on
  `#fbf8ef` = 3.12:1, on `#fff` = 3.31:1 — both < 4.5:1; ~12-12.5px bold is not
  WCAG large text. axe color-contrast (serious) independently flags 3 of OUR
  nodes in volunteer-month.json; the other 2 are inside the Tally iframe (out of
  scope). Real SC 1.4.3 / coding-rules A3 / design-rules D11 failure; darkening
  small-text coral or using `--green-dark` is safe and changes no behavior.
- **Skeptic 2 (failed to refute):** REAL, axe-confirmed AA failure.
  volunteer-month.json lists color-contrast (serious) on exactly the 3 in-DOM
  nodes claimed; the 2 remaining nodes are inside the Tally iframe and correctly
  scoped out. Token confirmed `--coral #e6654f` (style.css:10) on `.eyebrow`
  0.76rem/800 (154-161) and badge span 0.78rem/800 (2177-2182). Recomputed
  contrast: 3.12:1 on `#fbf8ef`, 3.31:1 on `#ffffff` — both < 4.5:1. Text is
  12.16px/12.48px @800, NOT WCAG large text (needs >= 18.66px bold). Fix is
  CSS-only, no JS/data-*/localStorage/copy/asset impact; candidate correctly
  recommends adjusting the token *usage* not the brand color. Behavior-safe.
- **Skeptic 3 (failed to refute):** Rules read/applied: coding-rules.md,
  design-rules.md, anti-slop-checklist.md, CLAUDE.md (Project Contract =
  findings-driven visual overhaul, not freeze). This is real and axe-confirmed,
  not taste. axe JSON lists color-contrast (impact serious) with 3 in-DOM nodes:
  `.volunteer-hero__badge>span`, `.volunteer-board__head>div>.eyebrow`,
  `.join-form>div:nth-child(1)>.eyebrow`. style.css:154-161 (.eyebrow color
  var(--coral), 0.76rem/800/uppercase) and 2177-2182 (badge span 0.78rem/800).
  Measured `#e6654f` (style.css:10) on `#fbf8ef` ~3.12:1 < 4.5:1; 12px-bold is
  NOT WCAG large text (coding-rules A3, design-rules D11, SC 1.4.3). The 2 other
  axe nodes are inside the Tally iframe (out of scope). Fix (darken coral for
  small text or use `--green-dark`) is safe.
