---
id: missing-canonical-og-meta
phase: phase3
agent: critic
status: fixed
severity: low
scope: code
evidence:
  - work-with-us.html:3-13
  - assets/img/logo.png
source: internal
---

## Claim
The document head has a unique title and description but no self-referential
canonical link and no Open Graph / Twitter card tags. `work-with-us.html:3-13`
contains the title (line 7) and meta description (line 6) plus preconnects, the
Manrope font link, favicon, apple-touch-icon, and stylesheet — but no `<link
rel="canonical">`, no `og:*`, and no `twitter:card` (grep of the file returns
none). coding-rules S2 (self-referential canonical) and S3 (Open Graph +
`twitter:card`) both note these absent repo-wide and explicitly head-only /
render-neutral.

## Why it matters
A canonical prevents duplicate-URL dilution and OG / Twitter tags control how the
recruitment page previews when shared on social — relevant for a grassroots org
that shares links on Instagram / WhatsApp. These are safe, behavior-neutral,
head-only additions (coding-rules S2/S3).

## Recommended action
Add `<link rel="canonical" href="...work-with-us.html">` plus
`og:title` / `og:description` / `og:image` / `og:url` / `og:type` and
`twitter:card` to the head, reusing existing copy and an existing local asset
(e.g. `assets/img/logo.png`) for `og:image`. Do not add scripts, request new
domains, or alter visible content — OG / canonical are crawler-read metadata, not
fetched by the page, so no new runtime network request or external origin is
introduced.

## How to verify it's fixed
View source: canonical resolves to this page's URL; paste the URL into a
link-preview / OG validator and confirm a correct title / description / image;
re-run the network capture and confirm no new external origins are requested by
the page itself.

## Vote tally
failedToRefute: 3 / 3

- **Skeptic 1 (failed to refute):** Confirmed factually: grep of
  work-with-us.html returns NONE for rel="canonical", og:, or twitter:card; head
  (lines 3-13) has only title/description/preconnect/font/icon/stylesheet.
  coding-rules.md S2 (self-referential canonical) and S3 (Open Graph +
  twitter:card) explicitly mark these absent repo-wide and head-only/render-neutral,
  and overhaul-aligned. Safe, behavior-neutral, no new external origins if
  og:image reuses an existing local asset. Low severity but a real, correct, safe
  finding.
- **Skeptic 2 (failed to refute):** Verifiable, low-risk gap. work-with-us.html:3-13
  head has title+description but no rel=canonical and no og:/twitter: tags.
  coding-rules S2/S3 explicitly endorse adding both as head-only and
  render-neutral. It reuses existing copy and an existing local asset
  (assets/img/logo.png) for og:image, so it adds no new external domain and no new
  runtime network request (OG/canonical are crawler-read metadata, not fetched by
  the page). No visual change, no JS/data-*/localStorage/copy impact. Safe; only
  the severity is low.
- **Skeptic 3 (failed to refute):** Factually correct and rule-backed.
  work-with-us.html head (lines 3-13) has title+description but no <link
  rel=canonical> and no og:*/twitter:card. coding-rules.md S2 and S3 explicitly
  endorse adding a self-referential canonical and Open Graph/Twitter tags, noting
  both absent today and "head-only, render-neutral". Reuses existing copy and
  assets/img/logo.png, adds no scripts/origins, stays no-build. Real, safe,
  low-severity SEO/sharing gap — not a taste call.
