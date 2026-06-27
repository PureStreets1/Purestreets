---
id: purebot-panel-aria-hidden-focus
phase: phase3
agent: critic
status: verified
severity: high
scope: a11y
evidence:
  - docs/audit/runs/before/axe/charities.json
  - charities.html:145
  - charities.html:151
  - charities.html:157-161
  - charities.html:164-165
  - style.css:1600-1618
  - script.js:249-255
source: internal
---

## Claim
When closed, `.purebot-panel` keeps `aria-hidden="true"`
(`charities.html:145`) yet is only visually hidden via `opacity: 0` +
`transform` + `pointer-events: none` (`style.css:1613-1617`) — there is no
`display: none`, `visibility: hidden`, or `inert`. `pointer-events: none` does
NOT remove keyboard focusability, so the panel's close "x"
(`charities.html:151`), quick-prompt buttons and links (`charities.html:157-161`),
and the text input + Send (`charities.html:164-165`) remain Tab-focusable inside
an element announced as hidden. `setOpen()` in `script.js:249-255` toggles
`aria-hidden`/`aria-expanded` but never removes focusability. axe confirms it:
`docs/audit/runs/before/axe/charities.json` lists violation `aria-hidden-focus`
(serious) targeting `.purebot-panel`.

## Why it matters
Keyboard and screen-reader users can Tab into an invisible, off-screen panel
that is announced as hidden, landing focus on controls they cannot see — a
serious, confusing WCAG 4.1.2 failure (coding-rules A4: ARIA must track real
state). Because the PureBot markup is shared across pages, the same defect
recurs site-wide.

## Recommended action
In `setOpen()`, toggle the native `inert` attribute (or `visibility: hidden`)
on the panel in lockstep with `aria-hidden`, so the closed panel's controls
leave the tab order. This is render-neutral for sighted users (the panel is
already `opacity: 0` when closed) and adds no build/runtime dependency. Caveat:
`removeAttribute('inert')` must run before `input.focus()` (`script.js:254`) so
the open path can still focus the input. Keep all existing hooks
(`.is-open`/`aria-hidden`/`aria-expanded`/`data-purebot-*`) untouched.

## How to verify it's fixed
Collapse PureBot, press Tab repeatedly, and confirm focus skips every panel
control (close, prompts, links, input, send). Open PureBot and confirm focus
still lands in the input. Re-run axe and confirm `aria-hidden-focus` is gone
with no new violations.

## Vote tally
failedToRefute: 3 / 3

- **Skeptic 1 (failed to refute):** axe-confirmed: charities.json lists
  violation 'aria-hidden-focus' (serious) on .purebot-panel. charities.html:145
  panel has aria-hidden="true" wrapping focusables (close 151, prompts/links
  157-161, input/send 164-165). style.css:1613-1617 closed state is only
  opacity:0 + transform + pointer-events:none (no display:none/visibility:hidden
  /inert). script.js:249-255 setOpen() toggles aria-hidden/aria-expanded but
  never removes focusability. Toggling `inert` in lockstep is render-neutral
  (panel already opacity:0). Matches coding-rules A4 / WCAG 4.1.2. Real, safe.
- **Skeptic 2 (failed to refute):** axe before/charities.json lists
  aria-hidden-focus (serious) on .purebot-panel. charities.html:145 sets
  aria-hidden=true on the panel which wraps focusable close/prompt/link/input
  controls (151,157-161,164-165). Closed state is opacity:0 + pointer-events:none
  only (style.css:1613-1617) — neither removes Tab focusability — and
  script.js setOpen (249-255) toggles aria-hidden/aria-expanded but never
  focusability. Recommended inert toggle is a native HTML attribute (no
  build/runtime dep), additive to the frozen PureBot flow (keeps
  .is-open/aria-hidden/aria-expanded/data-* hooks), and render-neutral; only
  caveat is removeAttribute('inert') must run before input.focus()
  (script.js:254). Real and safe (coding-rules A4; WCAG 4.1.2).
- **Skeptic 3 (failed to refute):** REAL, tool-confirmed.
  docs/audit/runs/before/axe/charities.json lists violation 'aria-hidden-focus'
  (serious) on .purebot-panel. Closed state is only opacity:0 + transform +
  pointer-events:none (style.css:1600-1618) with no
  display:none/visibility:hidden/inert; pointer-events:none does NOT remove
  keyboard focusability, so the close button, prompt buttons, links and text
  input (charities.html:151,157-161,164-165) inside aria-hidden="true"
  (charities.html:145) stay in the tab order. script.js setOpen() (249-255)
  toggles aria-hidden but never removes focusability. WCAG 4.1.2 / coding-rules
  A4. An inert toggle in setOpen is render-neutral and behavior-safe (does not
  touch any data-* hook or localStorage).
