# Phase 3 — Site-wide Themes (consolidated findings)

Owner: dedup-consolidator. Merges the 48 verified per-id findings under
`docs/audit/findings/phase3/*/` into site-wide themes. Each theme = a title,
the finding ids it subsumes, ONE unified recommendation, and the file(s) it
touches (so the file-ownership implementation partition in
`decisions/orchestration/implementation-partitioning.md` — 9 page-implementers +
1 css-implementer + 1 js-implementer — can pick them up).

Rules read before authoring: `docs/audit/rules/coding-rules.md`,
`docs/audit/rules/design-rules.md`, `docs/audit/rules/anti-slop-checklist.md`,
`/CLAUDE.md`. Inspiration skimmed (`findings/inspiration/`); the
Surfers-Against-Sewage note ("a hot coral used **only for action**") directly
corroborates Theme 1.

Scope counts: 48 findings → 15 themes. Two non-obvious calls are logged as
decisions: `decisions/phase3/hero-clip-theme-split.md` (T3 vs T4 kept separate)
and `decisions/phase3/perf-findings-grouping.md` (T7 groups 3 perf singletons).
Every layout/colour theme that shifts pixels is a finding-approved change under
the on-disk `/CLAUDE.md` overhaul contract and MUST be flagged as such in its PR.

Behaviour guardrails honoured by every recommendation below: no change to a
`localStorage` key/shape, a `data-*` hook read by `script.js`, copy/text (except
the two copy items in T13, which are themselves the finding and need content
sign-off), or assets; the site stays no-build (no framework/runtime dep).

---

## T1 — Coral small-text / eyebrow contrast fails WCAG AA site-wide
- **Severity:** high (a11y) · cross-page (8 pages)
- **Subsumes:** `index/eyebrow-coral-contrast-fail`,
  `charities/coral-label-contrast-below-aa`, `contact/coral-label-contrast-below-aa`,
  `mosques-isocs/coral-eyebrow-contrast`, `our-team/coral-labels-fail-contrast`,
  `terms/eyebrow-coral-contrast-fail`, `volunteer-month/coral-eyebrow-badge-contrast`,
  `work-with-us/coral-small-text-contrast`
- **Evidence:** `--coral: #e6654f` (`style.css:10`) drives `.eyebrow`
  (`color:var(--coral); font-size:0.76rem; font-weight:800` — `style.css:154-161`)
  and every small uppercase label span: `.partnership-list span`
  (`style.css:2366-2372`), `.contact-options span` (`style.css:1851-1856`),
  `.partner-grid span` (`style.css:776-783`), `.team-grid span`
  (`style.css:2709-2714`), `.volunteer-hero__badge span` (`style.css:2177-2182`),
  `.work-hero__panel span` (`style.css:2591-2596`). Measured: `#e6654f` ≈
  **3.12:1 on `--paper #fbf8ef`**, **3.31:1 on `#ffffff`**, **3.26:1 on `#fffdf7`**,
  **3.71:1 on `--green-dark #123c2b`** — all < 4.5:1, and 0.76–0.78rem/800 (~12–12.5px)
  is NOT WCAG large text. axe `color-contrast` (serious) fires on the in-DOM nodes
  in `before/axe/{index,charities,contact,our-team,volunteer-month,work-with-us}.json`;
  mosques is real but axe-`incomplete` (hero bg is a gradient, `style.css:739`).
- **Unified recommendation:** Recolour coral **where it is small text on light
  surfaces** to reach ≥4.5:1, via a dedicated darker label/eyebrow token (e.g.
  `--coral-text`) applied to `.eyebrow` + the six label-span selectors — NOT by
  darkening the shared `--coral` token globally (it is also used for large/
  decorative accents at `style.css:338,341,1852+`, and darkening it would *worsen*
  the coral-on-`--green-dark` pairing). Leave the hero lime eyebrow override
  (`style.css:163-166`) untouched. Verify ≥4.5:1 on `#fbf8ef`, `#ffffff`, `#fffdf7`.
- **Files:** `style.css` (token + eyebrow/label rules). CSS-only; no JS/HTML.

## T2 — PureBot closed panel is `aria-hidden` yet keyboard-focusable
- **Severity:** high (a11y) · shared component (all PureBot pages)
- **Subsumes:** `index/purebot-aria-hidden-focus`,
  `charities/purebot-panel-aria-hidden-focus`,
  `contact/purebot-panel-aria-hidden-focusable`,
  `mosques-isocs/purebot-aria-hidden-focusable`,
  `our-team/purebot-panel-aria-hidden-focusable`, `terms/purebot-aria-hidden-focus`,
  `volunteer-month/purebot-panel-aria-hidden-focus`,
  `work-with-us/purebot-aria-hidden-focusable`
