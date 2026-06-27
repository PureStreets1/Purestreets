---
id: head-metadata-canonical-og
phase: phase3
agent: critic
status: fixed
severity: low
scope: structure
evidence:
  - charities.html:3-13
  - charities.html:6
  - charities.html:7
  - docs/audit/runs/before/lighthouse-summary.json
source: internal
---

## Claim
`charities.html` has a unique `<title>` ("PureStreets | Charities",
`charities.html:7`) and `<meta name="description">` (`charities.html:6`), but
the head (`charities.html:3-13`) has no self-referential `<link rel="canonical">`,
no Open Graph (`og:*`) or Twitter (`twitter:*`) share tags, and no JSON-LD
(`<script type="application/ld+json">`) structured data. These are the
render-neutral, head-only additions called for by coding-rules S2/S3/S4.
`docs/audit/runs/before/lighthouse-summary.json` reports charities `seo: 100`,
so this is a share/discoverability enhancement, not a functional SEO defect.

## Why it matters
Shares of this page produce no preview image/title, and the missing canonical
risks duplicate-URL dilution. Every fix is an invisible head-only addition with
no render or behavior impact, no new DOM order, and no new runtime network
origin (canonical/og/twitter are inert link/meta; JSON-LD is non-executed).

## Recommended action
Add `<link rel="canonical">` for `charities.html`, `og:`/`twitter:` tags
(title, description, image referencing a local asset, url, type), and optional
`Organization` JSON-LD. No visual or behavioral change; no new external origin.

## How to verify it's fixed
Validate with a social-preview / Rich-Results tester and confirm canonical, OG,
Twitter, and JSON-LD parse. Capture before/after screenshots at 375 and 1440 to
confirm zero rendered-pixel change.

## Vote tally
failedToRefute: 3 / 3

- **Skeptic 1 (failed to refute):** Verified: charities.html head (lines 3-13)
  has unique title (7) + description (6) but no rel=canonical, no og:*/twitter:*,
  no application/ld+json. coding-rules S2/S3/S4 explicitly endorse these as
  render-neutral, head-only additions. og:image references a local asset and
  OG/canonical tags are not fetched by the browser on normal page load, so no
  new runtime network request/origin. lighthouse seo=100 means it's an
  enhancement not a defect, which the candidate states. Factually right and safe.
- **Skeptic 2 (failed to refute):** Confirmed: head (charities.html:3-13) has
  title+description but no rel=canonical, og:/twitter:, or application/ld+json.
  coding-rules S2/S3/S4 explicitly endorse these as render-neutral, head-only
  additions. JSON-LD via <script type=application/ld+json> is non-executed (no
  runtime/no-build impact); canonical/og/twitter are inert meta/link with zero
  render or behavior effect, no JS/data/copy/asset dependency, no new network
  origin. Low value (lighthouse seo already 100) but a real gap versus the rules
  and entirely safe.
- **Skeptic 3 (failed to refute):** REAL, render-neutral, rule-mandated.
  charities.html head (3-13) contains only title+description, preconnect, font
  link, icons, stylesheet — no rel=canonical, no og:/twitter:, no
  application/ld+json (verified). coding-rules S2/S3/S4 explicitly require these
  as head-only, render-neutral, overhaul-aligned additions; lighthouse seo=100
  (lighthouse-summary.json) measures only basic SERP signals and does not cover
  canonical/share/rich-results. Not subjective, not slop; safe head-only
  enhancement with no DOM-order/behavior/asset impact. Low severity but a
  legitimate finding.
