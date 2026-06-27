---
id: our-team-jsonld-roster-modeling
phase: phase5
agent: ws-html-our-team
timestamp: 2026-06-27
chosen: A
---
## Problem
The our-team head-metadata finding
(`findings/phase3/our-team/head-missing-canonical-og-jsonld.md`) and the planner's
WS-HTML-our-team row both call for JSON-LD `Organization` **with member `Person`s
for the visible team cards**. S4 (coding-rules) constrains JSON-LD to *only
content visible on the page*. The team grid (our-team.html:53-80) is four role
cards. Three are a single named person (Sumayyah / Partnerships, Maha / Digital
design, Nusaiba / Technology); the first card lists **four** names under one role
("Rayyan, Suweda, Waleed & Alisha" / Community lead). I must decide how to model
that roster (and whether to include Person entries at all, since the task labels
them "optional") without misrepresenting who is on the page.

Secondary, mechanical call: the origin base for canonical/og:url/og:image is the
GitHub-Pages default derived from the git remote `PureStreets1/Purestreets` →
`https://purestreets1.github.io/Purestreets/`. This MUST be confirmed/replaced if a
custom domain is later configured (a one-line find/replace of the host).

Scoring: 0–10 per criterion, higher = better (regression-risk/cost: higher = safer/cheaper).

## Alternatives considered
### Option A — Organization + `member`[], the 4-name card split into 4 Person entries (7 Person total)
Each visible first name becomes its own `Person {name, jobTitle}`; the four
community-lead names each carry `jobTitle: "Community lead"` (the card's role
label). Uses `member` (not `employee`) because the roster is volunteers
(CLAUDE.md) and the finding wording is "member Persons".
- Alignment 9 (matches finding + S4 — every one of the 7 names and its role label is literally on the page; accurate) · Regression-risk 9 (head-only, render-neutral, valid schema) · Cost 8 (7 short entries) · Reversibility 10 — **36/40**
### Option B — Organization + `member`[], one Person per card (4 Person), name = "Rayyan, Suweda, Waleed & Alisha"
- Alignment 5 (conflates four distinct, individually-named people into a single Person.name — semantically wrong, weak rich-result data) · Risk 9 · Cost 9 · Reversibility 10 — 33/40
### Option C — Organization only, no Person entries (task says Person is optional)
- Alignment 6 (satisfies the T6 baseline but forgoes the team-page-specific value the finding explicitly recommends) · Risk 10 (simplest) · Cost 9 · Reversibility 10 — 35/40

## Decision
Chose **A** (36/40). It is the most faithful to S4 ("only visible content") because
all seven names and their three role labels are visible in the grid, and it is the
only option that honours the finding's explicit "Organization with member Persons"
without conflating four people into one. Fields are limited to `name` + `jobTitle`
(plus org `name`/`url`/`logo` from existing same-origin assets) to stay minimal and
inline — no external fetch, no new network origin, no render. `member` is chosen
over `employee` because the team is volunteer-run. Canonical/og:url =
`origin + "our-team.html"`; og:image = `origin + "assets/img/hero-banner.jpg"`;
Organization `url` = origin; `logo` = `origin + "assets/img/logo.png"`.

## How to reverse
Delete the appended head block (the `<link rel="canonical">` … `</script>` JSON-LD)
from our-team.html. If a custom domain is adopted, replace the
`https://purestreets1.github.io/Purestreets/` host in the four URLs with the new
origin (canonical, og:url, og:image, Organization url/logo).
