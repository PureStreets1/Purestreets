---
id: index-head-metadata-url-form
phase: phase5
agent: WS-HTML-index
timestamp: 2026-06-27
chosen: A
---
## Problem
index.html needs a self-referential canonical + `og:url`. The orchestrator brief
gives two values that conflict for THIS page: the all-pages rule says
`canonical/og:url = origin + "index.html"` (=> `https://purestreets1.github.io/Purestreets/index.html`),
while the page-specific line says `index canonical = https://purestreets1.github.io/Purestreets/`
(the bare origin root, no `index.html`). I must pick one URL form for `canonical`
and decide whether `og:url` matches it. Origin base
`https://purestreets1.github.io/Purestreets/` is the GitHub-Pages default derived
from the git remote `github.com/PureStreets1/Purestreets.git`.
Scoring: 0–10 per criterion, higher = better (risk/cost higher = lower).

## Alternatives considered
### Option A — canonical = og:url = origin root `https://purestreets1.github.io/Purestreets/`
Honors the explicit, more-specific page instruction (Task 3); it is also the
homepage canonicalisation convention (the clean directory URL people actually
link to, avoiding `/` vs `/index.html` duplicate-URL dilution — the exact thing a
canonical exists to fix, coding-rules S2). `og:url` is kept identical to
`canonical` per Open Graph guidance (the two should agree).
- Alignment 9 · Regression risk 9 (render-neutral, correct, consistent) · Cost 9 · Reversibility 10 — 37/40

### Option B — canonical = og:url = `…/Purestreets/index.html`
Honors the all-pages formula literally, but contradicts the explicit page-specific
value and points the homepage canonical at the non-preferred `/index.html` form,
re-introducing the `/` vs `/index.html` split a self-canonical should collapse.
- Alignment 6 · Risk 8 · Cost 9 · Reversibility 10 — 33/40

### Option C — canonical = root, og:url = `…/index.html` (each instruction taken literally)
Internally inconsistent: `canonical` and `og:url` would disagree, which splits the
canonical signal across scrapers/crawlers — an OG/SEO anti-pattern.
- Alignment 4 · Risk 6 · Cost 9 · Reversibility 10 — 29/40

## Decision
Chose **A** (37/40). For the homepage the bare origin root is the correct,
explicitly-instructed canonical, and `og:url` is set to the same value so the two
never disagree. Secondary scoping settled here (all render-neutral, head/inline
only):
- **JSON-LD** is one inline `<script type="application/ld+json">` with a `@graph`
  of an `Organization` (site-wide) + three `Event`s for the visible pickup cards
  (index.html:101-126). Every field is drawn from on-page visible content only
  (coding-rules S4): Organization {name, url, logo=assets/img/logo.png,
  image=hero-banner.jpg, description=the page meta description, email + `sameAs`
  from the footer socials}; each Event {name=card `<h3>`, startDate=the card
  `<time datetime>`, description=the card's visible line, organizer→Organization}.
  No `location`/address is asserted (none is visible in the cards) — omitted
  rather than fabricated.
- **Preload** is placed early in `<head>` (right after the viewport meta) for
  maximum LCP benefit (web.dev LCP-preload guidance); `href` is the RELATIVE
  `assets/img/hero-banner.jpg` so it resolves to the exact same URL as the CSS
  background at style.css:133 — reprioritised existing asset, no second request.
- **Origin base** is the GitHub-Pages default for `PureStreets1/Purestreets`. It
  MUST be confirmed/replaced (find-and-replace the absolute base) if a custom
  domain (e.g. a CNAME) is later configured.

## How to reverse
Delete the added head lines in index.html: the hero `rel="preload"` link, the
`rel="canonical"` link, the `og:*` + `twitter:card` metas, and the
`application/ld+json` script. (The greeting `I`→`i` revert is covered by
decisions/phase5/apply-t13-content-items.md.) All additions are head-only / inline
text; removing them restores the prior head verbatim.
