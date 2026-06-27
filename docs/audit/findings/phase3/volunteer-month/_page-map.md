# Page map — volunteer-month.html

Authored by the phase3 critic after reading `docs/audit/rules/coding-rules.md`,
`docs/audit/rules/design-rules.md`, `docs/audit/rules/anti-slop-checklist.md`,
and `/CLAUDE.md`, and skimming `docs/audit/findings/inspiration/` for
grassroots-impact patterns (notably `goodgym.md`, `surfers-against-sewage.md`,
`two-minute-foundation.md`, and `the-felix-project.md`).

## Purpose
Volunteer-of-the-Month page: a **device-local point tracker** for logging
litter-pick clean-ups (name, month, route, bags, hours, bonus) that renders a
monthly leaderboard, plus an embedded Tally form to join the WhatsApp volunteer
network. Four stacked `<section>`s under one `<main>` (`volunteer-month.html:37`):
`.volunteer-hero` (pitch + points-rules badge, `:38-49`),
`#volunteer-leaderboard` (`.volunteer-board` + leader card + `role="table"`
tracker, `:55-83`), `#volunteer-form` (the nomination `.join-form`, `:89-127`),
and `#volunteer-network` (the embedded Tally WhatsApp form, `:132-142`).

## User flows
- Read hero + points-rules badge -> jump to the leaderboard / form / network via
  the three `.section-arrow` links (`:51-53`, `:85-87`, `:129-131`) ->
  `#volunteer-leaderboard`, `#volunteer-form`, `#volunteer-network`.
- Add a clean-up: fill the nomination form (`:90-126`) and submit "Add to
  tracker" (`:125`) -> entry appended to `localStorage`
  `'purestreets-volunteer-month'` -> `renderBoard()` aggregates per
  `month::name`, ranks, and updates the leader card; "Reset" (`:62`) clears the
  store.
- Apply to the WhatsApp network: submit the inline Tally iframe (`:139`) or open
  it in a new tab via "Open WhatsApp network form" (`:140`, `target="_blank"
  rel="noreferrer"`).
- Cross-site nav via the sticky header: desktop links (`:23-34`, the Volunteer
  link carries `.is-active`, `:27`) or the mobile hamburger (`data-nav-toggle`,
  `:20`) — screenshot `docs/audit/screenshots/volunteer-month/375-nav-open.png`.
- Open the PureBot assistant (`:198-225`) -> quick-prompt or free-text ->
  receive a local canned reply / link.

## CTAs
- "Add to tracker" — `.button--primary` form submit (`:125`).
- "Reset" — `.button--outline`, clears the volunteer board (`:62`).
- "Open WhatsApp network form" — `.button--primary` Tally link (`:140`,
  `target="_blank" rel="noreferrer"`); inline Tally iframe (`:139`).
- Three `.section-arrow` in-page jump links (`:51`, `:85`, `:129`) — currently
  unstyled / invisible (see finding `section-arrow-invisible-zero-size`).
- PureBot toggle + quick-prompts (events / contact / competition) + Partner /
  WhatsApp links + Send (`:199`, `:214-218`, `:222`).
- Footer link-outs: email (`:151`), contact / volunteer / work-with-us / team /
  charities pages (`:152-156`), Partner + WhatsApp Tally forms (`:157-158`),
  legal (`:162-163`), socials (`:168-192`).

## JS behaviours (all from the shared `script.js`)
- **Volunteer tracker** — `initVolunteerTracker()` (`script.js:323-456`). The
  month input defaults to the current `YYYY-MM` (`:335-336`); points =
  `20 + (bags*5) + (hours*10) + bonus` (`:351-352`, FROZEN); board sort is points
  desc -> bags desc -> name asc (`:380`); `renderBoard()` (`:383-425`) clears
  `[data-volunteer-rows]` via `innerHTML=''` (`:385`), toggles
  `[data-volunteer-empty]` (`:386`), and rebuilds each `role="row"` `<article>`
  with a static `innerHTML` template (`:411-420`) then sets the user-controlled
  name/route via `textContent` (`:421-422`, the XSS-safe pattern per coding-rules
  J3). The leader card re-triggers `is-celebrating` via forced reflow
  (`:398-402`). "Reset" `removeItem`s the store (`:450-453`).
- **PureBot** — `initPureBot()`; `setOpen()` (`script.js:249-255`) toggles
  `.is-open` + the panel's `aria-hidden` + the toggle's `aria-expanded`/
  `aria-label`, and focuses the input on open — but does **not** manage
  `inert`/`tabindex` (see finding `purebot-panel-aria-hidden-focus`). Replies are
  built purely from the live DOM; no network calls (coding-rules J7).
- **Header scroll state** — `setHeaderState()` keeps `.is-scrolled` because this
  subpage hardcodes `class="site-header is-scrolled"` (`:16`) and `body.subpage`
  (`:15`); bound to a passive `scroll` listener.
- **Mobile nav** — `data-nav-toggle` toggles `.is-open` + flips `aria-expanded`
  on `[data-nav]`/`[data-header]` (`:20`, `:23`).
- **Reveal-on-scroll** — every section is `[data-reveal="down"]` with staggered
  `--reveal-delay` (160ms on the arrows, 220ms on the sections, `:51-132`); the
  three orphan `.section-arrow` anchors are also reveal items.
- Counter / ISOC-competition flows are ABSENT here; the shared `script.js`
  early-returns on their missing hooks (coding-rules J6).

## Notes for implementers
- **FROZEN contract:** `localStorage` key `'purestreets-volunteer-month'`
  (`script.js:330`) is an append-only JSON array of
  `{name, month, route, bags, hours, bonus, note}`; the points formula and board
  dedup (`month::name.toLowerCase()`) must not change. Preserve every `data-*`
  hook (`data-volunteer-form`, `data-volunteer-rows`, `data-volunteer-empty`,
  `data-reset-volunteers`, `data-volunteer-leader-name`/`-detail`,
  `data-purebot-*`).
- Only external origins on this page: `fonts.googleapis.com`,
  `fonts.gstatic.com`, and `tally.so` (the lazy `#volunteer-network` iframe,
  `:139`). Two color-contrast axe nodes live inside that Tally iframe and are
  out of scope.
- **axe baseline (`docs/audit/runs/before/axe/volunteer-month.json`):** 2
  violations — `aria-hidden-focus` (serious, `.purebot-panel`) and
  `color-contrast` (serious, 5 nodes = 3 in-DOM eyebrow/badge labels + 2 Tally
  iframe). Both are covered by verified findings in this directory.
- Inspiration patterns worth weighing for any copy/framing work (proposals, not
  required by these findings): a named recurring local group ritual (goodgym),
  a collective campaign target + activist identity (surfers-against-sewage), a
  low-barrier "2 minutes" entry ask (two-minute-foundation), and a warm
  custom-icon system for utilitarian content (the-felix-project).
