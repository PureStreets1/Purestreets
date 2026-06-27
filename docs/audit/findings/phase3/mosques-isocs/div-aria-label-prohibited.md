---
id: div-aria-label-prohibited
phase: phase3
agent: critic
status: verified
severity: med
scope: a11y
evidence:
  - docs/audit/runs/before/axe/mosques-isocs.json:16-29
  - mosques-isocs.html:48
  - mosques-isocs.html:76
source: internal
---

## Claim
Two generic `<div>`s carry `aria-label` without a role that permits a name, so
the labels are dropped by assistive technology. axe flags `aria-prohibited-attr`
(serious, 2 nodes).

- `docs/audit/runs/before/axe/mosques-isocs.json:16-29` — `aria-prohibited-attr`,
  impact `serious`, 2 nodes, targets `.campaign-hero__video` and `.poster-scenes`.
- `mosques-isocs.html:48` — `<div class="campaign-hero__video" ...
  aria-label="PureStreets Sisters Southall video">` (role-less div wrapping a
  real `<video>`).
- `mosques-isocs.html:76` — `<div class="poster-scenes" ...
  aria-label="Brothers and sisters litter pick illustration">` (role-less div
  holding decorative CSS scene spans).

## Why it matters
A name on an element with no (implicit) role is invalid ARIA per ARIA-in-HTML:
screen readers ignore it, so the intended labels for the video region and the CSS
illustration are silently lost, and the markup fails ARIA-conformance checks.
Neither class nor label is referenced by `script.js` (grep empty), so neither is
a behavior hook — editing the ARIA is behavior-safe and has no visual effect.

## Recommended action
`poster-scenes` is a self-contained CSS illustration → add `role="img"` so the
existing `aria-label` becomes valid and its decorative child spans collapse to
one labelled image. `campaign-hero__video` wraps a real `<video>` that is already
an accessible element → remove the redundant wrapper `aria-label` (or give it
`role="group"`). Both edits are non-visual and touch no copy/localStorage/asset.

## How to verify it's fixed
Re-run axe — `aria-prohibited-attr` = 0. In a screen reader, confirm the poster
reads as a single labelled image and the video region no longer announces a
duplicate/ignored label. Visual diff at 1440/375 = 0 pixels.

## Vote tally
failedToRefute: 3 / 3

- **Skeptic 1 (not refuted):** Verified. axe JSON (mosques-isocs.json:16-28)
  lists `aria-prohibited-attr`, serious, exactly 2 nodes: `.campaign-hero__video`
  and `.poster-scenes`. HTML:48 is `<div class="campaign-hero__video" ...
  aria-label=...>` and HTML:76 is `<div class="poster-scenes" ... aria-label=...>`,
  both role-less generic divs, on which aria-label is prohibited by ARIA-in-HTML.
  Fix (role="img" on poster-scenes; drop/role=group on the video wrapper) is
  non-visual and accessibility-correct (coding-rule H5/A4). Claim is factually
  right.
- **Skeptic 2 (not refuted):** Real, axe-confirmed serious `aria-prohibited-attr`
  (before/axe/mosques-isocs.json:16-28): aria-label on role-less `<div>`s
  .campaign-hero__video (html:48) and .poster-scenes (html:76). Neither class nor
  label is referenced by script.js (grep empty); aria-label has no visual effect
  and is not page copy/localStorage/asset. role="img" on poster-scenes and
  role="group" (or removing the already-ignored label) on the video wrapper are
  standard, behavior-safe, zero-pixel fixes.
- **Skeptic 3 (not refuted):** Verified real. axe (mosques-isocs.json:16-29) flags
  `aria-prohibited-attr` serious on 2 nodes; HTML:48 (.campaign-hero__video) and
  HTML:76 (.poster-scenes) are role-less `<div>`s carrying aria-label, which AT
  drops. role='img' on the CSS-illustration poster and removing/re-roling the
  redundant video-wrapper label are both non-visual, evidence-backed fixes
  grounded in coding-rule A4/H5.
