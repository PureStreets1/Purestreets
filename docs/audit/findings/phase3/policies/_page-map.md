# Page map — policies.html

Authored by the phase3 critic after reading `docs/audit/rules/coding-rules.md`,
`docs/audit/rules/design-rules.md`, `docs/audit/rules/anti-slop-checklist.md`,
and `/CLAUDE.md`, and skimming `docs/audit/findings/inspiration/` (notably
`ramadan-tent-project.md` and `two-minute-foundation.md` — both stress airy
single-column restraint, which is the register this thin legal page already
sits in).

## Purpose
Thin static legal / policies subpage. An `.eyebrow` ("PureStreets") + `<h1>`
"Policies" (`policies.html:39-40`) sit above three short policy blocks —
Privacy and communications, Volunteer safety, Media and photos
(`policies.html:42-47`) — inside a single `.legal-page` `<section>` under one
`<main>` (`policies.html:37-50`). The page is wrapped in the shared site header
(`policies.html:16-35`), footer (`policies.html:52-104`) and PureBot assistant
(`policies.html:106-133`). It is informational only: there is no page-specific
interactive markup, no form, and no counter/tracker hooks.

## User flows
- Read the H1 + three policy paragraphs (static content; no interaction).
- Cross-site navigation via the fixed header: desktop links Mission / Events /
  Impact (`index.html#mission|#pickups|#impact`), Volunteer, Mosques & ISOCs,
  Charities, Work with us, Our team, Contact (`policies.html:24-33`), or the
  mobile hamburger (`[data-nav-toggle]`, `policies.html:20`) toggling the nav.
- Footer link-outs: email `mailto:purestreets0@gmail.com` (`policies.html:59`),
  Contact page, Volunteer tracker, Work with us form, Our team, Charity
  partnerships (`policies.html:60-64`), Tally Partner form `MeP2jX`
  (`policies.html:65`) and WhatsApp network form `3xLRX5` (`policies.html:66`),
  legal pages Policies / Terms (`policies.html:70-71`), and four social links
  (`policies.html:76-100`).
- Open the PureBot assistant (`policies.html:106-133`) -> quick-prompt or
  free-text -> receive a local canned reply / link.

## CTAs
- Top nav (9 links): `index.html#mission`, `index.html#pickups`,
  `index.html#impact`, `volunteer-month.html`, `mosques-isocs.html`,
  `charities.html`, `work-with-us.html`, `our-team.html`, `contact.html`
  (`policies.html:24-33`).
- Footer: email, Contact page, Volunteer tracker, Work with us form, Our team,
  Charity partnerships, Tally Partner form `MeP2jX`, Tally WhatsApp network
  `3xLRX5`, Policies, Terms, and 4 socials (Instagram / LinkedIn / Facebook /
  TikTok) (`policies.html:57-102`). All `target="_blank"` links already carry
  `rel="noreferrer"` (coding-rules SEC1 — compliant; do not downgrade).
- PureBot: quick-prompts Upcoming events / Contact details / ISOC competition
  (`policies.html:122-124`), Partner form + WhatsApp network Tally links
  (`policies.html:125-126`), and the "Ask PureBot" input + Send
  (`policies.html:128-131`).

## JS behaviours (all from the shared `script.js`)
- **Header scroll state** — `setHeaderState()` adds `.is-scrolled` when
  `scrollY > 18` OR `body.subpage` (`script.js:14-17,460-461`, passive `scroll`
  listener). This page is `<body class="subpage">` (`policies.html:15`) and also
  ships `.is-scrolled` hardcoded in the markup (`policies.html:16`), so the
  header chrome is always in its scrolled state here. `.subpage .site-header`
  only changes colour, not height (`style.css:675`).
- **Mobile nav toggle** — `[data-nav-toggle]` toggles `.is-open` on `[data-nav]`
  / `[data-header]` and flips `aria-expanded` / `aria-label`
  (`script.js:19-26`); clicking any nav link closes it (`script.js:28-35`).
  Markup at `policies.html:20,23`.
- **PureBot keyword assistant** — `initPureBot()` (`script.js:158-320`) wires
  open/close (`[data-purebot-toggle]` / `[data-purebot-close]` toggling
  `.is-open` and `aria-hidden` / `aria-expanded`), the three quick-prompt
  buttons (`[data-purebot-prompt="events|contact|competition"]`) and the
  free-text form (`[data-purebot-form]`). `getReply()` matches keywords and
  builds links by scanning the live DOM (`linkFor`); `addMessage()` linkifies
  URLs / `*.html` and marks external `https://` links `target="_blank"
  rel="noreferrer"`. Purely local DOM — no network calls (coding-rules J7).
- **CSS page-load animation** — `pagePanIn` on `.subpage main`, gated by
  `@media (prefers-reduced-motion: reduce)` (`style.css:1504-1513`).
- **Early-return / no-op flows** — Scrollspy (`script.js:37-49`), animated
  counters (`script.js:51-71`), reveal-on-scroll (`script.js:73-86`), the ISOC
  competition counter + reset (`script.js:88-156`) and the volunteer tracker
  (`script.js:323-456`) all guard on hooks that DO NOT exist on this page, so
  they early-return per coding-rules J6. No `localStorage` keys
  (`purestreets-isoc-competition`, `purestreets-volunteer-month`) are read or
  written on this page.

## Notes for implementers
- Only external origins on this page: `fonts.googleapis.com`,
  `fonts.gstatic.com` (Manrope, `policies.html:8-10`) and `tally.so` (the two
  footer + two PureBot deep links). No iframe embed on this page — Tally appears
  only as outbound `https://tally.so/r/...` links, so there are no transitive
  Tally/Sentry requests here (unlike `charities.html`).
- axe baseline: 1 violation — `aria-hidden-focus` (serious) on `.purebot-panel`
  (`docs/audit/runs/before/axe/policies.json`). Lighthouse: performance 95,
  accessibility 95, best-practices 100, seo 100
  (`docs/audit/runs/before/lighthouse-summary.json`).
- Screenshots: `docs/audit/screenshots/policies/` (320 absent; 375, 375-nav-open,
  768, 1280, 1280-purebot, 1440 present).
