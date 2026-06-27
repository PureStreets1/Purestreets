---
id: muslim-faith-exemplar
phase: phase2
agent: inspiration-researcher
timestamp: 2026-06-27
chosen: A
---

## Problem
PureStreets is specifically a Muslim, faith-inspired grassroots litter-picking
movement, so the inspiration set needs at least one strong **Muslim-led** example
whose design is genuinely worth learning from (the brief bars generic templates
and award-bait). Several UK Muslim orgs are plausible, but they differ sharply in
how design-led they are and how well their model maps to a community *volunteer
movement* (vs a donation portal). Only one slot should go to the Muslim exemplar
to keep the set balanced, so this is a single-choice judgement with >1 defensible
option.

Scoring: 0–10 per criterion, higher = better (for regression-risk/cost, higher =
lower risk / lower effort). Criteria: alignment to PureStreets' grassroots-Muslim-
community-service brief; regression-risk (chance the example misleads the visual
direction, e.g. a templated charity-CMS look); cost to evidence and feature well;
reversibility of the pick.

## Alternatives considered

### Option A — Ramadan Tent Project / Open Iftar (chosen)
Muslim-led, student-born (SOAS, 2013), community-first; faith expressed through
hospitality and service; explicitly welcomes "all faiths and none".
Pros: near-mirror of PureStreets' ethos; genuinely design-led (distinctive jade
brand, restraint, count-up impact stats, live countdown); directly observed and
well-evidenced. Cons: events/hospitality not litter, so some patterns transfer by
analogy rather than 1:1.
- Alignment 10 · Regression-risk 8 · Cost 8 · Reversibility 9 — **35/40**

### Option B — Inspirited Minds
Muslim-led, grassroots, faith-based mental-health charity (London, 2014).
Pros: strong grassroots + faith + student-era-founding fit; community-care mission.
Cons: design quality could not be verified (homepage returned HTTP 403 to every
fetch attempt); real risk it is a fairly templated WordPress charity site that
would not model the "confident elevation" PureStreets is aiming for; mental-health
focus is further from public-space/environmental action.
- Alignment 8 · Regression-risk 5 · Cost 4 · Reversibility 9 — **26/40**

### Option C — National Zakat Foundation
National UK Zakat collection/distribution charity.
Pros: well-known, credible, clearly Muslim; evidenced via search.
Cons: it is a transactional donation/grant portal (agency-built by Websquare), not
a grassroots volunteer movement — the model and aesthetic risk pulling PureStreets
toward a generic charity-CMS look, exactly what the brief warns against; visual
quality not independently verified.
- Alignment 6 · Regression-risk 4 · Cost 6 · Reversibility 9 — **25/40**

(Penny Appeal and Muslim Hands were also considered and set aside: slick but
big-charity *fundraising* aesthetics, even further from a grassroots community
movement.)

## Decision
Chose **A — Ramadan Tent Project** (35/40). It is the only candidate that is both
demonstrably design-led (verified by direct browser observation) and an almost
exact ethos-match: Muslim, student-founded, community-and-welcome-first, faith
shown through service. Its transferable patterns — radical "all faiths and none"
welcome, count-up impact stats, restrained single-colour brand confidence — map
cleanly onto PureStreets without dragging in a donation-portal look. A Rocha UK is
retained separately as the *faith + environment* exemplar (Christian), so the set
keeps two complementary faith voices rather than two Muslim ones.

## How to reverse
Delete or replace
`docs/audit/findings/inspiration/ramadan-tent-project.md` with a different
Muslim-led exemplar (Option B or C), and update this decision's `chosen` field.
No code or other findings depend on this pick, so swapping is isolated and free.
