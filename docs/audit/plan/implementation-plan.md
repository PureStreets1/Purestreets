# Implementation Plan — PureStreets overhaul (Phase 4, planner)

Owner: planner. Input: the 48 verified findings under
`../findings/phase3/*/<id>.md`, consolidated in
[`../findings/phase3/_themes.md`](../findings/phase3/_themes.md) (15 themes T1–T15),
the flow graph [`../findings/flows/site-map.md`](../findings/flows/site-map.md),
and [`structure.md`](structure.md).

**Rules read and obeyed (named per operating rules):**
[`../rules/coding-rules.md`](../rules/coding-rules.md),
[`../rules/design-rules.md`](../rules/design-rules.md),
[`../rules/anti-slop-checklist.md`](../rules/anti-slop-checklist.md),
[`/CLAUDE.md`](../../../CLAUDE.md). Inspiration skimmed
([`../findings/inspiration/`](../findings/inspiration/)); the
Surfers-Against-Sewage note ("a hot coral used **only for action**") corroborates
the T1 coral-as-accent scoping — recolour coral *labels*, keep coral for action.

## Partition model (mandated)
Per [`../decisions/orchestration/implementation-partitioning.md`](../decisions/orchestration/implementation-partitioning.md)
(Option B, file-ownership): **9 page-implementers** (one `.html` each) + **1
css-implementer** (`style.css`) + **1 js-implementer** (`script.js`). No two
workstreams touch the same file ⇒ conflict-free merges. The css pass runs **after**
the page passes so it can account for any markup change; the js pass runs **last**.

Every change below maps to a verified finding. **No invented scope.** All
pixel-moving changes are finding-approved under the on-disk `/CLAUDE.md` overhaul
contract and must be flagged as such in the PR. Behaviour guardrails (frozen by
`/CLAUDE.md` and re-confirmed in the site-map): no change to a `localStorage`
key/shape, a `data-*` hook read by `script.js`, an internal anchor, a Tally form
id, a filename, copy/text (except the two T13 items, which are themselves the
finding and are **gated on content sign-off**), or assets; the site stays no-build.

---

## Planner fork decisions (resolved here)

Three findings/themes presented an explicit fork. Resolutions, with rationale:

- **F-1 · T11 section arrows → REMOVE (path b, HTML).** The 3 `.section-arrow`
  anchors were *never* styled (`grep -i arrow style.css` = 0, `git log -S` = 0) and
  render as invisible ~0×0 empty focusable tab stops
  ([volunteer-month/section-arrow-invisible-zero-size](../findings/phase3/volunteer-month/section-arrow-invisible-zero-size.md)).
  Path (a) "make them visible chevrons" requires inventing a net-new visual element
  (glyph, size, colour, hover, focus ring) that **no finding specifies** —
  forbidden by "do not invent scope" + the anti-slop mandate against decorative
  invented motifs. Path (b) removes the 3 orphan `<a>` nodes: fully specified by the
  finding, pixel-neutral (they are invisible today), and behaviour-safe because the
  section IDs live on the `<section>` elements (lines 55/89/132), not the arrows.
  Owner: **WS-HTML-volunteer-month**.
- **F-2 · T7.2 will-change release → CSS (`:not(.is-visible)`), not JS.** The finding
  ([mosques-isocs/will-change-never-released](../findings/phase3/mosques-isocs/will-change-never-released.md))
  permits "move `will-change` into a transient state only present while animating."
  Scoping it to `[data-reveal]:not(.is-visible)` is a state-only-before-reveal
  selector that drops the hint the instant JS adds `.is-visible` — exactly the
  finding's accepted "clear right after `.is-visible`" point — and keeps it a
  compositor-only, pixel-neutral CSS change. This avoids a second `script.js` edit
  and keeps the perf work coherent in the single css pass. Owner: **WS-CSS**.
  (Alternative — clear on `transitionend` in JS — left unused.)
