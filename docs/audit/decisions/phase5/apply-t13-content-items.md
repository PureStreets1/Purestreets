---
id: apply-t13-content-items
phase: phase5
agent: orchestrator
timestamp: 2026-06-27
chosen: A
---
## Problem
Theme T13 (two verified findings) covers copy/label changes the planner gated on
"content sign-off": the PureBot greeting "how can i help you?" → "how can I help
you?" (the static bot message in all 9 *.html) and the charities Tally iframe
`title="PureStreets contact form"` → "…charity partner form". The user is not
available to sign off, and the autonomy contract says decide + log.
Scoring: 0–10 per criterion, higher = better (risk/cost higher = lower).

## Alternatives considered
### Option A — Apply both (they are corrections, not rewrites)
The greeting change capitalises the pronoun "I" (a grammar fix; the rest of the
line — "Assalamu alaikum," — is already correctly capitalised, so the lowercase
"i" is a typo, not a casual-lowercase style). The iframe `title` is an
accessibility *name* (not visible copy) and is currently factually wrong (it
labels a partner form as a "contact form"). Both trace to verified findings.
- Alignment 9 · Regression risk 8 (no behavior/layout/meaning change) · Cost 9 · Reversibility 10 — 36/40
### Option B — Defer both (ship without them)
- Alignment 4 (leaves a known typo in the polished result) · Risk 9 · Cost 9 · Reversibility 10 — 32/40
### Option C — Apply greeting, defer iframe title
Inconsistent; the iframe title is the lower-risk of the two (non-visible a11y name).
- Alignment 5 · Risk 8 · Cost 8 · Reversibility 10 — 31/40

## Decision
Chose **A** (36/40). Both are objective corrections (grammar; accurate a11y name),
finding-backed, with no change to meaning, voice, branding, behavior, or layout.
Shipping a lowercase-"i" greeting would itself be the kind of sloppiness this
overhaul exists to remove. The greeting is applied to ALL 9 pages for consistency
(per T13). If the maintainer dislikes either, both are one-token reverts.

## How to reverse
Revert the single-word edits: "I"→"i" in the `purebot-message--bot` line of each
*.html, and the charities iframe `title` back to "PureStreets contact form".
