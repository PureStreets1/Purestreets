---
id: purebot-aria-hidden-focusable
phase: phase3
agent: critic
status: fixed
severity: high
scope: a11y
evidence:
  - docs/audit/runs/before/axe/mosques-isocs.json:5-15
  - style.css:1600-1618
  - mosques-isocs.html:318-339
  - script.js:249-255
source: internal
---

## Claim
When PureBot is closed the panel keeps `aria-hidden="true"` yet remains in the
tab order, so keyboard users tab onto invisible controls. axe flags this as the
serious `aria-hidden-focus` violation.

- `docs/audit/runs/before/axe/mosques-isocs.json:5-15` — violation id
  `aria-hidden-focus`, impact `serious`, 1 node, target `.purebot-panel`.
- `style.css:1600-1618` — the closed panel is `opacity: 0` +
  `transform: translateY(12px) scale(0.98)` + `pointer-events: none` (NOT
  `display: none` / `visibility: hidden`), so its descendants stay focusable;
  `pointer-events: none` (style.css:1616) blocks the mouse only, not the keyboard.
- `mosques-isocs.html:318-339` — the panel contains a close button (`:324`), 3
  prompt buttons (`:330-332`), 2 links (`:333-334`) and a text input + Send
  (`:336-338`).
- `script.js:249-255` — `setOpen()` does
  `panel.setAttribute('aria-hidden', String(!isOpen))` (`:251`); aria-hidden is
  toggled but focusability is never removed.

## Why it matters
WCAG 4.1.2 / the `aria-hidden-focus` rule: focusable content inside an
`aria-hidden` subtree is announced inconsistently and traps sighted-keyboard and
screen-reader users on controls they cannot see — a serious, repeatable barrier
on every page that ships PureBot (the panel markup is identical site-wide).

## Recommended action
When closed, mark the panel `inert` — the native `inert` attribute removes it
from both the tab order and the accessibility tree with zero visual change and
supersedes the manual `aria-hidden`. Toggle `inert` off in the same JS branch
(`setOpen()`, script.js:249-255) that sets `.is-open`. Keep the existing
`aria-hidden`/`aria-expanded` toggles alongside it so frozen flow #6 is
preserved, and keep the open animation (opacity/transform) intact. No-build,
zero-pixel, additive.

## How to verify it's fixed
Re-run axe on `mosques-isocs.html` — `aria-hidden-focus` should be 0. Load the
page and press Tab repeatedly with PureBot closed: focus must never land on the
PureBot close/prompt/Send controls. Open PureBot and confirm they become
reachable again. Confirm no pixel change at rest at 1440/375.

## Vote tally
failedToRefute: 3 / 3

- **Skeptic 1 (not refuted):** Verified against truth sources. axe JSON
  (mosques-isocs.json:6-14) lists `aria-hidden-focus`, impact serious, target
  `.purebot-panel`, 1 node. style.css:1600-1618 confirms the closed panel uses
  opacity:0 + transform + pointer-events:none (NO display:none/visibility:hidden),
  so descendants stay keyboard-focusable; pointer-events:none blocks mouse only.
  HTML (lines 318-339) shows close button, 3 prompt buttons, 2 links, text input
  + Send all inside the panel. script.js:251 toggles aria-hidden but never removes
  focusability. The recommended `inert` is a native no-build attribute,
  well-supported, visually inert -> safe, behavior-preserving. Real,
  evidence-backed, safe-to-fix per coding-rule A4.
- **Skeptic 2 (not refuted):** Read coding-rules.md/design-rules.md/
  anti-slop-checklist.md/CLAUDE.md + skimmed inspiration/. Real, axe-confirmed
  serious `aria-hidden-focus` on .purebot-panel (before/axe/mosques-isocs.json:6-14).
  Closed panel is opacity:0/transform/pointer-events:none, NOT display:none
  (style.css:1613-1616), so its close/prompt/link/input controls (html:318-339)
  stay tab-focusable inside an aria-hidden subtree (script.js:251). pointer-events:
  none blocks mouse only, not keyboard. The `inert` fix is no-build, zero-visual,
  and additive to setOpen() — keep the existing aria-hidden toggle alongside it so
  frozen flow #6 is preserved. Genuine, safe a11y bug; not refuted on behavior
  grounds.
- **Skeptic 3 (not refuted):** Verified real. axe before-run
  (mosques-isocs.json:5-15) lists `aria-hidden-focus` impact serious on
  .purebot-panel. style.css:1600-1618 closes the panel with opacity:0 + transform
  + pointer-events:none (NOT display:none), so its close button/3 prompt buttons/2
  links/text input/Send (HTML:318-339) stay in the tab order. script.js:249-255
  setOpen() only toggles aria-hidden/aria-expanded, never focusability. The inert
  fix is well-supported, non-visual, and preserves the open/close flow. Genuine
  WCAG 4.1.2 / serious violation.