- **Evidence:** When closed, `.purebot-panel` is hidden only via `opacity:0` +
  `transform` + `pointer-events:none` (`style.css:1600-1618`) — no `display:none`,
  `visibility:hidden`, or `inert` — so its close button, 3 prompt buttons, 2 links,
  text input and Send stay in the tab order while `setOpen()` sets
  `aria-hidden="true"` (`script.js:249-255`, `:251`). `pointer-events:none` blocks
  the mouse, not the keyboard. axe `aria-hidden-focus` (serious, target
  `.purebot-panel`) in all 8 page JSONs (WCAG 4.1.2; coding-rules A4).
- **Unified recommendation:** In `setOpen()` toggle the native `inert` attribute
  on the panel in lockstep with `aria-hidden` (`panel.inert = !isOpen`); ensure
  `inert` is removed **before** `input.focus()` on open (`script.js:254`). Keep the
  existing `.is-open`/`aria-hidden`/`aria-expanded`/`data-purebot-*` hooks and the
  opacity/transform open animation intact. (CSS `visibility:hidden` ↔
  `.purebot.is-open` with a transition-delay is the equivalent CSS-only fallback if
  the JS route is rejected.) Render-neutral; one shared fix clears every page that
  renders the panel (incl. `policies.html`, which raised no per-page finding).
- **Files:** `script.js` (`setOpen`). Optional `style.css` if the visibility
  fallback is chosen instead.

## T3 — Fixed opaque header occludes the subpage hero eyebrow + H1
- **Severity:** high (design) · 6 subpages (terms fix also repairs policies)
- **Subsumes:** `charities/charity-hero-header-overlap`,
  `contact/hero-h1-eyebrow-clipped-by-fixed-header`,
  `our-team/header-overlaps-hero-h1`, `terms/h1-eyebrow-clipped-under-fixed-header`,
  `volunteer-month/fixed-header-occludes-hero`,
  `work-with-us/hero-h1-clipped-under-fixed-header`
- **Evidence:** `.site-header` is `position:fixed` + `padding:14px …`
  (`style.css:46-58`), forced opaque `is-scrolled` on subpages (`style.css:61-67`,
  `rgba(251,248,239,0.94)`). `.brand` is `width:clamp(78px,8vw,112px)`
  (`style.css:69-73`) over the portrait `logo.png` (intrinsic 343×480) with the
  global `img{max-width:100%}` carrying **no height cap** (`style.css:30-33`), so
  the header renders ~143px @1024 / ~171px @1280 / ~185px @1440. Each hero reserves
  less top space: `.charity-hero` 132px (`:2325`), `.contact-hero` 136px/118px@≤860
  (`:1809`,`:1902-1904`), `.team-hero` 132px (`:2647`), `.legal-page` 136px (`:1944`,
  shared by terms + policies), `.volunteer-hero` 132px (`:2149`), `.work-hero` 132px
  (`:2557-2562`). Screenshots at 1280/1440 confirm the eyebrow hidden and the H1
  first line clipped behind the bar; ≤768 is clear because the logo sits at its
  78px clamp floor. (design-rules D1/D3.)
- **Unified recommendation:** Make hero top clearance track the *real* header
  height instead of a hardcoded ~132–136px. Preferred single lever: cap the
  logo/header height (add a `.brand img` `height`/`aspect-ratio` rule) so one change
  fixes all six heroes; or expose a shared `--header-h` custom property and derive
  each hero's `padding-block-start` (and `scroll-padding-top`) from it. For
  `volunteer-month` also add `scroll-margin-top`/`scroll-padding-top` ≈ header
  height so `.section-arrow`/anchor jumps don't land headings under the bar. Keep
  the ≤768 rendering pixel-identical. Flag as an intentional bug-fix pixel change.
- **Files:** `style.css` (header/`.brand` cap and/or the six hero padding rules).
  No HTML.

## T4 — Index hero headline clipped at short viewport heights
- **Severity:** high (design) · index only · *kept separate from T3 — see
  `decisions/phase3/hero-clip-theme-split.md`*
