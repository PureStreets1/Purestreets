# Phase 6 — Final adversarial review (Phase 7 confirmation)

**Verdict: CLEAN.** All four Phase 7 fixes are correct and regression-free on the
final state. The two Phase 7 CSS change classes — (1) `--coral-text`
`#bd4631`→`#b8432e` and (2) hero top-padding increases tied to `--header-h` — do
what they intended and introduced **no unintended regression** on any page, at
any viewport, in any interactive state. All verification gates pass.

Scope: BEFORE `docs/audit/screenshots/<page>/` vs AFTER
`docs/audit/screenshots-after/<page>/` at 375 / 768 / 1280 / 1440 plus the
`nav-open`, `purebot`, `competition`, `volunteer` states; cross-read against the
Phase 7 git diff (`c1ae9cf`, `c80f831`), `hero-probe.json`, `flow-test.json`,
`after/capture-summary.json`, before/after `axe/*`, and before/after lighthouse.

---

## 1. Phase 7 diff is bounded and as-described (style.css only)

`git show c1ae9cf c80f831` touch **only `style.css`** (plus markdown
decision/finding docs). The complete set of CSS changes:

- `--coral-text: #bd4631 → #b8432e` (line 11). `--coral` (#e6654f),
  `--green-dark`, and `--header-h` (`clamp(137px, 11.2vw+28px, 185px)`) are
  **unchanged**.
- `.hero` mobile `padding-top: 128px → calc(var(--header-h) + 12px)` (line 643).
- `.contact-hero` desktop top `clamp(…,203px) → calc(var(--header-h) + 40px)`;
  mobile `118px → calc(var(--header-h) + 20px)`.
- `.work-hero` desktop top `clamp(…,203px) → calc(var(--header-h) + 40px)`.
- New `@media (max-width:860px)` block: `.charity-hero, .team-hero,
  .volunteer-hero { padding-top: calc(var(--header-h) + 5px); }`.

Because the change is CSS-only and `--coral`/`--green-dark`/`--header-h` are
untouched, Phase 7 can only affect (a) coral label color and (b) hero top spacing
on the named heroes — nothing else. The hero-padding math matches `hero-probe.json`
exactly (e.g. contact 1440 eyebrowTop=225 = 185+40; charities 375 eyebrowTop=142
= 137+5).

## 2. Coral token (`--coral-text` → #b8432e) — correct, still clearly coral

- All 7 `--coral-text` usages are **light-section** labels (`.eyebrow`,
  `.partner-grid span`, `.contact-options span`, `.volunteer-hero__badge span`,
  `.partnership-list span`, `.work-hero__panel span`, `.team-grid span`).
  Darkening text on a light background can only **raise** contrast — it cannot
  introduce a new contrast failure.
- Pixel-sampled the after screenshots: eyebrows measure **#b8432e (184,67,46)**
  on charities/volunteer/work — a saturated coral-red (R−G=117, R−B=138), **not
  muddy/brown**, and clearly readable on every page checked (index OUR PURPOSE,
  contact CONTACT US/EMAIL/PARTNERSHIPS/SOCIALS, charities/volunteer labels,
  terms/policies PURESTREETS, mosques MOSQUES & ISLAMIC SOCIETIES).
- Phase 7's specific delta is only −5/−3/−3 RGB (imperceptible). The visible
  before→after coral shift (#e6654f→#b8432e) is the **intended cumulative**
  overhaul darkening for AA; Phase 7 is the final tiny step.
- The dark-green-section eyebrows (`.impact-copy .eyebrow`, `.kit-section
  .eyebrow`) correctly **keep `--coral`** (style.css:189-191, T1 decision); their
  contrast is mathematically identical before/after — not touched, not a defect.

## 3. Hero clearance fixes — all correct, no broken layout

| Page | Result |
|------|--------|
| `index` 375 | H1 clearance below header increased ~8px→~24px (row-scan); page shifted +21px cleanly; no break. 768/1280 unchanged. 1440 first line "Clean" fully clear (earlier-phase desktop fix). |
| `contact` 1280/1440 | "CONTACT US" coral eyebrow now visible + "Speak to PureStreets." fully below header (was clipped, eyebrow occluded). Balanced, no awkward gap. |
| `contact` 375/768 | H1 was almost fully hidden @768 / clipped @375 → now renders clear. |
| `work-with-us` 1280/1440 | "WORK WITH US" eyebrow visible + H1 fully clear; "TEAM AREAS" panel word-break ("Environme nt"→"Environment") resolved. |
| `work-with-us` 768/375 | H1 first line was clipped → now clears. |
| `charities`/`our-team`/`volunteer-month` 375/768 | +10px gives the eyebrow/H1 a small positive clearance; full H1 visible; partner cards / POINTS card / illustration intact. |

No overlap, no new clipping/overflow, no misalignment, no awkward excess
whitespace at any viewport. Page-height growth is modest and uniform
(e.g. contact +39–89px, charities mobile +10px) and visually intentional.

## 4. Interactive states — clean

- `index` 375-nav-open: drawer renders all 9 links, identical before/after (F1 ok).
- `index` 1280-purebot: panel/chips/input/Send identical before/after (F6 ok).
- `mosques-isocs` 1280-competition: hero + "Brothers vs Sisters" poster identical;
  only difference is autoplay video frame timing (expected nondeterminism). F7 ok.
- `volunteer-month` 1280-volunteer: POINTS card + leaderboard ("Aisha — 60 points:
  1 clean-ups, 3 bags, 2 hours") render correctly; matches F8 points=60.

## 5. Spot-check (mosques-isocs, terms, policies) — no coral regression

All three render cleanly at 1280 + 375 with the global coral change; mosques page
height byte-identical (6132=6132, layout untouched); terms/policies desktop hero
clearance (eyebrow+H1) is clean (earlier-phase fix, unharmed by Phase 7).

## 6. Verification gates — all pass

- **hero-probe**: 32/32 PASS (all eyebrow/H1 tops below header in the live
  viewport).
- **flow-test**: 12/12 PASS, 0 console errors (F1–F8 incl. PureBot inert,
  reduced-motion counters, competition + volunteer add/reset/shape).
- **console**: 0 errors on all 9 pages (`capture-summary.json`).
- **axe after ≤ before** on every page (charities 2→1, contact 3→2, index 3→2,
  mosques 2→0, our-team 2→0, policies 1→0, terms 1→0, volunteer 2→1, work 2→1).
  No new violation type. The only remaining **site-controlled** color-contrast
  node is `.impact-copy > .eyebrow` — the intended dark-section `--coral`
  exception (unchanged); all other remaining color-contrast/link-name nodes are
  inside the third-party Tally `iframe` (out of scope, pre-existing).
- **lighthouse**: accessibility improved or equal on every page (none regressed),
  best-practices 100 everywhere, seo 100 everywhere, performance within ~3 of
  baseline (worst: policies −2; index +10).

---

## Non-regression caveats (documented, NOT issues)

In the **full-page** screenshots the captured header renders taller/opaque than
the `--header-h` model (~224px vs 137 at mobile; ~240 vs 185 at 1440), so a few
topmost elements still sit under the captured header bar: `index` 375 H1 first
line "Clean streets."; and the eyebrows on `terms`/`policies`/`charities`/
`our-team`/`mosques` at mobile. These are (a) **identical-or-better** than the
BEFORE captures (never a regression), (b) a **capture-vs-live** artifact already
documented in `_summary.md` (live-viewport `hero-probe` measures these as
clearing — 32/32), and (c) outside Phase 7's scope where applicable. They do not
change the CLEAN verdict.
