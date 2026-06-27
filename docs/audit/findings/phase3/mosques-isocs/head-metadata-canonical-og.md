---
id: head-metadata-canonical-og
phase: phase3
agent: orchestrator
status: verified
severity: low
scope: code
evidence:
  - mosques-isocs.html (head has no canonical/OG/JSON-LD)
  - docs/audit/findings/phase3/_themes.md (T6)
  - docs/audit/findings/phase3/index/missing-canonical-og.md
source: internal
---
## Claim
`mosques-isocs.html` ships with no `<link rel="canonical">`, no Open Graph /
Twitter metadata, and no JSON-LD — the same gap verified on 7 sibling pages
(theme T6). mosques' critic flagged other issues and did not raise T6; this is a
consistency extension, verified-by-analogy to T6 (identical head markup passed
adversarial verification on 7 pages). Authorised by
decisions/phase5/extend-t6-canonical-to-all-pages.md.

## Why it matters
mosques-isocs is a key campaign/landing page (the ISOC competition + guide). A
missing canonical risks duplicate indexing and missing OG tags yield a blank
share card — costly for the page most likely to be shared to societies.

## Recommended action
Add to the `<head>`: self-referential `<link rel="canonical">`; `og:title/
description/type/url/image` (reuse existing copy + an existing local image);
`twitter:card`; minimal inline JSON-LD `Organization`. Head-only, render-neutral.

## How to verify it's fixed
View-source shows canonical + OG + JSON-LD; link-preview debugger renders a valid
card; Lighthouse SEO stays 100; zero visual diff; no new console error or request.
