---
id: mobile-eyebrow-occlusion
phase: phase7
agent: css-fix-implementer
status: fixed
severity: medium
scope: design
evidence:
  - docs/audit/runs/hero-probe.json
  - style.css:2711
  - our-team.html
source: internal
---

## Claim
At mobile widths the `.team-hero` eyebrow renders ~3px UNDER the fixed header.
The Phase 7 deterministic hero-clearance probe (`docs/audit/runs/hero-probe.json`)
measures, at scroll-top:
- 375: `headerBottom=137 eyebrowTop=134 gap=-3` (FAIL)
- 768: `headerBottom=137 eyebrowTop=134 gap=-3` (FAIL)

Desktop is fine (1280: gap=21; 1440: gap=21). The cause is the hero's mobile top
padding flooring at the base clamp minimum `132px` (`.team-hero` padding
`clamp(132px, calc(11.2vw + 46px), 203px)`, style.css:2711), below the ~137px
rendered mobile header (portrait `logo.png` 343x480 at the `.brand` 78px mobile
floor → ~109px logo + 28px header padding). PRE-EXISTING; outside the original
desktop-only T3 finding scope. Note `.team-hero`'s own single-column breakpoint is
`<=760px`, so the 768 failure occurs in the two-column layout.

## Why it matters
The eyebrow is the first rung of the eyebrow → H1 ladder (design-rules D1/D3);
having it under the opaque `is-scrolled` subpage header is a content-occlusion
defect at the two most common mobile widths, inconsistent with the now-fixed
index/contact/work heroes and with terms/policies (which already pass).

## Recommended action
Apply the same `--header-h` mobile-clearance pattern used for `.contact-hero`'s
`<=860` override: add a mobile (`<=860px`, covering 375 AND 768) `padding-top:
calc(var(--header-h) + 5px)` to `.team-hero` so the eyebrow clears the mobile
header with a small positive gap. Do NOT change desktop padding (1280/1440 already
pass). CSS-only; touches no JS flow, `data-*` hook, localStorage, anchor, copy, or
asset.

## How to verify
Re-run the hero-probe; `our-team.html` at 375 and 768 must report
`eyebrowTop > headerBottom` (target gap ~2-8px). Confirm 1280/1440 gaps are
unchanged (21/21). Authorised by
`docs/audit/decisions/phase7/mobile-eyebrow-clearance.md`.
