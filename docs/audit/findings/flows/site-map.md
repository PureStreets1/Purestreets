# Site map — PureStreets end-to-end flow graph

Owner: flow-mapper (Phase: flows). This is the **re-walkable checklist** the
flow-verifier uses to confirm every navigation path, on-page flow, JS behaviour,
form, and external link still works **identically** after the overhaul. Every
claim cites a repo file + line. No screenshot/axe paths are invented here; this
doc is built from source (`*.html`, `script.js`) and the 9 phase3 `_page-map.md`s.

**Rules read & applied (named per operating rules):**
`docs/audit/rules/coding-rules.md`, `docs/audit/rules/design-rules.md`,
`docs/audit/rules/anti-slop-checklist.md`, `/CLAUDE.md`. Inspiration skimmed
(`docs/audit/findings/inspiration/`): the flow-relevant adaptable patterns are
`trash-free-trails.md` ("volunteers clean, then log what they found" — the
citizen-science log loop mirrors the volunteer tracker), `goodgym.md` (named
recurring led group ritual — the pickup cards), `surfers-against-sewage.md`
(collective campaign target — the impact counters + competition leaderboard), and
`two-minute-foundation.md` (low-barrier entry — the single-CTA hero). These are
framing inputs only; **no flow, hook, key, copy, or asset is changed by this map.**

**Frozen contract reminder (`/CLAUDE.md` BEHAVIOR-PRESERVATION):** the two
`localStorage` keys and shapes, all `data-*` hooks, all class toggles, all
internal anchors (`#mission` `#pickups` `#impact` `#competition`
`#volunteer-leaderboard` `#volunteer-form` `#volunteer-network`), the two Tally
form IDs (`MeP2jX`, `3xLRX5`), and every page filename must survive every change.

---

## 0. Page inventory (9 pages, all at repo root)

| Page | `<body>` | Header ships | Active nav | Page-unique flows |
|---|---|---|---|---|
| `index.html` | `<body>` (no class) | `.site-header` (no `is-scrolled`) | none (scrollspy-driven) | scrollspy, counters, reveals(6), join Tally embed |
| `mosques-isocs.html` | `subpage` | `is-scrolled` baked | Mosques & ISOCs | ISOC competition+reset, reveals(41), guide PDF, autoplay video |
| `volunteer-month.html` | `subpage` | `is-scrolled` baked | Volunteer | volunteer tracker add/points/reset, reveals(7), section-arrows, WhatsApp Tally embed |
| `charities.html` | `subpage` | `is-scrolled` baked | Charities | partner Tally embed |
| `work-with-us.html` | `subpage` | `is-scrolled` baked | Work with us | interest Tally embed |
| `contact.html` | `subpage` | `is-scrolled` baked | Contact | 3 option cards, contact Tally embed |
| `our-team.html` | `subpage` | `is-scrolled` baked | Our team | 4 mailto cards |
| `policies.html` | `subpage` | `is-scrolled` baked | none | static legal copy |
| `terms.html` | `subpage` | `is-scrolled` baked | none | static legal copy |

Evidence: `<body class>` and header class at line 15–16 of every page (e.g.
`index.html:16`, `mosques-isocs.html:15-16`); `.is-active` nav at
`mosques-isocs.html:29`, `volunteer-month.html:27`, `charities.html:30`,
`work-with-us.html:31`, `our-team.html:32`, `contact.html:33` (policies/terms/index
carry no `.is-active`).

---

## 1. Global chrome (identical shell on all 9 pages)

### 1a. Header + primary nav (`<header class="site-header" data-header>`)
- **Brand link** (`.brand`): on `index.html:17` → `#home` (scrolls to
  `<main id="home">`, `index.html:37`); on all 8 subpages → `index.html`
  (`mosques-isocs.html:17` et al.). The brand link is **not** inside `.site-nav`,
  so it does **not** fire the nav-close handler (`script.js:4,28`).
- **Hamburger** `<button data-nav-toggle>` (3 `<span>` bars), `aria-expanded`
  default `false`, `aria-label="Open menu"` (`index.html:20-22`).
