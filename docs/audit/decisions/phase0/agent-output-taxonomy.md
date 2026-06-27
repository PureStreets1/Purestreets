---
id: agent-output-taxonomy
phase: phase0
agent: agents-author
timestamp: 2026-06-27
chosen: B
---
## Problem
The pipeline's core rule (new CLAUDE.md) is "Every change must resolve a finding
in docs/audit/findings/." Seventeen context-isolated agents must therefore agree
on WHERE findings/votes/plans live and how a finding is identified, so a critic
can emit one, three skeptics can vote on it, a consolidator can verify it, a
planner can sequence it, and an implementer can cite the exact id that justified
its edit — all without sharing memory. The repo fixes some of this already
(findings/{inspiration,phase1,phase3,flows,review}/ exist; wf-A.workflow.js:64
shows the inspiration frontmatter `{id,phase,agent,status,scope,source}`), but the
nesting for critic vs skeptic vs verified output, and the finding-id scheme, are
undefined and have >1 defensible shape. I must fix one convention in all 17 files.

Scoring: 0–10 per criterion, higher = better (for risk/cost, higher = lower).

## Alternatives considered
### Option A — Flat: one file per page everywhere, overwritten in place
critic, skeptics and consolidator all write `phase3/<page>.md`. Pros: fewest
paths. Cons: agents are parallel + context-isolated, so a skeptic overwriting the
critic's file races/destroys evidence; no audit trail of refutations.
Alignment 5 · Risk 3 · Cost 8 · Reversibility 5 — 21/40
### Option B — Stage-nested dirs + stable `<page>-<slug>` ids (chosen)
`phase3/candidates/<page>.md` (critic) → `phase3/votes/<page>.skeptic-<n>.md`
(skeptics, n=1..3) → `phase3/<page>.md` + `phase3/index.md` (consolidator,
status: verified). Findings keyed `id: <page>-<slug>`; frontmatter mirrors the
existing inspiration schema. Pros: disjoint write paths (no races), full
refutation trail, ids stable across phases so implementers/planner cite them
verbatim. Cons: more directories. Alignment 9 · Risk 8 · Cost 7 · Reversibility 9 — 33/40
### Option C — One file PER finding (`phase3/<page>/<slug>.md`)
Maximal granularity. Pros: per-finding status. Cons: explosion of tiny files;
critic can't easily emit a coherent per-page candidate set in one write; harder
for skeptics to vote a whole page at once (the chosen batching unit per
skeptic-vote-batching.md). Alignment 7 · Risk 7 · Cost 5 · Reversibility 8 — 27/40

## Decision
Chose **B** (33/40). It gives every parallel agent a disjoint write path (no
clobbering), keeps the full critic→skeptic→consolidator audit trail, and yields
stable `<page>-<slug>` finding ids that planner and implementers cite verbatim to
satisfy "every change resolves a finding." It honors the page-granularity skeptic
batching (skeptic-vote-batching.md). Standard frontmatter for every finding:
`{id, phase, agent, status, scope, severity, evidence}` (evidence = repo path /
screenshot path / source URL). Flow contracts live in `findings/flows/<flow>.md`
(scope: behavior, status: verified); review findings in `findings/review/<page>.md`.
Planner output: `plan/implementation-plan.md` + `plan/workstreams/<owner>.md`.

## How to reverse
These are doc paths only. Re-run Workflows B–D after editing the path strings in
the agent files under `.claude/agents/`; no shipped code depends on them.
