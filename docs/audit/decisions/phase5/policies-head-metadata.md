---
id: policies-head-metadata
phase: phase5
agent: WS-HTML-policies
timestamp: 2026-06-27
chosen: A
---
## Problem
`policies.html` carried no `<link rel="canonical">`, no Open Graph/Twitter tags,
and no JSON-LD. policies raised no *own* T6 finding (2 of its 3 skeptics hit the
529 outage), but `decisions/phase5/extend-t6-canonical-to-all-pages.md` (Option A)
and the verified-by-analogy finding
`findings/phase3/policies/head-metadata-canonical-og.md` authorise adding the same
head metadata the other 8 pages received, so all 9 pages share one consistent
SEO/share surface. The judgment call is **which JSON-LD/OG shape to instantiate for
policies** — render-neutral, inventing no copy, adding no render-time network
request. Base origin `https://purestreets1.github.io/Purestreets/` is the
GitHub-Pages default derived from the git remote
(`github.com/PureStreets1/Purestreets.git`) and **must be confirmed/replaced if a
custom domain is later configured** (it is hard-coded in all five absolute URLs).
Scoring: 0–10 per criterion, higher = better (risk/cost higher = lower).

## Alternatives considered
### Option A — Mirror `terms.html` exactly (the structural twin)
policies is the twin of terms: same `legal-page` layout and the identical footer
with the same four social links. Emit canonical = og:url = origin+`policies.html`;
og:image = origin+`assets/img/hero-banner.jpg`; og:type=`website`;
twitter:card=`summary_large_image`; og:title/og:description reuse the existing
`<title>` ("PureStreets | Policies") and `meta description`
("Policies for PureStreets.") verbatim; one inline Organization-only JSON-LD
(name/url/logo=existing `assets/img/logo.png` + `sameAs` from the four footer
socials). Zero invented copy; every value already exists on-page; og:image is
crawler-only (no render fetch).
- Alignment 9 · Regression risk 9 (head-only, render-neutral) · Cost 9 (all values exist) · Reversibility 10 — **37/40**
### Option B — Compact single-line Organization, drop `sameAs`/`logo` (charities' minified form)
Smaller, still valid, but discards `logo`/`sameAs` that the visible footer
supports and diverges from the legal-page twin's shape.
- Alignment 6 · Risk 9 · Cost 9 · Reversibility 10 — 34/40
### Option C — Add a `PrivacyPolicy`/`WebPage` node alongside Organization
Models the policy page itself; exceeds the plan's Organization scope, adds markup
that must be kept correct, risks inventing page-type copy, and breaks the shared
shell of the other 8 pages.
- Alignment 5 · Risk 8 · Cost 7 · Reversibility 10 — 30/40

## Decision
Chose **A** (37/40). This is a trivial mechanical mirror of the sibling decision
`decisions/phase5/terms-head-metadata.md` (chosen A) — policies and terms are
structural twins — so this file records the policies-specific instantiation rather
than re-deriving the shape. The block is inserted between `<title>` and the first
`<link rel="preconnect">` (head order is irrelevant for metadata). `og:site_name`
is omitted: it is not in the task's enumerated OG set
(title/description/type/url/image) and is absent on 7 of 8 siblings. The greeting
fix (Task 2, "how can i" → "how can I") is covered by
`decisions/phase5/apply-t13-content-items.md` (Option A) and needs no separate
decision here.

## How to reverse
Delete the inserted canonical/OG/twitter/JSON-LD block from `policies.html`'s
`<head>` (between `<title>` and the first `<link rel="preconnect">`); the page
reverts to its prior head exactly. The greeting `I`→`i` revert is covered by
`apply-t13-content-items.md`. If a custom domain is adopted, replace the
`https://purestreets1.github.io/Purestreets/` origin in all five absolute URLs.