- **Primary nav** `<nav class="site-nav" data-nav>` — **9 links, identical order
  on every page** (verified count = 9/page):
  1. Mission → `index.html#mission` (on index: `#mission`)
  2. Events → `index.html#pickups` (on index: `#pickups`)
  3. Impact → `index.html#impact` (on index: `#impact`)
  4. Volunteer → `volunteer-month.html`
  5. Mosques & ISOCs → `mosques-isocs.html`
  6. Charities → `charities.html`
  7. Work with us → `work-with-us.html`
  8. Our team → `our-team.html`
  9. Contact → `contact.html`

  Evidence: `index.html:24-33` (same-page `#` form); subpage cross-page form e.g.
  `mosques-isocs.html:24-33`. The first 3 links are the ONLY difference between
  index (`#…`) and subpages (`index.html#…`).

### 1b. Footer (`<footer class="site-footer">`) — link graph, identical on all 9
Four columns + brand + trademark. All link-outs verified present on every page
(e.g. `index.html:157-209`):
- **footer-contact (8 links):** `mailto:purestreets0@gmail.com`, `contact.html`,
  `volunteer-month.html`, `work-with-us.html`, `our-team.html`, `charities.html`,
  `https://tally.so/r/MeP2jX` (Partner form, `_blank`), `https://tally.so/r/3xLRX5`
  (WhatsApp network form, `_blank`). Evidence `index.html:164-171`.
- **footer-legal (2 links):** `policies.html`, `terms.html` (`index.html:175-176`).
- **social-links (4 links):** Instagram `instagram.com/purestreets1/`, LinkedIn
  `linkedin.com/company/purestreets/`, Facebook `facebook.com/purestreets/`,
  TikTok `tiktok.com/@purestreets1` — all `target="_blank" rel="noreferrer"` with
  inline `<svg aria-hidden>` + `aria-label` (`index.html:181-205`).
- All footer `target="_blank"` links already carry `rel="noreferrer"`
  (coding-rules SEC1 — compliant; do not downgrade).

### 1c. PureBot assistant (`<aside class="purebot" data-purebot>`) — on all 9 pages
Verified present on every page. Structure (`index.html:212-239`): toggle button
`[data-purebot-toggle]` (figure.png, `alt=""`), panel `[data-purebot-panel
aria-hidden="true"]`, close `[data-purebot-close]` (text "x"), messages
`[data-purebot-messages aria-live="polite"]` seeded with one bot greeting
"Assalamu alaikum, how can i help you?", 3 quick-prompt buttons
(`data-purebot-prompt="events|contact|competition"`) + 2 link-outs (Partner
`MeP2jX`, WhatsApp `3xLRX5`), and `<form data-purebot-form>` with
`[data-purebot-input]` + Send. See flow F6 below for behaviour.

---

## 2. Global navigation graph (page → page edges)

Every page can reach every other page via header nav + footer; the directed edges
that matter for the verifier:

```
                 ┌──────────────────────────── header nav (9 links, all pages) ───────────────────────────┐
index.html ──┬─► work-with-us.html  (hero primary CTA, index.html:47)
             ├─► mosques-isocs.html (hero secondary CTA, index.html:48)
             ├─► #mission/#pickups/#impact (in-page, scrollspy)
             └─► mailto x3 (pickup cards, index.html:108,116,124)

mosques-isocs.html ─► #competition (hero "Open the counter", :44)
                    ─► tally MeP2jX (hero + partner-cta, :45,144)
                    ─► community-litter-pick-guide.pdf (:105,107)

volunteer-month.html ─► #volunteer-leaderboard / #volunteer-form / #volunteer-network (section-arrows, :51,85,129)
                      ─► tally 3xLRX5 (embed + open, :139,140)

charities.html / contact.html / work-with-us.html ─► tally MeP2jX (embed + open)
contact.html ─► mailto, tally MeP2jX, instagram (option cards, :52,58,64)
our-team.html ─► work-with-us.html (CTA :86) + mailto x4 (cards :58,65,72,79)

ALL pages ─► (footer) mailto, contact/volunteer/work/team/charities, tally MeP2jX, tally 3xLRX5, policies, terms, 4 socials
ALL pages ─► (PureBot) tally MeP2jX, tally 3xLRX5 + DOM-built links to internal pages
ALL subpages (brand) ─► index.html ; index (brand) ─► #home
```

**Reachability check for verifier:** from any page you must be able to reach all 8
others via the header nav; policies.html and terms.html are reachable only via the
**footer legal column** and PureBot (they are absent from the header nav) — confirm
those two footer edges on every page.

