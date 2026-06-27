---
id: head-meta-canonical-og-missing
phase: phase3
agent: critic
status: fixed
severity: low
scope: code
evidence:
  - volunteer-month.html:3-14
  - volunteer-month.html:6
  - volunteer-month.html:7
  - docs/audit/rules/coding-rules.md
source: internal
---

## Claim
The page has a unique `<title>` and `<meta name="description">`
(`volunteer-month.html:6-7`) but no self-referential canonical link, no Open
Graph/Twitter share tags, and no JSON-LD structured data. The full `<head>`
(`volunteer-month.html:3-14`) contains only charset, viewport, description,
title, two preconnects, the Manrope font link, favicon, apple-touch-icon, and
the stylesheet — `grep -i "canonical|og:|twitter:|application/ld"` returns
none. These are all head-only and render-neutral. coding-rules S2 (canonical),
S3 (OG/Twitter), and S4 (JSON-LD) call for all three.

## Why it matters
Weak share previews and missing canonicalization on an outreach/community page.
Zero visual risk because the tags live in `<head>` (coding-rules S2-S4).

## Recommended action
Add `<link rel="canonical">` to this page's production URL; add `og:`/`twitter:`
tags (title, description, image, url, type); and optionally an `Organization`
JSON-LD block (site-wide). Reuse an existing `assets/img` asset for `og:image`
so no new external origin or network request is introduced. No body/DOM/asset/
copy change.

## How to verify it's fixed
View-source shows the new `<head>` tags; a social-card debugger renders a
preview; before/after screenshots are pixel-identical; no new network request to
a new origin.

## Vote tally
failedToRefute: 3 / 3

- **Skeptic 1 (failed to refute):** Full head (HTML:3-14) contains only charset,
  viewport, description, title, two preconnects, the Manrope font link, favicon,
  apple-touch-icon, and stylesheet — no rel=canonical, no og:/twitter:, no
  application/ld+json. Title + description are present (HTML:6-7). coding-rules
  S2 (canonical), S3 (OG/Twitter), S4 (JSON-LD) recommend all three. These are
  head-only, render-neutral, and change no DOM/asset/behavior. Low severity but
  a real, safe, evidence-backed gap.
- **Skeptic 2 (failed to refute):** REAL and safe. grep confirms no
  canonical/og:/twitter:/application/ld in volunteer-month.html; title+
  description present (HTML:6-7). coding-rules S2/S3/S4 explicitly endorse
  canonical, OG/Twitter, and JSON-LD. All additions live in `<head>`:
  render-neutral (before/after pixel-identical), no DOM/asset/copy change, no new
  network request (meta tags don't fetch; JSON-LD is inert). Only impl caveat
  (use an existing asset for og:image, real production URL for canonical) — not a
  refutation.
- **Skeptic 3 (failed to refute):** Objective SEO gap, not taste. grep confirms
  no canonical/og:/twitter:/application/ld in volunteer-month.html; title+
  description present (HTML:6-7). coding-rules S2 (canonical), S3 (OG/Twitter),
  S4 (JSON-LD) explicitly call for these. Head-only, render-neutral (before/after
  pixel-identical), no new external domain (og:image can reuse an existing
  assets/img asset). Safe; not a slop/subjectivity issue.
