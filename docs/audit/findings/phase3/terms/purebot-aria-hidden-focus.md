---
id: purebot-aria-hidden-focus
phase: phase3
agent: critic
status: verified
severity: high
scope: a11y
evidence:
  - terms.html:110
  - terms.html:116
  - terms.html:122-130
  - style.css:1600-1624
  - script.js:158-320
  - docs/audit/runs/before/axe/terms.json
source: internal
---

## Claim
`.purebot-panel` carries `aria-hidden="true"` while closed (`terms.html:110`)
yet contains focusable controls — the close button (`terms.html:116`), three
quick-prompt buttons (`:122-124`), two links (`:125-126`), the text input
(`:129`), and Send (`:130`). axe flags this as `aria-hidden-focus`, impact
serious (`docs/audit/runs/before/axe/terms.json` — `violationCount: 1`, target
`.purebot-panel`). The CSS closes the panel with `opacity: 0` +
`pointer-events: none` (`style.css:1613-1617`), NOT `display: none` or
`visibility: hidden`, so the descendants remain in the tab order. `initPureBot`
toggles `.is-open` and `aria-hidden`/`aria-expanded` (`script.js:158-320`,
notably the open/close setter) but never removes the children from the tab
order, so keyboard users can Tab into an invisible panel that is announced to AT
as hidden.

## Why it matters
This is the only axe violation on the page (and it repeats on every page that
ships PureBot). Keyboard and screen-reader users can Tab focus into hidden
content — a focus-order defect (coding-rules A2/A4; WCAG 2.4.3 Focus Order /
4.1.2 Name, Role, Value) — and ARIA that lies about state undermines AT
navigation. It is machine-detected, not eyeballed.

## Recommended action
Keep the existing `aria-hidden` / `.is-open` toggle but also remove the panel
from the tab order while closed: apply the `inert` attribute to
`.purebot-panel` and flip it inside `initPureBot` alongside `aria-hidden` (set
`inert` on close, remove on open). Use `inert` rather than `hidden` /
`display: none` so the existing opacity/transform open-close transition
(`style.css:1617`) still runs and the rendered output is unchanged. Do not
rename any `data-purebot-*` hook; PureBot stays fully local (no network). The
same fix applies to the other PureBot-bearing pages.

## How to verify it's fixed
Re-run axe -> `aria-hidden-focus` is gone (violationCount 0). Tab through the
closed page -> focus never enters the panel. Opening PureBot still moves focus
to the input and the quick-prompt / ask flow works. Before/after screenshots
unchanged (inert is render-neutral).

## Vote tally
failedToRefute: 3 / 3

- **Skeptic 1 (failed to refute):** Confirmed by the authoritative axe run:
  `docs/audit/runs/before/axe/terms.json` reports `violationCount 1`, id
  `aria-hidden-focus`, impact serious, target `.purebot-panel`. `terms.html:110`
  sets `aria-hidden="true"` on `.purebot-panel` while it contains focusable
  controls (close button `:116`, prompt buttons `:122-124`, two links `:125-126`,
  text input `:129`, Send `:130`). The axe finding means descendants are in the
  tab order while hidden — a genuine serious WCAG 4.1.2/2.4.3 failure. The
  recommended `inert`/`hidden` fix preserves the `data-purebot-*` hooks and the
  local-only behavior.
- **Skeptic 2 (failed to refute):** CONFIRMED. axe before/terms.json shows
  exactly one violation: `aria-hidden-focus`, impact serious, target
  `.purebot-panel`. `terms.html:110` sets `aria-hidden=true` on the panel while
  it holds focusable controls (close, 3 prompt buttons, 2 links, input, Send at
  `:116,122-130`). CSS closes it with `opacity:0`/`pointer-events:none` but NOT
  `display:none`/`visibility:hidden` (`style.css:1600-1624`), so children stay in
  the tab order; the open/close setter (`script.js`) only toggles `.is-open` +
  `aria-hidden`, never `inert`. The recommended fix (add/remove `inert` alongside
  `aria-hidden`) is behavior-safe: `inert` has no visual effect, doesn't change
  display so the open/close transition still runs, and renames no `data-purebot-*`
  hook. Use `inert`, not `hidden` (`hidden` would break the CSS transition). Per
  coding-rules A4/A2.
- **Skeptic 3 (failed to refute):** Machine-verified, not a taste call.
  `docs/audit/runs/before/axe/terms.json`: `violationCount 1`, id
  `aria-hidden-focus`, impact serious, target `.purebot-panel`. `terms.html:110`
  sets `aria-hidden="true"` on the closed panel which contains focusable controls
  (close button `:116`, three prompt buttons `:122-124`, two links `:125-126`,
  text input `:129`, Send `:130`). Genuine WCAG 4.1.2/2.4.3 focus-order defect
  (coding-rules A2/A4). The fix (`inert`/`hidden` toggled in `initPureBot`
  alongside the existing `aria-hidden`) is render-neutral and preserves all
  `data-purebot-*` hooks and behavior.
</content>