- **Subsumes:** `index/hero-h1-clipped-top`
- **Evidence:** `.hero` is `min-height:92vh; display:grid; align-items:end;
  overflow:hidden; padding:150px …` (`style.css:123-132`); `.hero__content` is
  pulled up by `transform:translateY(clamp(-48px,-4vw,-28px))` (`style.css:151`);
  the H1 is `clamp(3rem,8vw,7.8rem)` at `line-height:0.93` (`style.css:205-206`);
  mobile override keeps `align-items:end` + `overflow:hidden` (`style.css:613-620`).
  On short viewports the fluid H1 overflows the clipped box top — 1440 and 375
  clip the first line + lime eyebrow, while 768/1280 render intact (viewport-HEIGHT
  dependent, not the T3 header-padding collision).
- **Unified recommendation:** Let content height drive the hero box at all viewport
  heights — e.g. switch `align-items:end → start` with adequate top padding, remove/
  reduce the upward `translateY`, and/or cap the H1 max-size so the headline fits
  within `min-height` without overflowing the clipped container. Must preserve the
  already-intact 768 rendering. CSS-only.
- **Files:** `style.css` (`.hero` / `.hero__content` / H1 — disjoint from T3
  selectors).

## T5 — Incomplete `prefers-reduced-motion` coverage
- **Severity:** med (a11y) · cross-page (one shared block + index counter)
- **Subsumes:** `index/reduced-motion-incomplete`, `charities/reduced-motion-incomplete`,
  `mosques-isocs/reduced-motion-smooth-scroll`,
  `our-team/incomplete-reduced-motion-coverage`,
  `terms/reduced-motion-coverage-partial`, `volunteer-month/reduced-motion-smooth-scroll`
- **Evidence:** The single `@media (prefers-reduced-motion: reduce)` block
  (`style.css:1504-1513`) only resets `.subpage main`, `[data-reveal]`,
  `.guide-copy > *`. Left ungated: `html{scroll-behavior:smooth}` (`style.css:19-21`);
  the `#impact` count-up via `setInterval` with no `matchMedia` guard
  (`script.js:51-71`); `.purebot-panel` transition (`:1617`); `.purebot-toggle:hover`
  transform (`:1583-1585`); `.button:hover` `translateY(-2px)` (`:248-249`);
  `.team-contact:hover` transform (`:2736-2742`); plus the lower-priority
  `.site-header` (`:58`) and `.site-nav a` (`:85`) colour fades. coding-rules C7
  explicitly names `scroll-behavior:smooth` AND "the counter animation."
- **Unified recommendation:** Extend the **existing** block (do not add a second
  media query) with `html{scroll-behavior:auto}` and `transition:none`/
  `transform:none` on the transform-based cases (`.purebot-panel`,
  `.purebot-toggle:hover`, `.button:hover`, `.team-contact:hover`); and in
  `script.js` gate the counter so that when
  `matchMedia('(prefers-reduced-motion: reduce)').matches` it writes the final
  values immediately (42+/18+/96+, preserving the `data-count` contract) instead of
  ticking. Render-neutral for default-motion users. Colour/background fades are
  optional (not vestibular motion).
- **Files:** `style.css` (the reduced-motion block) + `script.js` (counter guard).

## T6 — Missing canonical / Open Graph / Twitter / JSON-LD head metadata
- **Severity:** low–med (structure/SEO) · 7 pages with findings
- **Subsumes:** `index/missing-canonical-og`, `charities/head-metadata-canonical-og`,
  `contact/missing-canonical-and-og-meta`, `our-team/head-missing-canonical-og-jsonld`,
  `terms/head-missing-canonical-og-jsonld`, `volunteer-month/head-meta-canonical-og-missing`,
  `work-with-us/missing-canonical-og-meta`
- **Evidence:** Every cited head ships only `<title>` + `<meta name=description>`
  (e.g. `index.html:1-13`, `our-team.html:3-14`); grep finds no `rel="canonical"`,
  no `og:*`/`twitter:*`, no `application/ld+json` anywhere. coding-rules S2/S3/S4
  flag all three as absent and render-neutral; Lighthouse SEO is already 100, so
  these are share/discoverability enhancements, not regressions.
- **Unified recommendation:** Add to each page's `<head>`: a self-referential
  `<link rel="canonical">`; `og:title`/`og:description`/`og:image`/`og:url`/
  `og:type` + `twitter:card`; and JSON-LD per S4 — `Organization` site-wide, with
  member `Person`s on `our-team`, and `Event` for the index pickup cards
  (`index.html:101-126`). Reuse existing copy and an existing local asset for
  `og:image` (`hero-banner.jpg`/`logo.png`); canonical/`og:url` are self-URLs, so
  **no new external origin** and **no runtime request** (crawler-read only).
  Head-only ⇒ zero rendered-pixel change. NOTE: `mosques-isocs.html` and
  `policies.html` raised no such finding — apply the same head block to them only
  if a matching finding is added (consistency follow-up, flagged not assumed).
