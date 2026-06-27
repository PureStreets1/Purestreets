# Page map — index.html (phase3)

Rules read & applied: `docs/audit/rules/coding-rules.md`,
`docs/audit/rules/design-rules.md`, `docs/audit/rules/anti-slop-checklist.md`,
`/CLAUDE.md`; `docs/audit/findings/inspiration/` skimmed (e.g. `goodgym.md` —
"present pickups as a recurring, led, sociable group ritual with named local
groups").

## Purpose
Home / landing page for PureStreets, a faith-inspired grassroots litter-picking
movement. Establishes the mission via a hadith, lists aims, shows upcoming pickup
routes, animated community-impact stats, and a join/contact (Tally) form; funnels
users into work-with-us, ISOC, volunteer and partner flows.

## User flows
- **Header scroll-state:** `setHeaderState()` adds `.is-scrolled` past
  `scrollY > 18` (`script.js:14-17,460-461`).
- **Scrollspy:** an `IntersectionObserver` toggles `.is-active` on
  `#mission` / `#pickups` / `#impact` nav links (`script.js:37-49`).
- **Mobile nav toggle:** `[data-nav-toggle]` flips `.is-open` +
  `aria-expanded` / `aria-label`; a nav-link click closes it (`script.js:19-35`).
- **Reveal-on-scroll:** `[data-reveal="down"]` elements gain `.is-visible`,
  staggered via `--reveal-delay` (mission block `index.html:60-66`).
- **Animated counters:** `[data-count]` 42/18/96 count up once `#impact` enters
  view (`script.js:51-71`).
- **PureBot assistant:** open/close, quick prompts (events/contact/competition),
  free-text replies built from live DOM, fully local (`script.js:158-320`).
- **Tally embed:** lazy iframe `MeP2jX` with an "Open form" fallback
  (`index.html:150-153`).

## CTAs
- Hero primary "Work with us" -> `work-with-us.html` (`index.html:47`).
- Hero secondary "Start an ISOC challenge" -> `mosques-isocs.html`
  (`index.html:48`).
- Pickup-card "Work with us" `mailto` x3 (`index.html:108,116,124`).
- "Open form" -> `tally.so/r/MeP2jX` (`index.html:152`).
- PureBot prompts + Partner / WhatsApp links (`index.html:228-232`).
- Footer contact / legal / social links (`index.html:162-207`).

## JS behaviours
- Passive `scroll` listener -> header state.
- Two `IntersectionObserver`s (scrollspy + reveals).
- `setInterval` counter tick (28ms) — no `requestAnimationFrame`.
- `initPureBot` keyword matcher with DOM-scanning `linkFor` + URL linkify (no
  network).
- Competition / volunteer flows are absent on this page and early-return
  (`script.js` guards).

## Notes for critics
The competition counter + reset, volunteer tracker, and their two `localStorage`
keys are NOT exercised by index.html markup (the flows early-return when their
hooks are absent, coding-rules J6). Index-scoped findings must not touch those
keys/shapes. The frozen contract for index is: `#mission`/`#pickups`/`#impact`
anchors (scrollspy + smooth scroll), the `[data-count]` 42/18/96 counters, all
`data-purebot-*` / `data-nav*` / `data-reveal` hooks, and the two Tally form IDs
(`MeP2jX`, `3xLRX5`).
