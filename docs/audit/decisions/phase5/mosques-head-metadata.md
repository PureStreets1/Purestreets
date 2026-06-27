---
id: mosques-head-metadata
phase: phase5
agent: WS-HTML-mosques-isocs
timestamp: 2026-06-27
chosen: A
---
## Problem
Finding `head-metadata-canonical-og` (verified-by-analogy to T6, authorised by
`extend-t6-canonical-to-all-pages.md`) requires adding canonical + Open Graph +
Twitter + inline JSON-LD to `mosques-isocs.html`. The *authorising* decision
fixes the WHAT; this decision fixes the HOW — the two consequential sub-choices
are (1) the absolute origin base for canonical/og:url/og:image and (2) which
JSON-LD entity/shape to inline. Both must be render-neutral, head-only, minimal,
and reuse existing page copy. Scoring: 0–10 per criterion, higher = better
(risk/cost higher number = lower risk/cost).

### Origin base
The git remote is `https://github.com/PureStreets1/Purestreets.git`, whose
GitHub-Pages *project-site* default URL is
`https://purestreets1.github.io/Purestreets/` (user lower-cased in the host,
repo case preserved in the path). canonical/og:url = base + `mosques-isocs.html`;
og:image = base + `assets/img/hero-banner.jpg`. **This is a derived default and
MUST be confirmed or replaced if a custom domain (CNAME) is later configured** —
if so, every page's canonical/og:url/og:image/JSON-LD `url`/`logo` base changes.

## Alternatives considered
### Option A — Organization-only JSON-LD, GitHub-Pages base, pure-insert block
Inline a single minimal `Organization` (name, url, logo, sameAs) — every field
backed by content visible on this page (logo image in the header brand; the four
social links in the footer; the org name throughout). canonical/og:url/og:image
use the derived GitHub-Pages base. The whole block is *inserted* before
`</head>` so no existing line is modified. Matches the "minimal inline JSON-LD
`Organization`" wording of the finding and the sibling subpage spec in the plan.
- Alignment 9 · Regression risk 9 (head-only, render-neutral, no line edited) · Cost 9 · Reversibility 10 — 37/40
### Option B — Add an `Event` for the Brothers-vs-Sisters Litter Pick too
The page shows a dated event ("Muslim Climate Action Week, 14th July to 20th
July"). Marking it up as `Event` mirrors index's pickup-card Event idea. But the
on-page date carries **no year**, so an ISO `startDate`/`endDate` would have to be
invented — risking an invalid/misleading rich result — and it exceeds the
finding's "minimal … Organization" scope.
- Alignment 6 · Risk 6 (invented date precision) · Cost 7 · Reversibility 9 — 28/40
### Option C — Richer Organization (postal address, contactPoint, description prose)
More complete schema, but address/contactPoint are not present as visible page
content (S4 says mark up only visible content) and a bespoke description would be
invented copy — both violate "reuse existing copy / visible-only".
- Alignment 5 · Risk 7 · Cost 6 · Reversibility 9 — 27/40

## Decision
Chose **A** (37/40). It is the minimal, fully render-neutral, finding-scoped fix:
an `Organization` whose every property is justified by content already visible on
the page, OG/Twitter that reuse the existing `<title>` and `<meta
name="description">` verbatim, and a canonical/og:url/og:image on the derived
GitHub-Pages base. `Event` (B) is rejected to avoid inventing an event year;
richer Organization (C) is rejected to avoid invented/invisible data. The block
is a pure insertion (no existing line changed), so the rendered pixels at all
viewports are unaffected.

## How to reverse
Delete the inserted canonical/OG/Twitter/JSON-LD block from
`mosques-isocs.html`'s `<head>`. If a custom domain is adopted, replace the
`https://purestreets1.github.io/Purestreets/` base in canonical, og:url,
og:image, and the JSON-LD `url`/`logo` with the live origin (site-wide change,
not mosques-only).
