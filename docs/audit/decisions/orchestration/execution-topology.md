---
id: execution-topology
phase: orchestration
agent: orchestrator
timestamp: 2026-06-27
chosen: B
---
## Problem
How to realize the 8-phase pipeline given this environment: Claude Code dynamic
Workflows run subagents in the background, and background agents have unreliable
access to interactive MCP browser tools. Deterministic capture (screenshots,
lighthouse, axe) and git operations need to be reliable.

Scoring: 0–10 per criterion, higher = better (for risk/cost, higher = lower).

## Alternatives considered
### Option A — One monolithic background Workflow (capture inside agents)
Pros: single script, matches "write a JS harness" literally.
Cons: an LLM agent fumbling a Playwright install/loop silently degrades the
whole audit; no human-in-loop checkpoints; costly to re-run on mid-pipeline
failure. Alignment 6 · Risk 4 · Cost 5 · Reversibility 6 — 21/40
### Option B — Staged Workflow runs + orchestrator does capture/git directly
Cognitive phases (research, critique, plan, implement, review) run as Workflow
fan-outs; deterministic capture + git + verification run in the main loop where
they are debuggable. Recommended multi-phase pattern.
Pros: reliable real artifacts; adapt between phases; resumable.
Cons: more orchestrator turns. Alignment 9 · Risk 8 · Cost 7 · Reversibility 9 — 33/40
### Option C — No Workflow tool; drive every subagent via the Agent tool inline
Pros: full control. Cons: loses deterministic fan-out/pipeline semantics the
user explicitly requested; more orchestrator bookkeeping.
Alignment 4 · Risk 7 · Cost 5 · Reversibility 8 — 24/40

## Decision
Chose **B** (33/40). Screenshots/lighthouse/axe are mechanical and must be real,
so the orchestrator runs them directly; Workflow fan-outs handle cognition. The
canonical harness scripts are persisted under `docs/audit/plan/` so the JS
harness the user asked for is inspectable and re-runnable.

## How to reverse
Process choice only — nothing to undo. The persisted workflow scripts under
`docs/audit/plan/` can be re-run with the Workflow tool's `scriptPath` option.
