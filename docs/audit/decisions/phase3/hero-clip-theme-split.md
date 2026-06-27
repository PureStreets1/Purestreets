---
id: hero-clip-theme-split
phase: phase3
agent: dedup-consolidator
timestamp: 2026-06-27
chosen: B
---
## Problem
Seven verified findings all describe the hero's focal content (eyebrow + first H1
line) being clipped or hidden at the top. SIX are subpage findings with one root
cause — the `position: fixed` opaque header is taller than the hero's reserved
top padding (`charity-hero-header-overlap`, `hero-h1-eyebrow-clipped-by-fixed-header`,
`header-overlaps-hero-h1`, `h1-eyebrow-clipped-under-fixed-header`,
`fixed-header-occludes-hero`, `hero-h1-clipped-under-fixed-header`). The SEVENTH,
`index/hero-h1-clipped-top`, has a DIFFERENT mechanism: `.hero` is
`min-height: 92vh` + `display: grid` + `align-items: end` + `overflow: hidden`
with `.hero__content` pulled up by `translateY(clamp(-48px,-4vw,-28px))`
(`style.css:123-151`), so on short viewports the fluid H1 overflows the clipped
box top — it is viewport-HEIGHT dependent (768 renders intact, 1440/375 clip),
not a fixed-header-vs-padding collision. Should all 7 be one theme or two?
Scoring: 0–10 per criterion, higher = better (risk/cost: higher = lower).

## Alternatives considered
### Option A — One "hero top clipped" theme (all 7 findings)
Matches the squint-level symptom. But no honest *single unified recommendation*
exists: the subpage fix is "increase hero top padding / cap the logo-driven
header height," the index fix is "rework `.hero` align-items / overflow /
translateY / H1 max-size." A merged rec would be vague and an implementer could
apply the wrong fix to the wrong page (e.g. bump padding on index, which would
not fix an overflow-clip). Alignment 4 · Risk 4 · Cost 8 · Reversibility 7 — 23/40
### Option B — Two themes: subpage-header-overlap (6) + index-hero-clip (1)
Each theme gets a crisp, mechanism-specific unified recommendation. Both touch
`style.css` but disjoint selectors (`.charity-hero`/`.contact-hero`/`.team-hero`/
`.legal-page`/`.volunteer-hero`/`.work-hero` + `.brand` vs `.hero`/`.hero__content`),
so the lone css-implementer can do both without conflict.
Alignment 9 · Risk 8 · Cost 7 · Reversibility 9 — 33/40
### Option C — One theme, two labelled sub-recommendations
Keeps a single theme entry but carries two distinct fixes inside it. Violates the
"single unified recommendation per theme" contract and just re-creates the split
internally with less clarity. Alignment 6 · Risk 6 · Cost 7 · Reversibility 8 — 27/40

## Decision
Chose **B** (33/40). The shared symptom is real but the root causes and the safe
fixes are genuinely different, and an incorrect cross-application is a regression
risk. Two themes (`T3 subpage-fixed-header-overlap`, `T4 index-hero-headline-clip`)
each carry a precise, mechanism-matched recommendation. Both are flagged as
intentional, finding-approved pixel changes per the on-disk `/CLAUDE.md` overhaul
contract.

## How to reverse
If implementation shows the two fixes converge (e.g. a shared `--header-h` token
ends up resolving both), collapse `T4` into `T3` in `_themes.md`; the finding ids
are unaffected.
