---
id: mobile-eyebrow-clearance
phase: phase7
agent: orchestrator
timestamp: 2026-06-27
chosen: A
---
## Problem
The Phase 7 hero-clearance probe (deterministic, docs/audit/runs/hero-probe.json)
found that on charities, our-team, and volunteer-month the hero eyebrow renders
~3-5px UNDER the fixed header at mobile (375/768): eyebrowTop 132-134 vs
headerBottom 137 (gap -3 to -5). This is PRE-EXISTING (the overhaul changed only
desktop hero padding for those pages; mobile floored at the original clamp min
132 < the ~137px mobile header) and was outside the original T3 finding scope
(T3 was a desktop 1280/1440 finding). The now-fixed index/contact/work clear the
mobile header (gap 20-40), so leaving these three clipped is inconsistent.
Scoring: 0–10 per criterion, higher = better (risk/cost higher = lower).

## Alternatives considered
### Option A — Fix the 3 mobile occlusions now (evidence-backed findings + same --header-h pattern)
Write findings (probe evidence), extend the T3 mobile clearance to these heroes.
- Alignment 8 · Regression risk 8 (mobile-only padding bump, deterministically re-verified) · Cost 7 · Reversibility 9 — 32/40
### Option B — Defer as a documented follow-up (strict scope: pre-existing, not a regression, no original finding)
- Alignment 5 (ships an inconsistent, visibly-clipped mobile result) · Risk 9 · Cost 9 · Reversibility 9 — 32/40
### Option C — Loosen the probe tolerance to pass them
Hides a real defect. Alignment 2 · Risk 7 · Cost 10 · Reversibility 8 — 27/40

## Decision
Chose **A** (32/40, tie with B broken on quality/consistency). The defect is real
(deterministic measurement), the fix is the identical low-risk --header-h pattern
already validated on contact's mobile, and a polished result should not clip
eyebrows on half the subpages. Findings are written first (probe evidence), so the
change still traces to a finding. This is the SECOND and final Phase 7 fix round
(run contract: ≤2 rounds); after it, the loop terminates regardless and any
residue is documented as deferred.

## How to reverse
Revert the mobile padding bump on .charity-hero / .team-hero / .volunteer-hero in
style.css; desktop and the other heroes are unaffected.