- **F-3 · T2 PureBot focus → JS `inert`, not CSS visibility.** Per
  [index/purebot-aria-hidden-focus](../findings/phase3/index/purebot-aria-hidden-focus.md)
  the preferred fix is `panel.inert = !isOpen` in `setOpen()` (script.js:249-255),
  initialised to `inert` at `initPureBot()` since the panel ships closed. `inert` is
  native (no-build), has no visual effect, does not block the opacity transition,
  and must be removed before `input.focus()`. Owner: **WS-JS** — no HTML edit, so
  the shared PureBot markup on all 9 pages is fixed by one change.

---

## Workstreams

### WS-CSS — `style.css` (single coherent pass)
Resolves T1, T3, T4, T5(css half), T7.2, T7.3, T8, T9, T10, T15.

| Item | Finding(s) | Change (selectors named are existing) |
|---|---|---|
| Coral label/eyebrow contrast | [index](../findings/phase3/index/eyebrow-coral-contrast-fail.md), [charities](../findings/phase3/charities/coral-label-contrast-below-aa.md), [contact](../findings/phase3/contact/coral-label-contrast-below-aa.md), [mosques](../findings/phase3/mosques-isocs/coral-eyebrow-contrast.md), [our-team](../findings/phase3/our-team/coral-labels-fail-contrast.md), [terms](../findings/phase3/terms/eyebrow-coral-contrast-fail.md), [volunteer](../findings/phase3/volunteer-month/coral-eyebrow-badge-contrast.md), [work](../findings/phase3/work-with-us/coral-small-text-contrast.md) | Add a dedicated darker label token (e.g. `--coral-text`, ≥4.5:1 on `#fbf8ef`/`#ffffff`/`#fffdf7`) and apply it to `.eyebrow` (style.css:154-161) + the six label spans (`.partnership-list span`, `.contact-options span`, `.partner-grid span`, `.team-grid span`, `.volunteer-hero__badge span`, `.work-hero__panel span`). **Do NOT darken the shared `--coral` token** (used for large/decorative accents) and **do not touch** the hero lime eyebrow override (style.css:163-166). |
| Subpage fixed-header overlap | [charities](../findings/phase3/charities/charity-hero-header-overlap.md), [contact](../findings/phase3/contact/hero-h1-eyebrow-clipped-by-fixed-header.md), [our-team](../findings/phase3/our-team/header-overlaps-hero-h1.md), [terms](../findings/phase3/terms/h1-eyebrow-clipped-under-fixed-header.md), [volunteer](../findings/phase3/volunteer-month/fixed-header-occludes-hero.md), [work](../findings/phase3/work-with-us/hero-h1-clipped-under-fixed-header.md) | Make hero top clearance track the real header height. **Recommended (lowest risk): the hero-padding lever** — raise `padding-block-start` on the 6 hero rules (`.charity-hero` :2325, `.contact-hero` :1809/:1902-1904, `.team-hero` :2647, `.legal-page` :1944 [also fixes policies], `.volunteer-hero` :2149, `.work-hero` :2557-2562) to exceed the logo-driven header height, optionally via a shared `--header-h` custom property; add `scroll-padding-top`/`scroll-margin-top` ≈ header height for volunteer-month anchor jumps. The capped-`.brand img` alternative is allowed only if scoped so the ≤768 logo stays pixel-identical (see Risk). |
| Index hero headline clip | [index/hero-h1-clipped-top](../findings/phase3/index/hero-h1-clipped-top.md) | Let content height drive `.hero` at all viewport **heights**: switch `align-items:end`→`start` with adequate top padding and/or reduce the upward `transform:translateY` (style.css:151) and/or cap the H1 max size (style.css:205-206). Disjoint selectors from the subpage fix (per [hero-clip-theme-split](../decisions/phase3/hero-clip-theme-split.md)). |
| Reduced-motion (CSS half) | [index](../findings/phase3/index/reduced-motion-incomplete.md), [charities](../findings/phase3/charities/reduced-motion-incomplete.md), [mosques](../findings/phase3/mosques-isocs/reduced-motion-smooth-scroll.md), [our-team](../findings/phase3/our-team/incomplete-reduced-motion-coverage.md), [terms](../findings/phase3/terms/reduced-motion-coverage-partial.md), [volunteer](../findings/phase3/volunteer-month/reduced-motion-smooth-scroll.md) | **Extend the existing** `@media (prefers-reduced-motion: reduce)` block (style.css:1504-1513) — do not add a second query — with `html{scroll-behavior:auto}` and `transition:none`/`transform:none` for `.purebot-panel`, `.purebot-toggle:hover`, `.button:hover`, `.team-contact:hover`. (The counter half is WS-JS.) |
| will-change never released | [mosques/will-change-never-released](../findings/phase3/mosques-isocs/will-change-never-released.md) | Move `will-change:opacity,transform` off the base `[data-reveal]` rule (style.css:691) onto `[data-reveal]:not(.is-visible)` so the hint drops once `.is-visible` is added. Pixel-neutral (compositor hint only; at rest `opacity:1;transform:none`). |
| Unsized hero images (our-team) | [our-team/hero-images-unsized-cls](../findings/phase3/our-team/hero-images-unsized-cls.md) | Reserve space via CSS only: `.brand img{aspect-ratio:343/480;height:auto}` and `.team-hero img{aspect-ratio:760/701;height:auto}` (or width/height attrs paired with `height:auto`). **Binding constraint:** global `img` has no `height:auto` (style.css:30-33); the box must reproduce the current rendered size exactly (no distortion). |
| Legal reading measure | [terms/legal-copy-measure-too-wide](../findings/phase3/terms/legal-copy-measure-too-wide.md) | Constrain `.legal-copy` (style.css:1957) to ~60–70ch (e.g. `max-width:62ch`); optional paragraph `line-height`≈1.6. Keep `.legal-page h1` width separate (style.css:1949). Repairs policies too. |
| Contact iframe dark bg | [contact/contact-form-iframe-dark-bg-contrast](../findings/phase3/contact/contact-form-iframe-dark-bg-contrast.md) | Give `.tally-embed--contact iframe` a light background to match `.tally-embed--work iframe` (style.css:2621-2624). Do not alter the Tally id/URL/`src`. |
| Work-hero word break | [work/panel-word-breaks-mid-word](../findings/phase3/work-with-us/panel-word-breaks-mid-word.md) | Lower `.work-hero__panel strong` max font-size and/or the `3.7vw` step and replace `overflow-wrap:anywhere` (style.css:2603) with normal wrapping so "Environment" never splits. Keep the Environment/Tech/Design copy. |
| team-contact tap target | [our-team/contact-links-small-tap-target](../findings/phase3/our-team/contact-links-small-tap-target.md) | Raise `.team-contact` effective hit area to ≥44px tall (block padding or `min-height`) without changing the visible pill; must not reflow card `min-height:300px` (style.css:2691). Discretionary (clears 24px AA already). |

