# Pure Streets — Project Contract

PureStreets is a faith-inspired, grassroots community litter-picking movement.
This repo is its website: a **hand-written, no-build static site** — plain
HTML/CSS/JS served as files, with no bundler, package manager, framework, or
runtime dependency.

> This contract supersedes the previous "ZERO visual changes" spec. The change
> of mandate is logged at
> `docs/audit/decisions/phase0/conflict-resolution-full-overhaul.md` (this run is
> an evidence-driven visual overhaul, not a freeze). Rule strictness for
> modernization is set by
> `docs/audit/decisions/phase0/architecture-modernization-scope.md`.

## What this project is
- **9 HTML pages** (all at repo root): `index.html`, `mosques-isocs.html`,
  `volunteer-month.html`, `charities.html`, `work-with-us.html`, `our-team.html`,
  `contact.html`, `policies.html`, `terms.html`.
- **One stylesheet**: `style.css` (~2772 lines) — design tokens live in `:root`
  custom properties at the top (`--ink`, `--green`, `--paper`, `--lime`, etc.).
- **One script**: `script.js` (~462 lines) — a single classic script loaded at
  end of `<body>`; wires every interactive flow via `data-*` hooks.
- **Local assets** under `assets/`: `assets/img/` (logo, favicon, hero-banner,
  figure, video-poster), `assets/video/sisters-southall.mp4`,
  `assets/docs/community-litter-pick-guide.pdf`.
- **External dependencies (the ONLY two, do not add more):**
  1. **Google Fonts** — `Manrope` (weights 400;600;700;800), loaded via
     `<link>` to `fonts.googleapis.com` / `fonts.gstatic.com` on every page
     (e.g. `index.html:8-10`). Manrope is the only web font actually loaded.
  2. **Tally.so** — embedded form `<iframe>`s and `https://tally.so/r/…` links.
     Form IDs in use: `MeP2jX` (partner / contact) and `3xLRX5` (WhatsApp
     network). See `index.html:151`, `volunteer-month.html:139`.

## Hard constraints (never violate)
- Every change must resolve a finding in docs/audit/findings/.
- Every decision must be logged in docs/audit/decisions/.
- Preserve all behavior. All user flows must work end-to-end.
- Never add a build tool or runtime dep to the shipped site.

## Audit-driven workflow
This codebase is changed through an audit pipeline, not ad-hoc edits.
1. **Findings first.** No edit is made unless it traces to a written finding in
   `docs/audit/findings/<phase>/`. A finding states the problem, the evidence
   (repo path, screenshot, or source URL), and the fix direction. No finding ⇒
   no change.
2. **Decisions are logged.** Any judgement call with more than one defensible
   option is written to `docs/audit/decisions/<phase>/<slug>.md` (schema:
   frontmatter `{id, phase, agent, timestamp, chosen}`, then `## Problem`,
   `## Alternatives considered` with ≥3 scored options, `## Decision`,
   `## How to reverse`) *before* acting.
3. **The rules are law.** `docs/audit/rules/coding-rules.md`,
   `docs/audit/rules/design-rules.md`, and
   `docs/audit/rules/anti-slop-checklist.md` bind every agent and every edit.
4. **Evidence or it didn't happen.** Every claim in any audit doc cites a repo
   file path, a screenshot path, or a source URL.
5. **Verify before commit.** Before/after capture (4 viewports × 9 pages) plus
   axe and a console check; no new console errors, no new network requests, no
   new external domains; every flow below re-verified end-to-end.
6. **No-build is permanent.** Audit tooling (Lighthouse/axe/screenshots) lives
   only in gitignored scratch (`docs/audit/runs/`); the shipped site never gains
   a dependency.

## BEHAVIOR-PRESERVATION (must survive every change)
All behavior is wired in `script.js` through `data-*` attributes and class
toggles. Selectors, class names, `data-*` hooks, the two `localStorage` keys,
and their value shapes are a frozen contract — do not rename or reshape them
without a verified finding and a logged decision.

### JS flows (all must keep working on every page that includes the markup)
1. **Mobile nav toggle** — `[data-nav-toggle]` toggles `.is-open` on `[data-nav]`
   and `[data-header]`, and flips `aria-expanded` / `aria-label`
   (`script.js:19-26`). Clicking any nav link closes the menu (`:28-35`).
2. **Header scroll state** — `setHeaderState()` adds `.is-scrolled` to the header
   when `scrollY > 18` OR `body.subpage`; bound to a passive `scroll` listener
   (`script.js:14-17, 460-461`). Subpages carry `class="subpage"` on `<body>`.
