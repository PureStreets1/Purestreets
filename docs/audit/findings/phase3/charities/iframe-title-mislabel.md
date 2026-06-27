---
id: iframe-title-mislabel
phase: phase3
agent: critic
status: fixed
severity: low
scope: content
evidence:
  - charities.html:82
  - charities.html:77
  - charities.html:100
  - charities.html:160
source: internal
---

## Claim
The Tally iframe's accessible name is `title="PureStreets contact form"`
(`charities.html:82`), but this section is the charity PARTNER form: the
eyebrow directly above it reads "Partner form" (`charities.html:77`), and the
same `MeP2jX` form is labelled "Partner form" in the footer
(`charities.html:100`) and in PureBot (`charities.html:160`). So assistive-tech
users hear a label ("contact form") that diverges from every visible label on
this page (coding-rules H7: honest accessible names). `script.js` does not read
the iframe `title`, so it is not a behavior hook.

## Why it matters
Screen-reader users hear "contact form" for the charity-partner enquiry — an
inaccurate accessible name that misrepresents the control's purpose and is
internally inconsistent with the page's own visible labelling.

## Recommended action
Rename the iframe `title` to match its purpose (e.g. "PureStreets charity
partner form"). The `title` attribute is non-visual, so there is no rendered
change, and it is not referenced by `script.js`, so no behavior changes.
(Note: the underlying form is documented as dual-purpose "partner / contact",
so "contact form" is not strictly false — but on this charity-partnership page
"partner form" is the accurate name. Copy/label change is justified by this
verified finding per CLAUDE.md.)

## How to verify it's fixed
Inspect the accessibility tree and confirm the iframe's accessible name reflects
the partner form. Confirm before/after screenshots at 375 and 1440 are
pixel-identical (title is non-visual).

## Vote tally
failedToRefute: 3 / 3

- **Skeptic 1 (failed to refute):** Verified: charities.html:82 iframe
  title="PureStreets contact form" while the same MeP2jX form is labelled
  'Partner form' by the eyebrow (77), footer (100) and PureBot (160). The
  accessible name is inconsistent with the page's own visible labelling
  (coding-rules H7 honest accessible names). The form ID is dual-purpose
  ('partner / contact' per CLAUDE.md) so 'contact form' is not strictly false,
  but on this charity-partnership page 'partner form' is the accurate name. Fix
  is render-neutral (iframe title is not part of layout) and behaviorally safe
  (script.js does not read the iframe title). Real, minor, safe.
- **Skeptic 2 (failed to refute):** Real, minor inconsistency: iframe
  title='PureStreets contact form' (charities.html:82) conflicts with this
  section's own 'Partner form' eyebrow (77) and the footer/PureBot 'Partner
  form' links (100,160) for the same MeP2jX form. The title attribute is
  non-visual accessibility metadata, is not read by script.js (no
  data-*/selector/title dependency) and is not rendered copy, so renaming is
  render-neutral and behaviorally safe (coding-rules H7/SEC2 honest names). Low
  confidence because 'contact form' is partly defensible (CLAUDE.md documents
  MeP2jX as the 'partner / contact' form), but within this page the mislabel is
  genuine and the fix is safe.
- **Skeptic 3 (failed to refute):** Minor but evidence-backed, not slop. The
  Tally iframe accessible name is title="PureStreets contact form"
  (charities.html:82), yet this page labels the same MeP2jX form 'Partner form'
  in three visible places: the eyebrow directly above it (charities.html:77),
  the footer link (100), and the PureBot link (160). So AT users hear a label
  that diverges from every visible label on the page — a concrete internal
  inconsistency, coding-rules H7 (honest accessible names). The title attribute
  is non-visual, so the fix is render-neutral and touches no data-* hook or
  localStorage. Confidence is low because the form is documented as dual-purpose
  ('partner / contact', CLAUDE.md), so 'contact form' is defensible and the gain
  is marginal — but the claim is supported, not a pure taste call.