**Acceptance criteria (WS-CSS):**
- axe `color-contrast` no longer lists any `.eyebrow` / label-span node; the chosen
  label colour measures ≥4.5:1 on `#fbf8ef`, `#ffffff`, `#fffdf7`; hero lime eyebrow
  and dark-section eyebrows unchanged.
- charities/contact/our-team/terms/volunteer/work at 1280 & 1440: eyebrow text and
  full H1 cap-height render **below** `.site-header`
  (`header.getBoundingClientRect().bottom` ≤ H1 first-line top); the ≤768 and the
  already-intact 768 renderings stay pixel-identical.
- index at 1440×800, 1366×768, 375×667, 375×812: full "Clean streets." line visible
  below the header, no top clip; 768/1280 pixel-diff unchanged.
- With OS reduced-motion on: in-page anchor scroll jumps instantly; `.button` /
  `.team-contact` / PureBot hover/open show no transform animation.
- DevTools Rendering: promoted-layer count drops after each reveal completes;
  mosques perf does not regress.
- our-team: throttled reload shows no hero jump as images decode; logo not
  vertically stretched; CLS ≤0.1; dimensions match before-screenshots at 4 widths.
- terms & policies: longest paragraph wraps ≤75 ch at 1440.
- contact: embedded form fields/labels readable on a light surface; in-iframe
  `color-contrast` nodes clear.