- **Files:** `index.html`, `charities.html`, `contact.html`, `our-team.html`,
  `terms.html`, `volunteer-month.html`, `work-with-us.html` (heads).

## T7 — Core Web Vitals / performance hygiene (3 independent fixes)
- **Severity:** high (LCP) · med/low (others) · *grouped, not duplicates — see
  `decisions/phase3/perf-findings-grouping.md`*
- **Subsumes:** `index/hero-lcp-8s`, `mosques-isocs/will-change-never-released`,
  `our-team/hero-images-unsized-cls`
- **Evidence & recommendation (three independent sub-fixes):**
  1. **Hero LCP (index).** LCP 8.3s (`before/lighthouse/index.json`); the hero is a
     CSS `background-image` discovered only after CSS parse (`style.css:133`,
     `hero-banner.jpg` 223KB, same origin). Fix: add
     `<link rel="preload" as="image" href="assets/img/hero-banner.jpg"
     fetchpriority="high">` to `index.html` head — same-origin reprioritization, no
     new domain/request, no visual change. Keep Tally a lazy iframe (P5).
  2. **`will-change` never released (mosques).** `will-change:opacity,transform` is
     on the base `[data-reveal]` selector (`style.css:691`) across ~41 nodes and is
     never cleared; `revealObserver` adds `.is-visible` + `unobserve()`s without
     touching it (`script.js:73-86`). Fix: clear `will-change` after the reveal (on
     `transitionend` or right after `.is-visible`), or scope it to a transient
     animating class. At rest the element is `opacity:1; transform:none`
     (`style.css:714-717`), so de-promoting the layer is pixel-neutral.
  3. **Unsized hero images (our-team).** Logo (`our-team.html:18`) and figure
     (`:44`) carry no `width`/`height`/`aspect-ratio`. IMPLEMENTATION CONSTRAINT
     (binding, from the finding): the global `img` rule has **no** `height:auto`
     (`style.css:30-33`) and author CSS overrides width only — adding raw
     `width`/`height` attributes alone would distort the images. Fix MUST reserve
     space via CSS `aspect-ratio` on `.brand img` / `.team-hero img` (intrinsic
     343×480 / 760×701), OR pair `width`/`height` attrs with `height:auto`, so the
     rendered box is unchanged.
- **Files:** `index.html` (preload) + `style.css` (will-change gate, img
  `aspect-ratio`) + `script.js` (will-change release). The our-team fix is CSS-only
  on its preferred path.

## T8 — Legal pages: over-wide reading measure
- **Severity:** med (design) · terms + policies (shared rule)
- **Subsumes:** `terms/legal-copy-measure-too-wide`
- **Evidence:** `.legal-copy` is `max-width:860px` + `line-height:1.75`
  (`style.css:1957,1959`); body sets no base font-size (`:23-28`) so 16px → ~100–110
  characters/line, well past design-rules D6's 45–75ch (and 1.75 exceeds D6's
  1.4–1.6, though it clears WCAG SC 1.4.8's 1.5 floor — the wide measure is the
  primary defect). Shared by `policies.html`.
- **Unified recommendation:** Constrain the measure to ~60–70ch (e.g.
  `max-width:62ch` on `.legal-copy`) and optionally set paragraph `line-height`≈1.6;
  keep the heading width separate (`.legal-page h1` has its own `max-width:900px`,
  `:1949`). Repairs both legal pages.
- **Files:** `style.css`.

## T9 — Embedded contact form renders on a dark-teal background
- **Severity:** med (design) · contact only
- **Subsumes:** `contact/contact-form-iframe-dark-bg-contrast`
- **Evidence:** `.tally-embed iframe` is `background:#033236` (`style.css:2533-2540`),
  while `.tally-embed--work iframe` overrides to `var(--white)` (`:2621-2624`). The
  contact wrapper `.tally-embed tally-embed--contact` (`contact.html:74`) has no
  override and the iframe `src` carries `transparentBackground=1` (`:75`), so the
  SAME `MeP2jX` form that is white on work-with-us renders dark teal on contact —
  in-iframe `color-contrast` nodes + a large dark box (`before/axe/contact.json`,
  screenshots). design-rules D11/D21.
