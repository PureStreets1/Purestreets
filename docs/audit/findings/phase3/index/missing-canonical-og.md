---
id: missing-canonical-og
phase: phase3
agent: critic
status: verified
severity: low
scope: structure
evidence:
  - index.html:1-13
  - docs/audit/runs/before/lighthouse-summary.json
  - assets/img/hero-banner.jpg
source: internal
---

## Claim
The document head ships only title, description, fonts and icons — no
self-referential canonical and no `og:*` / `twitter:*` tags — so links shared on
Instagram/WhatsApp (the org's main growth channels) render no controlled preview
and the page has no canonical signal. The head (`index.html:1-13`) contains
charset / viewport / description / title / preconnect / fonts / icons /
stylesheet only. A grep across all `*.html` returns no `rel="canonical"` and no
`og:` / `twitter:` meta anywhere in the repo. coding-rules S2 (self-referential
canonical) and S3 (Open Graph + `twitter:card`) explicitly flag these as absent
and render-neutral.

## Why it matters
For a community movement that spreads through social shares, a missing OG image /
title means unbranded, unattractive link previews; a self-canonical is cheap
insurance against duplicate-URL dilution. Both are head-only and change nothing
visual. Lighthouse SEO is already 100
(`docs/audit/runs/before/lighthouse-summary.json`), so this is an enhancement
beyond the audit's SEO floor, not a regression.

## Recommended action
Add render-neutral head tags: a self-referential `<link rel="canonical">`,
`og:title` / `og:description` / `og:image` / `og:url` / `og:type` and
`twitter:card`, reusing existing copy and an existing asset (e.g.
`assets/img/hero-banner.jpg`) for `og:image`. No DOM/body/visual change; the
tags fire no runtime network request (the `og:image` is fetched only by social
scrapers), add no new external domain on page load, and add no build/runtime
dependency.

## How to verify it's fixed
Validate with an OG / link-preview debugger; Lighthouse SEO stays 100; confirm
zero visual diff and no new runtime network requests.

## Vote tally
failedToRefute: 3 / 3

- **Skeptic 1 (failed to refute):** Confirmed factually: grep of all *.html
  returns no rel="canonical", no og:*, no twitter:* — index.html head (1-13)
  carries only charset/viewport/description/title/preconnect/fonts/icons/stylesheet.
  coding-rules S2 (self-referential canonical) and S3 (Open Graph + twitter:card)
  explicitly call for these as absent and render-neutral. Recommended fix is
  head-only, reuses existing copy and the existing hero-banner.jpg, adds no
  runtime/visual change and no new network request at load. Low severity but a
  real, safe, rules-endorsed gap.
- **Skeptic 2 (failed to refute):** Confirmed absent: grep finds no
  rel="canonical" or og:/twitter: tags in any HTML; head (index.html:1-13) ships
  only charset/viewport/description/title/fonts/icons. coding-rules S2/S3 call for
  these as render-neutral. BEHAVIOR/REGRESSION lens: head-only meta tags add no
  JS/data/storage/copy/visual change, fire no runtime network request, add no new
  domain, and og:image can reuse the existing assets/img/hero-banner.jpg — fully
  no-build-safe. Low-severity but a real, safe improvement.
- **Skeptic 3 (failed to refute):** Verified absent: grep for rel="canonical",
  og:, twitter:, property="og across all HTML returns nothing, and index.html:1-14
  head contains only charset/viewport/description/title/preconnect/fonts/icons/stylesheet.
  coding-rules S2 (self-referential canonical) and S3 (Open Graph + twitter:card)
  explicitly require these and flag them absent + render-neutral. Head-only, zero
  pixel change, reuses existing copy and the existing hero-banner.jpg asset, adds
  no runtime network request (og:image is fetched only by social scrapers) and no
  new external domain on page load — no-build-safe. Low severity but a real,
  rules-grounded, safe finding, not taste and not already-fine.