- work-with-us at 1440/1280/1024: "Environment", "Tech", "Design" each on one
  unbroken line; no horizontal overflow at 375/768.
- our-team: `.team-contact` rendered box ≥44px tall at 375; cards' `min-height`
  and spacing unchanged.
- Global: `git diff --stat` = `style.css` only; no new axe violations on any page;
  no new console errors; no new network request/domain.

**Risk & mitigation:** (1) **T3 ↔ T7.3 both can touch `.brand img`.** Mitigate by
using the **hero-padding lever for T3** so T3 leaves `.brand img` untouched and
T7.3 owns the `.brand img`/`.team-hero img` aspect-ratio; if the implementer
instead caps the logo height, it must be media-scoped so the ≤768 logo (78px width
floor) is pixel-identical. Single css pass reconciles both. (2) **T1 token** —
adding a *new* token (not editing `--coral`) prevents regressing coral-on-dark-green
and coral decorative accents; verify the six label selectors are the complete set
(grep). (3) **Reduced-motion** — extend the one existing block; default-motion users
must be pixel/behaviour-identical. (4) Every item is finding-approved pixel change —
flag each in the PR named to its finding.

---

### WS-JS — `script.js` (runs last)
Resolves T2 and the JS half of T5.

| Item | Finding(s) | Change |
|---|---|---|
| PureBot closed-panel focusable | [index](../findings/phase3/index/purebot-aria-hidden-focus.md), [charities](../findings/phase3/charities/purebot-panel-aria-hidden-focus.md), [contact](../findings/phase3/contact/purebot-panel-aria-hidden-focusable.md), [mosques](../findings/phase3/mosques-isocs/purebot-aria-hidden-focusable.md), [our-team](../findings/phase3/our-team/purebot-panel-aria-hidden-focusable.md), [terms](../findings/phase3/terms/purebot-aria-hidden-focus.md), [volunteer](../findings/phase3/volunteer-month/purebot-panel-aria-hidden-focus.md), [work](../findings/phase3/work-with-us/purebot-aria-hidden-focusable.md) | In `setOpen()` (script.js:249-255) set `panel.inert = !isOpen` in lockstep with `aria-hidden`, **before** the `if (isOpen) input.focus()` call; initialise `panel.inert = true` at `initPureBot()` (panel ships closed). Keep `.is-open`/`aria-hidden`/`aria-expanded`/all `data-purebot-*` hooks and the open animation. |
| Counter ignores reduced-motion | [index/reduced-motion-incomplete](../findings/phase3/index/reduced-motion-incomplete.md) | In the `#impact` counter (script.js:51-71), when `matchMedia('(prefers-reduced-motion: reduce)').matches` write the final values immediately (`42+`/`18+`/`96+`) instead of running the `setInterval` tick. Preserve the `data-count` contract and the once-only semantics. |

**Acceptance criteria (WS-JS):**
- With PureBot **closed**, Tab through every page — focus never enters the panel;
  axe `aria-hidden-focus` gone with no new violations.
- Open/close, the 3 quick prompts, both link-outs, free-text submit (~180ms reply),
  and "open lands focus in the input" all still work on all 9 pages; no network call.
- With OS reduced-motion on: `#impact` shows final `42+/18+/96+` immediately without
  ticking; without it, counters still tick `0→target` once and do not re-fire.
- `git diff --stat` = `script.js` only; both `localStorage` keys still readable in
  their documented shape; F1–F8 re-verified per the site-map checklist.

**Risk & mitigation:** `inert` must be cleared *before* `input.focus()` or focus
fails on open — ordering is explicit above. `panel` is the existing closure
reference; no new global. Reduced-motion branch must still satisfy the once-only
counter contract (guard the same observer entry). Runs last so it sees final markup.

---

