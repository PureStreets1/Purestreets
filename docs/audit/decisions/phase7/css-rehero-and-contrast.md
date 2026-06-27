---
id: css-rehero-and-contrast
phase: phase7
agent: css-fix-implementer
timestamp: 2026-06-27
chosen: A
---

## Problem
Phase 6 confirmed 4 INSUFFICIENT fixes, all in `style.css`, all under-tuned
versions of already-landed fixes:

1. **T1 contrast** — `--coral-text: #bd4631` clears 4.5:1 on `#fbf8ef` (4.84),
   `#ffffff` (5.14) and `#fffdf7` (5.06) but only **4.476** on the warmer
   `.section--schedule` background `#f4efe1` (style.css:432). axe still lists
   `#pickups > .section__heading > .eyebrow` under `color-contrast`.
2. **T4** — the index hero H1 first line ("Clean streets.") is reported clipped
   under the fixed header at mobile 375; the Phase 5 fix only eased the upward
   `translateY` above 1280px, so the `<=860` mobile override was untouched.
3. **T3 contact** — the "Contact us" eyebrow (topmost element, sits ~30-60px
   ABOVE the H1) is still occluded by the fixed header at 1280/1440, and the H1
   is reported clipped at mobile 375/768. Phase 5 cleared the H1 but not the
   eyebrow.
4. **T3 work** — the "Work with us" eyebrow is still occluded/clipped under the
   fixed header at desktop widths.

Root geometry (measured from the fixed-viewport reshoots
`scratchpad/real_contact1440.png`, `real_wwu1440.png`, `vp_idx375.png`,
deviceScaleFactor=1, scroll-top — NOT the full-page captures the Phase 6 reviewer
used, which mis-composite `position:fixed` headers):

- The fixed header is tall because `logo.png` is **343x480 (portrait)**; at the
  capped `.brand` width 112px the logo renders 156.7px tall, so the header BOX is
  ~184.7px at >=1400px (measured solid-paper bottom = **184**). The existing
  `--header-h: clamp(137px, calc(11.2vw + 28px), 185px)` (style.css:15) already
  models this box accurately.
- The opaque (`is-scrolled`) subpage header also paints a `box-shadow: 0 10px
  30px` that reaches ~40px BELOW the box.
- Current hero clearance `clamp(132/136px, calc(11.2vw + 46px), 203px)` is only
  `header-box + 18px`, so the eyebrow lands inside the shadow band (measured
  eyebrow-top gap above the box = 29-33px at 1440 — clears the box but sits in
  the shadow), which reads as "occluded" and is borderline for a clearance probe.
- Index mobile: the header is **transparent** at scroll-top, so the H1 is
  actually fully visible (measured H1 top = **176** vs header box ~137); only the
  topmost lime overlap ("COMMUNITY ACTION GROUP") sits right at the header edge
  (~137). The reported clip is largely a full-page-capture artifact, but the
  topmost element is geometrically borderline.

The consequential choice is **which lever raises the hero top clearance** so the
TOPMOST element (the eyebrow) clears the header at every width without capping
the logo and without regressing the heroes already confirmed fixed (charities,
our-team, terms, volunteer-month). Scoring 0-10 per criterion (regression-risk
and cost: higher = safer / cheaper = better).

## Alternatives considered

### Option A — Tie the 3 named heroes' `padding-block-start` to `var(--header-h)` + a context gap
`calc(var(--header-h) + 40px)` on `.contact-hero` and `.work-hero` (clears the
header BOX **and** its 40px drop-shadow on the opaque desktop header);
`calc(var(--header-h) + 20px)` on the `.contact-hero` `<=860` override; and
`calc(var(--header-h) + 12px)` on the index `.hero` `<=860` override (transparent
header → only geometric box clearance needed, minimal shift). `--header-h`
already reflects the real header box, so this is a single-source-of-truth
(coding-rules C1) clearance that scales with the logo-driven header at every
width. Only the 3 named hero rules change; `--header-h` itself is NOT edited, so
`scroll-padding-top` and the other heroes are untouched.
Alignment 9 · Regression-risk 8 · Cost 8 · Reversibility 9 — **34/40**

