---
id: purebot-panel-aria-hidden-focus
phase: phase3
agent: critic
status: verified
severity: high
scope: a11y
evidence:
  - docs/audit/runs/before/axe/volunteer-month.json
  - volunteer-month.html:199
  - volunteer-month.html:202
  - volunteer-month.html:208
  - volunteer-month.html:214-218
  - volunteer-month.html:221-222
  - style.css:1600-1618
  - style.css:1620-1624
  - script.js:249-255
source: internal
---

## Claim
When PureBot is closed, `.purebot-panel` carries `aria-hidden="true"`
(`volunteer-month.html:202`) yet still contains focusable controls: the close
button (`volunteer-month.html:208`), 3 prompt buttons + 2 links
(`volunteer-month.html:214-218`), and the text input + Send button
(`volunteer-month.html:221-222`). The closed state is rendered with
`opacity: 0` + `pointer-events: none` (`style.css:1600-1618`), NOT `display:
none` / `visibility: hidden`, so those controls remain in the keyboard Tab
order while the region is hidden from the accessibility tree. `pointer-events:
none` blocks the mouse but not keyboard focus. `setOpen()` toggles only the
panel's `aria-hidden` and the toggle's `aria-expanded`/`aria-label`
(`script.js:249-255`) — there is no `inert`/`tabindex` management. axe confirms
it: `docs/audit/runs/before/axe/volunteer-month.json` lists `aria-hidden-focus`
(impact serious) targeting `.purebot-panel`.

## Why it matters
Focusable-but-hidden content is a SC 4.1.2 / focus-order failure: keyboard and
AT users Tab into controls that are visually absent and announced as hidden
(coding-rules A4). PureBot ships on every page, so the fix is high-leverage.

## Recommended action
In `setOpen()` (`script.js:249-255`), set the panel inert when closed
(`panel.inert = !isOpen`) — or toggle the `hidden` attribute / `tabindex="-1"`
on its controls — keeping `aria-hidden` in sync. The toggle button lives OUTSIDE
the panel (`volunteer-month.html:199` vs the panel at `:202`), so making the
panel inert does not disable opening it; when open, `inert = false` and the
existing `input.focus()` (`script.js:254`) still runs. No localStorage,
`data-*`, or copy change; `inert` is a native DOM property requiring no build
step.

## How to verify it's fixed
Re-run axe and confirm `aria-hidden-focus` is 0. Keyboard-Tab through the page
with the panel closed: focus must skip all PureBot controls. Open the panel and
confirm focus still lands on the input and all controls are reachable again.

## Vote tally
failedToRefute: 3 / 3

- **Skeptic 1 (failed to refute):** axe aria-hidden-focus (serious) targets
  `.purebot-panel` (volunteer-month.json). HTML:202 sets `aria-hidden=true`
  while the panel holds a focusable close button (208), 3 prompt buttons + 2
  links (214-218), and input + Send (221-222). The closed state uses opacity:0 +
  pointer-events:none, NOT display/visibility:hidden (style.css:1600-1618), so
  the controls remain in the Tab order — exactly why axe fires. setOpen toggles
  only aria-hidden/aria-expanded/label (script.js:249-255), no inert/tabindex.
  Real SC 4.1.2 issue; `panel.inert = !isOpen` is render-neutral and touches no
  localStorage/data-*/copy.
- **Skeptic 2 (failed to refute):** REAL, axe-confirmed. Verified the closed
  panel uses opacity:0 + pointer-events:none (style.css:1613-1616), NOT
  display:none/visibility:hidden, so its close button, 3 prompt buttons, 2 links,
  input and Send (HTML:208-222) stay in the keyboard tab order while
  aria-hidden="true" (HTML:202). setOpen() (script.js:249-255) only toggles
  aria-hidden/aria-expanded, no inert/tabindex. Fix is safe: the open toggle sits
  OUTSIDE the panel (HTML:199 vs 202) so panel.inert won't disable opening; when
  open inert=false and input.focus() (254) still works; aria-hidden kept in sync.
  inert is a no-build DOM property. No localStorage/data-*/copy break.
- **Skeptic 3 (failed to refute):** axe-confirmed: aria-hidden-focus (impact
  serious) targets `.purebot-panel`. HTML:202 panel has `aria-hidden="true"`
  while containing focusable close (208), prompt buttons/links (214-218), input +
  Send (221-222). script.js:249-255 setOpen toggles only aria-hidden +
  aria-expanded; grep confirms no inert/tabindex management in script.js.
  Keyboard users Tab into an AT-hidden region (SC 4.1.2). Fix via
  panel.inert/tabindex is additive and non-visual; no localStorage/data-*/copy
  change. Real, high-leverage, safe.
