---
id: scoped-reverification
phase: phase7
agent: orchestrator
timestamp: 2026-06-27
chosen: B
---
## Problem
Phase 6 confirmed 54 fixes and 4 insufficient issues (all CSS, all on hero
header-clearance T3/T4 + the coral token T1 on one extra background). Phase 7
must fix them and re-verify. Re-running the full Workflow D (14 agents, ~1.9M
tokens) to re-check 4 localized, deterministically-measurable CSS issues is
disproportionate. Scoring: 0–10 per criterion, higher = better (risk/cost higher = lower).

## Alternatives considered
### Option A — Full Workflow D re-run after the fix
Maximal coverage. Alignment 7 · Risk 8 · Cost 2 · Reversibility 9 — 26/40
### Option B — Fix + targeted DETERMINISTIC re-verification of the 4 issues
(1) WCAG contrast math for --coral-text on every eyebrow background; (2) re-run
axe on the affected pages (the color-contrast node must clear); (3) a Playwright
hero-clearance probe asserting every subpage hero's topmost element (eyebrow)
renders below the fixed header at 375/768/1280/1440; (4) re-capture affected
pages for a visual spot-check; (5) extend flow-test to F2/F3 and re-run all flows.
These checks are exact and target precisely what Phase 6 flagged.
Alignment 9 · Risk 8 · Cost 8 · Reversibility 9 — 34/40
### Option C — Fix and trust it (no re-verify)
Cheapest, but unverified. Alignment 4 · Risk 4 · Cost 10 · Reversibility 9 — 27/40

## Decision
Chose **B** (34/40). The 4 issues are contrast (a number) and header-occlusion
(a measurable box relationship) — both verifiable deterministically and more
reliably than by image-reading agents. A full re-review is reserved only if the
deterministic checks surface something ambiguous. The loop is bounded to 2 fix
rounds per the run contract.

## How to reverse
If deterministic checks prove insufficient, run Workflow D again
(wf-D.workflow.js) for a full adversarial re-review of the affected pages.
