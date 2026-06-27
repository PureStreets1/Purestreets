# Phase 6 — Adversarial review summary

Roll-up of the per-page reviewer verdicts (`docs/audit/findings/review/*.md`) over
the overhaul changes. Each page was checked BEFORE vs AFTER at 375 / 768 / 1280 /
1440 plus the `375-nav-open` and `1280-purebot` interactive states, cross-read
against `git diff main`, axe before/after, `console-after`, lighthouse
before/after, and `flow-test.json`. Pixel work was quantified (max-channel diff,
threshold 16; offset-minimisation; magnitude histograms) to separate real change
from inter-run render noise.

## Per-page result table

| Page | Confirmed-fixed | Confirmed issues (→ fix loop) | Low/uncertain (not in fix loop) |
|------|:---------------:|:-----------------------------:|---------------------------------|
| `index.html` | 4 | 2 | 1 — ≤7px logo/fixed-header jitter (full-page-capture artifact; recommend fixed-viewport 375 reshoot) |
| `charities.html` | 6 | 0 | — |
| `contact.html` | 4 | 1 | 1 — ~2px header jitter @768 only (backdrop-filter/capture nondeterminism) |
| `mosques-isocs.html` | 7 | 0 | — |
| `our-team.html` | 7 | 0 | — |
| `policies.html` | 9 | 0 | — |
| `terms.html` | 6 | 0 | — |
| `volunteer-month.html` | 7 | 0 | — |
| `work-with-us.html` | 4 | 1 | — |
| **Total** | **54** | **4** | **2** |

Notes:
- **Confirmed-fixed (54)** is a per-page tally; the shared/global findings (head
  metadata, PureBot `inert`, reduced-motion, the `--coral-text` token, the
  `.brand img` aspect-ratio) are counted on every page they render on, so this is
  not 54 distinct findings.
- **Confirmed issues (4)** are the only items that drive the Phase 7 fix loop.
- The 2 **low/uncertain** items were investigated and dismissed as capture-harness
  nondeterminism (DOM rects byte-identical, logo raster identical, aspect-ratio
  mathematically size-neutral on the exact 343×480 logo); they are NOT confirmed
  regressions and are listed only so the reshoot recommendation isn't lost.

### Per-page one-liners (pages with issues)

- **`index.html`** — 4/6 fixed findings confirmed (hero-lcp preload perf 73→83,
  head metadata, PureBot `inert`, reduced-motion CSS+JS guard). 2 INSUFFICIENT
  (pickups eyebrow still <AA; mobile-375 hero H1 still clipped). Intended changes
  (coral recolor, `#join` iframe white bg, 1440 hero move) verified correct.
- **`contact.html`** — 4/5 fixed (coral contrast, PureBot `inert`, iframe
  dark→white, head metadata). 1 INSUFFICIENT (desktop H1 fixed, but eyebrow still
  occluded @1280/1440 and H1 still clipped @375/768).
- **`work-with-us.html`** — 4/5 fixed (panel "TEAM AREAS" coral recolor, panel
  word-break, PureBot `inert`, head metadata). 1 INSUFFICIENT, low (sliced H1
  resolved; muted `#607068` eyebrow still occluded @1440 — was hidden before too,
  not a regression).
- **All other 6 pages** — every fixed finding confirmed, zero unintended
  regressions across all 4 viewports + both interactive states.

## Confirmed issues (drive the fix loop)

These 4 are `insufficient` verdicts on findings marked `fixed` — the visible/high
parts are resolved but a stated acceptance criterion is unmet. No new regressions,
no new axe violation types, and no new console errors were confirmed on any page.

### 1. `index.html:pickups-eyebrow-still-below-aa` — med
- **Finding:** `eyebrow-coral-contrast-fail` · **Viewport:** all (contrast is
  viewport-independent)