---

## 3. JS-driven flows (the 8 frozen behaviours) + per-page applicability

All wired by the single end-of-body `<script src="script.js">` (`index.html:240`).
`script.js` runs four initializers + a scroll binding at the bottom
(`script.js:457-461`): `initPureBot()`, `initVolunteerTracker()`,
`renderCompetition()`, `setHeaderState()`, `addEventListener('scroll', …, {passive:true})`.
Every flow **early-returns when its hooks are absent** (coding-rules J6), so the
shared script is safe on thin pages.

### Applicability matrix (which page exercises which flow)
| Flow | index | mosques | volunteer | charities | work | contact | team | policies | terms |
|---|---|---|---|---|---|---|---|---|---|
| F1 Mobile nav toggle | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| F2 Header scroll-state | ✅ scroll | ✅ forced | ✅ forced | ✅ forced | ✅ forced | ✅ forced | ✅ forced | ✅ forced | ✅ forced |
| F3 Scrollspy | ✅ | – | – | – | – | – | – | – | – |
| F4 Animated counters | ✅ (3) | – | – | – | – | – | – | – | – |
| F5 Reveal-on-scroll | ✅ (6) | ✅ (41) | ✅ (7) | – | – | – | – | – | – |
| F6 PureBot Q&A | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| F7 ISOC competition+reset | – | ✅ | – | – | – | – | – | – | – |
| F8 Volunteer tracker | – | – | ✅ | – | – | – | – | – | – |

`data-reveal` counts grep-verified: index 6, mosques-isocs 41, volunteer-month 7,
all others 0 (charities/contact/team/policies/terms have **zero** `[data-reveal]`
nodes — their only entrance motion is the CSS `pagePanIn` on `.subpage main`,
`style.css:1504-1513`, already `prefers-reduced-motion`-gated). `data-count`,
competition hooks, and volunteer hooks each appear on exactly ONE page
(grep-confirmed: index / mosques-isocs / volunteer-month respectively).

### F1 — Mobile nav toggle (`script.js:19-35`)
- Click `[data-nav-toggle]` → toggles `.is-open` on `[data-nav]` **and**
  `[data-header]`; sets `aria-expanded` = open-state; `aria-label` =
  "Close menu"/"Open menu".
- Click ANY `.site-nav a` (`script.js:28-35`) → removes `.is-open` from both,
  resets `aria-expanded="false"` / `aria-label="Open menu"`.
- **Verify:** open hamburger at ≤860px, menu shows; click a nav link → menu
  closes AND navigates; `aria-expanded` returns to `false`. (Screens exist e.g.
  `docs/audit/screenshots/volunteer-month/375-nav-open.png`.)

### F2 — Header scroll-state (`script.js:14-17,460-461`)
- `setHeaderState()` toggles `.is-scrolled` when `scrollY > 18` **OR**
  `body.subpage`. On index it flips on first scroll past 18px; on all 8 subpages
  it is forced on (and the class is also baked into markup, e.g.
  `mosques-isocs.html:16`).
- **Verify:** index header is transparent at top, gains `.is-scrolled` after a
  small scroll; every subpage header is opaque from load.

### F3 — Scrollspy (`script.js:37-49`) — index only
- `IntersectionObserver` (`rootMargin:-42% 0px -48% 0px`, threshold 0) toggles
  `.is-active` on the same-page nav links (`#mission`/`#pickups`/`#impact`) as
  `section[id]`s cross the viewport band. `samePageNavLinks` is non-empty only on
  index (`script.js:5,47`).
- **Verify:** scrolling index updates which of Mission/Events/Impact is
  highlighted. Subpages: no same-page `#` nav links → observer never wired.

### F4 — Animated counters (`script.js:51-71`) — index `#impact` only
- 3 `[data-count]` numbers 42 / 18 / 96 (`index.html:137-139`), start at `0`,
  count up with a trailing `+`, step `max(1, round(target/34))` every 28 ms, fired
  ONCE when `#impact` enters view (threshold 0.35), then `observer.disconnect()`.
- **Verify:** scroll `#impact` into view → numbers tick 0→42+, 0→18+, 0→96+ once;
  do not re-fire on re-scroll.

