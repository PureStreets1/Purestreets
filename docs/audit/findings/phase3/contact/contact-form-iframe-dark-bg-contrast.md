---
id: contact-form-iframe-dark-bg-contrast
phase: phase3
agent: critic
status: fixed
severity: med
scope: design
evidence:
  - style.css:2533-2540
  - style.css:2621-2624
  - contact.html:74
  - contact.html:75
  - docs/audit/runs/before/axe/contact.json
  - docs/audit/screenshots/contact/1440.png
  - docs/audit/screenshots/contact/375.png
source: internal
---

## Claim
The embedded contact form sets the iframe background to dark teal `#033236`
while the Tally embed is `transparentBackground=1`, so the form renders on dark
teal — producing in-frame text-contrast failures and a big dark rectangle on a
light page, inconsistent with the work-with-us form which uses a white iframe
background. `.tally-embed iframe` is `background: #033236; min-height: 720px`
(`style.css:2533-2540`), whereas `.tally-embed--work iframe` overrides to
`background: var(--white)` (`style.css:2621-2624`). The contact wrapper is
`class="tally-embed tally-embed--contact"` (`contact.html:74`), which has no
override, so it inherits `#033236`; and the iframe `src` includes
`transparentBackground=1` (`contact.html:75`), so the CSS background shows
through behind the form. The IDENTICAL form (`tally.so/embed/MeP2jX?...`) is
embedded on work-with-us forced white and on contact dark teal, proving this
dark-text form is designed for a light surface.
`docs/audit/runs/before/axe/contact.json` shows in-iframe `color-contrast`
nodes (`.tally-text > span`) plus `link-name`, consistent with dark-on-dark form
text, and `docs/audit/screenshots/contact/1440.png` / `375.png` show the form
area as a large flat dark-teal box dominating the section.

## Why it matters
A dark canvas behind a transparent form both harms legibility of the form's own
labels/helper text and reads as an unstyled/loading state on an otherwise warm
paper page (design-rules D11/D21 + visual consistency). The work page already
proves the lighter treatment works, so the inconsistency is the org's own,
provable from CSS + screenshots regardless of Tally internals.

## Recommended action
Give the contact form iframe a light background to match the work form (or drop
`transparentBackground=1`) so the Tally text renders on a legible surface. This
is a deliberate visual change — raise as a finding per `/CLAUDE.md` rather than
editing silently. Do not alter the Tally form id/URL or its data hooks; the
existing unstyled `.tally-embed--contact` modifier (`contact.html:74`) is the
natural scope for the new background rule. CSS-only, no-build, no JS impact.

## How to verify it's fixed
Load the page, confirm the embedded form fields/labels are readable; re-run axe
and confirm the in-iframe `color-contrast` nodes clear; compare before/after
screenshots for the intended (and only the intended) change.

## Vote tally
failedToRefute: 2 / 2

- **Skeptic 1 (failed to refute):** Correct on every verifiable point.
  style.css:2533-2540 sets .tally-embed iframe background:#033236 (dark teal),
  while style.css:2621-2624 overrides .tally-embed--work iframe to var(--white);
  contact.html:74 uses tally-embed/tally-embed--contact which has no override, so
  it inherits #033236; contact.html:75 includes transparentBackground=1, so the
  form sits on dark teal. All four screenshots show a large dark-teal box
  dominating the section; axe contact.json shows in-iframe color-contrast nodes
  (.tally-text>span) plus link-name, consistent with dark-on-dark form text. The
  dark/white inconsistency vs the work form is independently provable from
  CSS+screenshots regardless of Tally internals. Appropriately framed as a
  propose-finding visual change; Tally form id/URL untouched.
- **Skeptic 2 (failed to refute):** Supported. The IDENTICAL form
  (tally.so/embed/MeP2jX?...transparentBackground=1) is embedded on work-with-us
  (forced white via .tally-embed--work iframe, style.css:2623) and on contact
  (dark teal #033236 from base .tally-embed iframe, style.css:2538) — proving this
  dark-text form is designed for a light surface, so the dark teal makes its text
  fail. axe reports in-iframe color-contrast nodes (contact.json). The fix (give
  the contact iframe a light background) is a CSS-only change that does not alter
  the Tally form id/URL or data hooks. Caveat lowering confidence: the screenshot
  "dark void" is partly the unloaded lazy iframe, and the in-iframe axe nodes are
  cross-origin — but the same-form-on-white comparison is decisive.
