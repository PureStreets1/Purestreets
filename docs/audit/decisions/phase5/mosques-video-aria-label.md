---
id: mosques-video-aria-label
phase: phase5
agent: WS-HTML-mosques-isocs
timestamp: 2026-06-27
chosen: A
---
## Problem
Finding `div-aria-label-prohibited` flags two role-less `<div>`s carrying
`aria-label` (`aria-prohibited-attr`, serious). `.poster-scenes` (line 76) is a
self-contained CSS illustration → the finding *mandates* `role="img"` (no fork —
applied as specified). `.campaign-hero__video` (line 48) wraps a real `<video>`
and the finding offers an explicit either/or: **remove** the redundant wrapper
`aria-label`, **or** give the wrapper `role="group"`. This decision resolves only
that fork. Scoring: 0–10 per criterion, higher = better.

## Alternatives considered
### Option A — Remove the redundant `aria-label` from `.campaign-hero__video`
The `<video>` it wraps is already an accessible, named-by-context media element;
the wrapper label "PureStreets Sisters Southall video" is redundant and currently
dropped by AT. Removing the one attribute clears the violation with the smallest
possible change and adds no new SR announcement. Class/attr unreferenced by
script.js (grep empty) and untouched in CSS → render-neutral, behavior-safe.
- Alignment 9 · Regression risk 10 (one attribute removed, nothing added) · Cost 10 · Reversibility 10 — 39/40
### Option B — Add `role="group"` to keep the `aria-label` valid
Validates the label, but turns a single-video wrapper into an announced "group"
region — extra SR verbosity around one already-labelled control, with no real
grouping semantics to justify it.
- Alignment 6 · Risk 8 · Cost 9 · Reversibility 10 — 33/40
### Option C — Add `role="figure"`/`role="img"` to the wrapper
Wrong semantics: the wrapper contains an interactive `<video>`, not a static
figure/image; `role="img"` would mask the media controls' semantics.
- Alignment 2 · Risk 6 · Cost 9 · Reversibility 10 — 27/40

## Decision
Chose **A** (39/40). Removal is the SMALLEST change that satisfies the acceptance
("the video region no longer announces a dropped label"), matches the finding's
first-listed recommendation, and avoids adding gratuitous group verbosity. The
`role="img"` on `.poster-scenes` is applied as mandated (keeps its existing
`aria-label`, collapsing the decorative child spans to one labelled image).

## How to reverse
Re-add `aria-label="PureStreets Sisters Southall video"` to the
`.campaign-hero__video` div, and remove `role="img"` from `.poster-scenes`.