- **Unified recommendation:** Give `.tally-embed--contact iframe` a light background
  to match the work form (or drop `transparentBackground=1`). Do not alter the Tally
  form id/URL or data hooks. CSS-only.
- **Files:** `style.css`.

## T10 — Work-with-us hero panel breaks "Environment" mid-word
- **Severity:** med (design) · work-with-us only (desktop)
- **Subsumes:** `work-with-us/panel-word-breaks-mid-word`
- **Evidence:** `.work-hero__panel strong` is `clamp(2rem,3.7vw,3.8rem);
  line-height:1.06; overflow-wrap:anywhere` (`style.css:2598-2604`) inside the
  `minmax(260px,0.42fr)` column (`:2559`) with `clamp(22px,4vw,34px)` padding
  (`:2585`) → ~280px inner width at 1440, narrower than "Environment" at that size,
  so `overflow-wrap:anywhere` splits it ("Environme"/"nt"). The DOM intends one word
  per line via `<strong>Environment<br>Tech<br>Design</strong>`
  (`work-with-us.html:46`). design-rules D4/D6.
- **Unified recommendation:** Lower the `strong` max font-size and/or the `3.7vw`
  step and replace `overflow-wrap:anywhere` with normal word wrapping so words never
  split internally (optionally widen the panel min column). Keep the Environment/
  Tech/Design copy. Effectively a desktop-only size adjustment (375 already fits).
- **Files:** `style.css`.

## T11 — Volunteer-month section arrows are unstyled, invisible 0×0 tab stops
- **Severity:** med (a11y) · volunteer-month only
- **Subsumes:** `volunteer-month/section-arrow-invisible-zero-size`
- **Evidence:** `.section-arrow`/`.section-arrow--cream` have **no CSS rule**
  (`grep -i arrow style.css` = 0; never existed per `git log -S`), yet render as
  `<a href="#…" aria-label="…"><span></span></a>` (`volunteer-month.html:51-53`,
  `:85-87`, `:129-131`) → invisible, ~0×0 focusable empty Tab stops with no focus
  ring (SC 2.4.7 / 2.5.8; design-rules D17 lists them as expected tap targets).
- **Unified recommendation:** Choose ONE path (fork for the planner): **(a)** give
  the arrows a visible chevron affordance sized ≥24px (ideally 44×44) with a visible
  focus state — `style.css`, css-implementer; or **(b)** if intentionally dropped,
  remove the three orphan `<a>`+`aria-label` nodes — `volunteer-month.html`,
  page-implementer. Section IDs live on the `<section>`s, not the arrows, so either
  path breaks no flow/hook. Pair (a) with the `scroll-margin-top` from T3.
- **Files:** `style.css` (path a) OR `volunteer-month.html` (path b).

## T12 — `aria-label` on role-less `<div>`s (prohibited ARIA)
- **Severity:** med (a11y) · mosques-isocs only
- **Subsumes:** `mosques-isocs/div-aria-label-prohibited`
- **Evidence:** axe `aria-prohibited-attr` (serious, 2 nodes,
  `before/axe/mosques-isocs.json`): `.campaign-hero__video`
  (`mosques-isocs.html:48`) and `.poster-scenes` (`:76`) are generic role-less
  `<div>`s carrying `aria-label`, which AT drops. Not referenced by `script.js`.
- **Unified recommendation:** Add `role="img"` to `.poster-scenes` (self-contained
  CSS illustration → valid single labelled image); remove the redundant wrapper
  `aria-label` on `.campaign-hero__video` (or give it `role="group"`) since it wraps
  a real `<video>`. Non-visual.
- **Files:** `mosques-isocs.html`.

## T13 — Copy & label corrections (content sign-off required)
- **Severity:** low (content) · greeting site-wide; iframe title charities only
- **Subsumes:** `mosques-isocs/purebot-greeting-lowercase-i`,
  `charities/iframe-title-mislabel`
- **Evidence:** (1) The static PureBot greeting reads "Assalamu alaikum, how can i
  help you?" with a lowercase first-person "i" (`mosques-isocs.html:327`; same
  string hard-coded on all 9 pages) — an objective English error, anti-slop #17.
  (2) The charity partner Tally iframe's accessible name is `title="PureStreets
  contact form"` (`charities.html:82`) while the same `MeP2jX` form is labelled
  "Partner form" by the eyebrow (`:77`), footer (`:100`) and PureBot (`:160`) —
  coding-rules H7 honest accessible names.
