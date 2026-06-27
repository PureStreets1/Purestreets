---
id: head-metadata-canonical-og
phase: phase3
agent: orchestrator
status: fixed
severity: low
scope: code
evidence:
  - policies.html (head has no canonical/OG/JSON-LD)
  - docs/audit/findings/phase3/_themes.md (T6)
  - docs/audit/findings/phase3/terms/head-missing-canonical-og-jsonld.md
source: internal
---
## Claim
`policies.html` ships with no `<link rel="canonical">`, no Open Graph / Twitter
card metadata, and no JSON-LD — the same gap verified on 7 sibling pages (theme
T6). policies raised no own T6 finding only because 2 of its 3 skeptics hit the
529 outage (see decisions/phase3/transient-failure-recovery.md); this finding is
verified-by-analogy to T6, whose identical-markup instances passed adversarial
verification. Authorised by decisions/phase5/extend-t6-canonical-to-all-pages.md.

## Why it matters
Without canonical, search engines may index parameter/duplicate variants; without
OG/Twitter tags the page produces a blank, untrustworthy share preview. Leaving
2 of 9 pages without metadata is an inconsistent SEO/share surface.

## Recommended action
Add to the `<head>`: a self-referential `<link rel="canonical">`; `og:title`,
`og:description`, `og:type`, `og:url`, `og:image` (reuse existing copy +
`assets/img/hero-banner.jpg`); `twitter:card`; and a minimal inline JSON-LD
`Organization`. Head-only, render-neutral. No new network request/domain.

## How to verify it's fixed
View-source shows canonical + OG + JSON-LD; a link-preview debugger renders a
valid card; Lighthouse SEO stays 100; zero visual diff at 375/1440; no new
console error or network request.
