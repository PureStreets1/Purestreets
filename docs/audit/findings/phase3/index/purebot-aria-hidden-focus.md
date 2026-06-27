---
id: purebot-aria-hidden-focus
phase: phase3
agent: critic
status: verified
severity: high
scope: a11y
evidence:
  - docs/audit/runs/before/axe/index.json
  - index.html:216
  - index.html:222
  - index.html:228-232
  - index.html:235-236
  - script.js:249-255
  - style.css:1600-1618
source: internal
---

## Claim
When PureBot is closed, `.purebot-panel` has `aria-hidden="true"`
(`index.html:216`) yet its close button (`index.html:222`), three prompt buttons
and two links (`index.html:228-232`), and text input + send button
(`index.html:235-236`) remain in the tab order, so keyboard users can focus
invisible controls. `setOpen()` toggles `.is-open` and `aria-hidden` together —
closed = `aria-hidden` true (`script.js:249-255`, sets
`panel.setAttribute('aria-hidden', String(!isOpen))`). The closed-state CSS hides
the panel via `opacity: 0` + `transform` + `pointer-events: none` ONLY
(`style.css:1600-1618`) — there is no `display: none`, `visibility: hidden`, or
`inert`, and `pointer-events: none` does not remove keyboard focusability, so the
children remain focusable. axe confirms it:
`docs/audit/runs/before/axe/index.json` lists `aria-hidden-focus` (serious,
target `.purebot-panel`, 1 node).

## Why it matters
Focusing controls inside an `aria-hidden` subtree confuses screen-reader +
keyboard users (focus lands on nothing visible) and is a serious WCAG 4.1.2
failure (coding-rules A4: ARIA must track real state). It is the only structural
a11y bug in our own DOM on this page (the other axe nodes are inside the Tally
iframe). Because the PureBot markup is shared across pages, the same defect
recurs site-wide.

## Recommended action
When closed, remove the panel from the tab order without changing its open
appearance: toggle the native `inert` attribute (or `visibility: hidden` with a
transition delay so the close animation still plays) in lockstep with
`aria-hidden` in `script.js` `setOpen()`. The toggle button is OUTSIDE the panel
(`index.html:213`) so reopen still works; `inert` does not block the CSS opacity
transition; `removeAttribute('inert')` must run before `input.focus()`
(`script.js:254`). Preserves all `data-*` hooks, the open animation, and every
PureBot flow/key. `inert` is a native attribute (no-build compatible).

## How to verify it's fixed
With the panel closed, Tab through the whole page — focus never enters the panel;
re-run axe (`aria-hidden-focus` gone, no new violations); confirm open/close,
quick prompts, links, and send still work and that opening still lands focus in
the input.

## Vote tally
failedToRefute: 3 / 3

- **Skeptic 1 (failed to refute):** Confirmed real WCAG 4.1.2 bug in our own DOM.
  index.html:216 panel has aria-hidden="true" with focusable children (close btn
  222, prompts/links 228-232, input/send 235-236). script.js setOpen (249-255)
  sets aria-hidden=String(!isOpen) so closed=true. Closed-state CSS
  (style.css:1613-1616) is only opacity:0 + transform + pointer-events:none —
  grep confirms no display:none/visibility:hidden/inert in the .purebot-panel
  block (1600-1618), so children remain in tab order. axe/index.json
  aria-hidden-focus (serious, target .purebot-panel, 1 node) confirms. Proposed
  fix (inert or visibility:hidden in lockstep with aria-hidden) preserves all
  data-* hooks and the open animation.
- **Skeptic 2 (failed to refute):** Confirmed serious axe violation
  (aria-hidden-focus on .purebot-panel). index.html:216 sets aria-hidden=true
  with focusable children (close 222, prompts/links 228-232, input/send 235-236);
  style.css:1600-1618 hides the closed panel only via
  opacity:0/transform/pointer-events:none (no display:none, visibility:hidden, or
  inert) so children stay in tab order. Fix (toggle inert in lockstep with
  aria-hidden in setOpen, script.js:249-255) is safe: the toggle button is
  OUTSIDE the panel (index.html:213) so reopen still works, the opacity
  transition still animates on close (inert does not block CSS transitions), all
  data-* hooks/flows are preserved, and inert is a native attribute (no-build
  compatible).
- **Skeptic 3 (failed to refute):** Confirmed axe 'aria-hidden-focus' serious
  violation (before/axe/index.json target .purebot-panel) in our own DOM.
  index.html:216 sets aria-hidden=true on the panel while children stay focusable
  (close button :222, prompt buttons/links :228-232, input/send :235-236).
  script.js:251 toggles aria-hidden in setOpen; closed-state CSS
  (style.css:1613-1617) hides only via opacity:0 + transform + pointer-events:none
  — no display:none/visibility:hidden/inert — so children remain in the tab
  order. Genuine WCAG 4.1.2 failure (coding-rules A4). The proposed
  inert/visibility-on-close fix removes them from tab order with zero visual
  change (pointer-events already none) and preserves every data-* hook and the
  open animation. Safe, no-build.
