---
id: purebot-panel-aria-hidden-focusable
phase: phase3
agent: critic
status: fixed
severity: high
scope: a11y
evidence:
  - docs/audit/runs/before/axe/contact.json
  - style.css:1600-1618
  - script.js:251
  - script.js:254
  - contact.html:139-160
source: internal
---

## Claim
When PureBot is closed, the panel has `aria-hidden="true"` yet is only visually
hidden via opacity/transform (not `display: none` or `visibility: hidden`), so
its controls remain in the tab order — a keyboard user tabs onto invisible,
AT-hidden controls. The closed `.purebot-panel` sets only `opacity: 0;
transform: translateY(12px) scale(0.98); pointer-events: none`
(`style.css:1600-1618`), and `pointer-events: none` does not remove keyboard
focusability. `setOpen()` sets
`panel.setAttribute('aria-hidden', String(!isOpen))` (`script.js:251`), so the
panel is `aria-hidden="true"` while closed (also hardcoded at
`contact.html:139`). The panel contains focusable controls
(`contact.html:139-160`): the `data-purebot-close` button, three
`data-purebot-prompt` buttons, two anchors (Partner form / WhatsApp network),
the text input, and the Send submit button — all reachable by Tab inside an
`aria-hidden` subtree. axe confirms it:
`docs/audit/runs/before/axe/contact.json` lists `aria-hidden-focus` (serious)
targeting `.purebot-panel`.

## Why it matters
Focusing a node inside `aria-hidden` produces "ghost" focus — a screen reader
announces nothing while focus visibly disappears — stranding keyboard and AT
users (coding-rules A4; WCAG 4.1.2 / 2.4.3). PureBot is global, so this affects
every page.

## Recommended action
Add `visibility: hidden` to the closed `.purebot-panel` and
`visibility: visible` to `.purebot.is-open .purebot-panel` (transition
`visibility` alongside the existing `opacity`/`transform` so the 160ms fade is
unchanged), or toggle the `inert` attribute on the panel via `script.js` when
closed. Both are render-neutral (the closed state stays invisible either way) and
preserve the open/close animation; `input.focus()` on open still works because
`.is-open` is applied before `focus()` (`script.js:251-254`). No localStorage,
`data-*`, copy, or asset impact.

## How to verify it's fixed
With PureBot closed, press Tab through the page in a browser: focus must never
enter the panel. Re-run axe expecting the `aria-hidden-focus` violation to
disappear, and confirm before/after screenshots are pixel-identical.

## Vote tally
failedToRefute: 2 / 2

- **Skeptic 1 (failed to refute):** Correct. style.css:1600-1618 closes the panel
  with only opacity:0 + transform + pointer-events:none (no
  display:none/visibility:hidden), and pointer-events:none does not remove
  keyboard focusability; script.js:251 sets aria-hidden="true" while closed. Thus
  the close button, 3 prompt buttons, 2 anchors, input and Send
  (contact.html:139-160) remain in the tab order inside an aria-hidden subtree.
  axe contact.json flags aria-hidden-focus (serious) on .purebot-panel. Both
  proposed fixes (transition-aware visibility:hidden, or toggling inert via
  script.js) are render-neutral and behavior-preserving (coding-rules A4).
- **Skeptic 2 (failed to refute):** Verified: closed .purebot-panel uses only
  opacity:0 / transform / pointer-events:none (style.css:1613-1616) — no
  visibility:hidden or display:none — while aria-hidden=true is set
  (contact.html:139; script.js:251), leaving the close/3 prompt buttons/2
  links/input/Send focusable inside an aria-hidden subtree. axe aria-hidden-focus
  (serious) on .purebot-panel (contact.json). Recommended fix (animate visibility
  alongside opacity, or toggle inert in setOpen) is render-neutral — closed state
  stays invisible either way, visibility is special-cased to stay "visible"
  through the fade so the 160ms animation is unchanged, and input.focus() on open
  still works because .is-open is applied before focus(). No
  localStorage/data-*/copy impact.
