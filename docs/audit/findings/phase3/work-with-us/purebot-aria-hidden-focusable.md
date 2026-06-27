---
id: purebot-aria-hidden-focusable
phase: phase3
agent: critic
status: verified
severity: high
scope: a11y
evidence:
  - work-with-us.html:120
  - work-with-us.html:126
  - work-with-us.html:132-140
  - style.css:1600-1618
  - docs/audit/runs/before/axe/work-with-us.json
  - docs/audit/runs/before/lighthouse-summary.json:51-55
source: internal
---

## Claim
The closed PureBot panel is `aria-hidden="true"` yet its close button,
quick-prompt buttons, links, and text input remain keyboard-focusable, so
keyboard / AT users can tab into invisible controls.
`docs/audit/runs/before/axe/work-with-us.json` reports violation id
`aria-hidden-focus`, impact `serious`, target `.purebot-panel`.
`work-with-us.html:120` is `<section class="purebot-panel" data-purebot-panel
aria-hidden="true">` wrapping focusable children at lines 126 (close button),
132-136 (prompt buttons + Partner/WhatsApp links), and 139-140 (text input +
Send). The closed `.purebot-panel` uses only `opacity: 0` + `pointer-events:
none` (`style.css:1600-1618`) — no `visibility: hidden`, `display: none`, or
`inert` — so its children stay in the focus order. Lighthouse a11y for this page
is 90 (`docs/audit/runs/before/lighthouse-summary.json:51-55`), consistent with
the two serious axe violations.

## Why it matters
Focusable-but-`aria-hidden` content is a WCAG 4.1.2 / focus-order failure: a
sighted keyboard user tabs to controls they cannot see, and screen-reader focus
and visual focus desync (coding-rules A2 focus visibility, A4 keep ARIA honest).
This is a real, reproducible, tool-confirmed defect, not a heuristic.

## Recommended action
When the panel is closed, remove its subtree from the tab order without changing
the JS `aria` toggle or any `data-*` hook — e.g. add `visibility: hidden` to the
base `.purebot-panel` and `visibility: visible` to `.purebot.is-open
.purebot-panel` (render-neutral since it is already `opacity: 0`; append a
`visibility` transition-delay so the 160ms fade-out is preserved), or toggle the
`inert` attribute. `setOpen()` adds `.is-open` before calling `input.focus()`
(`script.js`), so opening still focuses the input. NOTE: PureBot is shared across
all pages, so this fixes them all.

## How to verify it's fixed
Re-run axe on `work-with-us.html` — `aria-hidden-focus` node count must be 0.
Manually: with PureBot closed, Tab through the page and confirm focus never lands
on the close "x", prompt buttons, links, or input; open PureBot and confirm they
are reachable again.

## Vote tally
failedToRefute: 3 / 3

- **Skeptic 1 (failed to refute):** Confirmed by direct axe evidence:
  runs/before/axe/work-with-us.json lists violation id "aria-hidden-focus",
  impact "serious", target ".purebot-panel". work-with-us.html:120 sets
  aria-hidden="true" on the panel wrapping focusable close button/prompt
  buttons/links/input (lines 126,132-140). style.css:1600-1618 closed-panel state
  uses only opacity:0 + pointer-events:none; grep confirms NO
  visibility/display/inert on .purebot-panel, so children remain in the tab
  order. Genuine WCAG 4.1.2 failure, reproducible, fixable via inert or
  visibility toggle without altering JS aria/data-* hooks.
- **Skeptic 2 (failed to refute):** Real serious axe violation confirmed in
  docs/audit/runs/before/axe/work-with-us.json (aria-hidden-focus,
  .purebot-panel). HTML:120 sets aria-hidden=true on a panel whose children
  (close button 126, prompt buttons 132-134, links 135-136, input 139) stay in
  the tab order because the closed state uses only opacity:0 + pointer-events:none
  (style.css:1613-1616), neither of which removes keyboard focusability. A safe
  fix exists: script.js:249-255 setOpen() already toggles .is-open on the bot and
  aria-hidden on the panel, so adding visibility:hidden to base .purebot-panel and
  visibility:visible to .purebot.is-open .purebot-panel (with a visibility
  transition-delay appended to style.css:1617 to preserve the 160ms fade-out) is
  render-neutral and keeps the aria toggle and all data-* hooks intact;
  input.focus() on open (script.js:254) still works because .is-open is added
  before the focus call. No localStorage/copy/asset impact. Shared PureBot, so it
  fixes all pages.
- **Skeptic 3 (failed to refute):** Tool-confirmed, not heuristic.
  docs/audit/runs/before/axe/work-with-us.json lists id "aria-hidden-focus",
  impact serious, target .purebot-panel. work-with-us.html:120 sets
  aria-hidden=true on a panel containing focusable controls (lines 126,132-141).
  CSS for the closed panel uses only opacity:0 + pointer-events:none
  (style.css:1600-1618); grep confirms no visibility/inert/display:none anywhere
  on .purebot-panel (line 1760 media query only tweaks bottom/max-height), so
  children stay in the tab order. Genuine WCAG 4.1.2 failure.