### F5 — Reveal-on-scroll (`script.js:73-86`)
- `[data-reveal]` elements gain `.is-visible` when observed
  (`rootMargin:0px 0px -10% 0px`, threshold 0.16), unobserved after. Optional
  inline `--reveal-delay` staggers (e.g. `index.html:61-66`,
  `mosques-isocs.html:40-92`, `volunteer-month.html:51-132`). No
  `IntersectionObserver` → all reveal items shown immediately (`script.js:84-85`).
- **Verify:** on index/mosques/volunteer, reveal items fade/slide in on scroll and
  remain visible; content is never permanently hidden if JS/IO is unavailable.

### F6 — PureBot keyword assistant (`script.js:158-320`) — all 9 pages
- **Open/close:** `[data-purebot-toggle]` toggles `.is-open` + panel
  `aria-hidden` + toggle `aria-expanded`/`aria-label`, focuses input on open
  (`setOpen`, `:249-255`); `[data-purebot-close]` closes (`:302`).
- **Quick prompts (3):** `[data-purebot-prompt="events|contact|competition"]`
  echo the button label as a user message then append the canned reply
  (`:304-310`).
- **Free-text:** submit `[data-purebot-form]` → echo question, clear input, after
  180 ms append `getReply(question)` (`:312-318`). `getReply` keyword-matches into
  events / contact / competition / volunteer / whatsappNetwork / charity / guide /
  work / navigate / partner, else a fallback listing the live nav (`:286-299`).
- **Link building:** replies call `linkFor()` which scans the **live DOM**
  `a[href]` for a matching label/href (`:170-174`); `addMessage()` linkifies URLs
  and `*.html` tokens, marking external `https://` links `target="_blank"
  rel="noreferrer"`, and rewrites a `mosques-isocs.html` token to the label
  "Mosques & ISOCs page" (`:257-284`). **No network calls** (coding-rules J7).
- **Verify on every page:** open PureBot; each of the 3 prompts returns a non-empty
  reply; a free-text "when is the next pickup" returns the events reply; emitted
  internal links resolve, external links open in a new tab. Greeting text reads
  exactly "Assalamu alaikum, how can i help you?" (note: an open finding
  `purebot-greeting-lowercase-i` concerns the lowercase "i" — copy change is
  finding-gated, not a flow break).

### F7 — ISOC competition counter + reset (`script.js:88-156`) — mosques-isocs only
- 4 rows `[data-team]` = UCL ISOC, KCL ISOC, Imperial ISOC, Queen Mary ISOC
  (`mosques-isocs.html:171,189,207,225`). Each row has brothers & sisters
  `score-control`s: `[data-score-minus="brothers|sisters"]`,
  `[data-score-plus="brothers|sisters"]`, display `[data-score=…]`, plus
  `[data-team-total]` (8 minus + 8 plus + 8 score + 4 total, grep-verified).
- **Click (delegated per row, `:136-151`):** `+`/`-` adjust the team's
  brothers/sisters count, clamped `Math.max(0,…)`, persist to `localStorage`
  `'purestreets-isoc-competition'`, then `renderCompetition()`.
- **`renderCompetition()` (`:105-134`):** writes each score + total, clears/sets
  `.is-leading` on the highest-total row, updates `[data-leader-name]` /
  `[data-leader-detail]`. Total 0 across all → "Waiting for scores" / "Add bags
  below to start the competition."
- **Reset:** `[data-reset-competition]` (`mosques-isocs.html:154`) →
  `localStorage.removeItem` + re-render (`:153-156`).
- **localStorage shape (FROZEN):** object `{ "<Team>": {brothers:int≥0,
  sisters:int≥0} }`, key `'purestreets-isoc-competition'` (`script.js:12`).
- **Verify:** `+brothers` on UCL → UCL brothers=1, total=1, UCL row `.is-leading`,
  leader card = "UCL ISOC / 1 bags total: 1 brothers, 0 sisters."; `-` clamps at 0;
  refresh persists; Reset clears all to "Waiting for scores".

### F8 — Volunteer tracker add + points + reset (`script.js:323-456`) — volunteer-month only
- **Form** `[data-volunteer-form]` (`volunteer-month.html:90-126`) fields: `name`
  (required), `month` (required, `type=month`, defaults to current `YYYY-MM` via
  `:335-336`), `route` (required), `bags` (≥0), `hours` (≥0, step 0.5), `bonus`
  (≥0), `note`.
