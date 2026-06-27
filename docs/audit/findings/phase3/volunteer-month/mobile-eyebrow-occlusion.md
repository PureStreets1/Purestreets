---
id: mobile-eyebrow-occlusion
phase: phase7
agent: css-fix-implementer
status: fixed
severity: medium
scope: design
evidence:
  - docs/audit/runs/hero-probe.json
  - style.css:2195
  - volunteer-month.html
source: internal
---

## Claim
At mobile widths the `.volunteer-hero` eyebrow ("Volunteer of the month") renders
~5px UNDER the fixed header. The Phase 7 deterministic hero-clearance probe
(`docs/audit/runs/hero-probe.json`) measures, at scroll-top:
- 375: `headerBottom=137 eyebrowTop=132 gap=-5` (FAIL)
- 768: `headerBottom=137 eyebrowTop=132 gap=-5` (FAIL)

Desktop is fine (1280: gap=18; 1440: gap=18). The cause is the hero's mobile top
padding flooring at the base clamp minimum `132px` (`.volunteer-hero` padding
`clamp(132px, calc(11.2vw + 46px), 203px)`, style.css:2195), below the ~137px
rendered mobile header (portrait `logo.png` 343x480 at the `.brand` 78px mobile
floor → ~109px logo + 28px header padding). PRE-EXISTING; outside the original
desktop-only T3 finding scope.

## Why it matters
The eyebrow is the first rung of the eyebrow → H1 ladder (design-rules D1/D3);
having it under the opaque `is-scrolled` subpage header is a content-occlusion
defect at the two most common mobile widths, inconsistent with the now-fixed
index/contact/work heroes and with terms/policies (which already pass). The
section also carries `data-reveal`, so the occluded eyebrow is the page's first
visible content.

## Recommended action
Apply the same `--header-h` mobile-clearance pattern used for `.contact-hero`'s
`<=860` override: add a mobile (`<=860px`) `padding-top: calc(var(--header-h) +
5px)` to `.volunteer-hero` so the eyebrow clears the mobile header with a small
positive gap. Do NOT change desktop padding (1280/1440 already pass). CSS-only;
touches no JS flow, `data-*` hook, localStorage, anchor, copy, or asset (the
`#volunteer-intro` anchor and `data-reveal` are untouched).

## How to verify
Re-run the hero-probe; `volunteer-month.html` at 375 and 768 must report
`eyebrowTop > headerBottom` (target gap ~2-8px). Confirm 1280/1440 gaps are
unchanged (18/18). Authorised by
`docs/audit/decisions/phase7/mobile-eyebrow-clearance.md`.
