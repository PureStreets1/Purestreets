---
id: purebot-panel-aria-hidden-focusable
phase: phase3
agent: critic
status: verified
severity: med
scope: a11y
evidence:
  - /Users/haidertoha/Code/pure_streets/docs/audit/runs/before/axe/our-team.json
  - /Users/haidertoha/Code/pure_streets/our-team.html:147
  - /Users/haidertoha/Code/pure_streets/our-team.html:153
  - /Users/haidertoha/Code/pure_streets/our-team.html:159-163
  - /Users/haidertoha/Code/pure_streets/our-team.html:165-167
  - /Users/haidertoha/Code/pure_streets/script.js:249-255
  - /Users/haidertoha/Code/pure_streets/style.css:1600-1624
source: internal
---

## Claim
The closed PureBot panel has `aria-hidden="true"` while still containing focusable
controls — a close button, three prompt buttons, two links, a text input and a
send button — so keyboard / AT users tab into content that is announced as hidden.
This is exactly the `aria-hidden-focus` (serious) node axe flags.

Verified:
- axe `our-team.json` lists `aria-hidden-focus` (serious) targeting
  `.purebot-panel`.
- `our-team.html:147` `<section class="purebot-panel" data-purebot-panel
  aria-hidden="true">` wraps focusable children: close button (:153), three prompt
  buttons + two Tally links (:159-163), input + Send (:165-167).
- The closed panel is hidden via `opacity: 0` / transform / `pointer-events: none`
  (style.css:1600-1624) — NOT `display: none` or `visibility: hidden` — so its
  focusable descendants remain in the tab order while `aria-hidden="true"`.
- `script.js` `setOpen` (around 249-255) toggles `aria-hidden` with the open
  state, so the bug is present whenever the panel is collapsed (coding-rules A4).

## Why it matters
Focusable-inside-aria-hidden is a WCAG failure that creates phantom tab stops —
an invisible keyboard "trap" of controls the AT announces as hidden. Because
PureBot is a shared component present on every page, fixing the component clears
the violation site-wide.

## Recommended action
When the panel is collapsed, remove its descendants from the tab order in lockstep
with `aria-hidden` — e.g. toggle the `inert` attribute (or `hidden`) on the panel
together with the existing `aria-hidden` toggle in `setOpen`/`initPureBot`. Purely
additive and visual-neutral while the panel is already invisible; changes no
data-* hook, localStorage key, copy, or asset. Implementation note: remove `inert`
before `input.focus()` on open so the input stays focusable.

## How to verify it's fixed
With the panel closed, Tab through the page and confirm focus never enters PureBot
internals; open it and confirm all controls (close, prompts, links, input, Send)
are reachable. Re-run axe and confirm the `aria-hidden-focus` node is gone; confirm
no new console errors and no visual change when closed.

## Vote tally
failedToRefute: 3 / 3

- failedToRefute: axe-confirmed aria-hidden-focus serious on .purebot-panel.
  our-team.html:147 wraps focusable close button (:153), prompt buttons + links
  (:159-163), input + Send (:165-167). script.js toggles aria-hidden with open
  state. Genuine WCAG failure (A4); the inert fix is no-build and visual-neutral
  while collapsed. Fixes site-wide.
- failedToRefute: VERIFIED REAL. Panel is hidden when closed via opacity:0 /
  transform / pointer-events:none (style.css:1600-1624) — NOT display:none — so
  focusable children remain tabbable while aria-hidden='true'. Fix = toggle `inert`
  in lockstep with the existing aria-hidden in setOpen; purely additive, changes no
  data-* hook, localStorage, copy, or asset. Only note: remove inert before
  input.focus() on open. Real and safe.
- failedToRefute: Confirmed by axe. our-team.html:147 sets aria-hidden on the
  closed panel wrapping focusable controls. Closed state hides via opacity:0 +
  pointer-events:none, not display:none/visibility:hidden, so descendants remain in
  tab order while announced hidden — a genuine WCAG fail. Adding inert/hidden in
  lockstep is visual-neutral and behavior-preserving. Fixes site-wide.
