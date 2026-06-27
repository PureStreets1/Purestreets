# Page map — contact.html

Authored by the phase3 critic after reviewing `docs/audit/rules/coding-rules.md`,
`docs/audit/rules/design-rules.md`, `docs/audit/rules/anti-slop-checklist.md`,
`/CLAUDE.md`, and skimming `docs/audit/findings/inspiration/` (notably
`two-minute-foundation.md`, `trash-free-trails.md`, and
`surfers-against-sewage.md`).

## Purpose
Contact hub that routes different audiences (volunteers, mosques/ISOCs, media,
partners, community groups) to the right channel. Three stacked `<section>`s
under one `<main>`: `.contact-hero` (eyebrow + H1 + intro + figure,
`contact.html:38-45`), `.contact-options` (three option cards — email, partner
Tally form, Instagram — `contact.html:47-66`), and `.contact-form-section` (the
embedded Tally contact form plus an "Open form" fallback,
`contact.html:68-78`).

## User flows
- Read the three contact-option cards and pick a channel
  (`contact.html:47-66`).
- Click the `mailto` link to email general enquiries (`contact.html:52`).
- Click "Open partner form" / "Open form" to open the Tally form in a new tab
  (`contact.html:58`, `contact.html:76`).
- Fill the embedded Tally iframe form inline (`contact.html:75`).
- Open/close the mobile hamburger nav (`<=860px`, `data-nav-toggle`
  `contact.html:20`); any nav link click closes the menu.
- Open/close PureBot and use the quick-prompt buttons / links
  (`contact.html:135-162`).

## CTAs
- `mailto:purestreets0@gmail.com` — appears twice: option card
  (`contact.html:52`) + footer (`contact.html:88`).
- "Open partner form" -> `https://tally.so/r/MeP2jX` in a new tab
  (`contact.html:58`, `target="_blank" rel="noreferrer"`).
- "@purestreets1" -> Instagram in a new tab (`contact.html:64`).
- "Open form" -> `https://tally.so/r/MeP2jX` in a new tab (`contact.html:76`).
- Inline Tally contact-form iframe (`contact.html:75`).
- Footer link list + WhatsApp network form `3xLRX5` (`contact.html:88-95`).
- PureBot prompt buttons (events / contact / competition) + Partner form +
  WhatsApp network links (`contact.html:151-155`).

## JS behaviours (all from the shared `script.js`)
- Header scroll-state via `data-header` / `setHeaderState()`; this subpage ships
  the `.is-scrolled` class hardcoded in the markup (`contact.html:16`).
- Mobile nav open/close toggling `.is-open` + syncing `aria-expanded` /
  `aria-label` (`data-nav-toggle` / `data-nav`, `contact.html:20,23`;
  `script.js:21-33`).
- PureBot open/close: `setOpen()` toggles `.purebot .is-open`, sets the panel
  `aria-hidden`, and flips the toggle `aria-expanded` / `aria-label`, focusing
  the input on open (`script.js:250-254`; `data-purebot-*` hooks at
  `contact.html:135-160`). Prompt/form replies are built locally via
  `textContent` with no network (coding-rules J3/J7).
- CSS-only page-load animation `pagePanIn` on `.subpage main`, plus
  `[data-reveal]` scroll reveals — both gated by
  `@media (prefers-reduced-motion: reduce)` (`style.css:678-680`, and the
  reveal/reduced-motion blocks).
- Competition / volunteer / counter flows are ABSENT on this page; the shared
  `script.js` early-returns on its missing hooks (coding-rules J6), so no
  counters, no tally, no localStorage writes occur here.

## Notes for implementers
- Only external origins on this page: `fonts.googleapis.com`,
  `fonts.gstatic.com`, and `tally.so` (the lazy contact-form iframe, the four
  `tally.so/r/...` link-outs, and the footer WhatsApp form). No new origins may
  be introduced.
- axe baseline (`docs/audit/runs/before/axe/contact.json`): 3 violations —
  `aria-hidden-focus` (serious, 1 node on `.purebot-panel`), `color-contrast`
  (serious, 12 nodes — the three `.contact-options span` labels plus in-iframe
  Tally nodes), and `link-name` (serious, 1 node — inside the cross-origin Tally
  iframe, not page-authored and not separately findable). Lighthouse
  (`docs/audit/runs/before/lighthouse-summary.json`): performance 94,
  accessibility 90, best-practices 100, seo 100.
- The `tally-embed--contact` modifier (`contact.html:74`) is unstyled in
  `style.css` today but is shared across `index.html:150` and
  `charities.html:81`; it is the intended scope for the
  `contact-form-iframe-dark-bg-contrast` fix — do not delete it.
