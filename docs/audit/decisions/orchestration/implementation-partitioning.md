---
id: implementation-partitioning
phase: orchestration
agent: orchestrator
timestamp: 2026-06-27
chosen: B
---
## Problem
Phase 5 calls for parallel worktree implementers per "workstream." But this site
has exactly ONE stylesheet (`style.css`, 2772 lines) and ONE script
(`script.js`). Most visual changes touch `style.css`, so concern-partitioned
parallel worktrees would all edit the same file and guarantee merge conflicts.

Scoring: 0–10 per criterion, higher = better (for risk/cost, higher = lower).

## Alternatives considered
### Option A — Naive parallel worktrees per concern (literal Phase 5)
All touch style.css. Alignment 5 · Risk 2 (conflict-guaranteed, high regression)
· Cost 3 · Reversibility 6 — 16/40
### Option B — Partition by FILE ownership
9 page-implementers (one HTML file each → disjoint, safe parallel/worktree),
ONE css-implementer (single coherent style.css pass), ONE js-implementer. No two
agents touch the same file, so merges are conflict-free by construction.
Alignment 9 · Risk 8 · Cost 7 · Reversibility 8 — 32/40
### Option C — Fully sequential single implementer
One agent does everything in order. Safe but slow and loses parallelism on the
9 independent HTML files. Alignment 6 · Risk 9 · Cost 5 · Reversibility 8 — 28/40

## Decision
Chose **B** (32/40). File-level ownership preserves Phase 5's parallelism intent
where it is safe (the 9 page files) while serializing the shared bottleneck
(`style.css`, `script.js`) into single coherent passes. This serves the prompt's
own goal — "Preserve all behavior, no regression" — better than naive parallel
worktrees that fight over one CSS file. The css-implementer runs after page
implementers so it can account for any class/markup changes they introduce.

## How to reverse
Revert the relevant implement commits (`git revert <sha>`), or reset the branch
and re-run Workflow C with a different partitioning.
