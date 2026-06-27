---
id: mobile-eyebrow-occlusion
phase: phase7
agent: css-fix-implementer
status: fixed
severity: medium
scope: design
evidence:
  - docs/audit/runs/hero-probe.json
  - style.css:2371
  - charities.html
source: internal
---

## Claim
At mobile widths the `.charity-hero` eyebrow ("Charity partnerships") renders
~5px UNDER the fixed header. The Phase 7 deterministic hero-clearance probe
(`docs/audit/runs/hero-probe.json`) measures, at scroll-top:
- 375: `headerBottom=137 eyebrowTop=132 gap=-5` (FAIL)
- 768: `headerBottom=137 eyebrowTop=132 gap=-5` (FAIL)

Desktop is fine (1280: gap=91; 1440: gap=84). The cause is the hero's mobile top
padding flooring at the base clamp minimum `132px` (`.charity-hero` padding
`clamp(132px, calc(11.2vw + 46px), 203px)`, style.css:2371), which is below the
~137px rendered mobile header (the portrait `logo.png` 343x480 at the `.brand`
78px mobile floor → ~109px logo + 28px header padding). This is PRE-EXISTING and
was outside the original desktop-only T3 finding scope.

## Why it matters
The eyebrow is the first rung of the eyebrow → H1 ladder (design-rules D1/D3);
having it sit under the opaque `is-scrolled` subpage header is a content-occlusion
defect at the two most common mobile widths, and is inconsistent with the
now-fixed index/contact/work heroes (which clear the mobile header) and with
terms/policies (which already pass).

## Recommended action
Apply the same `--header-h` mobile-clearance pattern used for `.contact-hero`'s
`<=860` override: add a mobile (`<=860px`) `padding-top: calc(var(--header-h) +
5px)` to `.charity-hero` so the eyebrow clears the mobile header with a small
positive gap. Do NOT change desktop padding (1280/1440 already pass). CSS-only;
touches no JS flow, `data-*` hook, localStorage, anchor, copy, or asset.

## How to verify
Re-run the hero-probe; `charities.html` at 375 and 768 must report
`eyebrowTop > headerBottom` (target gap ~2-8px). Confirm 1280/1440 gaps are
unchanged (91/84). Authorised by
`docs/audit/decisions/phase7/mobile-eyebrow-clearance.md`.
