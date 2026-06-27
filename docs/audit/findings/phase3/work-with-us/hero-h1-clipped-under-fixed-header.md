---
id: hero-h1-clipped-under-fixed-header
phase: phase3
agent: critic
status: fixed
severity: high
scope: design
evidence:
  - work-with-us.html:16
  - work-with-us.html:40-41
  - style.css:30-32
  - style.css:46-56
  - style.css:61-67
  - style.css:69-73
  - style.css:2557-2562
  - assets/img/logo.png
  - docs/audit/screenshots/work-with-us/1440.png
  - docs/audit/screenshots/work-with-us/375.png
source: internal
---

## Claim
On `work-with-us.html` the hero heading "Bring your skills into community
action." has its top line cut off because the fixed, opaque (`is-scrolled`)
header is taller than the space `.work-hero` reserves above its content. The
header is `position: fixed; padding: 14px ...` (`style.css:46-56`) and subpages
force its opaque `is-scrolled` paper state in the markup
(`work-with-us.html:16`; `style.css:61-67` => `rgba(251,248,239,0.94)` panel
that occludes rather than shows through). `.brand` is
`width: clamp(78px, 8vw, 112px)` (`style.css:69-73`) over a portrait `logo.png`
of intrinsic 343x480 (verified via `sips`), and the global `img { max-width:
100% }` with no height/aspect cap (`style.css:30-32`) renders the logo ~112px
wide x ~157px tall at desktop, so the header band is ~185px tall (157 + 14px*2
padding) > the `padding: 132px ...` that `.work-hero` reserves above its content
(`style.css:2557-2562`, `align-items: center`). The eyebrow "Work with us"
(`work-with-us.html:40`) is fully hidden and the H1 first line is sliced.
Confirmed in `docs/audit/screenshots/work-with-us/1440.png` (first line "Bring
your skills" sliced by the header's bottom edge; only "into community / action."
fully visible) and `375.png` (top of "Bring your" sits flush against / under the
header).

## Why it matters
The page's single most important element — the H1 — is visibly broken at the
most common desktop width and tight on mobile, which reads as an unfinished
layout and undercuts the recruitment message on first paint (design-rules D1,
one clear focal point; D3, the eyebrow -> H1 ladder, the first thing a visitor
should read, with the eyebrow here invisible). It is a content-obscuring layout
bug, not a taste call, and reproduces at multiple capture widths — the kind of
"actual bug" the on-disk `/CLAUDE.md` overhaul contract permits fixing via a
verified finding.

## Recommended action
Increase the `.work-hero` top padding (`style.css:2562`) so it exceeds the
rendered fixed-header height (e.g. anchor it to the same scale used by other
subpage heroes), or add a top safe-area / `scroll-margin` equal to header
height; alternatively cap the logo/header height so the eyebrow and full first
H1 line sit below the header. Re-check at 1440 and 375. Do not change the header
position, the `logo.png` asset, or the copy. NOTE: this is an intentional,
finding-approved pixel change (it reveals currently-hidden content), flag it
explicitly in the PR. The fix touches no JS flow, `data-*` hook, localStorage,
copy, or asset.

## How to verify it's fixed
Load `work-with-us.html` at 1440px and 375px scrolled to top; in DevTools
measure `header.getBoundingClientRect().height` vs the h1's top — the h1's first
glyph row must sit fully below the header and the "Work with us" eyebrow must be
fully visible. Before/after screenshot diff should show the full "Bring your
skills" line restored.

## Vote tally
failedToRefute: 3 / 3

- **Skeptic 1 (failed to refute):** [Read coding-rules.md, design-rules.md,
  anti-slop-checklist.md, CLAUDE.md; skimmed findings/inspiration/.] Confirmed
  against source of truth. screenshots/work-with-us/1440.png unambiguously shows
  the h1 first line "Bring your skills" sliced by the opaque is-scrolled header
  (only lower glyph halves visible; eyebrow fully hidden); "into community" /
  "action." fully visible. style.css:2562 reserves only padding-top:132px on
  .work-hero. Header-height math holds: logo.png verified 343x480; .brand width
  clamp->112px at desktop (style.css:72) x 480/343 = ~157px + 14px top/bottom
  padding (style.css:56) = ~185px fixed header > 132px reserved, so eyebrow + h1
  first line sit under the header. is-scrolled (work-with-us.html:16) is
  94%-opaque paper (style.css:64) so it occludes rather than shows through. Real,
  evidence-backed, safe to fix via larger top padding/scroll-margin
  (overhaul-sanctioned).
- **Skeptic 2 (failed to refute):** Real, objective defect. Screenshot
  docs/audit/screenshots/work-with-us/1440.png shows the H1 first line "Bring
  your skills" sliced and the "Work with us" eyebrow entirely hidden under the
  fixed is-scrolled header. Verified header math: logo.png is 343x480 (confirmed
  via file inspection); at 1440 .brand clamps to 112px (style.css:72) so the logo
  renders ~157px tall, +28px header padding (style.css:56) => ~185px header,
  exceeding .work-hero padding-top:132px (style.css:2562). Header is opaque paper
  at is-scrolled (style.css:61-67) so text underneath is obscured. Fix is CSS
  padding only; touches no JS flow, data-* hook, localStorage key/shape, copy, or
  asset. Under the operative overhaul mandate (CLAUDE.md supersedes the prior
  zero-visual-changes spec) a finding-backed visual fix is permitted.
- **Skeptic 3 (failed to refute):** Confirmed real by both screenshot and CSS.
  docs/audit/screenshots/work-with-us/1440.png shows the H1 first line "Bring
  your skills" sliced by the header's bottom edge with the eyebrow hidden. Math
  checks out: logo.png is 343x480 (verified via sips); at 1440 .brand clamps to
  112px wide (style.css:72) and the img keeps aspect (style.css:30-32) => ~157px
  tall, plus 14px x2 header padding (style.css:56) => ~185px header, which
  exceeds the 132px top padding .work-hero reserves (style.css:2562). The
  is-scrolled header is opaque (style.css:61-67) so it hides rather than reveals
  the text. Not subjective; objective layout defect with a contained padding-only
  fix direction.
