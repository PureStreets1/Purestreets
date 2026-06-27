# Coding Rules — PureStreets audit (the law all agents obey)

Binding on every later phase (page-mapper, critics, implementers, reviewer,
flow-verifier). Each rule has a one-line **Why** with a citation (source URL or
repo path). Companion files: `design-rules.md` (quality heuristics),
`anti-slop-checklist.md` (AI-slop tells, owned by slop-researcher),
`/CLAUDE.md` (frozen behavior + the four hard constraints).

**Meta-rules (override everything below):**
- No change without a finding in `docs/audit/findings/`; no judgement call
  without a decision in `docs/audit/decisions/`. (Why: project contract,
  `/CLAUDE.md`.)
- Never add a build tool, package manager, framework, or runtime dependency to
  the shipped site; the only allowed external origins stay
  `fonts.googleapis.com`, `fonts.gstatic.com`, `tally.so`. (Why: `/CLAUDE.md`;
  current deps verified at `index.html:8-10,151`.)
- Modern features are the target idiom, but `@layer` retrofits and ES-module
  splits are **propose-via-finding only**, never applied blindly, because they
  can alter the cascade or load timing. (Why:
  `docs/audit/decisions/phase0/architecture-modernization-scope.md`.)

---

## HTML
- **H1** Each page has exactly one `<h1>`, and headings descend without skipping
  levels (`h1→h2→h3`). Why: heading order is a parsed document outline for AT and
  SEO (https://www.w3.org/WAI/tutorials/page-structure/headings/). Repo note:
  subpages already use a single `<h1>` (e.g. `mosques-isocs.html:41`).
- **H2** Use semantic landmarks (`<header> <nav> <main> <footer> <section>
  <article> <aside>`) over `<div>` soup; one `<main>` per page. Why: landmarks
  give AT navigable regions (https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/main).
  Repo already does this (`index.html:16,37,157,212`).
- **H3** Keep `<!DOCTYPE html>`, `<html lang="en">`, `<meta charset="UTF-8">`,
  and `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
  on every page. Why: required baseline for correct rendering/encoding
  (https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta).
  Present repo-wide (`index.html:1-5`).
- **H4** Buttons that perform actions are `<button type="button">`; navigation is
  `<a href>`. Never swap them. Why: native semantics give keyboard + AT behavior
  for free (https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button).
  Repo is correct (`mosques-isocs.html:154,177`).
- **H5** Every `<img>` has an `alt`: descriptive for meaningful images, `alt=""`
  + `aria-hidden="true"` for decorative ones. Why:
  https://www.w3.org/WAI/tutorials/images/decision-tree/. Repo example of correct
  decorative use: `index.html:214`.
- **H6** Do not change DOM order, class names referenced by CSS/JS, `data-*`
  hooks, or copy text without a verified finding. Why: these wire every flow and
  selector (`/CLAUDE.md` BEHAVIOR-PRESERVATION; `script.js:1-12`).
- **H7** Associate every form control with a label (wrapping `<label>` or
  `for`/`id`) and keep `name` attributes stable. Why: labels are required for
  AT + the volunteer flow reads `name`s via `FormData`
  (https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/label;
  `script.js:429-438`). Repo wraps labels (`volunteer-month.html:95-98`).

## CSS
- **C1** Keep design decisions in `:root` custom properties; never hard-code a
  value that already has a token. Why: single source of truth for theming
  (https://developer.mozilla.org/en-US/docs/Web/CSS/--*). Tokens exist at
  `style.css:1-13`.
- **C2** Type and fluid spacing use `clamp(min, preferred-vw, max)` rather than
  per-breakpoint font sizes. Why: one fluid value replaces breakpoint stacks
  (https://developer.mozilla.org/en-US/docs/Web/CSS/clamp). Already used
  (`style.css:56,72,130`).
- **C3** Prefer **logical properties** (`margin-inline`, `padding-block`,
  `inset`, `border-start-…`) for new flow-relative spacing so RTL content (the
  Arabic hadith, `index.html:62` `dir="rtl"`) is handled. Why:
  https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values.
- **C4** For component-driven responsiveness, prefer **container queries**
  (`container-type` + `@container`) over viewport media queries where a block
  should adapt to its own column. Why: container queries have shipped in all
  evergreen browsers (https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries).
- **C5** **Do not retrofit `@layer`** across `style.css` without a finding that
  proves zero render change; layers re-order specificity resolution. Why: layer
  order changes which rule wins (https://css-tricks.com/css-cascade-layers/;
  decision `architecture-modernization-scope.md`).
- **C6** No `!important` except to override third-party (Tally/Google Fonts)
  styles, and only with a comment. Why: `!important` defeats the cascade and is
  the usual smell layers are meant to fix (https://developer.mozilla.org/en-US/docs/Web/CSS/important).
- **C7** Gate all non-essential motion behind
  `@media (prefers-reduced-motion: reduce)` and neutralize `scroll-behavior:
  smooth`, transitions, reveals, and the counter animation there. Why: WCAG 2.3.3
  + motion-sensitivity safety (https://www.w3.org/WAI/WCAG21/Techniques/css/C39).
  Repo currently ships smooth scroll/animations with **no** such guard
  (`style.css:19-21`) — a candidate finding, not a silent fix.
- **C8** Keep one delivered stylesheet (`style.css`); any split into partials is
  PROPOSE-only and must not add `@import` chains that add render-blocking
  requests. Why: extra blocking CSS requests hurt LCP
  (https://web.dev/articles/lcp); single-file plan in
  `decisions/orchestration/implementation-partitioning.md`.

## JavaScript
- **J1** Use `const`/`let`, never `var`; one declaration per binding. Why: block
  scope avoids hoisting bugs (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const).
  Repo already does (`script.js:1-12`).
- **J2** Prefer **event delegation** — one listener on a container using
  `event.target.closest(…)` — over per-element listeners, especially for
  rendered rows. Why: handles dynamic content, less memory
  (https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling).
  Repo already delegates competition clicks (`script.js:136-151`).
- **J3** Never build DOM from untrusted/dynamic strings via `innerHTML`; set text
  with `textContent` / `createTextNode`. Why: prevents XSS
  (https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML#security_considerations).
  Repo already routes user values through `textContent` even when it templates
  static cells (`script.js:411-422`); preserve that pattern.
- **J4** Keep `script.js` loaded so it runs after parse. A classic
  `<script>` at end of `<body>` already executes post-parse (`index.html:240`);
  if moved to `<head>`, it MUST get `defer`, and any `type="module"` is
  deferred automatically. Why: avoids parser-blocking + null-query bugs
  (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#applying_the_module_to_your_html).
- **J5** Converting `script.js` to `type="module"` is propose-via-finding only:
  modules are strict-mode + deferred and would change the global wiring of
  `renderCompetition()`/`setHeaderState()`. Why: load/scope semantics change
  (same MDN modules ref; decision `architecture-modernization-scope.md`).
- **J6** Guard optional DOM: every flow already early-returns when its hooks are
  absent (`if (!form || !rowsTarget) return`, `script.js:332`). Keep that — a
  page without a flow's markup must not throw. Why: shared script across 9 pages
  (`/CLAUDE.md`).
- **J7** No new network calls. PureBot is entirely local DOM logic
  (`script.js:158-320`); keep it offline. Why: "no new network requests / external
  domains" gate (`/CLAUDE.md`).

## Accessibility (WCAG 2.2 AA)
- **A1** Interactive targets are ≥ 24×24 CSS px (WCAG 2.2 SC 2.5.8 AA), and aim
  ≥ 44×44 px for primary touch controls. Why:
  https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/. Audit the small
  `+`/`-` score buttons and PureBot close `x` against this
  (`mosques-isocs.html:177-179`).
- **A2** Visible, ≥ 3:1-contrast focus indicators on every interactive element;
  never `outline: none` without a replacement. Why: SC 2.4.7 + 2.4.11 Focus Not
  Obscured (https://www.w3.org/TR/WCAG22/#focus-visible).
- **A3** Text contrast ≥ 4.5:1 (≥ 3:1 for ≥ 24px or 19px-bold large text),
  including white nav text over the hero image. Why: SC 1.4.3
  (https://www.digitala11y.com/understanding-sc-1-4-3-contrast-minimum/). Check
  `--muted` (`style.css:3`) and hero overlay text (`index.html:44-45`).
- **A4** Keep ARIA honest: `aria-expanded`, `aria-hidden`, `aria-label`, and
  `aria-live` must track real state. Why: stale ARIA misleads AT
  (https://www.w3.org/WAI/ARIA/apg/practices/). Repo updates these in JS
  (`script.js:23-24,251-253`) — preserve the toggles.
- **A5** Respect `prefers-reduced-motion` for all decorative motion (mirrors C7).
  Why: SC 2.3.3 (https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html).
- **A6** Provide a keyboard-operable path for anything pointer-driven; no
  drag-only interactions (SC 2.5.7). Why:
  https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/. (Repo counters are
  button-based — keep them so.)

## Performance (Core Web Vitals)
Targets: **LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1** at the 75th percentile (INP
replaced FID in March 2024). Why: https://web.dev/articles/vitals.
- **P1** Give the hero/LCP image explicit `width`/`height` (or `aspect-ratio`)
  and avoid late-loading it; reserve space for embeds to keep CLS ≤ 0.1. Why:
  unsized media is the top CLS cause (https://web.dev/articles/cls). Hero is a CSS
  `background-image` (`style.css:133`) — verify it is not layout-shifting.
- **P2** Lazy-load only below-the-fold media (`loading="lazy"`); never lazy-load
  the LCP element. Why: https://web.dev/articles/browser-level-image-lazy-loading.
  Repo lazy-loads Tally iframes (`index.html:151`) — correct.
- **P3** Keep `<link rel="preconnect">` to `fonts.googleapis.com` and
  `fonts.gstatic.com` (crossorigin) and use `font-display: swap` (already in the
  Google Fonts URL) to cut font-blocking. Why:
  https://web.dev/articles/font-best-practices. Present at `index.html:8-10`.
- **P4** Keep JS off the main critical path (defer/end-of-body) and keep handlers
  cheap so INP ≤ 200ms; the `scroll` listener is already `{ passive: true }`
  (`script.js:461`). Why: https://web.dev/articles/inp.
- **P5** Do not add blocking third-party scripts; Tally stays an `<iframe>`
  embed. Why: third-party JS is the common INP/LCP regressor
  (https://web.dev/articles/optimizing-content-efficiency-loading-third-party-javascript).

## SEO
- **S1** Every page has a unique, descriptive `<title>` and `<meta
  name="description">`. Why: primary SERP signals
  (https://developers.google.com/search/docs/appearance/snippet). Present
  (`index.html:6-7`).
- **S2** Add a self-referential `<link rel="canonical">` per page. Why: prevents
  duplicate-URL dilution (https://developers.google.com/search/docs/crawling-indexing/canonicalization).
  Absent today (grep: no `rel="canonical"` in repo) — head-only, render-neutral.
- **S3** Add Open Graph (`og:title`, `og:description`, `og:image`, `og:url`,
  `og:type`) + `twitter:card` for share previews. Why:
  https://ogp.me/. Absent today — head-only, render-neutral, overhaul-aligned.
- **S4** Add JSON-LD structured data (`Organization` site-wide; `Event` for the
  pickup cards) in a `<script type="application/ld+json">`. Why: Google's
  preferred format; unlocks rich results/AI citations
  (https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data).
  Mark up only content visible on the page (same source). Pickup cards live at
  `index.html:101-126`.
- **S5** Keep all internal links/anchors and filenames stable; do not rename
  pages or change `#mission`/`#pickups`/`#impact` anchors. Why: breaks inbound
  links + scrollspy (`script.js:5,42`; `index.html:24-26`).

## Security
- **SEC1** Every `target="_blank"` link carries `rel` that includes `noopener`
  (`noreferrer` satisfies this — it implies `noopener` in modern browsers). Why:
  blocks reverse-tabnabbing via `window.opener`
  (https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel#noopener).
  Repo uses `rel="noreferrer"` (`index.html:152,170`) — already compliant; do
  not "downgrade" by removing it.
- **SEC2** Add `<iframe>` `title` (present) and a least-privilege `sandbox`/
  `allow` only if a finding shows it is needed; Tally embeds are already
  `title`d + `loading="lazy"` (`index.html:151`). Why:
  https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe.
- **SEC3** Use **Subresource Integrity** (`integrity` + `crossorigin`) for any
  static third-party `<script>`/`<link>` with a fixed URL. Why: defends against
  CDN supply-chain tampering (https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
  Note: Google Fonts' CSS URL is dynamic/versioned and is **not** SRI-pinnable —
  do not attempt SRI on `fonts.googleapis.com` (it would break on font updates).
- **SEC4** A **Content-Security-Policy** is recommended; on a no-build static
  host deliver it via host headers, or as a fallback `<meta http-equiv>`
  restricting to `self` + the three allowed origins. Why: mitigates XSS/injection
  even on static sites (https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html).
  Treat as propose-via-finding; verify it does not block Tally iframes or Google
  Fonts before shipping.
- **SEC5** Never introduce inline event handlers (`onclick=…`) or `eval`/
  `new Function`/`innerHTML` from dynamic input. Why: each is a CSP-breaking XSS
  vector (https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html#defense-in-depth).
  Repo is clean today (handlers are `addEventListener`, `script.js:20`).

---

## Verification gate (every implementer + reviewer)
- `git diff --stat` shows only intended files; each commit names the finding id.
- Before/after capture at 4 viewports × 9 pages; any pixel change must be the
  intended one named in a finding. Why: `/CLAUDE.md` audit-driven workflow.
- axe: no new violations; console: no new errors/warnings; network: no new
  requests or external domains. Why: `/CLAUDE.md` verify-before-commit.
- All 8 flows in `/CLAUDE.md` BEHAVIOR-PRESERVATION re-verified end-to-end, both
  `localStorage` keys still readable in their documented shape.