- **Submit (`:427-448`):** build entry, coerce numbers `Math.max(0,Number||0)`,
  reject if name/month/route empty, **append** to `localStorage`
  `'purestreets-volunteer-month'` (append-only JSON array), `form.reset()`, restore
  month, `renderBoard()`.
- **`renderBoard()` (`:383-425`):** aggregate per `` `${month}::${name.toLowerCase()}` ``,
  **points = `20 + bags*5 + hours*10 + bonus`** (FROZEN, `:351-352`), sort points
  desc → bags desc → name asc (`:380`); clear `[data-volunteer-rows]`, toggle
  `[data-volunteer-empty]`, render a `role="row"` `<article>` per volunteer with
  user values set via `textContent` (XSS-safe, `:421-422`); top row `.is-leading`;
  leader card `[data-volunteer-leader-name]`/`[-detail]` re-triggers
  `is-celebrating` via forced reflow (`:398-402`).
- **Reset:** `[data-reset-volunteers]` (`volunteer-month.html:62`) →
  `removeItem` + re-render → "Waiting for entries" / "Add a nomination to begin."
- **Verify:** add {Aisha, this month, High Street, bags 3, hours 2, bonus 0} →
  points `20+15+20+0=55`, leader card shows "55 points in <month>: 1 clean-ups, 3
  bags, 2 hours.", empty-state hidden; second entry same name+month aggregates into
  one row; refresh persists; Reset clears.

---

## 4. Per-page on-page user flows (entry → action)

### index.html
- Hero: read H1 "Clean streets. Shared reward." → primary **Work with us**
  (`:47`) / secondary **Start an ISOC challenge** (`:48`); side panel "Next
  community clean / Cricklewood Litter Pick / TBC" (`:51-55`, static).
- `#mission` hadith block (6 `[data-reveal]`, RTL Arabic `:62`) → `#pickups` 3
  pickup cards each with a `mailto` "Work with us" (`:102-125`) → `#impact`
  counters (F4) → `#join` Tally embed `MeP2jX` + "Open form" (`:150-153`).
- Scrollspy highlights Mission/Events/Impact (F3); PureBot (F6).

### mosques-isocs.html
- Hero (`:38-54`): "Open the counter" → `#competition` (in-page); "Partner with
  us" → Tally `MeP2jX` (`_blank`); autoplay-muted-loop **video**
  `sisters-southall.mp4` with `controls` + poster (`:49-52`).
- Poster section (decorative, `:57-98`) → guide section: "Open the guide" +
  `guide-preview` `<object>` both → `community-litter-pick-guide.pdf` (`_blank`,
  `:105,107-110`) → partner grid (`:113-129`) → LSE partnership (`:131-141`) →
  partner-cta Tally `MeP2jX` (`:144`).
- `#competition` leaderboard (F7) with Reset; kit section (`:245-256`); PureBot (F6).

### volunteer-month.html
- Hero + points badge (`:38-49`) → 3 `.section-arrow` in-page jumps to
  `#volunteer-leaderboard` / `#volunteer-form` / `#volunteer-network`
  (`:51,85,129`; an open finding `section-arrow-invisible-zero-size` notes they
  render invisibly — the anchors still function).
- Leaderboard (F8 board + Reset, `:55-83`) → nomination form (F8 add, `:89-127`)
  → WhatsApp network Tally embed `3xLRX5` + "Open WhatsApp network form" (`_blank`,
  `:138-141`). PureBot (F6).

### charities.html
- Hero pitch + previous-partner logo stack (Islamic Relief, MCB, `:44-53`) →
  partnership proof (`:56-73`) → partner Tally embed `MeP2jX` + "Open form"
  (`:81-84`). PureBot (F6).

### work-with-us.html
- Hero + team-areas panel (`:38-48`) → register-interest Tally embed `MeP2jX` +
  "Open Work with us form" (`_blank`, `:56-59`). PureBot (F6).

### contact.html
- Hero + figure (`:38-45`) → 3 option cards: Email `mailto` (`:52`), Partnerships
  "Open partner form" Tally `MeP2jX` (`:58`), Socials "@purestreets1" Instagram
  (`:64`) → contact Tally embed `MeP2jX` + "Open form" (`:74-77`). PureBot (F6).

### our-team.html
- Hero + figure (`:38-45`) → 4 team cards each with a `mailto?subject=…` Contact
  link (`:58,65,72,79`) → team-cta **Work with us** → `work-with-us.html`
  (`:86`). PureBot (F6).