### Option B — Per-hero hard-coded clamp bumps
Re-derive `clamp(min, 11.2vw + k, max)` triplets for each named hero (e.g.
`clamp(175px, calc(11.2vw + 66px), 223px)`). Works, but duplicates the header
math into each rule instead of referencing the token (violates C1 / DRY), and is
more error-prone to keep in sync if the header ever changes.
Alignment 7 · Regression-risk 8 · Cost 7 · Reversibility 9 — **31/40**

### Option C — Cap the logo height (`.brand img { max-height }`) to shrink the header
Shrinks the header on ALL 9 pages so the existing padding suffices. Explicitly
forbidden by the task ("Do NOT cap the logo height — risks a logo visual
change"), touches the shared header/logo globally (high regression risk; could
alter the `<=768` logo), and contradicts the T7.3 CLS reservation.
Alignment 2 · Regression-risk 3 · Cost 6 · Reversibility 8 — **19/40**

## Decision
Chose **A (34/40)**. Tie the contact/work/index hero top clearance to the
existing `--header-h` token plus a context-appropriate gap:

- `.contact-hero` (base) and `.work-hero` (base): `padding-block-start =
  calc(var(--header-h) + 40px)` — clears the opaque header box **and** its
  `0 10px 30px` drop-shadow so the eyebrow (topmost element) is fully clear at
  1280/1440. (+~22px vs the old 203px cap at 1440.)
- `.contact-hero` `<=860` override `padding-top`: `calc(var(--header-h) + 20px)`
  (was `118px`) — clears the mobile header box; the H1 sits ~30px lower, fully
  clear at 375/768.
- index `.hero` `<=860` override `padding-top`: `calc(var(--header-h) + 12px)`
  (was `128px`) — the index header is transparent so only the geometric box
  clearance for the borderline topmost lime overlap is needed; minimal shift.

The differing gaps (40 desktop / 20 + 12 mobile) are deliberate: the opaque
subpage desktop header has a visible drop-shadow to clear, whereas mobile screens
are short and the index header is transparent, so a smaller clearance both
satisfies the clearance requirement and avoids wasting vertical space. Darkening
is contrast-safe everywhere because reducing the text luminance can only raise
contrast on a light background, so no other label/eyebrow surface regresses.

For **T1 contrast**: change `--coral-text` `#bd4631 -> #b8432e` (the ~1-step
darker option the task suggested). Exact WCAG ratios (computed in
`scratchpad/contrast.py`): `#fbf8ef` 5.096, `#ffffff` 5.412, `#fffdf7` 5.320,
`#f4efe1` **4.711** — clears 4.5:1 on all four eyebrow backgrounds (worst case
`#f4efe1`) with a small, safe margin while staying a recognizable coral
(184,67,46), not brown. The global `--coral` token, the hero lime eyebrow
override, and the dark-section eyebrow (`.impact-copy`/`.kit-section` →
`--coral`) are untouched.

Scope: edits ONLY `style.css`, ONLY the `--coral-text` token + the
index/contact/work hero rules. Heroes already confirmed fixed (charity-hero,
team-hero, legal-page, volunteer-hero) and `--header-h` itself are NOT touched.
No `data-*` hook, class name, localStorage key, anchor, or asset changes;
no-build preserved.

## How to reverse
- Token: set `--coral-text` back to `#bd4631` (style.css:11).
- Heroes: restore `.contact-hero` base padding top to
  `clamp(136px, calc(11.2vw + 46px), 203px)`, the `.contact-hero` `<=860`
  `padding-top` to `118px`, `.work-hero` base padding top to
  `clamp(132px, calc(11.2vw + 46px), 203px)`, and the index `.hero` `<=860`
  `padding-top` to `128px`.
- If the deterministic clearance probe still fails, fall back to Option B
  (per-hero clamp triplets) or escalate to a full Workflow D re-review per
  `phase7/scoped-reverification.md`.
