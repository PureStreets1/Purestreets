# Page map — terms.html

Authored by the phase3 critic after reading `docs/audit/rules/coding-rules.md`,
`docs/audit/rules/design-rules.md`, `docs/audit/rules/anti-slop-checklist.md`,
and `/CLAUDE.md`, and skimming `docs/audit/findings/inspiration/` (notably
`two-minute-foundation.md` and `surfers-against-sewage.md` for the lean
legal/footer chrome pattern).

## Purpose
Static legal "Terms & conditions" page for the PureStreets community
litter-picking movement. It states website-usage terms, event/participation
responsibility, and a third-party external-links disclaimer. Pure boilerplate
content — a single `<section class="legal-page">` holding an eyebrow + h1 + three
`h2`/`p` pairs (`terms.html:38-49`) — wrapped in the shared header / footer /
PureBot chrome.

## User flows
- **Mobile nav toggle** — the hamburger `[data-nav-toggle]` (`terms.html:20`)
  toggles `.is-open` on `[data-nav]` / `[data-header]` and flips
  `aria-expanded` / `aria-label` (`docs/audit/screenshots/terms/375-nav-open.png`).
- **Nav-link click** closes the open mobile menu.
- **Header scroll state** — `body.subpage` plus the markup-baked
  `class="is-scrolled"` (`terms.html:16`) forces the fixed header opaque from
  load.
- **PureBot assistant** — open/close, three quick-prompt buttons, two external
  Tally form links, and a free-text ask form (`terms.html:106-133`).
- Counter / scrollspy / reveal / ISOC-competition / volunteer-tracker flows are
  INERT here — no markup is present, so `script.js` early-returns per its
  missing-hook guards (coding-rules J6).

## CTAs
- Footer mailto `purestreets0@gmail.com` (`terms.html:59`).
- Internal links: contact, volunteer tracker, work-with-us, our-team,
  charities, policies, terms (`terms.html:60-64,70-71`).
- External Tally forms: Partner (`tally.so/r/MeP2jX`) and WhatsApp network
  (`tally.so/r/3xLRX5`), `target="_blank" rel="noreferrer"` (`terms.html:65-66`).
- Social links: Instagram / LinkedIn / Facebook / TikTok,
  `target="_blank" rel="noreferrer"` (`terms.html:76-95`).
- PureBot quick-prompts (events / contact / competition) + Send
  (`terms.html:122-130`).

## JS behaviours (all from the shared `script.js`)
- Mobile nav toggle + link-close (`script.js:19-35`).
- `setHeaderState()` passive scroll listener; this subpage stays `.is-scrolled`
  (`script.js:14-17, 460-461`; markup at `terms.html:16`).
- `initPureBot()` (`script.js:158-320`): `getReply()` keyword match,
  `addMessage()` linkifies URLs / `*.html` and marks external `https://` links
  `target="_blank" rel="noreferrer"` — fully local, no network.
- Scrollspy / counter / reveal / competition / volunteer initializers run but
  no-op via their missing-hook guards (coding-rules J6) — no localStorage writes
  occur on this page.

## Notes for implementers
- Only external origins on this page: `fonts.googleapis.com`,
  `fonts.gstatic.com` (Manrope), and `tally.so` (the two footer + two PureBot
  form links, which are plain `<a>` link-outs, not embedded iframes here).
- axe baseline: 1 violation — `aria-hidden-focus` (serious) on `.purebot-panel`
  (`docs/audit/runs/before/axe/terms.json`). Lighthouse: performance 93,
  accessibility 95, best-practices 100, seo 100
  (`docs/audit/runs/before/lighthouse-summary.json`).
- Verified findings on this page: `h1-eyebrow-clipped-under-fixed-header` (high,
  design — shared `.legal-page` clipping, also hits policies.html),
  `purebot-aria-hidden-focus` (high, a11y), `eyebrow-coral-contrast-fail` (med,
  a11y), `legal-copy-measure-too-wide` (med, design),
  `reduced-motion-coverage-partial` (low, a11y),
  `head-missing-canonical-og-jsonld` (low, structure). Rejected:
  `touch-targets-below-44px`, `redundant-brand-eyebrow` (see `_rejected.md`).
</content>
