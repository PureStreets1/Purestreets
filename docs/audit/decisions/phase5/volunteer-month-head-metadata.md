---
id: volunteer-month-head-metadata
phase: phase5
agent: WS-HTML-volunteer-month
timestamp: 2026-06-27
chosen: A
---

## Problem
Finding `head-meta-canonical-og-missing` requires adding a self-referential
`<link rel="canonical">`, Open Graph tags, `twitter:card`, and inline JSON-LD to
`volunteer-month.html`'s `<head>`. The exact shape is a judgment call: which
JSON-LD `@type`, which OG/Twitter fields, and what origin base for the absolute
URLs. No sibling page was implemented at edit time (`grep -c "og:"` = 0 on all 9
pages) and no orchestration decision pins the markup, so I choose and log it.
The origin base is derived from the git remote
(`github.com/PureStreets1/Purestreets` → GitHub-Pages default
`https://purestreets1.github.io/Purestreets/`) and **must be confirmed/replaced
if a custom domain is adopted**. Scoring 0-10 per criterion (risk/cost: higher =
better).

## Alternatives considered

### Option A — Minimal `Organization` JSON-LD + the 5 required OG tags + `twitter:card` (fallback to OG)
`canonical` + `og:type=website`/`og:url`/`og:title`/`og:description`/`og:image`
+ `twitter:card=summary_large_image` + a minimal `Organization` block
(`name`/`url`/`logo`, all present on-page in the footer brand + logo `<img>`).
Matches the plan (WS-HTML-volunteer-month row: "JSON-LD `Organization`"), the
`extend-t6-canonical-to-all-pages` decision (consistent `Organization` across all
9 pages), coding-rules S2-S4, and S4's "mark up only content visible on the
page." Reuses existing page copy (`<title>` + meta description verbatim). No
duplicated `twitter:title`/`twitter:description` — Twitter falls back to OG —
keeping it minimal.
- Alignment 9 · Regression risk 9 (head-only, render-neutral; JSON-LD is inert
  data; `og:image` reuses an existing asset so no new on-page request/origin) ·
  Cost 9 · Reversibility 10 — **37/40**

### Option B — Page-specific `WebApplication`/`WebPage` JSON-LD
The page is literally a device-local tracker tool, so `WebApplication` is
"accurate," but it over-claims (invites a SoftwareApplication rich result),
diverges from the plan's `Organization`, and makes this page's structured data
inconsistent with the other 8 (all `Organization`) — harder to keep coherent
across 9 independently-implemented pages.
- Alignment 5 · Risk 6 · Cost 7 · Reversibility 10 — 28/40

### Option C — Rich `@graph` (`Organization` + `WebPage` + `BreadcrumbList`)
Maximises SEO surface, but the task explicitly asked for "minimal INLINE
JSON-LD"; more markup to validate and keep byte-identical across 9 pages, and
breadcrumbs are not clearly warranted by visible content.
- Alignment 6 · Risk 6 · Cost 5 · Reversibility 10 — 27/40

### Option D — `canonical` + OG only, no JSON-LD
Smallest, but the finding (S4) and the task both require JSON-LD; under-delivers.
- Alignment 3 · Risk 9 · Cost 10 · Reversibility 10 — 32/40

## Decision
Chose **A** (37/40). Minimal, honest, plan-aligned, render-neutral. The Org
`name`/`logo`/`url` all appear on the page (footer brand text, `assets/img/logo.png`,
site root), satisfying S4. `og:image` reuses the existing
`assets/img/hero-banner.jpg` — no new asset, and only crawlers fetch it (zero new
on-page request/origin). `twitter:card=summary_large_image` with OG fallback
avoids duplicating copy in four places. Origin base
`https://purestreets1.github.io/Purestreets/` is the GitHub-Pages default derived
from remote `github.com/PureStreets1/Purestreets` — **MUST be confirmed/replaced
if a custom domain is adopted** (swap the origin in the 3 absolute URLs +
Organization `url`/`logo`).

Sibling changes on this same page reference prior decisions, not duplicated here:
the 3 orphan `.section-arrow` removals follow plan fork **F-1** (REMOVE, path b);
the additive `role="rowgroup"` on `[data-volunteer-rows]` is the verified
finding `aria-table-required-children` recommended action. The empty-board edge
case was confirmed safe against the audit's own **axe-core 4.12.1**: `rowgroup`
is in the `aria-required-children` `reviewEmpty` set (axe.js:31920), so an empty
rowgroup returns `void 0` (incomplete, **not** a violation) — clean in both empty
and populated states. The greeting capitalisation is authorised by
`decisions/phase5/apply-t13-content-items.md`.

## How to reverse
Delete the inserted `<head>` block (the `canonical` link, the 6 `og:`/`twitter:`
meta, and the `application/ld+json` `<script>`) from `volunteer-month.html`. The
body/DOM is untouched. If a custom domain is adopted, replace the origin in the 3
absolute URLs and the Organization `url`/`logo` rather than deleting.
