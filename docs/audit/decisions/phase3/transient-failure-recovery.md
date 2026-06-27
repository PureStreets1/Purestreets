---
id: transient-failure-recovery
phase: phase3
agent: orchestrator
timestamp: 2026-06-27
chosen: B
---
## Problem
Workflow B's critique stage succeeded (39+ verified findings, all 9 critics and
most skeptics returned), but a ~1-minute API outage (ConnectionRefused /
FailedToOpenSocket / "connection closed mid-response") killed the back half: all
9 writers, consolidate, flow-mapper, planner, and the skeptics for charities /
policies / work-with-us. Result: 0 findings persisted to disk; no themes / site
map / plan; and 3 pages falsely show verifiedCount:0 (their candidates defaulted
to rejected because no skeptic verdicts arrived). 48 agent transcripts ARE cached
on disk. Scoring: 0–10 per criterion, higher = better (risk/cost higher = lower).

## Alternatives considered
### Option A — Re-run wf-B from scratch
Pros: clean. Cons: throws away 3.1M tokens of successful critique; re-does the
expensive image-reading critics. Alignment 6 · Risk 6 · Cost 1 · Reversibility 8 — 21/40
### Option B — Resume via resumeFromRunId (same script)
Cached successful agents (critics + good skeptics) replay instantly; only the
FAILED calls re-run live now that the outage has passed. Reconstructs each
writer's inputs from cached critic results; the 3 dead-skeptic pages get real
verdicts. Pros: cheap, recovers everything incl. the false-zero pages. Cons:
depends on failed calls being treated as not-cached. Alignment 9 · Risk 8 · Cost 9 · Reversibility 9 — 35/40
### Option C — Hand-author a recovery workflow that reads critic transcripts
Parse agent-*.jsonl to recover candidates, then re-run only writers/consolidate/
plan. Pros: full control. Cons: brittle transcript parsing; more work.
Alignment 7 · Risk 6 · Cost 4 · Reversibility 8 — 25/40

## Decision
Chose **B** (35/40). The failures are purely transient infrastructure (clustered
in time, all connection-level), not logic — so a resume that re-runs just the
failed agents is the cheapest correct recovery. If resume instead reproduces the
nulls (treats failed calls as cached), fall back to Option C. Verification on
completion: totalVerified should rise above 39 (charities/policies/work-with-us
gain real findings) and themes/siteMap/plan should be non-null with files on disk.

## How to reverse
Resume is additive (writes findings + plan). If it misbehaves, `git stash`/discard
unstaged docs and re-run wf-B fresh, or pivot to Option C using the cached
transcripts under the workflow transcript dir.
