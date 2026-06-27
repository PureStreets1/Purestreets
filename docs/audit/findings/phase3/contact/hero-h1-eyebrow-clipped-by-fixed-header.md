---
id: hero-h1-eyebrow-clipped-by-fixed-header
phase: phase3
agent: critic
status: verified
severity: high
scope: design
evidence:
  - contact.html:16
  - contact.html:40-41
  - style.css:46-59
  - style.css:72
  - style.css:202-206
  - style.css:678-680
  - style.css:1809
  - style.css:1813-1816
  - style.css:1902-1904
  - assets/img/logo.png
  - assets/img/figure.png
  - docs/audit/screenshots/contact/1440.png
  - docs/audit/screenshots/contact/375.png
  - docs/audit/screenshots/contact/768.png
  - docs/audit/screenshots/contact/1280.png
source: internal
---

## Claim
At page load (scroll top) the `position: fixed` site-header sits over the
contact hero, fully hiding the "Contact us" eyebrow (`contact.html:40`) and
clipping the top of the "Speak to PureStreets." H1 (`contact.html:41`), so the
page's primary focal point is visually decapitated at every width. The header
is `position: fixed; top: 0` with `padding: 14px clamp(18px, 4vw, 54px)` and
`z-index: 20` (`style.css:46-59`), and subpages force its opaque
`is-scrolled` state in the markup (`contact.html:16`). The `.brand` is
`width: clamp(78px, 8vw, 112px)` (`style.css:72`) over a portrait
`logo.png` of intrinsic 343x480 (verified via `sips`), and there is no
`.brand img` height/aspect cap, so the logo renders ~157px tall at >=1400px and
the header band is ~185px tall (157 + 14px*2 padding). But `.contact-hero` only
reserves `padding: 136px ...` at the top (`style.css:1809`), dropping to
`padding-top: 118px` at `<=860px` (`style.css:1902-1904`), and `.subpage main`
carries only the `pagePanIn` animation with NO top offset (`style.css:678-680`),
so the header overlaps the hero. Contact is the worst-case hero because it pairs
the site's largest H1 — `.contact-hero h1` at `clamp(3rem, 7vw, 7rem)`
(`style.css:1813-1816`) with global `line-height: 0.93` (`style.css:202-206`) —
with an eyebrow above it. `figure.png` is 760x701 (~267px tall at 290px wide),
shorter than the ~333px text block, so `align-items: center` does not push the
eyebrow clear. Confirmed in `docs/audit/screenshots/contact/1440.png` and
`1280.png` (no "Contact us" eyebrow; "Speak" top clipped), `768.png` (H1 almost
fully behind the header), and `375.png` (identical clipping at mobile).

## Why it matters
The eyebrow -> H1 ladder (design-rules D1/D3) is the first thing a visitor
should read, and here the eyebrow is invisible and the headline is mutilated — a
credibility and legibility failure on the page whose whole job is to look
approachable. It is a content-obscuring layout bug, not a taste call, and it
reproduces at all four capture widths. This is the kind of "actual bug" the
on-disk `/CLAUDE.md` overhaul contract permits fixing via a verified finding.

## Recommended action
Increase `.contact-hero` top padding (and the `<=860px` override) so it clears
the rendered fixed-header height (roughly >=190px desktop / >=150px mobile), or
cap the logo/header height (e.g. a `.brand img` height/`aspect-ratio` rule) so
the eyebrow and the full first H1 line sit below the header. NOTE: this is an
intentional, finding-approved pixel change (it reveals currently-hidden content),
not a silent edit — flag it explicitly against `/CLAUDE.md` rule 1 in the PR. The
fix touches no JS flow, `data-*` hook, localStorage, copy, or asset.

## How to verify it's fixed
Re-screenshot at 375 and 1440 at `scrollY=0`: the "Contact us" eyebrow is fully
visible and no part of the H1 cap-height is behind the header. In DevTools,
confirm `header.getBoundingClientRect().bottom` <= the H1 first-line top, and
measure the header bottom edge vs hero content top. Before/after screenshots at
375 and 1440 isolate the single intended change.

## Vote tally
failedToRefute: 2 / 2

- **Skeptic 1 (failed to refute):** Verified correct against source + all four
  screenshots. style.css:46-67 makes .site-header position:fixed/top:0 with an
  opaque is-scrolled bg (forced on subpages, contact.html:16); .brand width
  clamp(78px,8vw,112px) (style.css:72) over the 343x480 logo.png yields
  ~157px+28px = ~185px header at 1440, while .contact-hero top padding is only
  136px (style.css:1809) / 118px at <=860px (style.css:1903). Screenshots
  1440/1280/375 show the "Contact us" eyebrow absent and "Speak" clipped; 768.png
  shows the H1 almost fully behind the header. Math + 4 screenshots agree, so
  "every width" holds. The recommended pixel change is sanctioned by the current
  /CLAUDE.md (evidence-driven overhaul, not a freeze) and properly flagged as
  finding-approved.
- **Skeptic 2 (failed to refute):** Confirmed by geometry AND screenshots.
  logo.png is 343x480 (verified via sips); .brand width clamp(...,112px)
  (style.css:72) + global img max-width:100% renders the logo ~157px tall, + 14px
  header padding x2 (style.css:56) = ~185px fixed header. .contact-hero
  padding-top is only 136px desktop / 118px mobile (style.css:1809,1903) and
  .subpage main carries NO top offset (style.css:678 is only "animation:
  pagePanIn"), so the header overlaps the hero. figure.png is 760x701 -> ~267px
  tall at 290px wide, shorter than the ~333px text block, so align-items:center
  does not push the eyebrow clear. docs/audit/screenshots/contact/1440.png and
  375.png both show the top of "Speak" clipped and no "Contact us" eyebrow. Fix
  (increase hero padding-top) touches no JS flow, data-* hook, localStorage, copy,
  or asset — behavior-safe layout fix.
