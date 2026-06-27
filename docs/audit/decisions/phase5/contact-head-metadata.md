---
id: contact-head-metadata
phase: phase5
agent: WS-HTML-contact
timestamp: 2026-06-27
chosen: A
---
## Problem
Finding `findings/phase3/contact/missing-canonical-and-og-meta.md` (status
verified) requires a self-referential canonical, Open Graph, Twitter Card, and
inline JSON-LD in `contact.html`'s `<head>`. The consequential call is the exact
*shape and content* of that block — specifically how rich the JSON-LD should be —
because (a) it must stay render-neutral and not regress Lighthouse SEO/perf, and
(b) seven page-implementers run in parallel with no shared context, so the block
must be predictable enough that all pages end up consistent (the goal stated in
`decisions/phase5/extend-t6-canonical-to-all-pages.md`).

Origin base = `https://purestreets1.github.io/Purestreets/`, the GitHub-Pages
default derived from the git remote `github.com/PureStreets1/Purestreets.git`
(host is lowercased, repo-name case preserved in the path). **This must be
confirmed/replaced if a custom domain is later configured** — if so, every
canonical/`og:url`/`og:image`/JSON-LD `url` absolute URL on all 9 pages changes.

Scoring: 0–10 per criterion, higher = better (regression-risk/cost: higher = better i.e. lower risk/cost).

## Alternatives considered
### Option A — Minimal: canonical + the task's explicit OG set + twitter:card + minimal `Organization` JSON-LD
Exactly the fields the task names: `og:title/description/type/url/image`,
`twitter:card`, and an `Organization` JSON-LD with `name`/`url`/`logo` only.
Page-specific values (`canonical`, `og:url`, `og:title`, `og:description`) reuse
the existing `<title>`/`<meta description>` copy; `og:image` = origin +
`assets/img/hero-banner.jpg`; JSON-LD `logo` = origin + `assets/img/logo.png`
(the visible brand mark). Identical Organization block on every page ⇒ consistent.
- Alignment 9 · Regression-risk 9 (head-only, tiny, no external fetch) · Cost 9 · Reversibility 10 — **37/40**

### Option B — Richer JSON-LD: `Organization` + `ContactPage`/`contactPoint` with the visible email, plus `sameAs` social links
More semantically apt for a contact page and all on-page-visible (S4-compliant),
but diverges from the other 8 pages (they are not contact pages), enlarges the
head, and raises the chance of cross-page inconsistency since each parallel
implementer would hand-roll a different graph.
- Alignment 7 · Regression-risk 7 · Cost 6 · Reversibility 9 — 29/40

### Option C — `WebSite`/`WebPage` JSON-LD instead of `Organization`
Plausible, but the plan and the orchestrator T6 decision both name `Organization`
as the site-wide type; choosing a different type here would break the
"identical Organization across all pages" consistency.
- Alignment 6 · Regression-risk 8 · Cost 8 · Reversibility 9 — 31/40

## Decision
Chose **A** (37/40). It satisfies the finding and the task's explicit field list,
stays minimal (no perf/SEO regression, no external fetch), is render-neutral
(all inside `<head>`), and — by using the exact task-named field set + a minimal
`Organization` graph — is the shape most likely to match the six sibling pages
produced in parallel. Page-uniqueness is carried only by canonical/`og:url`/
`og:title`/`og:description`, which reuse this page's existing copy verbatim;
`og:type=website`, `twitter:card=summary_large_image` (a wide hero image is
provided). No visible copy, DOM order, class, `data-*`, anchor, asset, Tally id,
or localStorage touched.

## How to reverse
Delete the contiguous metadata block (the `<!-- SEO / social metadata -->`
comment through the closing `</script>`) added before `</head>` in
`contact.html`. If a custom domain is adopted, instead of reverting, swap the
origin base in the five absolute URLs.
