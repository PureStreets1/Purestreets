---
id: skeptic-vote-batching
phase: orchestration
agent: orchestrator
timestamp: 2026-06-27
chosen: B
---
## Problem
Phase 3/6 require, for each candidate finding, parallel ×3 skeptics that try to
refute it (keep findings where ≥2 fail to refute). Literally per-finding, 9 pages
× ~6 findings × 3 votes ≈ 160 agent calls per review round — intractable and
mostly redundant.

Scoring: 0–10 per criterion, higher = better (for risk/cost, higher = lower).

## Alternatives considered
### Option A — Literal 3 votes per finding
Maximal rigor, ~160 agents/round. Alignment 8 · Risk 8 · Cost 2 · Reversibility 9 — 27/40
### Option B — 3 skeptics per PAGE, each refutes the whole candidate list
Each of 3 independent skeptics receives all of a page's candidates and returns a
per-finding verdict; keep findings ≥2 skeptics fail to refute. 9 × 3 = 27
agents/round; preserves 3 independent adversarial perspectives per finding.
Alignment 8 · Risk 8 · Cost 8 · Reversibility 9 — 33/40
### Option C — 1 skeptic per finding
Cheap but loses the majority-vote robustness. Alignment 5 · Risk 6 · Cost 9 · Reversibility 9 — 29/40

## Decision
Chose **B** (33/40). Batching at page granularity keeps the exact decision rule
(≥2 of 3 independent skeptics must fail to refute) and 3 distinct perspectives
per finding, while cutting agent count ~6×. Each skeptic still judges every
finding individually; only the dispatch is batched.

## How to reverse
Re-run the critique/review Workflow with per-finding voting (expand the vote
stage to map over findings instead of pages).
