# Page map — charities.html

Authored by the phase3 critic after reviewing `docs/audit/rules/coding-rules.md`,
`docs/audit/rules/design-rules.md`, `docs/audit/rules/anti-slop-checklist.md`,
`/CLAUDE.md`, and skimming `docs/audit/findings/inspiration/` (notably
`surfers-against-sewage.md` and `ramadan-tent-project.md`).

## Purpose
Charity / community-partnership landing page. It pitches PureStreets litter-pick
partnerships to Islamic charities and community organisations, showcases prior
partners (Islamic Relief, Muslim Council of Britain), and routes prospects to a
Tally partner-enquiry form. Three stacked `<section>`s under one `<main>`:
`.charity-hero` (pitch + previous-partner logo stack, `charities.html:38-54`),
`.partnership-section` (proof, `charities.html:56-73`), and
`.charity-form-section` (the embedded partner form, `charities.html:75-85`).

## User flows
- Read hero pitch -> scan "previous partnerships" proof -> submit the inline
  Tally partner form or open it in a new tab (`charities.html:81-84`).
- Cross-site navigation via the sticky header: desktop links
  (`charities.html:23-34`) or the mobile hamburger (`data-nav-toggle`,
  `charities.html:20`).
- Footer link-outs: email (`charities.html:94`), Partner form
  (`charities.html:100`), WhatsApp network form (`charities.html:101`), legal
  pages (`charities.html:105-106`), and socials (`charities.html:111-135`).
- Open the PureBot assistant (`charities.html:141-167`) -> quick-prompt or
  free-text -> receive a local canned reply / link.

## CTAs
- "Open form" button -> `https://tally.so/r/MeP2jX` (`charities.html:83`,
  `target="_blank" rel="noreferrer"`).
- Inline Tally partner-form iframe (`charities.html:82`).
- Footer "Partner form" + "WhatsApp network form" (`charities.html:100-101`).
- PureBot quick-prompts (events / contact / competition) + Partner form +
  WhatsApp network links (`charities.html:157-161`).

## JS behaviours (all from the shared `script.js`)
- Header scroll-state via `data-header` / `setHeaderState`; this subpage ships
  the `.is-scrolled` class hardcoded in the markup (`charities.html:16`).
- Mobile nav open/close toggling `.is-open` + `aria-expanded`
  (`data-nav-toggle` / `data-nav`, `charities.html:20,23`).
- PureBot open/close with `aria-hidden` / `aria-expanded` toggles, quick-replies,
  and link parsing (`script.js:249-284`; `data-purebot-*` hooks at
  `charities.html:141-166`). `setOpen()` (`script.js:249-255`) toggles ARIA and
  focuses the input on open.
- CSS-only page-load animation `pagePanIn` on `.subpage main`, gated by
  `prefers-reduced-motion` (`style.css:1504-1513`).
- Counter / competition / volunteer flows are ABSENT on this page; the shared
  `script.js` early-returns on its missing hooks (coding-rules J6), so no
  counters, no tally, no localStorage writes occur here.

## Notes for implementers
- Only external origins on this page: `fonts.googleapis.com`,
  `fonts.gstatic.com`, and `tally.so` (the lazy iframe). The Tally embed
  transitively pulls ~31 tally.so requests + 3 Sentry POSTs
  (`docs/audit/runs/before/network/charities.json`) — inside Tally's iframe and
  not removable without dropping the embed.
- axe baseline: 2 violations — `aria-hidden-focus` (serious) and
  `color-contrast` (serious), per `docs/audit/runs/before/axe/charities.json`.
  Lighthouse: performance 90, accessibility 90, best-practices 100, seo 100
  (`docs/audit/runs/before/lighthouse-summary.json`).
