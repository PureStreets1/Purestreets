---
id: missing-canonical-and-og-meta
phase: phase3
agent: critic
status: verified
severity: med
scope: code
evidence:
  - contact.html:3-13
  - contact.html:6
  - contact.html:7
  - docs/audit/rules/coding-rules.md
  - docs/audit/runs/before/lighthouse-summary.json
source: internal
---

## Claim
The contact page has a unique `<title>` and `<meta name="description">` but no
self-referential canonical link and no Open Graph / Twitter Card metadata, so
shared links render no preview and duplicate-URL variants are not consolidated.
The `<head>` (`contact.html:3-13`) contains the description (`contact.html:6`)
and title (`contact.html:7`) but a grep returns no `rel="canonical"`, no `og:*`,
and no `twitter:*` tags. coding-rules S2 (canonical absent repo-wide) and S3
(OG/Twitter absent) explicitly flag these as head-only, render-neutral,
overhaul-aligned additions. `docs/audit/runs/before/lighthouse-summary.json`
shows contact `seo: 100`, so this is an enhancement, not a regression.

## Why it matters
For a grassroots org that grows via social sharing (Instagram / WhatsApp), a
missing `og:image`/`og:title` means link shares look broken; a canonical
protects against query-string duplication (coding-rules S2/S3). All changes live
in `<head>` and cannot alter rendered pixels, JS flows, `data-*` hooks,
localStorage, copy, or behavior.

## Recommended action
Add `<link rel="canonical">` for the contact URL plus `og:title` /
`og:description` / `og:image` / `og:url` / `og:type` and `twitter:card` in
`<head>`. Use existing copy and a local `og:image` asset only (no new external
origins) and a self URL for canonical/`og:url`, so it stays no-build and within
`/CLAUDE.md`.

## How to verify it's fixed
View-source confirms the new head tags; run a social-preview / OG validator;
re-run Lighthouse SEO (still 100) and confirm screenshots unchanged.

## Vote tally
failedToRefute: 2 / 2

- **Skeptic 1 (failed to refute):** Correct and render-neutral. grep of
  contact.html returns no rel=canonical, no og:*, no twitter:* (only description
  at line 6 and title at line 7). coding-rules.md S2 (canonical) and S3
  (OG/Twitter) explicitly call for adding these head-only tags as render-neutral,
  overhaul-aligned enhancements. lighthouse-summary.json shows contact seo:100, so
  this is enhancement not regression, exactly as the candidate states. All changes
  are in <head>, cannot alter rendered pixels, and use existing copy/assets/origins
  (no new external domains), staying within the no-build constraint.
- **Skeptic 2 (failed to refute):** Verified: contact.html:6-7 has
  description+title but the head has no rel=canonical, no og:*, no twitter:*
  (contact.html:3-13). coding-rules S2/S3 explicitly endorse adding these as
  head-only and render-neutral. Additive head metadata cannot alter rendered
  pixels, JS flows, data-* hooks, localStorage, copy, or behavior, and stays
  no-build provided og:image uses an existing local asset and canonical/og:url use
  the self URL (no new external origin).