3. **Scrollspy** — an `IntersectionObserver` toggles `.is-active` on same-page
   (`#…`) nav links as `section[id]`s cross `rootMargin: -42% 0px -48% 0px`
   (`script.js:37-49`).
4. **Animated counters** — `[data-count]` numbers in `#impact` count up to their
   target with a trailing `+`, step `max(1, round(target/34))` every 28 ms, once
   when the section enters view (`script.js:51-71`). HTML starts them at `0`.
5. **Reveal-on-scroll** — `[data-reveal]` elements gain `.is-visible` when
   observed (`rootMargin: 0px 0px -10% 0px`, threshold 0.16); optional
   `--reveal-delay` inline custom property staggers them. Without
   `IntersectionObserver`, all reveal items are shown immediately
   (`script.js:73-86, 84-85`).
6. **PureBot keyword assistant** — `initPureBot()` (`script.js:158-320`). Open/
   close (`[data-purebot-toggle]`/`[data-purebot-close]` toggling `.is-open` and
   `aria-hidden`/`aria-expanded`), quick-prompt buttons
   (`[data-purebot-prompt="events|contact|competition"]`), and a free-text form
   (`[data-purebot-form]`). `getReply()` matches keywords to canned replies and
   builds links by scanning the live DOM (`linkFor`); `addMessage()` linkifies
   URLs/`*.html` and marks external `https://` links `target="_blank"
   rel="noreferrer"`. No network calls — it is purely local.
7. **ISOC competition counter + reset** — `renderCompetition()` and the
   per-row click handler on `[data-team]` rows (`script.js:88-156`). `+`/`-`
   buttons (`[data-score-plus]`/`[data-score-minus]` valued `brothers|sisters`)
   adjust scores (clamped at 0), update `[data-score=…]`, `[data-team-total]`,
   the `[data-leader-name]`/`[data-leader-detail]` card, and `.is-leading`.
   `[data-reset-competition]` clears the store.
8. **Volunteer tracker add + points + reset** — `initVolunteerTracker()`
   (`script.js:323-456`). `[data-volunteer-form]` submit appends an entry;
   `renderBoard()` aggregates per volunteer, renders `[data-volunteer-rows]`,
   toggles `[data-volunteer-empty]`, and updates the leader card
   (`is-celebrating`). `[data-reset-volunteers]` clears the store. The month
   field defaults to the current `YYYY-MM`.

### localStorage keys + value shapes (FROZEN)
**Key 1 — `'purestreets-isoc-competition'`** (`script.js:12`)
- Value: a JSON **object** keyed by team name → `{ brothers, sisters }`, both
  non-negative integers. Missing team defaults to `{ brothers: 0, sisters: 0 }`;
  increments/decrements are clamped with `Math.max(0, …)` (`script.js:100-103,
  145-147`).
- Shape: `{ "<Team name>": { "brothers": <int≥0>, "sisters": <int≥0> }, … }`
- Example: `{"UCL ISOC":{"brothers":3,"sisters":5},"KCL ISOC":{"brothers":0,"sisters":2}}`
- Team total = `brothers + sisters`; leader = highest total; total 0 ⇒
  "Waiting for scores" (`script.js:113, 120-128`). Reset = `removeItem`
  (`:153-156`). Read is `try/catch`-guarded, falling back to `{}` (`:88-94`).

**Key 2 — `'purestreets-volunteer-month'`** (`script.js:330`)
- Value: a JSON **array** of append-only entry objects (never deduped on write;
  dedup happens only in the rendered board, grouped by
  `` `${month}::${name.toLowerCase()}` ``) (`script.js:339-345, 358-359, 443`).
- Entry shape: `{ name: <string>, month: "YYYY-MM", route: <string>,
  bags: <int≥0>, hours: <number≥0>, bonus: <int≥0>, note: <string> }`.
  Submit requires non-empty `name`, `month`, `route`; numbers coerced with
  `Math.max(0, Number(x) || 0)` (`script.js:430-440`).
- **Points formula (do not change): `20 + (bags * 5) + (hours * 10) + bonus`**
  (`script.js:351-352`). Board sort: points desc, then bags desc, then name asc
  (`:380`). Reset = `removeItem` (`:450-453`). Read falls back to `[]` (`:339-345`).

## How to work
- Read `docs/audit/rules/*` and the relevant `docs/audit/findings/*` before
  editing. Make one small, reviewable change per logical finding; commit per
  finding and reference its id.
- If a change is not backed by a finding, or would alter a frozen flow / key /
  shape, STOP, write the finding or decision first, and only then proceed.
