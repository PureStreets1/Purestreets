---
name: static-site
description: Best practices for editing this hand-written, no-build, multi-page HTML/CSS/JS site (PureStreets) without breaking behavior, performance, or accessibility.
---

# Static-site implementer skill

You are editing a **no-build static site**: 9 HTML pages at the repo root, one
`style.css`, one `script.js`, assets under `assets/`. There is no bundler, no
package manager, no framework. Keep it that way.

## Before you touch anything
1. Read `/CLAUDE.md` (the four hard constraints + the frozen behavior/localStorage
   contract), `docs/audit/rules/coding-rules.md`, `docs/audit/rules/design-rules.md`,
   and `docs/audit/rules/anti-slop-checklist.md`.
2. Find the finding in `docs/audit/findings/` your change resolves. No finding ⇒
   no change. Reference its id in your commit.
3. If you hit a real choice with >1 defensible option, write the decision to
   `docs/audit/decisions/<phase>/<slug>.md` first.

## The two external dependencies (do not add a third)
- Google Fonts: **Manrope** only, via `fonts.googleapis.com`/`fonts.gstatic.com`
  (`<link>` in each page head). Keep `preconnect` + `display=swap`.
- Tally.so: form `<iframe>`s + `tally.so/r/…` links (IDs `MeP2jX`, `3xLRX5`).
No new origins, no new scripts, no CDNs, no SRI on the dynamic Google Fonts URL.

## HTML
- One `<h1>`/page; never skip heading levels. Semantic landmarks
  (`header/nav/main/footer/section/article/aside`). Keep `lang`, `charset`,
  `viewport`.
- Buttons that act = `<button type="button">`; navigation = `<a href>`. Never
  swap.
- Every `<img>` has `alt` (descriptive, or `alt=""`+`aria-hidden` if decorative).
- Do NOT change DOM order, `data-*` hooks, CSS/JS-referenced class names, `name`
  attributes, anchors (`#mission`/`#pickups`/`#impact`), or copy without a finding.
- Head-only, render-neutral SEO/security wins you MAY add when a finding calls for
  them: `rel="canonical"`, Open Graph + Twitter tags, JSON-LD
  (`Organization` site-wide, `Event` for pickup cards) — markup only content
  that is visible on the page.

## CSS
- Reuse `:root` tokens (`style.css:1-13`); never hard-code a value that has a
  token. Fluid sizing with `clamp()`; new flow spacing with logical properties
  (`margin-inline`, `padding-block`) so the RTL Arabic line stays correct.
- Prefer container queries for component-level responsiveness.
- DO NOT retrofit `@layer` across the whole file or split `style.css` into
  partials unless a finding proves zero render change — these can reorder the
  cascade. Avoid `!important` (only to tame Tally/Google styles, with a comment).
- Wrap every non-essential animation/transition (incl. `scroll-behavior: smooth`,
  reveals, the counter tick) in `@media (prefers-reduced-motion: reduce)`.

## JavaScript
- `const`/`let` only. Prefer event delegation (`container.addEventListener` +
  `event.target.closest(...)`) over per-element listeners.
- Build DOM with `textContent`/`createTextNode` for any dynamic value — never
  `innerHTML` from input (XSS).
- Keep `script.js` running after parse (it loads at end of `<body>`). Converting
  to `type="module"` or adding `defer` in `<head>` is propose-via-finding only —
  it changes load/scope semantics and the global wiring.
- Every flow must early-return when its hooks are absent (the script runs on all
  9 pages). No new network calls — PureBot is local-only.
- The 8 flows and BOTH localStorage shapes in `/CLAUDE.md` are frozen: mobile nav,
  header scroll state, scrollspy, counters, reveals, PureBot, ISOC competition
  (`purestreets-isoc-competition` = `{team:{brothers,sisters}}`), volunteer
  tracker (`purestreets-volunteer-month` = array; points = `20 + bags*5 +
  hours*10 + bonus`). Do not rename keys or change shapes/formula.

## Accessibility (WCAG 2.2 AA)
- Targets ≥ 24×24px (aim 44×44 for primary). Visible ≥3:1 focus rings (never bare
  `outline:none`). Text contrast ≥4.5:1 (≥3:1 large). Keep `aria-expanded`/
  `aria-hidden`/`aria-label`/`aria-live` tracking real state. Respect
  `prefers-reduced-motion`.

## Performance (CWV: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1)
- Size media (or set `aspect-ratio`) to prevent CLS; reserve space for iframes.
- `loading="lazy"` only below the fold (never the LCP element). Keep handlers
  cheap; `scroll` stays `{ passive: true }`. No blocking third-party JS.

## Verify before commit
- `git diff --stat` = only intended files; commit names the finding id.
- Before/after capture 4 viewports × 9 pages — every pixel change is the intended
  one. axe: no new violations. Console: no new errors. Network: no new requests
  or domains.
- Re-run all 8 flows by hand; confirm both localStorage keys still read/write in
  their documented shape.