- **What's wrong:** the `#pickups` eyebrow sits on the warmer `.section--schedule`
  background `#f4efe1` (style.css:432), where the new `--coral-text` `#bd4631`
  computes **4.476:1 — below the 4.5 AA floor**. `docs/audit/runs/after/axe/index.json`
  still lists `color-contrast` target `#pickups > .section__heading > .eyebrow`.
- **Why partial:** the token was validated against `#fbf8ef`/`#ffffff`/`#fffdf7`
  (mission 4.84 PASS, join 5.06 PASS) but not the `#f4efe1` schedule bg, where it
  lands 0.024 under threshold. Visually imperceptible, but a real unmet AA node.
- **Suggested fix:** darken `--coral-text` ~1 step (e.g. `#b8432e`) so it also
  clears 4.5:1 on `#f4efe1`. (The dark-section eyebrow remaining at 3.71 is the
  intended "dark-section eyebrows unchanged" decision, not a defect.)

### 2. `index.html:mobile-hero-h1-still-clipped` — med
- **Finding:** `hero-h1-clipped-top` · **Viewport:** 375 (1440 fixed; 768/1280
  preserved)
- **What's wrong:** the 375 hero body is **0 changed px** before/after — `Clean
  streets.` is still hidden under the fixed header and `Shared reward.` is the
  first visible line. The `translateY` easing only applies >1280px (mobile override
  style.css:639-646 keeps `translateY(0)`; `align-items:safe end` is a no-op when
  content fits).
- **Why partial:** 1440 IS fixed (full `Clean streets.` now below the header), but
  the plan's acceptance explicitly required 375 (375×667 / 375×812) to show the
  full headline. Mobile is the most common viewport class.
- **Suggested fix:** extend the hero clearance/translate to the mobile breakpoint
  (or add hero top padding at ≤375) so the first line clears the fixed header.

### 3. `contact.html:eyebrow-occluded-and-mobile-h1-clipped` — med
- **Finding:** `hero-h1-eyebrow-clipped-by-fixed-header` · **Viewport:** 1280, 1440
  (eyebrow); 375, 768 (H1)
- **What's wrong:** desktop H1 decapitation is genuinely fixed (`Speak to` cap-top
  y=264, 24px below the y=240 header @1440). But there are **zero eyebrow-coral
  pixels** in the hero text column @1440 — the `Contact us` eyebrow is still
  occluded at 1280 and 1440. Mobile 375/768 padding-top override (118px,
  style.css:1948) was left unchanged, so the H1 is still clipped there.
- **Root cause:** the header-height model — `--header-h` `clamp(137px,11.2vw+28,185px)`
  (style.css:15) and `.contact-hero` padding-top `clamp(136,11.2vw+46,203)`
  (style.css:1854) — models the header as ~185px, but the rendered header is
  ~240px @1440. `.contact-hero` is `align-items:center` with no `min-height`, so
  the eyebrow lands at the header edge under the opaque blurred bar.
- **Why partial:** the plan's acceptance ("eyebrow text AND full H1 cap-height
  render below `.site-header` at 1280 & 1440") fails for the eyebrow. (375/768 H1
  clip is pre-existing and was scoped out by the plan — not a regression.)
- **Suggested fix:** correct the header-height model up to the real ~240px (raise
  the `--header-h` / padding-top cap, or give `.contact-hero` a `min-height`) so
  the eyebrow clears the header.

### 4. `work-with-us.html:hero-eyebrow-still-occluded-under-fixed-header` — low
- **Finding:** `hero-h1-clipped-under-fixed-header` · **Viewport:** 1440, 1280
- **What's wrong:** the dominant high-severity defect (sliced H1 first line) is
  fixed — `Bring your skills` renders fully below the header (cap-top y~272 vs
  header bottom y~238 @1440). But the `Work with us` eyebrow is fully occluded
  @1440, mostly clipped @1280 (one muted row at y211), and only fully visible in
  the `1280-purebot` capture — i.e. visibility is capture/render-dependent at the
  finding's primary 1440 width. Eyebrow renders `--muted` `#607068` (specificity
  win of `.work-hero p` / `.work-form-section p` over `.eyebrow`).
