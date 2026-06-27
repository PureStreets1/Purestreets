---
id: work-with-us-head-metadata
phase: phase5
agent: WS-HTML-work-with-us
timestamp: 2026-06-27
chosen: A
---
## Problem
Finding `missing-canonical-og-meta` (verified) requires adding a self-referential
`<link rel="canonical">`, Open Graph, `twitter:card`, and inline JSON-LD to
`work-with-us.html`'s head. Three sub-choices are not fully fixed by the finding
and must be decided: (1) which **absolute origin base** to use (canonical/og:url
must be absolute, not relative); (2) which **og:image** asset — the finding says
"e.g. `assets/img/logo.png`" but the cross-page convention in the implementation
plan uses `assets/img/hero-banner.jpg`; (3) the **JSON-LD entity + how much** to
include while staying "minimal" and only marking up content visible on the page
(coding-rules S4). Scoring: 0–10 per criterion, higher = better (risk/cost higher
= lower).

## Alternatives considered
### Option A — Site-wide convention: absolute GitHub-Pages URLs, hero-banner.jpg OG image, minimal inline Organization JSON-LD, og:type=website
Origin base `https://purestreets1.github.io/Purestreets/` (the GitHub-Pages
default derived from the git remote `github.com/PureStreets1/Purestreets`);
canonical/og:url = base + `work-with-us.html`; og:image = base +
`assets/img/hero-banner.jpg` (a 1200-wide landscape photo, the correct shape for
a `summary_large_image` social card). JSON-LD is a single inline `Organization`
node (name, url, logo, `sameAs` → the four footer social links that are visible
on the page). Matches the plan (Organization JSON-LD, hero-banner OG image),
coding-rules S2/S3/S4, and the task brief. Head-only, render-neutral, no fetch.
- Alignment 9 · Regression risk 9 (head-only, no network, no DOM/CSS impact) · Cost 9 · Reversibility 10 — **37/40**
### Option B — Literal finding: logo.png OG image, relative canonical/og:url
`logo.png` is a 343×480 portrait — it crops badly in a landscape share card —
and relative canonical/og:url URLs are invalid (both must be absolute), so this
ships a broken OG/canonical surface.
- Alignment 5 · Risk 6 (relative canonical is a real SEO defect) · Cost 9 · Reversibility 10 — 30/40
### Option C — Rich graph (WebPage + JobPosting/Organization)
Modeling "Work with us" as `JobPosting` would require salary/dates/location data
that does not exist on the page; inventing it is structured-data spam (Google
penalty risk) and violates S4 "mark up only content visible on the page" plus the
"minimal" mandate.
- Alignment 5 · Risk 6 · Cost 7 · Reversibility 9 — 27/40

## Decision
Chose **A** (37/40). It satisfies the finding and coding-rules S2/S3/S4, uses the
task-mandated origin and og:image, and keeps the JSON-LD a minimal, accurate
`Organization` node whose every value is visible on the page (logo + the four
footer socials). All tags are crawler-read metadata or a non-rendered
`type="application/ld+json"` data block — zero pixels, zero new network requests,
zero behavior change. **Caveat:** the origin base is the GitHub-Pages default
inferred from the remote; if a custom domain is adopted, the five absolute URLs
(canonical, og:url, og:image, JSON-LD url, JSON-LD logo) must be re-pointed.

## How to reverse
Delete the inserted block in `work-with-us.html` head (the `<link rel="canonical">`,
the `og:*` / `twitter:card` `<meta>` tags, and the `<script type="application/ld+json">`
Organization node). No other file is affected.
