---
id: hero-h1-clipped-top
phase: phase3
agent: critic
status: fixed
severity: high
scope: design
evidence:
  - docs/audit/screenshots/index/1440.png
  - docs/audit/screenshots/index/375.png
  - docs/audit/screenshots/index/768.png
  - docs/audit/screenshots/index/1280.png
  - docs/audit/screenshots/index/1280-purebot.png
  - style.css:123-133
  - style.css:151
  - style.css:205-206
  - style.css:613-620
source: internal
---

## Claim
On the shipped 1440 and 375 captures the hero headline's first line is clipped
at the top edge / hidden behind the header, so the page's primary message is
partially missing on common laptop heights and on phones, while 768 and 1280
render it intact. On `docs/audit/screenshots/index/1440.png` the first H1 line
("Clean") is cut off at the top and the lime "COMMUNITY ACTION GROUP" eyebrow is
not visible; on `docs/audit/screenshots/index/375.png` only "Shared reward."
shows at the top with "Clean streets." pushed above the viewport. By contrast
`docs/audit/screenshots/index/768.png` and `docs/audit/screenshots/index/1280-purebot.png`
show the full eyebrow + "Clean streets. Shared reward." intact — proving this is
a viewport-height-dependent layout bug, not an intentional crop.

Mechanism (verified in CSS): `.hero` is `min-height: 92vh` with `display: grid`,
`align-items: end`, `overflow: hidden`, and `padding: 150px …` (`style.css:123-132`);
`.hero__content` is pulled upward with `transform: translateY(clamp(-48px, -4vw,
-28px))` (`style.css:151`); the H1 is `font-size: clamp(3rem, 8vw, 7.8rem)` with
`line-height: 0.93` (`style.css:205-206`), so the headline grows faster than the
hero box on short viewports and its top overflows the clipped container. The
mobile override keeps `align-items: end` + `overflow: hidden`, changing only
`min-height: 96vh` / `padding-top: 128px` / `translateY(0)` (`style.css:613-620`),
so the same clip recurs on phones.

## Why it matters
The headline is the single most important focal point of the landing page
(design-rules D1). Clipping it behind the header on the most common desktop
laptop heights (~768-900px) and on every phone undercuts the first impression
and hides org-specific copy, exactly where a grassroots site needs to read as
intentional. This is genuine content loss of the focal point, not a taste call;
the CLAUDE.md evidence-driven overhaul mandate supersedes the prior ZERO-visual
freeze and permits an evidence-backed visual fix here.

## Recommended action
Make the hero's vertical sizing accommodate the fluid H1 at all viewport
heights: e.g. let content height drive the box (avoid clipping the top by
switching `align-items: end` -> `start` with adequate top padding, or removing
the upward `translateY` / capping the H1 max-size so content fits within
`min-height`). Re-verify at multiple heights. The fix is CSS-only (align-items /
padding / translateY / h1 max-size) and touches no JS flow, `data-*` hook,
localStorage, copy, or asset. It must preserve the intact 768 rendering.

## How to verify it's fixed
Capture index at 1440x800, 1366x768, 375x667 and 375x812; confirm the full
"Clean streets." line is visible below the header with no top clip; pixel-diff
768/1280 to confirm they remain unchanged.

## Vote tally
failedToRefute: 3 / 3

- **Skeptic 1 (failed to refute):** Verified against screenshots + CSS.
  1440.png: first H1 line "Clean" is clipped at the top edge and the lime
  "COMMUNITY ACTION GROUP" eyebrow is missing; 375.png: only "Shared reward."
  shows at top, "Clean streets." hidden under header. 768.png renders fully
  intact (eyebrow + full headline), proving it is a height-dependent layout bug,
  not intentional. Mechanism confirmed: .hero align-items:end + overflow:hidden +
  padding-top 150px (style.css:128,130,132), .hero__content translateY(clamp(-48px,
  -4vw,-28px)) (151), h1 clamp(3rem,8vw,7.8rem)/line-height:0.93 (205-206),
  mobile min-height:96vh/padding-top:128px/translateY(0) (614-619). Minor
  inaccuracies that do NOT refute: first line is just "Clean" (not "Clean
  streets."), and 1280.png is ALSO clipped (candidate cited 1280-purebot.png as
  intact). Real D1 visual defect; fix is in-scope under the overhaul mandate.
- **Skeptic 2 (failed to refute):** Real viewport-specific layout defect,
  confirmed visually: 768.png shows the hero intact (lime "COMMUNITY ACTION
  GROUP" eyebrow + full "Clean streets. Shared reward." headline), while 1440.png
  clips the first line and drops the eyebrow, and 375.png shows only "Shared
  reward." as the first hero line. Root cause verified in style.css:123-152
  (.hero align-items:end + overflow:hidden + .hero__content translateY pulling
  tall content above the 150px top padding) and the mobile override at :613-620.
  BEHAVIOR/REGRESSION lens: the proposed fix is CSS-only (align-items / padding /
  translateY / h1 max-size) and touches no JS flow, data-* hook, localStorage,
  copy, or asset; permitted under the overhaul mandate. Safe to act on.
- **Skeptic 3 (failed to refute):** Verified against source-of-truth
  screenshots. Top-crops show the hero H1 top is genuinely clipped on 1440.png
  ("Clean" cut at top, lime eyebrow "COMMUNITY ACTION GROUP" entirely absent) and
  on plain 1280.png (same clip), while 768.png AND 1280-purebot.png render the
  full eyebrow + "Clean streets. Shared reward." intact. The pair of same-width
  1280 captures with opposite results proves the clip is viewport-HEIGHT
  dependent, exactly the candidate's claim (common laptop heights / mobile). On
  375.png "Clean streets." is pushed entirely above the viewport. Mechanism is
  real: style.css:128 align-items:end + :132 overflow:hidden + :151
  translateY(-48px) make content overflow the hero's top box on short viewports;
  mobile keeps align-items:end+overflow:hidden (style.css:613-620). This is
  genuine content loss of the focal point (design-rules D1), not subjective
  taste; CLAUDE.md contract supersedes ZERO-visual-change and permits an
  evidence-backed visual fix. Fix must preserve the intact 768 rendering.

## Phase 7 re-fix (status: fixed)
Phase 6 found the 1440 fix landed but the `<=860` mobile override (translateY(0),
`padding-top: 128px`) was untouched, so the topmost hero element was reported
clipped at 375. Phase 7 measurement of the authoritative fixed-viewport reshoot
(`scratchpad/vp_idx375.png`, 375x667, deviceScaleFactor=1, scroll-top) shows the
H1 top at y≈**176** vs the transparent header box bottom y≈**137** (the full-page
clip was a `position:fixed` capture artifact), but the topmost lime overlap
("COMMUNITY ACTION GROUP") sat right at the header edge (~137). To guarantee the
full H1 + the topmost element render below the header box at 375/768, Phase 7
tied the mobile clearance to the header token: index `.hero` `<=860`
`padding-top: 128px -> calc(var(--header-h) + 12px)` (= 149px at mobile; +12px of
clearance above the header box, style.css ~643). `translateY(0)` at mobile is
kept (no upward pull). Base/desktop `.hero` and the `>=1281px` easing are
unchanged, so 1280/1440 stay as the Phase 5 fix left them. Decision:
`docs/audit/decisions/phase7/css-rehero-and-contrast.md`.