### WS-HTML-index — `index.html`
| Item | Finding | Change |
|---|---|---|
| Hero LCP preload | [index/hero-lcp-8s](../findings/phase3/index/hero-lcp-8s.md) | Add to `<head>` (before `</head>`, line 13) `<link rel="preload" as="image" href="assets/img/hero-banner.jpg" fetchpriority="high">`. Same-origin reprioritisation of the existing asset — no new domain/request. Keep Tally a lazy iframe. |
| Head metadata | [index/missing-canonical-og](../findings/phase3/index/missing-canonical-og.md) | Add self-referential `<link rel="canonical">`; `og:title/description/image/url/type` + `twitter:card` (reuse existing copy + `assets/img/hero-banner.jpg`); JSON-LD `Organization` (site-wide) **and** `Event` for the visible pickup cards (index.html:101-126). Head-only, render-neutral. |
| PureBot greeting (GATED) | [purebot-greeting-lowercase-i](../findings/phase3/mosques-isocs/purebot-greeting-lowercase-i.md) | "how can i help you?"→"how can I help you?" (this file's copy). **Blocked pending content sign-off.** |

**Acceptance:** OG/canonical validate in a link-preview debugger; Lighthouse SEO
stays 100; **Lighthouse mobile perf on index ≥ 73** (target: LCP materially lower,
≤2.5s) with no new domain/request (same hero URL); zero visual diff at 1440/375; no
new console errors.

**Risk:** preload must point at the *exact* current hero path or it adds a wasted
request — verify the URL matches `style.css:133`. JSON-LD must be inline + minimal
(no external fetch) so perf 73 does not regress. Greeting is gated.

### WS-HTML-charities — `charities.html`
| Item | Finding | Change |
|---|---|---|
| Head metadata | [charities/head-metadata-canonical-og](../findings/phase3/charities/head-metadata-canonical-og.md) | canonical + OG/twitter + JSON-LD `Organization`. Head-only. |
| Iframe title mislabel (GATED) | [charities/iframe-title-mislabel](../findings/phase3/charities/iframe-title-mislabel.md) | `title="PureStreets contact form"`→"PureStreets charity partner form" (charities.html:82). Non-visual. Label change — **content sign-off**. |
| PureBot greeting (GATED) | [purebot-greeting-lowercase-i](../findings/phase3/mosques-isocs/purebot-greeting-lowercase-i.md) | Capitalise "I" (this file). Gated. |

**Acceptance:** head validates, SEO stays 100, zero visual diff; iframe accessible
name reads "charity partner form" in the a11y tree; greeting reads "…how can I help
you?". No new request/domain.

### WS-HTML-contact — `contact.html`
| Item | Finding | Change |
|---|---|---|
| Head metadata | [contact/missing-canonical-and-og-meta](../findings/phase3/contact/missing-canonical-and-og-meta.md) | canonical + OG/twitter + JSON-LD `Organization`. Head-only. |
| PureBot greeting (GATED) | [purebot-greeting-lowercase-i](../findings/phase3/mosques-isocs/purebot-greeting-lowercase-i.md) | Capitalise "I". Gated. |

**Acceptance:** head validates; SEO 100; zero visual diff; greeting corrected.

### WS-HTML-our-team — `our-team.html`
| Item | Finding | Change |
|---|---|---|
| Head metadata | [our-team/head-missing-canonical-og-jsonld](../findings/phase3/our-team/head-missing-canonical-og-jsonld.md) | canonical + OG/twitter + JSON-LD `Organization` with member `Person`s for the visible team cards. Head-only. |
| PureBot greeting (GATED) | [purebot-greeting-lowercase-i](../findings/phase3/mosques-isocs/purebot-greeting-lowercase-i.md) | Capitalise "I". Gated. |

**Acceptance:** head validates; SEO 100; zero visual diff; greeting corrected.
(The unsized-image fix for this page is CSS-only in WS-CSS — **not** here.)

### WS-HTML-terms — `terms.html`
| Item | Finding | Change |
|---|---|---|
| Head metadata | [terms/head-missing-canonical-og-jsonld](../findings/phase3/terms/head-missing-canonical-og-jsonld.md) | canonical + OG/twitter + JSON-LD `Organization`. Head-only. |
| PureBot greeting (GATED) | [purebot-greeting-lowercase-i](../findings/phase3/mosques-isocs/purebot-greeting-lowercase-i.md) | Capitalise "I". Gated. |

**Acceptance:** head validates; SEO 100; zero visual diff; greeting corrected.

### WS-HTML-volunteer-month — `volunteer-month.html`
| Item | Finding | Change |
|---|---|---|
| Head metadata | [volunteer-month/head-meta-canonical-og-missing](../findings/phase3/volunteer-month/head-meta-canonical-og-missing.md) | canonical + OG/twitter + JSON-LD `Organization`. Head-only. |
| Remove orphan section arrows (F-1) | [volunteer-month/section-arrow-invisible-zero-size](../findings/phase3/volunteer-month/section-arrow-invisible-zero-size.md) | Delete the 3 orphan `<a class="section-arrow…">…</a>` nodes (lines 51-53, 85-87, 129-131), including their `data-reveal` items. Section IDs stay on the `<section>` elements. |
| ARIA table rowgroup | [volunteer-month/aria-table-required-children](../findings/phase3/volunteer-month/aria-table-required-children.md) | Add `role="rowgroup"` to `[data-volunteer-rows]` (line 80) so JS-appended `role="row"` articles are owned. Optionally relocate/re-role `.volunteer-empty` (line 79) outside the table region **only if** pixel-neutral (coordinate with WS-CSS); preserve the `data-volunteer-empty` hook. **Do NOT** convert to a native `<table>` (would break the CSS grid). |
| PureBot greeting (GATED) | [purebot-greeting-lowercase-i](../findings/phase3/mosques-isocs/purebot-greeting-lowercase-i.md) | Capitalise "I". Gated. |

**Acceptance:** head validates; SEO 100; no empty Tab stop remains and the 3 section
anchors still resolve by scroll/deep-link; axe `aria-required-children` clean in
**both** empty and **populated** board states; F8 (add/points/aggregate/reset,
points = `20+bags*5+hours*10+bonus`) and the `purestreets-volunteer-month` array
shape unchanged; zero visual diff at 375/1440. **Note for flow-verifier:** removing
the arrows lowers this page's `[data-reveal]` count from **7 → 4** (F5 still fires
on the remaining 4; not a behaviour break).