- **Unified recommendation:** Capitalize the greeting to "…how can I help you?"
  consistently across all 9 HTML files; rename the charities iframe `title` to the
  accurate "PureStreets charity partner form." Both are copy/label changes — per
  `/CLAUDE.md`, flag for content sign-off, do not silently edit. Render-neutral
  (greeting is a single glyph; iframe `title` is non-visual) and not read by
  `script.js`.
- **Files:** all 9 `*.html` (greeting string) + `charities.html` (iframe `title`).

## T14 — Volunteer leaderboard: ARIA table rowgroup ownership
- **Severity:** low (structure) · volunteer-month only · 2/3 skeptics (latent)
- **Subsumes:** `volunteer-month/aria-table-required-children`
- **Evidence:** `.volunteer-table[role="table"]` (`volunteer-month.html:71`)
  directly contains a roleless `.volunteer-empty` text div (`:79`) and a roleless
  `[data-volunteer-rows]` wrapper (`:80`); `renderBoard()` appends `role="row"`
  `<article>`s into that wrapper (`script.js:407-423`), severing table→row ownership
  once populated. axe passes only because the captured DOM is the empty state.
- **Unified recommendation:** Add `role="rowgroup"` to `[data-volunteer-rows]` so
  appended rows are owned correctly, and handle `.volunteer-empty` outside the table
  region (preserving the `data-volunteer-empty` hook). Do **NOT** convert to a native
  `<table>` — the layout is CSS-grid on `.volunteer-table`/`.volunteer-row`, which a
  native table would break. Render-neutral; preserves `data-*` + localStorage shape.
  Re-run axe against a *populated* board when fixing.
- **Files:** `volunteer-month.html`.

## T15 — our-team contact mailto links below the 44px touch-target aim
- **Severity:** med (a11y) · discretionary · our-team only · 2/3 skeptics
- **Subsumes:** `our-team/contact-links-small-tap-target`
- **Evidence:** `.team-contact` is `padding:9px 12px; font-size:0.84rem` + 1px border
  (`style.css:2725-2736`) → ~37–39px tall, below the 44px design-rules D17/
  coding-rules A1 *aim* for primary touch controls, though it clears the 24px WCAG
  2.2 SC 2.5.8 AA hard minimum (so this is an aspirational usability gap, not an AA
  failure — one skeptic refuted on that basis).
- **Unified recommendation:** Raise the effective hit area to ≥44px tall (add block
  padding or `min-height`) without changing the visible pill style, and verify it
  does not reflow the card `min-height:300px` (`style.css:2691`). Touches no
  `href`/`mailto` or JS hook.
- **Files:** `style.css`.

---

## Coverage map (all 48 findings → theme)

| Theme | Findings | Files |
|---|---|---|
| T1 coral contrast | 8 (index, charities, contact, mosques, our-team, terms, volunteer, work) | style.css |
| T2 PureBot aria-hidden focus | 8 (index, charities, contact, mosques, our-team, terms, volunteer, work) | script.js (+css fallback) |
| T3 subpage header overlap | 6 (charities, contact, our-team, terms, volunteer, work) | style.css |
| T4 index hero clip | 1 (index) | style.css |
| T5 reduced-motion | 6 (index, charities, mosques, our-team, terms, volunteer) | style.css + script.js |
| T6 canonical/OG/JSON-LD | 7 (index, charities, contact, our-team, terms, volunteer, work) | 7 page heads |
| T7 perf hygiene | 3 (index, mosques, our-team) | index.html, our-team.html, style.css, script.js |
| T8 legal measure | 1 (terms; repairs policies) | style.css |
| T9 contact iframe dark bg | 1 (contact) | style.css |
| T10 work-hero word break | 1 (work) | style.css |
| T11 section arrows | 1 (volunteer) | style.css OR volunteer-month.html |
| T12 div aria-label | 1 (mosques) | mosques-isocs.html |
| T13 copy/label | 2 (mosques greeting ×9, charities iframe title) | all 9 *.html + charities.html |
| T14 aria table rowgroup | 1 (volunteer) | volunteer-month.html |
| T15 team-contact tap target | 1 (our-team) | style.css |
| **Total** | **48** | — |

Note: `policies.html` produced zero verified findings of its own; it is touched
indirectly by T3 (shared `.legal-page` hero padding), T8 (shared `.legal-copy`),
T2 (shared PureBot), and T5 (shared reduced-motion block) — and by T13 if it ships
the PureBot greeting. No policies-specific edit is implied beyond those shared rules.
