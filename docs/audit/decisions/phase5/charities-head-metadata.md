---
id: charities-head-metadata
phase: phase5
agent: ws-html-charities
timestamp: 2026-06-27
chosen: A
---
## Problem
Finding `findings/phase3/charities/head-metadata-canonical-og.md` (verified)
requires adding a self-referential `<link rel="canonical">`, Open Graph + Twitter
share tags, and inline JSON-LD to `charities.html`'s head (coding-rules S2/S3/S4).
`canonical` and `og:url`/`og:image` must be **absolute** URLs (the OGP spec and
real-world scrapers reject relative OG URLs), so I must commit to an absolute
origin base. No page in the repo had head metadata yet (grep: 0 hits), so this is
the first implementation and pins the pattern the 8 sibling pages will mirror.
Scoring 0–10 per criterion, higher = better (risk/cost higher = lower).

## Alternatives considered
### Option A — Absolute GitHub-Pages origin `https://purestreets1.github.io/Purestreets/`
Derived from the git remote `https://github.com/PureStreets1/Purestreets.git`
(project-site URL = `https://<user>.github.io/<repo>/`, user lowercased). This is
the live host today. canonical/og:url = origin + `charities.html`; og:image =
origin + `assets/img/hero-banner.jpg`; JSON-LD Organization url/logo on the same
origin. A header comment-free note records that the base must be swapped if a
custom domain is later attached.
- Alignment 9 · Regression-risk 9 (head-only, render-neutral; sole exposure is a
  wrong host iff a custom domain is added later — documented + one find/replace) ·
  Cost 9 · Reversibility 10 — **37/40**
### Option B — Document-relative canonical + relative OG paths (`href="charities.html"`)
- Google tolerates a relative canonical, but OGP requires absolute `og:url`/
  `og:image`; FB/Twitter/LinkedIn scrapers drop relative OG, so share previews —
  the finding's actual goal — would silently fail.
- Alignment 4 · Risk 7 · Cost 9 · Reversibility 9 — 29/40
### Option C — Defer absolute URLs until a custom domain is confirmed
- Leaves the verified finding unresolved and breaks the 9-page consistency the
  T6 rollout (decision `extend-t6-canonical-to-all-pages.md`) mandates.
- Alignment 3 · Risk 9 · Cost 9 · Reversibility 9 — 30/40

## Decision
Chose **A** (37/40). Use the absolute GitHub-Pages origin
`https://purestreets1.github.io/Purestreets/` for canonical, og:url, og:image and
the JSON-LD `Organization` url/logo. Tag set kept minimal per the task:
canonical; og:type(website)/url/title/description/image; twitter:card
(summary_large_image); one inline `Organization` JSON-LD (name/url/logo). og:title
reuses the existing `<title>` ("PureStreets | Charities") and og:description reuses
the existing `<meta name="description">` verbatim — no new copy. Block inserted
after `<title>` (head-only, render-neutral; `application/ld+json` is non-executed).
**Base-URL caveat:** if PureStreets attaches a custom domain, replace the origin in
every absolute URL across all pages. Sibling page-implementers may reference this
decision instead of re-deriving it.

## How to reverse
Delete the inserted metadata block (canonical + 6 meta + JSON-LD script) from
`charities.html`'s head. To only change the host, find/replace
`https://purestreets1.github.io/Purestreets/` with the new origin.