- **Why low:** NOT a regression — the eyebrow was hidden before the fix as well,
  and it is a muted, low-emphasis label. The finding's second acceptance ("eyebrow
  must be fully visible") is the only unmet part.
- **Suggested fix:** a few more px of hero top clearance (or cap the logo/header
  height) so the eyebrow clears the taller-than-203px rendered header at 1440.

## Flow-verifier verdict — `allPass: false`

`flow-test.json` reports **10/10 checks PASS, 0 FAIL** — every check that actually
ran passed. **BUT** the deterministic harness
(`docs/audit/runs/tooling/flow-test.mjs`) only exercises **6 of the 8** frozen
flows, so all-8 cannot be confirmed → `allPass=false`. This is a **test-coverage
gap, not a detected regression**: the diff sanity check (`git diff main -- script.js`)
is clean — only (a) a `prefers-reduced-motion` branch added to `counterObserver`
reading `counter.dataset.count`, and (b) PureBot setting `panel.inert=true` at init
plus `panel.inert=!isOpen` in `setOpen()`. No `data-*` hook renamed, no
localStorage key changed (`purestreets-isoc-competition`,
`purestreets-volunteer-month` both intact), no anchor/href/id changed; the
`setHeaderState` and `sectionObserver` code paths are untouched by the diff.

| Flow | Pass | Note |
|------|:----:|------|
| F1 mobile nav (toggle + close on link) | ✅ | `open=true aria-expanded=true closedOnLink=true` (index @375); `data-nav`/`data-nav-toggle` intact |
| F2 header scroll state (`is-scrolled`) | ⚠️ | **NOT COVERED** — harness defines no F2; `setHeaderState` (script.js L14-17, invoked L470-471) untouched. Coverage gap, not a regression |
| F3 scrollspy (nav `.is-active`) | ⚠️ | **NOT COVERED** — harness defines no F3; `sectionObserver` (script.js L37-49) untouched. Coverage gap, not a regression |
| F4 counters incl. reduced-motion | ✅ | `counts=["42+","18+","96+"]`; reduced-motion shows final within 250ms |
| F5 reveals (reveal-on-scroll) | ✅ | `someVisible=true`; `data-reveal` intact |
| F6 PureBot inert + open + reply + close | ✅ | `closedInert=true open=true focus=true msgs=3 reClosedInert=true errs=0` (index, policies, work-with-us) |
| F7 ISOC competition counter / shape / reset | ✅ | store `{"brothers":2,"sisters":0}` total=2 `clearedAfterReset=true`; key unchanged |
| F8 volunteer add / points / shape / reset | ✅ | `points=60`=expected `(20 + bags*5 + hours*10 + bonus)`; `shapeOk=true`; anchors 3/3. Caveat: volunteer RESET sub-path not asserted |

**Sub-gaps within passing flows:** volunteer RESET (part of F8's spec) is not
asserted (only F7 verifies a reset).

**Recommendation:** extend `flow-test.mjs` with an F2 check (header gains
`.is-scrolled` when `scrollY>18` or `.subpage`), an F3 check (correct nav link
gains `.is-active` on section enter), and a volunteer-reset assertion, then re-run
for a true 8/8 confirmation.

Relevant files: `docs/audit/runs/flow-test.json`,
`docs/audit/runs/tooling/flow-test.mjs`, `script.js`.

## Bottom line

54 per-page fixed findings confirmed across 9 pages. **4 confirmed issues** feed
the fix loop — 3 medium (`index` pickups-eyebrow AA, `index` mobile-375 hero clip,
`contact` eyebrow occlusion + mobile H1) and 1 low (`work-with-us` eyebrow
occlusion). No confirmed new regressions, no new axe violation types, no new
console errors on any page. Flow harness is green on every check it runs (10/10)
but covers 6/8 frozen flows → close the F2/F3/volunteer-reset coverage gap and
re-run for an 8/8 sign-off.
