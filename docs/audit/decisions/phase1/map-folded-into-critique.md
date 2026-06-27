---
id: map-folded-into-critique
phase: phase1
agent: orchestrator
timestamp: 2026-06-27
chosen: B
---
## Problem
Phase 1 specifies a standalone page-mapper per page (purpose, flows, CTAs, JS
behaviors) feeding a flow-mapper. Running 9 dedicated mappers plus 9 critics
means each page is fully read twice, doubling image/token cost for largely the
same context.

Scoring: 0–10 per criterion, higher = better (for risk/cost, higher = lower).

## Alternatives considered
### Option A — Standalone page-mapper ×9, then critics ×9
Faithful to the literal phase split. Alignment 7 · Risk 8 · Cost 3 · Reversibility 9 — 27/40
### Option B — Critic emits a "Page map" section; flow-mapper synthesizes the site graph from the 9 HTML files + script.js + those map sections
The page-map deliverable still exists (written by the critic's writer), and the
runtime data (console/network/axe JSON) is already captured to disk, so nothing
is lost. Alignment 8 · Risk 8 · Cost 8 · Reversibility 9 — 33/40
### Option C — Drop per-page maps entirely; flow-mapper reads only HTML
Cheapest but loses the per-page purpose/flow deliverable. Alignment 4 · Risk 7 · Cost 9 · Reversibility 8 — 28/40

## Decision
Chose **B** (33/40). The critic already reads each page in full to critique it,
so it emits the page-map as a byproduct (written to phase3/<page>/_page-map.md).
The flow-mapper builds the site-wide graph from the HTML/JS source plus those
map sections. The deliverable is preserved at roughly half the read cost.

## How to reverse
Add a dedicated page-mapper stage before the critic in wf-B.workflow.js
(pipeline(PAGES, mapStage, critiqueStage, ...)).
