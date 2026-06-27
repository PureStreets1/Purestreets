# Page map — our-team.html

Source of truth: `/Users/haidertoha/Code/pure_streets/our-team.html`,
`/Users/haidertoha/Code/pure_streets/script.js`,
`/Users/haidertoha/Code/pure_streets/style.css`. Screenshots under
`/Users/haidertoha/Code/pure_streets/docs/audit/screenshots/our-team/`.

## Purpose
Subpage that introduces the PureStreets team by area of work (community lead,
partnerships, digital design, technology) to build credibility for a
faith-inspired grassroots litter-picking movement, and funnels prospective helpers
to the "Work with us" form. Chrome is static: the header is hard-coded
`.is-scrolled` (`<body class="subpage">`, our-team.html:15-16).

Structure: `team-hero` (H1 + intro + figure, our-team.html:38-45) ->
`team-section` (eyebrow "Meet the team" + h2 "Core areas of work." + 4-card
`team-grid`, :47-82) -> `team-cta` (h2 + "Work with us" primary button, :84-87) ->
`site-footer` (:89-141) -> shared PureBot `aside` (:143-170).

## User flows
- **Mobile hamburger nav:** `[data-nav-toggle]` toggles `.is-open` on `[data-nav]`
  / `[data-header]` and flips `aria-expanded` / `aria-label`; tapping any nav link
  closes it (script.js:19-35). Open state captured in
  `docs/audit/screenshots/our-team/375-nav-open.png`.
- **Per-team-area "Contact":** four `.team-contact` mailto links open the mail
  client with a prefilled subject (our-team.html:58,65,72,79).
- **Primary CTA "Work with us":** `.button--primary` routes to work-with-us.html
  (our-team.html:86).
- **PureBot assistant:** open/close, quick-prompt buttons, and free-text Q&A, all
  local DOM (our-team.html:143-170; script.js:158-320). Open state captured in
  `docs/audit/screenshots/our-team/1280-purebot.png`.
- **Footer navigation:** legal, contact, socials, and Tally partner / WhatsApp form
  links (our-team.html:89-141).

## CTAs
- **Work with us** (`button button--primary`, in `.team-cta`, our-team.html:86) —
  the page's single primary CTA.
- **Contact** x4 (mailto role links in cards, our-team.html:58,65,72,79) —
  secondary per-card actions.
- **PureBot toggle + quick prompts** (Upcoming events / Contact details / ISOC
  competition, our-team.html:159-161).
- **Footer** email + Tally partner / WhatsApp form links (our-team.html:96-103).

## JS behaviours
**Active on this page (markup present):**
- Mobile nav toggle (script.js:19-35).
- `setHeaderState()` adds `.is-scrolled` because `body.subpage` (script.js:14-17,
  460-461) — header is opaque from load.
- `initPureBot()` (script.js:158-320): toggle/close, quick prompts, free-text form;
  `getReply()` matches keywords and builds links by scanning the live DOM
  (`linkFor`); `addMessage()` linkifies URLs / `*.html` and marks external
  `https://` links `target="_blank" rel="noreferrer"`. No network calls.

**Inert on this page (markup absent / handlers early-return):**
- Scrollspy (script.js:37-49), animated counters (:51-71), ISOC competition
  (:88-156), volunteer tracker (:323-456) — the page has none of their `data-*`
  hooks, so each early-returns.
- Reveal-on-scroll: the page has zero `[data-reveal]` nodes, so the only entrance
  motion is the `.subpage main` `pagePanIn` animation (style.css:678-679, 719-729),
  which is already gated by the `prefers-reduced-motion` block (style.css:1504-1513).

## localStorage
- This page neither reads nor writes either frozen key
  (`purestreets-isoc-competition`, `purestreets-volunteer-month`) — their flows are
  inert here. No key/shape change is in scope for any our-team finding.

## Audit state (before)
- axe (`docs/audit/runs/before/axe/our-team.json`): 2 serious violations —
  `aria-hidden-focus` (.purebot-panel) and `color-contrast` (5 nodes: the eyebrow +
  4 role labels).
- Lighthouse (`docs/audit/runs/before/lighthouse-summary.json`): performance 94,
  accessibility 90, best-practices 100, SEO 100.
