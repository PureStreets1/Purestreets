# Page map — mosques-isocs.html

Rules reviewed first: `docs/audit/rules/coding-rules.md`,
`docs/audit/rules/design-rules.md`, `docs/audit/rules/anti-slop-checklist.md`,
`/CLAUDE.md`; inspiration skimmed under `docs/audit/findings/inspiration/`
(the authentic documentary `sisters-southall.mp4` here aligns with the
charity-water / goodgym "real action photography over stock" pattern,
design-rule D20).

## Purpose
Campaign / landing page for mosques and Islamic societies (ISOCs). It pitches
running organised litter picks plus a "Brothers vs Sisters" inter-ISOC
competition, offers a free litter-pick guide PDF, invites partnership signup, and
provides an on-device leaderboard with `localStorage` persistence. Body carries
`class="subpage"` (mosques-isocs.html:15), so the header is force-pinned
`is-scrolled`.

## User flows
- **Hero CTA "Open the counter"** (`mosques-isocs.html:44`) anchors to
  `#competition` (`:147`) and smooth-scrolls down the page.
- **"Partner with us"** (hero `:45`, dedicated CTA `:144`) opens Tally form
  `https://tally.so/r/MeP2jX` in a new tab.
- **"Open the guide" / guide-preview** (`:105`, `:107`) opens
  `assets/docs/community-litter-pick-guide.pdf` in a new tab.
- **Inter-ISOC competition** (`:147-243`): +/- brothers & sisters bags per society
  (4 teams: UCL, KCL, Imperial, Queen Mary), live per-team total + "Current
  leader" card, persisted to `localStorage 'purestreets-isoc-competition'`;
  "Reset scores" (`:154`) clears it.
- **PureBot assistant** (`:314-341`): open/close panel, canned quick-prompt
  buttons (events / contact / competition), free-text ask, links to Tally forms.
- **Global**: mobile nav hamburger toggle (`:20`), sticky header (forced
  `is-scrolled` on subpage), scroll-reveal entrance animations (41
  `[data-reveal]` elements).

## CTAs
- Open the counter → `#competition` (in-page anchor)
- Partner with us → `tally.so/r/MeP2jX` (×2: hero + partner-cta)
- Open the guide → `assets/docs/community-litter-pick-guide.pdf` (×2: button +
  guide-preview)
- Score +/- buttons per team/gender (8 controls × 4 rows)
- Reset scores (`data-reset-competition`)
- PureBot prompts (events/contact/competition) + Partner/WhatsApp links + Send
- Footer: mail (`purestreets0@gmail.com`), internal page links, Tally partner +
  WhatsApp forms, social links (IG/LinkedIn/FB/TikTok, all
  `target=_blank rel=noreferrer`)

## JS behaviours (script.js)
- **Reveal-on-scroll** — `IntersectionObserver` adds `.is-visible` to 41
  `[data-reveal]` elements on scroll (`rootMargin: 0px 0px -10% 0px`,
  threshold 0.16); falls back to instant-visible when IO unsupported
  (`script.js:73-86`).
- **Competition tally** — `readScores`/`writeScores` to `localStorage` key
  `'purestreets-isoc-competition'` (object keyed by team →
  `{brothers, sisters}`, clamped ≥0); recompute per-team totals + leader; reset =
  `removeItem` (`script.js:88-156`).
- **PureBot** — open/close toggling `.is-open`, `aria-expanded` on the toggle and
  `aria-hidden` on the panel (`script.js:249-255`); canned keyword replies,
  `addMessage()` linkifies URLs / `*.html` and marks external `https://` links
  `target=_blank rel=noreferrer`; purely local, no network (`script.js:158-320`).
- **Mobile nav toggle** — updates `aria-expanded` / `aria-label` and `.is-open`
  (`script.js:19-26`); clicking a nav link closes the menu.
- **Header state** — `setHeaderState()` forces `.is-scrolled` because
  `body.subpage` (`script.js:14-17`).
- **Inert observers** — scrollspy and the animated counter are guarded no-ops on
  this page (no same-page `#` nav links; no `#impact`/`[data-count]` element)
  (`script.js:37-71`).

## Notes for critics
- localStorage key in play here is `'purestreets-isoc-competition'` only (the
  volunteer key is on `volunteer-month.html`). Do not reshape it.
- External origins on this page: `fonts.googleapis.com`, `fonts.gstatic.com`,
  `tally.so` — all allowed by `/CLAUDE.md`. Network capture
  (`docs/audit/runs/before/network/mosques-isocs.json`) = 9 requests, 0 failures;
  it does NOT fetch the PDF, and it DOES fetch the 6.0 MB
  `sisters-southall.mp4` on load (autoplay).
- axe before-run = 2 violations (`aria-hidden-focus`, `aria-prohibited-attr`);
  Lighthouse perf 82 (second-weakest), a11y 93, best-practices 100, seo 100.
