---
id: index-hero-clip-mechanism
phase: phase5
agent: css-implementer
timestamp: 2026-06-27
chosen: A
---

## Problem
T4: the index `.hero` clips the headline at short viewport heights / wide widths,
but the acceptance requires the 768 and 1280 renderings stay **pixel-identical**
while 1440x800, 1366x768, 375x667 and 375x812 are fixed. Analysis of the mechanism
shows two distinct failure modes, not one:

- **Mobile (375x*)**: content is taller than `min-height: 96vh`, and `align-items:
  end` (style.css:128) + `overflow: hidden` push the overflow off the **top**
  (clipped). True overflow.
- **Wide desktop (1366x768, 1440x800)**: content actually *fits* 92vh, but
  `.hero__content { transform: translateY(clamp(-48px,-4vw,-28px)) }` (style.css:151)
  pulls the bottom-anchored content up *under the growing fixed logo* (logo height =
  8vw*1.4, up to ~171px at 1440). A width x height collision, not overflow.

The two "preserve" captures (768, 1280) and the clipping 1440 capture are all
full-page shots taken at the same short viewport height (~800; 1440.png is 1440x4677,
1280.png 1280x4478), so the only discriminator between intact-1280 and clipped-1440
is **width**. Any global change to `translateY` or `align-items` moves the
bottom-anchored content at 1280 too, breaking the preserve target.

Scoring 0-10/criterion, higher = better (regression/cost: higher = safer/cheaper).

## Alternatives considered
### Option A — `align-items: safe end` + width-scoped `translateY` ramp (`@media (min-width: 1281px)`)
`safe end` behaves as `end` when content fits (so 768/1280 are byte-identical) and
falls back to `start` only on overflow (fixes the 375 mobile clip, anchoring at the
existing 128px mobile padding which clears the 78px-floor logo). A `min-width: 1281px`
media query ramps `.hero__content` translateY from -48px (at 1280, continuous with
the base) to 0 by 1440, dropping the wide-desktop content out from under the logo —
and is a strict no-op at <=1280. Both levers are no-ops on the preserve targets *by
construction*. Disjoint from T3 (only `.hero` / `.hero__content`).
Alignment 9 · Regression 8 · Cost 7 · Reversibility 9 = **33/40**

### Option B — `align-items: start` + large top padding (subpage-style)
Top-anchors content with header-clearing padding. But when content fits (768/1280),
start vs end moves the block from the bottom of 92vh to the top — a large visible
shift that breaks the "768/1280 pixel-identical" guarantee.
Alignment 5 · Regression 3 · Cost 6 · Reversibility 8 = **22/40**

### Option C — global `translateY` reduction + cap H1 max-size
Reducing the upward pull globally shifts 1280's bottom-anchored content downward
(1280 is at translateY -48); capping H1 only helps the very widest viewports and not
1366x768. Breaks the preserve target and under-fixes.
Alignment 5 · Regression 3 · Cost 6 · Reversibility 8 = **22/40**

## Decision
Chose **A** (33/40). `.hero { align-items: safe end }` (was `end`) plus
`@media (min-width: 1281px) { .hero__content { transform: translateY(clamp(-48px,
calc(-48px + (100vw - 1280px) * 0.3), 0px)) } }`. `safe end` is a no-op whenever the
hero content fits (every preserve viewport), and the ramp is a no-op at and below
1280px, so default renderings at 768/1280 are untouched; the four short/mobile cases
gain top clearance. Browser support for `safe` alignment is evergreen (Chrome 93+,
Firefox 63+, Safari 15.4+), no-build-safe.

## How to reverse
Restore `.hero { align-items: end }` and delete the `@media (min-width: 1281px)`
`.hero__content` rule. No JS/hook/asset/storage touched.