### policies.html / terms.html
- Static legal copy only (`policies.html:38-49`, `terms.html:38-49`): eyebrow +
  H1 + 3 `<h2>/<p>` blocks. No page-specific interactive markup. Navigation via
  header nav, footer, and PureBot (F6) only.

---

## 5. Forms inventory (real `<form>` + embedded Tally)

**Native `<form>` elements (10 total, grep-verified):**
- `[data-purebot-form]` — one per page on all 9 (e.g. `index.html:234`); local
  submit, `preventDefault`, no network (F6).
- `[data-volunteer-form]` — `volunteer-month.html:90` only; local submit →
  `localStorage` (F8). Fields: name, month, route, bags, hours, bonus, note
  (labels wrap inputs, coding-rules H7).

**Embedded Tally `<iframe>` forms (5, cross-origin, lazy):**
| Page | line | src | Tally ID |
|---|---|---|---|
| index.html | 151 | `tally.so/embed/MeP2jX?…` | MeP2jX (contact/join) |
| charities.html | 82 | `tally.so/embed/MeP2jX?…` | MeP2jX (partner) |
| contact.html | 75 | `tally.so/embed/MeP2jX?…` | MeP2jX (contact) |
| work-with-us.html | 57 | `tally.so/embed/MeP2jX?…` | MeP2jX (interest) |
| volunteer-month.html | 139 | `tally.so/r/3xLRX5` | 3xLRX5 (WhatsApp network) |

Each embed is paired with a fallback "Open …" `<a … target="_blank"
rel="noreferrer">` to the `tally.so/r/<id>` page. All carry an iframe `title`
(note: index/charities/contact iframes share `title="PureStreets contact form"` —
the open finding `iframe-title-mislabel` flags the charities one; the title is a
flow-neutral a11y label).

---

## 6. External link inventory (the only 3 allowed off-site origins)

Allowed origins per `/CLAUDE.md`: `fonts.googleapis.com`, `fonts.gstatic.com`,
`tally.so`. (Socials + mailto are link-outs, not embeds — they add no runtime
origin.) The flow-verifier must confirm **no new origin** appears after changes.

- **Tally** (grep-verified unique targets): `tally.so/embed/MeP2jX` (4 iframes),
  `tally.so/r/MeP2jX` (Partner/contact/work — 25 link occurrences across pages),
  `tally.so/r/3xLRX5` (WhatsApp network — 20 occurrences + 1 iframe on
  volunteer-month). Plus the Google Fonts preconnect/stylesheet on every page head
  (`index.html:8-10`).
- **mailto** (`purestreets0@gmail.com`): plain in every footer (×9) + PureBot
  fallback; with subject lines on `index.html:108,116,124`
  (`Cricklewood Litter Pick`, `Park and Playground Sweep`, `Sisters PureStreets`)
  and `our-team.html:58,65,72,79` (`Community lead enquiry`,
  `Mosques and partnerships enquiry`, `Digital design enquiry`,
  `Technology enquiry`). **These subject strings are copy — frozen.**
- **Socials** (`target="_blank" rel="noreferrer"`, all pages footer): Instagram
  `instagram.com/purestreets1/`, LinkedIn `linkedin.com/company/purestreets/`,
  Facebook `facebook.com/purestreets/`, TikTok `tiktok.com/@purestreets1`. Contact
  page also surfaces Instagram in an option card (`contact.html:64`).
- **Local assets referenced** (must keep resolving): `assets/img/logo.png`,
  `assets/img/favicon.png`, `assets/img/figure.png`, `assets/img/hero-banner.jpg`
  (CSS), `assets/img/video-poster.jpg` (`mosques-isocs.html:49`),
  `assets/video/sisters-southall.mp4` (`:50-51`),
  `assets/docs/community-litter-pick-guide.pdf` (`:105,107,108`).

---

## 7. Non-JS / orphan hooks (present in HTML, NOT queried by `script.js`)

Grep-confirmed these 3 `data-*` attributes exist in markup but are **not**
referenced anywhere in `script.js` — they are structural/CSS hooks, not flow
hooks, so they are NOT on the flow checklist, but per `/CLAUDE.md` they must not
be renamed without a finding (they may be CSS targets):
- `data-guide-copy` — `mosques-isocs.html:101`.
- `data-leader-card` — `mosques-isocs.html:157`.
- `data-volunteer-leader-card` — `volunteer-month.html:65`.

