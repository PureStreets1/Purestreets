---
id: head-missing-canonical-og-jsonld
phase: phase3
agent: critic
status: verified
severity: low
scope: structure
evidence:
  - terms.html:3-14
  - terms.html:76-95
  - docs/audit/runs/before/lighthouse-summary.json
source: internal
---

## Claim
`terms.html`'s `<head>` has a unique `<title>` and `<meta name="description">`
(`terms.html:6-7`) but no self-referential `<link rel="canonical">`, no
`og:` / `twitter:` share tags, and no JSON-LD `Organization` block
(`terms.html:3-14`). grep over `terms.html` confirms NONE of
`canonical|og:|twitter:|ld+json` are present. These are head-only and
render-neutral (coding-rules S2/S3/S4) and align with the overhaul scope even
though Lighthouse SEO already reports 100 for terms
(`docs/audit/runs/before/lighthouse-summary.json`).

## Why it matters
Without a canonical, duplicate-URL variants can dilute indexing; without
OG/Twitter tags, shared links render as bare text instead of a rich preview;
without `Organization` JSON-LD the site forgoes the structured data Google
prefers. All three are zero-pixel head changes (coding-rules S2/S3/S4), so they
are low-risk wins rather than visual edits.

## Recommended action
Add to the `<head>`: a self-referential `<link rel="canonical">`,
`og:title` / `og:description` / `og:image` / `og:url` / `og:type` plus
`twitter:card`, and a site-wide `Organization` JSON-LD in a
`<script type="application/ld+json">`. Keep it head-only — no body/DOM/copy
changes. Point `og:url`/canonical at the page's own URL and `og:image` at an
existing local asset under `assets/img/` so no new external origin is
introduced; `sameAs` can reuse the social URLs already in the footer
(`terms.html:76-95`). JSON-LD is inert data, not executed script, so there is
no no-build / CSP concern.

## How to verify it's fixed
Validate with an OG / rich-results debugger (canonical resolves to self,
Organization parses, share preview renders). Visual before/after diff = 0
changed pixels (head-only). Confirm no new external domain appears in the
network capture.

## Vote tally
failedToRefute: 3 / 3

- **Skeptic 1 (failed to refute):** Confirmed absent: grep over terms.html
  returns NONE for `canonical`/`og:`/`twitter:`/`ld+json`; the head
  (`terms.html:3-14`) has only charset, viewport, description, title, fonts,
  favicon, stylesheet. coding-rules S2/S3/S4 recommend a self-referential
  canonical, OG/Twitter, and Organization JSON-LD. `lighthouse-summary.json`
  confirms terms seo:100, and the finding honestly notes these remain recommended
  (dedup + link previews). All are head-only, render-neutral, no-build-safe
  additions.
- **Skeptic 2 (failed to refute):** CONFIRMED absent and safe. `terms.html:3-14`
  has unique title + description but no `rel=canonical`, no `og:`/`twitter:`
  tags, no JSON-LD. coding-rules S2/S3/S4 explicitly endorse adding all three as
  head-only, render-neutral wins. Adding them is pixel-zero (no body/DOM/copy
  change), touches no JS flow/`data-*` hook/localStorage, and introduces no new
  external domain if `og:url`/canonical are self-referential and `og:image`
  points at an existing local asset (`assets/img/`) — `sameAs` can reuse the
  social URLs already on the page (`terms.html:76-95`). JSON-LD is inert data,
  not executed script, so no no-build/CSP concern. Behavior- and no-build-safe.
- **Skeptic 3 (failed to refute):** Verified absent and directly endorsed by
  coding-rules S2/S3/S4. The terms.html head (lines 3-14) has unique title +
  meta description but no `<link rel=canonical>`, no `og:`/`twitter:` tags, and
  no JSON-LD. These are head-only and render-neutral (zero pixel change), add no
  render-time network request (OG image is crawler-only; canonical is a link;
  JSON-LD inline), and don't touch DOM body/copy/assets. Low severity (Lighthouse
  SEO is already 100) but a legitimate, safe, rule-grounded addition — not slop.
</content>
