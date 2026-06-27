---
id: audit-tooling
phase: orchestration
agent: orchestrator
timestamp: 2026-06-27
chosen: A
---
## Problem
The audit needs real screenshots (4 viewports × 9 pages + states), Lighthouse
scores, and axe a11y results. The shipped site is intentionally no-build and
must not gain a build tool or runtime dependency.

Scoring: 0–10 per criterion, higher = better (for risk/cost, higher = lower).

## Alternatives considered
### Option A — Playwright + Lighthouse + axe installed into gitignored scratch
Installed under `docs/audit/runs/tooling/` (in `.gitignore`); used only at
audit time; never referenced by the shipped HTML/CSS/JS.
Pros: real, deterministic results; zero impact on shipped artifacts.
Cons: ~250 MB local scratch. Alignment 9 · Risk 9 · Cost 8 · Reversibility 10 — 36/40
### Option B — claude-in-chrome MCP only
Pros: no install. Cons: interactive MCP is unreliable in background Workflow
agents; no Lighthouse/axe JSON. Alignment 5 · Risk 5 · Cost 7 · Reversibility 9 — 26/40
### Option C — Add devDependencies to a committed root package.json
Pros: conventional. Cons: introduces a package.json/lockfile into a deliberately
no-build repo — violates a hard rule. Alignment 3 · Risk 6 · Cost 7 · Reversibility 7 — 23/40

## Decision
Chose **A** (36/40). Tooling lives entirely in gitignored scratch, so the
shipped site stays no-build and dependency-free while the audit still produces
real, reproducible metrics. `run-audit.sh [before|after]` reproduces any capture.

## How to reverse
`rm -rf docs/audit/runs/tooling` removes all tooling; nothing in the shipped
site references it. `.gitignore` already excludes `docs/audit/runs/`.