(The leader cards ARE updated by JS, but via `[data-leader-name]`/`[-detail]` and
`.closest('.volunteer-leader')`, not via these `*-card` hooks — `script.js:9-10,
390,396`.)

---

## 8. Flow-verifier re-walk checklist (run after every change, all viewports
320/375/768/1024/1440, default + interactive states)

**Global (every one of the 9 pages):**
1. [ ] Header nav shows 9 links in the fixed order (§1a); each routes to the
   correct page/anchor; `.is-active` on the current page where applicable.
2. [ ] Footer renders 4 columns; all 14 link-outs resolve (§1b: contact 8 +
   legal 2 + socials 4); legal column
   reaches policies.html + terms.html; 4 socials open new tab w/ `rel=noreferrer`.
3. [ ] F1 mobile nav: hamburger opens/closes `.is-open`, `aria-expanded` tracks,
   nav-link click closes + navigates.
4. [ ] F2 header state correct (index: scroll-triggered; subpages: opaque from load).
5. [ ] F6 PureBot: opens/closes (aria-hidden/expanded track), 3 prompts reply,
   free-text replies after ~180ms, links resolve, no network request fires.
6. [ ] No new console errors/warnings; no new network origin beyond fonts + tally.

**index.html:** 7. [ ] F3 scrollspy highlights Mission/Events/Impact;
8. [ ] F4 counters tick 0→42+/18+/96+ once at `#impact`; 9. [ ] F5 reveals fire
(6 items); 10. [ ] hero CTAs → work-with-us / mosques-isocs; 11. [ ] 3 pickup
`mailto`s carry correct subjects; 12. [ ] `#join` Tally `MeP2jX` embed + Open form.

**mosques-isocs.html:** 13. [ ] "Open the counter" scrolls to `#competition`;
14. [ ] video autoplays muted/looping with controls; 15. [ ] guide buttons open
the PDF; 16. [ ] F7: +/- per team adjusts + clamps at 0, total + leader + is-leading
update, persists across refresh, Reset → "Waiting for scores"; 17. [ ] F5 reveals
fire (41 items); 18. [ ] partner CTAs → Tally `MeP2jX`.

**volunteer-month.html:** 19. [ ] 3 section-arrows jump to the 3 section anchors;
20. [ ] F8: month defaults to current YYYY-MM; submit adds an entry; points =
`20+bags*5+hours*10+bonus`; board sorts points→bags→name; same name+month
aggregates; leader card `is-celebrating`; empty-state toggles; persists; Reset →
"Waiting for entries"; 21. [ ] F5 reveals fire (7 items); 22. [ ] WhatsApp Tally
`3xLRX5` embed + Open form.

**charities / work-with-us / contact:** 23. [ ] Tally `MeP2jX` embed renders +
"Open form" opens new tab; 24. [ ] contact: 3 option cards (mailto / partner Tally
/ Instagram) resolve; 25. [ ] no `[data-reveal]` expected (0 nodes) — only CSS
`pagePanIn`.

**our-team:** 26. [ ] 4 card `mailto?subject=…` links + "Work with us" CTA →
work-with-us.html. **policies / terms:** 27. [ ] static copy renders; reachable via
footer + PureBot; both `localStorage` keys untouched.

**localStorage integrity (both keys, after exercising F7/F8):**
28. [ ] `purestreets-isoc-competition` is `{team:{brothers,sisters}}` ints ≥0.
29. [ ] `purestreets-volunteer-month` is an append-only array of
`{name,month,route,bags,hours,bonus,note}`; points formula unchanged.

---

### Cross-references
Per-page detail: `docs/audit/findings/phase3/<page>/_page-map.md`. Behaviour law:
`docs/audit/rules/coding-rules.md` (J1–J7, A4). Frozen contract + key shapes:
`/CLAUDE.md` BEHAVIOR-PRESERVATION. Open findings that touch these flows are
flow-neutral a11y/contrast/SEO fixes (e.g. `purebot-*-aria-hidden-focus`,
`*-canonical-og`, `reduced-motion-*`) — none may alter a `data-*` hook, key,
shape, anchor, copy string, or the no-build constraint.