**Risk:** relocating `.volunteer-empty` out of the `display:grid` `.volunteer-table`
can shift layout — prefer the additive `role="rowgroup"` as the core fix and leave
`.volunteer-empty` in place unless WS-CSS confirms a pixel-neutral move.

### WS-HTML-work-with-us — `work-with-us.html`
| Item | Finding | Change |
|---|---|---|
| Head metadata | [work-with-us/missing-canonical-og-meta](../findings/phase3/work-with-us/missing-canonical-og-meta.md) | canonical + OG/twitter + JSON-LD `Organization`. Head-only. |
| PureBot greeting (GATED) | [purebot-greeting-lowercase-i](../findings/phase3/mosques-isocs/purebot-greeting-lowercase-i.md) | Capitalise "I". Gated. |

**Acceptance:** head validates; SEO 100; zero visual diff; greeting corrected.
(The word-break fix is CSS-only in WS-CSS — **not** here.)

### WS-HTML-mosques-isocs — `mosques-isocs.html`
| Item | Finding | Change |
|---|---|---|
| `aria-label` on role-less divs | [mosques-isocs/div-aria-label-prohibited](../findings/phase3/mosques-isocs/div-aria-label-prohibited.md) | Add `role="img"` to `.poster-scenes` (line 76) so its `aria-label` is valid; remove the redundant `aria-label` on `.campaign-hero__video` (line 48), or give it `role="group"`. Non-visual. |
| PureBot greeting (GATED) | [purebot-greeting-lowercase-i](../findings/phase3/mosques-isocs/purebot-greeting-lowercase-i.md) | Capitalise "I" (canonical source of this finding). Gated. |

**Acceptance:** axe `aria-prohibited-attr` = 0; SR reads the poster as one labelled
image and the video region no longer announces a dropped label; zero visual diff.
**No head-metadata change** — mosques raised no T6 finding ([_themes.md](../findings/phase3/_themes.md) T6 note).

