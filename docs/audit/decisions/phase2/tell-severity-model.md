---
id: tell-severity-model
phase: phase2
agent: slop-researcher
timestamp: 2026-06-27
chosen: B
---

## Problem
Current (2025-2026) sources disagree on whether several visual patterns are
"AI slop" at all. The same techniques are described as overused clichés to
purge AND as legitimate craft when used with intention:

- **Glassmorphism / gradients / big type / bento grids / generous radius** are
  named as things "creatives are so over in 2026"
  (https://www.creativeboom.com/insight/10-trends-creatives-are-so-over-in-2026/)
  and as the AI-slop fingerprint
  (https://www.925studios.co/blog/ai-slop-web-design-guide ,
  https://dev.to/alanwest/why-every-ai-built-website-looks-the-same-blame-tailwinds-indigo-500-3h2p).
- The SAME patterns are endorsed as best practice when applied deliberately:
  glassmorphism "used judiciously… in the right places"
  (https://www.nngroup.com/articles/glassmorphism/), oversized type and bento
  as 2026 SaaS direction
  (https://www.eloqwnt.com/blog/saas-website-design-trends), emoji "aren't
  inherently unprofessional… require careful consideration"
  (https://smarticons.co/blog/emoji-icons-web-design/).

The Phase 3 critics consume `anti-slop-checklist.md` and turn it into pass/fail
findings that drive real visual edits to a *finished, signed* design
(PureStreets — a faith-inspired community litter-picking site, not a SaaS).
How the checklist classifies these ambiguous patterns decides whether critics
generate accurate findings or false positives that push the site toward an
equally-generic "anti-trend" over-correction. This is a judgement call with
more than one defensible answer, so it is logged.

Scoring: 0–10 per criterion, higher = better (for risk/cost, higher = lower).
Total /40 across alignment · regression-risk · cost · reversibility.

## Alternatives considered

### Option A — Flat binary list (every listed pattern is an automatic fail)
Every tell is treated as slop; any gradient, rounded card or centered block
fails the audit.
Pros: trivially simple for critics to apply; maximal "teeth"; nothing slips
through.
Cons: directly contradicts the half of current sources (NN/g, SaaS-trend
writers) that call these techniques legitimate when intentional; high
false-positive rate; on a finished, intentional design it manufactures churn
(critics fail the brand's green gradient and colored shadows, implementers
strip them) — the exact over-correction the run must avoid.
- Alignment 4 · Regression-risk 3 · Cost 8 · Reversibility 6 — **21/40**

### Option B — Two-tier severity (HARD tell vs CONDITIONAL smell) + co-occurrence test *(chosen)*
Each item is tagged **HARD** (almost always slop regardless of context — e.g.
default Inter+indigo gradient, emoji-as-icon-system, AI stock blobs, vague
aspirational copy, the four-point "AI sparkle") or **CONDITIONAL** (only slop
when unjustified — e.g. glassmorphism, gradients, generous radius, bento, big
type). A CONDITIONAL smell may only be raised as a finding when it fails a
**co-occurrence / justification test**: it co-occurs with >=2 other tells, OR
it is applied uniformly with no hierarchy, OR the design has no rationale for it.
Pros: matches BOTH camps of current sources (clear slop is failed; intentional
craft is protected); low false-positive rate; lets the critic distinguish
PureStreets' deliberate colored layered shadows / brand gradient from generic
indigo slop.
Cons: more work per item for the critic (must run the test, not just eyeball);
slightly more complex document.
- Alignment 9 · Regression-risk 8 · Cost 6 · Reversibility 9 — **32/40**

### Option C — Advisory only (list tells as "considerations", no pass/fail)
Critics get a reading list, not a rubric.
Pros: lowest regression risk; honest about ambiguity.
Cons: gives the critics no teeth; the run's explicit purpose is an anti-slop
overhaul (see decisions/phase0/conflict-resolution-full-overhaul.md), which
this under-serves; outcomes become inconsistent between critics.
- Alignment 5 · Regression-risk 9 · Cost 7 · Reversibility 9 — **30/40**

### Option D — Numeric slop-score (N tells present => page fails)
Count tells per page; fail above a threshold.
Pros: quantitative, scannable.
Cons: weights unequal tells equally (one egregious AI hero == three trivial
smells); the threshold is arbitrary and indefensible; a page with a single
severe tell can pass.
- Alignment 6 · Regression-risk 6 · Cost 5 · Reversibility 7 — **24/40**

## Decision
Chose **B (32/40)**. The checklist tags every item HARD or CONDITIONAL and
ships a co-occurrence/justification test that critics must apply before raising
a CONDITIONAL smell as a finding. This reconciles the conflicting sources
(clear slop fails; deliberate craft is protected), minimises false positives on
an already-intentional design, and still gives Phase 3 a real rubric. Severity
tags are guidance the critic can override *with written rationale in the
finding*, never a hard gate.

## How to reverse
Documentation-only. To revert to a flat list, delete the `[HARD]`/`[CONDITIONAL]`
tags and the "How to use" co-occurrence section from
`docs/audit/rules/anti-slop-checklist.md`; every tell then reads as an absolute
fail (Option A). No code or asset is affected.
