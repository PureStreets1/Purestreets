---
id: contact-links-small-tap-target
phase: phase3
agent: critic
status: verified
severity: med
scope: a11y
evidence:
  - /Users/haidertoha/Code/pure_streets/style.css:2725-2736
  - /Users/haidertoha/Code/pure_streets/style.css:2691
  - /Users/haidertoha/Code/pure_streets/our-team.html:58
  - /Users/haidertoha/Code/pure_streets/our-team.html:65
  - /Users/haidertoha/Code/pure_streets/our-team.html:72
  - /Users/haidertoha/Code/pure_streets/our-team.html:79
  - /Users/haidertoha/Code/pure_streets/docs/audit/screenshots/our-team/375.png
source: internal
---

## Claim
The four "Contact" mailto links render about 36-39px tall (`padding: 9px 12px` +
~0.84rem text + 1px border), below the recommended 44x44px for primary touch
controls, though they clear the 24px WCAG 2.2 SC 2.5.8 AA hard minimum.

Verified:
- `.team-contact` is `padding: 9px 12px; font-size: 0.84rem` (13.44px) with a 1px
  border (style.css:2725-2736). Fixed vertical = 18px padding + 2px border = 20px;
  with a single ~13.44px line box at normal line-height (~17-19px) the rendered box
  is ~37-39px tall — below 44px, above the 24px AA minimum.
- These are the only per-card action, one per card (our-team.html:58, 65, 72, 79),
  shown as small single pills on mobile (375.png).
- design-rules D17 / coding-rules A1 set 44px as the aim for primary touch
  controls.

## Why it matters
On touch devices a ~36-39px target is easy to mis-tap. Per-area contact is a core
conversion path for the page, so undersized targets cost real taps for
motor-impaired and mobile users. Note this is an aspirational usability gap (it
meets WCAG 2.2 SC 2.5.8 AA at 24px), so it is medium/discretionary, not a hard AA
conformance failure.

## Recommended action
Increase the effective hit area to >=44px tall (add block padding or a
`min-height`) without noticeably changing the visible pill style. Verify it does
not reflow the card `min-height: 300px` (style.css:2691). Behaviorally safe: it
touches no `href`/`mailto`, no JS hook (PureBot's `linkFor` scans by text/href, not
size), no localStorage key, copy, or asset.

## How to verify it's fixed
Inspect the rendered link box at 375 and confirm >=44px height. Before/after
screenshot the cards at 375 and 1440 to confirm no layout shift beyond the intended
target growth, and that the four cards' `min-height` and spacing are unchanged.

## Vote tally
failedToRefute: 2 / 3

- failedToRefute: Factually supported. `.team-contact` padding:9px 12px,
  font-size:0.84rem (13.44px), 1px border. Fixed vertical = 18px + 2px = 20px; with
  a ~13.44px line box at ~1.3-1.4 line-height (~17-19px), total ~37-39px — below
  44px, above the 24px AA minimum (which the claim honestly acknowledges). D17 / A1
  set 44px as the target for primary controls, and these are the only per-card
  action. Real best-practice gap; padding/min-height fix is safe if it doesn't
  reflow card min-height (2691).
- failedToRefute: Measurement supported — ~36-40px tall, below the D17 / A1 aim of
  44px for the per-card action. It DOES meet WCAG 2.2 SC 2.5.8 AA (24px), so this is
  an aspirational/usability gap, not an AA failure — discretionary, low priority.
  Behaviorally safe: adding block padding/min-height touches no href/mailto, no JS
  hook, no localStorage/copy/asset; only caveat is to avoid reflowing card
  min-height (2691).
- refuted: Already meets the binding standard — at ~36px tall x ~74px wide it
  clears WCAG 2.2 SC 2.5.8 AA (24x24), which the candidate concedes. 44px is an
  aspirational "aim" (A1) / D17 target for PRIMARY controls; these are SECONDARY
  per-card mailto links (the page's primary CTA is the green "Work with us"
  button). axe flags nothing here. Enlarging the deliberately-styled pill
  (style.css:2725-2730) is a visual change with card-reflow risk chasing a
  non-required target — a borderline polish call.
