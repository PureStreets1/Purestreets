---
id: head-missing-canonical-og-jsonld
phase: phase3
agent: critic
status: fixed
severity: med
scope: content
evidence:
  - /Users/haidertoha/Code/pure_streets/our-team.html:3-14
  - /Users/haidertoha/Code/pure_streets/our-team.html:53-80
  - /Users/haidertoha/Code/pure_streets/script.js:171-172
  - /Users/haidertoha/Code/pure_streets/docs/audit/runs/before/lighthouse-summary.json
source: internal
---

## Claim
The document head ships only `<title>` and `<meta name="description">`; it lacks a
self-referential canonical, Open Graph / Twitter share tags, and any JSON-LD — all
render-neutral additions, and a team page is the ideal place for
Organization/Person structured data.

Verified:
- `our-team.html:3-14` — the entire head is `charset`, `viewport`, `description`,
  `title`, two preconnects, the Manrope font link, favicon, apple-touch-icon, and
  the stylesheet. There is no `rel="canonical"`, no `og:*`/`twitter:*`, and no
  `<script type="application/ld+json">`.
- coding-rules S2 (canonical), S3 (Open Graph + `twitter:card`), S4 (JSON-LD; mark
  up only visible content) call for all three.
- The visible team roster (our-team.html:53-80) maps cleanly to schema.org
  `Organization` + member `Person`.

## Why it matters
Missing canonical risks duplicate-URL dilution; missing OG/Twitter yields bare
social previews; missing JSON-LD forgoes rich-result / AI-citation eligibility —
all upside with zero visual or behavioral risk. Lighthouse SEO 100
(lighthouse-summary.json) does not refute this: Lighthouse SEO does not audit
canonical, OG, or JSON-LD presence.

## Recommended action
Add to `<head>`: a self-referential `<link rel="canonical">`; `og:title` /
`og:description` / `og:image` / `og:url` / `og:type` plus `twitter:card`; and an
`Organization` (with member `Person`s) JSON-LD block describing only the visible
roster (S4). Head-only, no DOM/CSS impact. `og:image` must reuse an existing
same-origin asset and `og:url`/canonical are self-referential, so no new external
network origin is introduced (no-build / origin allowlist respected). PureBot scans
`a[href]` and DOM text (script.js:171-172), never `<meta>`/`<link>`/ld+json
scripts, so there is no flow impact.

## How to verify it's fixed
Validate with Google Rich Results Test and a social-preview debugger; confirm the
canonical resolves to the page's own URL. Confirm no new render and no new network
requests beyond existing origins (`fonts.googleapis.com`, `fonts.gstatic.com`,
`tally.so`, self).

## Vote tally
failedToRefute: 3 / 3

- failedToRefute: CORRECT. The entire head (our-team.html:3-14) has no
  rel=canonical, no og:*/twitter:*, no application/ld+json. S2/S3/S4 call for all
  three; the visible roster (:53-80) maps to Organization+Person. Head-only,
  render-neutral, no new external origins (og:image can reuse an existing asset).
  Lighthouse SEO 100 does not refute this — Lighthouse SEO does not audit
  canonical/OG/JSON-LD; the real-world value is genuine and the change is safe.
- failedToRefute: VERIFIED REAL. Head-only additions are render-neutral; PureBot
  scans a[href] and DOM text (script.js:171-172,261-280), never <meta>/<link>/
  ld+json scripts, so no flow impact; canonical/og:url are self-referential and
  og:image uses an existing local asset, so no new external network origin. JSON-LD
  must mark up only the visible roster (:53-80) per S4. Real, safe, evidence-backed.
- failedToRefute: Verified: head has only charset/viewport/description/title/
  preconnects/fonts/icons/stylesheet — no rel=canonical, no og:*/twitter:*, no
  JSON-LD. Backed by S2/S3/S4. All head-only, render-neutral, behavior-neutral with
  no new page-render network requests. Visible roster maps cleanly to
  Organization+Person per S4. Objective best-practice, not taste.
