---
id: terms-head-metadata
phase: phase5
agent: WS-HTML-terms
timestamp: 2026-06-27
chosen: A
---
## Problem
Finding `findings/phase3/terms/head-missing-canonical-og-jsonld.md` (verified)
requires adding a self-referential `<link rel="canonical">`, Open Graph
(`og:title/description/type/url/image`), `twitter:card`, and inline JSON-LD to
`terms.html`'s `<head>`. The plan (implementation-plan.md, WS-HTML-terms) scopes
the JSON-LD to `Organization`. The judgment call: how to model the page in
structured data and which `og:type`/`twitter:card` values to pick for a *legal*
page, while staying render-neutral, inventing no copy, and adding no new
render-time network request.

Base origin is the GitHub-Pages default derived from the git remote
(`https://github.com/PureStreets1/Purestreets.git`) =>
`https://purestreets1.github.io/Purestreets/`. **This must be confirmed or
replaced if a custom domain is later configured** — every absolute URL below
(canonical, og:url, og:image, Organization url/logo) hard-codes that origin.

Scoring: 0–10 per criterion, higher = better (risk/cost higher = lower).

## Alternatives considered
### Option A — Organization-only JSON-LD; og:type=website; twitter:card=summary_large_image
Mirrors the plan exactly. canonical/og:url = origin+`terms.html`; og:image =
origin+`assets/img/hero-banner.jpg`; og:title/description reuse the existing
`<title>`/`meta description` verbatim; Organization carries only name/url/logo
(existing `assets/img/logo.png`) + `sameAs` from the four footer social links
(terms.html:76,83,90,95). No invented prose. `summary_large_image` because a
large landscape hero image is supplied; Twitter falls back to the og: tags for
title/description/image, so no redundant twitter:* duplicates are needed.
- Alignment 9 · Regression risk 9 (head-only, crawler-only, no render fetch) · Cost 9 (smallest, all values already exist) · Reversibility 10 — **37/40**
### Option B — Add a `TermsOfService`/`WebPage` JSON-LD node alongside Organization
Models the legal page itself. More structured-data surface, but exceeds the
plan's "Organization" scope, adds markup that must be kept correct, and risks
inventing page-type copy not present today.
- Alignment 6 · Risk 8 · Cost 6 · Reversibility 10 — 30/40
### Option C — Organization + og:type=article
Treats the terms page as an article. `article` is semantically for
blog/news/editorial content, not a static legal page, and diverges from what the
other 8 T6 pages will emit (interchangeable shell consistency).
- Alignment 5 · Risk 8 · Cost 9 · Reversibility 10 — 32/40

## Decision
Chose **A** (37/40). It satisfies the finding's enumerated set exactly
(canonical + og:title/description/type/url/image + twitter:card + minimal inline
Organization JSON-LD), reuses only existing copy/assets/footer URLs (zero
invented text, zero new external origin at render — og:image is crawler-only),
and keeps every page on the same `Organization`/`website` model the plan
prescribes for all 7→9 T6 pages. og:title/og:description copy the existing
`<title>` ("PureStreets | Terms & Conditions") and `meta description`
("Terms & Conditions for PureStreets.") verbatim, including their raw `&` to
match the file's existing convention (terms.html:6). The block is inserted
between the `<title>` and the first `preconnect` link — render order is
irrelevant for `<head>` metadata. The greeting fix (Task 2) is covered by
`decisions/phase5/apply-t13-content-items.md` (Option A) and needs no separate
decision here.

## How to reverse
Delete the inserted canonical/OG/twitter/JSON-LD block from `terms.html`'s
`<head>` (between `<title>` and the first `<link rel="preconnect">`); the page
reverts to its prior head exactly. If a custom domain is adopted, replace the
`https://purestreets1.github.io/Purestreets/` origin in all five absolute URLs.
