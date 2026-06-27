# Page map — work-with-us.html (phase3 critic)

## Purpose
Recruitment / interest-registration page: invites people with environment, tech,
or digital-design backgrounds to join the PureStreets team and funnels them into
an embedded Tally interest form (form id `MeP2jX`). Two stacked sections — a hero
(`.work-hero`, `work-with-us.html:38-48`) and the form section
(`.work-form-section`, `:50-60`) — plus the shared header, footer, and PureBot
assistant.

## User flows
- **Mobile nav** — the hamburger `[data-nav-toggle]` (`work-with-us.html:20`)
  toggles `.is-open` on `[data-nav]` / `[data-header]` and flips
  `aria-expanded` / `aria-label`; tapping a link closes it (`script.js:19-35`).
- **Header scroll state** — `<body class="subpage">` (`work-with-us.html:15`)
  short-circuits `setHeaderState()` to force `.is-scrolled` so the header is
  always opaque paper on this page (`script.js:14-17`; header already ships
  `class="site-header is-scrolled"`, `work-with-us.html:16`).
- **Register interest** — complete the embedded Tally iframe
  (`tally.so/embed/MeP2jX`, `work-with-us.html:57`) inline, or open it in a new
  tab via the fallback button (`:58`).
- **PureBot assistant** — open/close the panel, quick-prompt buttons
  (events / contact / competition), free-text query — all local DOM, no network
  (`script.js:158-320`; markup `work-with-us.html:116-143`).

## CTAs
- **Primary:** "Open Work with us form" `button button--primary` ->
  `https://tally.so/r/MeP2jX` (new tab, `work-with-us.html:58`).
- Embedded Tally interest form iframe `MeP2jX` (`work-with-us.html:57`).
- **Footer:** `mailto:purestreets0@gmail.com` (`:69`), internal nav links
  (`:70-74`), Partner form `tally.so/r/MeP2jX` (`:75`), WhatsApp network form
  `tally.so/r/3xLRX5` (`:76`), social links (`:86-110`).
- **PureBot:** quick prompts + Partner / WhatsApp links
  (`work-with-us.html:131-137`).

## JS behaviours (script.js)
- **Nav toggle** + `aria-expanded` / `aria-label` flip (`script.js:19-26`); links
  close the menu (`:28-35`).
- **setHeaderState** passive `scroll` listener; `body.subpage` short-circuits to
  `is-scrolled` (`script.js:14-17, 460-461`).
- **initPureBot** — open/close, `aria-hidden` / `aria-expanded` toggles, keyword
  `getReply`, `addMessage` linkify of URLs / `*.html` (external `https://` links
  get `target="_blank" rel="noreferrer"`); no network calls (`script.js:158-320`).
- **ABSENT here:** counters / scrollspy(same-page) / reveal / ISOC competition /
  volunteer tracker flows have no markup on this page, so each early-returns when
  its hooks are missing (coding-rules J6; e.g. `script.js:332`). Neither
  `localStorage` key (`purestreets-isoc-competition`,
  `purestreets-volunteer-month`) is touched by this page.

## Accessibility / SEO baseline (evidence)
- axe (`docs/audit/runs/before/axe/work-with-us.json`): 2 serious violations —
  `aria-hidden-focus` (`.purebot-panel`) and `color-contrast`
  (`.work-hero__panel > span`; remaining nodes inside the Tally iframe).
- Lighthouse (`docs/audit/runs/before/lighthouse-summary.json:51-55`):
  performance 94, accessibility 90, best-practices 100, seo 100.
- Head (`work-with-us.html:3-13`) has a unique title + description but no
  `rel="canonical"` and no Open Graph / `twitter:card` tags.