### WS-HTML-policies — `policies.html`
| Item | Finding | Change |
|---|---|---|
| PureBot greeting (GATED) | [purebot-greeting-lowercase-i](../findings/phase3/mosques-isocs/purebot-greeting-lowercase-i.md) | Capitalise "I" only. Gated. |

**Acceptance:** greeting reads "…how can I help you?"; zero visual diff; nothing
else changes. **No head-metadata change** (policies raised no T6 finding). **If the
greeting sign-off is withheld this workstream is a no-op** — the greeting must be
applied to all 9 pages or none, for consistency (T13).

---

## Apply order (dependencyOrder)
Page HTML first (disjoint files, parallel-safe), then the single CSS pass (so it can
account for the volunteer-month markup change), then JS last:

1. WS-HTML-index → 2. WS-HTML-charities → 3. WS-HTML-contact →
4. WS-HTML-our-team → 5. WS-HTML-terms → 6. WS-HTML-volunteer-month →
7. WS-HTML-work-with-us → 8. WS-HTML-mosques-isocs → 9. WS-HTML-policies →
**10. WS-CSS** → **11. WS-JS**.

(The 9 HTML workstreams are mutually independent; the listed order is nominal.)

## Cross-cutting gates (every workstream + reviewer)
- **No perf regression:** index Lighthouse mobile perf stays **≥73** (T7.1 should
  *improve* LCP); no new network request or external origin beyond
  `fonts.googleapis.com` / `fonts.gstatic.com` / `tally.so`.
- **No a11y regression:** axe shows **no new** violations on any page; the targeted
  ones (coral contrast, `aria-hidden-focus`, `aria-prohibited-attr`,
  `aria-required-children`, empty tab stops) are *removed*.
- **Behaviour preserved:** all 8 flows (F1–F8) and both `localStorage` keys/shapes
  re-verified per [`../findings/flows/site-map.md`](../findings/flows/site-map.md) §8;
  no `data-*` hook, anchor, Tally id, filename, or asset changed.
- **Content gating (T13):** the greeting (×9) and the charities iframe `title` are
  copy/label changes — **do not ship without content sign-off**; apply the greeting
  to all 9 or none.
- **No-build preserved:** no framework/bundler/dep; single `style.css` + single
  `script.js`; `@layer`/module splits remain out of scope
  ([architecture-modernization-scope](../decisions/phase0/architecture-modernization-scope.md)).
- **Verify per `/CLAUDE.md`:** before/after capture 4 viewports × 9 pages; every
  pixel change must be the intended one named in a finding; `git diff --stat` shows
  only the owned file.

## Coverage map (48 findings → workstream)
| Theme | Findings | Workstream(s) |
|---|---|---|
| T1 coral contrast | 8 | WS-CSS |
| T2 PureBot focus | 8 | WS-JS |
| T3 subpage header overlap | 6 | WS-CSS |
| T4 index hero clip | 1 | WS-CSS |
| T5 reduced-motion | 6 | WS-CSS (all 6) + WS-JS (index counter) |
| T6 canonical/OG/JSON-LD | 7 | WS-HTML-{index,charities,contact,our-team,terms,volunteer-month,work-with-us} |
| T7 perf hygiene | 3 | WS-HTML-index (preload) + WS-CSS (will-change, our-team img) |
| T8 legal measure | 1 | WS-CSS |
| T9 contact iframe bg | 1 | WS-CSS |
| T10 work-hero word break | 1 | WS-CSS |
| T11 section arrows | 1 | WS-HTML-volunteer-month (remove) |
| T12 div aria-label | 1 | WS-HTML-mosques-isocs |
| T13 copy/label (GATED) | 2 | WS-HTML-* greeting (×9) + WS-HTML-charities iframe title |
| T14 aria table rowgroup | 1 | WS-HTML-volunteer-month |
| T15 team-contact tap target | 1 | WS-CSS |
| **Total** | **48** | 11 workstreams (9 HTML + CSS + JS) |
