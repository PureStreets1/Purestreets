---
id: extend-t6-canonical-to-all-pages
phase: phase5
agent: orchestrator
timestamp: 2026-06-27
chosen: A
---
## Problem
Verified theme T6 (canonical + Open Graph/Twitter + JSON-LD head metadata) was
raised on 7 of 9 pages. mosques-isocs has no T6 finding (its critic flagged other
issues) and policies has no T6 finding because 2 of its 3 skeptics hit the 529
outage (its candidates defaulted to rejected — see
transient-failure-recovery.md). Shipping canonical/OG on 7 pages but not on
policies/mosques leaves an inconsistent, partially-broken SEO/share surface.
Scoring: 0–10 per criterion, higher = better (risk/cost higher = lower).

## Alternatives considered
### Option A — Extend T6 to policies + mosques (write 2 verified-by-analogy findings)
canonical/OG/JSON-LD is render-neutral and unambiguously correct for every page;
7 sibling pages independently passed adversarial verification on identical head
markup. Instantiating the same fix on the remaining 2 pages is well-grounded.
- Alignment 9 · Regression risk 9 (head-only, render-neutral) · Cost 8 · Reversibility 9 — 35/40
### Option B — Re-run policies critique+vote to recover its real findings
More rigorous for policies, but: its non-meta issues are global themes (T1/T2/T3/
T5/T8 in style.css/script.js) that already cover policies; the only policies-
specific gap is head-meta. A full re-run spends tokens to near-certainly
re-confirm duplicates. Doesn't help mosques.
- Alignment 7 · Risk 8 · Cost 4 · Reversibility 9 — 28/40
### Option C — Leave policies/mosques without head-meta (respect literal findings)
- Alignment 4 (knowingly inconsistent SEO) · Risk 9 · Cost 9 · Reversibility 9 — 31/40

## Decision
Chose **A** (35/40). Two findings are written
(`findings/phase3/{policies,mosques-isocs}/head-metadata-canonical-og.md`,
status verified-by-analogy) so the change still traces to a finding per the
contract, and all 9 pages get consistent, correct head metadata. policies' other
(global-theme) issues are delivered by WS-CSS/WS-JS automatically.

## How to reverse
Delete the two findings and remove the head-metadata block from policies.html /
mosques-isocs.html; the other 7 pages are unaffected.
