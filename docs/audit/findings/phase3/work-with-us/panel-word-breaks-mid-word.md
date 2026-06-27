---
id: panel-word-breaks-mid-word
phase: phase3
agent: critic
status: verified
severity: med
scope: design
evidence:
  - work-with-us.html:46
  - style.css:2559
  - style.css:2585
  - style.css:2598-2604
  - docs/audit/screenshots/work-with-us/1440.png
source: internal
---

## Claim
The hero side-panel renders the word "Environment" split across two lines
mid-word ("Environme" / "nt") because its font-size is too large for the narrow
panel column and `overflow-wrap: anywhere` allows breaking inside the word.
`.work-hero__panel strong` is `font-size: clamp(2rem, 3.7vw, 3.8rem);
line-height: 1.06; overflow-wrap: anywhere` (`style.css:2598-2604`), inside the
panel's `minmax(260px, 0.42fr)` grid column (`style.css:2559`) with
`padding: clamp(22px, 4vw, 34px)` (`style.css:2585`), leaving only ~280px inner
width at 1440 — narrower than "Environment" at that size. The DOM forces each
word onto its own line via `<strong>Environment<br />Tech<br />Design</strong>`
(`work-with-us.html:46`), so the longest word must fit the column or it breaks.
Confirmed in `docs/audit/screenshots/work-with-us/1440.png`: the panel shows
"Environme" then "nt" on the next line above "Tech" / "Design".

## Why it matters
A headline-weight brand word split mid-syllable looks like a rendering bug and
damages the "considered, human" tone the brand targets; it is the clearest
typography defect on the page at desktop (design-rules D4/D6 — type harmony and
readability). It is an objective rendering defect, not a taste call.

## Recommended action
Make "Environment" fit the panel: lower the `strong` max font-size and/or the
`3.7vw` step, and replace `overflow-wrap: anywhere` (`style.css:2603`) with
normal word wrapping so words never split internally (optionally widen the panel
min column). Keep the Environment / Tech / Design content unchanged. At 375 the
word already fits on one line, so this is effectively a desktop-only size
adjustment.

## How to verify it's fixed
At 1440 / 1280 / 1024 confirm "Environment", "Tech", and "Design" each render on
a single unbroken line inside the panel; confirm no horizontal overflow at 375 /
768.

## Vote tally
failedToRefute: 3 / 3

- **Skeptic 1 (failed to refute):** Confirmed.
  screenshots/work-with-us/1440.png shows the panel rendering "Environme" / "nt"
  over "Tech" / "Design". style.css:2601 .work-hero__panel strong font-size
  clamp(2rem,3.7vw,3.8rem) (~53px at 1440) with overflow-wrap:anywhere
  (style.css:2603) inside the narrow minmax(260px,0.42fr) column (style.css:2559)
  + 34px padding (style.css:2585) leaves ~284px inner width, narrower than
  "Environment" at that size, so overflow-wrap:anywhere splits it mid-word.
  Evidence's stated 60.8px is the unreached max (actual ~53px at 1440) but the
  conclusion is ground-truth-confirmed by the screenshot. Real visual defect,
  fixable without touching copy/DOM.
- **Skeptic 2 (failed to refute):** Real, objective rendering defect, not a taste
  call. Screenshot 1440.png clearly shows "Environme" then "nt". style.css:2598-2603
  confirms .work-hero__panel strong has font-size clamp max 3.8rem +
  overflow-wrap:anywhere inside a minmax(260px,0.42fr) column (style.css:2559)
  that is too narrow for "Environment" at that size. Fix (reduce the strong
  font-size and/or change overflow-wrap to normal so it fits) is CSS-only; the DOM
  content "Environment<br>Tech<br>Design" (work-with-us.html:46) is untouched, so
  no behavior/copy/data-* impact. At 375 the word already fits on one line, so the
  fix is a desktop-only size adjustment.
- **Skeptic 3 (failed to refute):** Confirmed real.
  docs/audit/screenshots/work-with-us/1440.png plainly shows "Environme" then
  "nt" across two lines. CSS confirms cause: .work-hero__panel strong is
  clamp(2rem,3.7vw,3.8rem) with overflow-wrap:anywhere (style.css:2598-2603)
  inside the narrow minmax(260px,0.42fr) column (style.css:2559) with
  clamp(22px,4vw,34px) padding (style.css:2585) ~284px inner; "Environment" at
  ~53px exceeds that, so anywhere-wrap splits it mid-word. The <br> stack
  (work-with-us.html:46) shows the intent is one word per line, which the break
  defeats. Objective rendering defect, not a taste call.
