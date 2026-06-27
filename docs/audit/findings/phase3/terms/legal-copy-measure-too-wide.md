---
id: legal-copy-measure-too-wide
phase: phase3
agent: critic
status: fixed
severity: med
scope: design
evidence:
  - terms.html:41-47
  - style.css:23-28
  - style.css:1954-1960
  - docs/audit/screenshots/terms/1440.png
  - docs/audit/screenshots/terms/1280.png
source: internal
---

## Claim
`.legal-copy` is `max-width: 860px` with `line-height: 1.75`
(`style.css:1957,1959`); the body sets no base `font-size` (`style.css:23-28`),
so text renders at the 16px default. 860px at 16px yields roughly 100-110
characters per line — well past the 45-75ch comfortable measure (design-rules
D6) — and the 1.75 leading exceeds the D6 paragraph range of 1.4-1.6. In
`docs/audit/screenshots/terms/1440.png` and `1280.png` the first paragraph spans
the full measure; the top line runs ~100+ characters. Shared with
`policies.html`, which uses the same `.legal-copy` rule.

## Why it matters
Over-long line lengths make the eye lose its place returning to the next line,
hurting readability of exactly the dense prose a terms page needs to be legible
(design-rules D6; NN/g legibility guidance). The fix improves both legal pages.
(The line-length overage is the clear, measured D6 violation; the 1.75
line-height is the softer sub-claim — airy leading is common for legal prose and
still exceeds WCAG SC 1.4.8's 1.5 floor — so the primary, rule-cited defect is
the measure.)

## Recommended action
Constrain the measure to ~60-70ch (e.g. `max-width: 62ch` on `.legal-copy`) and
optionally set paragraph `line-height` to ~1.6. Keep the heading width separate
(`.legal-page h1` already has its own `max-width: 900px`, `style.css:1949`). The
change is a CSS width/leading adjustment with no JS, hook, copy, or asset
dependency, and applies equally to `policies.html`.

## How to verify it's fixed
At 1440, the longest paragraph wraps at <=75 characters per line; readability
spot-check passes; `policies.html` stays consistent with `terms.html`.
Before/after screenshots isolate the single intended re-wrap.

## Vote tally
failedToRefute: 3 / 3

- **Skeptic 1 (failed to refute):** CSS values exact: `style.css:1957`
  `max-width:860px`, `:1959` `line-height:1.75`; body (23-28) sets no font-size
  so 16px. 1440.png first paragraph wraps at ~108-115 chars/line (e.g. line 1
  runs through "community litter-"), and even the conservative ch-measure
  (~0.57em) gives ~94ch — both well past design-rules D6's 45-75ch, and 1.75
  exceeds D6's 1.4-1.6. The line-length portion is a clear, measured D6
  violation; the line-height portion is more debatable for dense legal text but
  still outside the documented range. Core claim is correct and evidence-backed.
- **Skeptic 2 (failed to refute, low confidence):** Partially valid,
  behavior-safe, but weak/subjective on severity. Measure claim holds:
  `.legal-copy max-width:860px` (`style.css:1957`) at the inherited 16px body
  size yields ~90-107 chars/line, exceeding design-rules D6's 45-75ch —
  evidence-backed against the project's own rule. However the secondary claim
  that `line-height:1.75` (`style.css:1959`) is a defect is weak: 1.75 EXCEEDS
  WCAG SC 1.4.8's 1.5 readability floor and is good practice for dense legal
  prose, so dropping to 1.6 is not clearly an improvement. The page has only
  three short paragraphs (`terms.html:43-47`), so practical impact is minor. The
  fix (max-width in ch) is behavior-safe — no JS/hook/copy dependency. Real per
  D6 but low-severity and half-subjective.
- **Skeptic 3 (failed to refute, med confidence):** Grounded in design-rules D6
  (45-75ch, 1.4-1.6), not pure taste. `.legal-copy max-width:860px,
  line-height:1.75` (`style.css:1957,1959`); body inherits 16px (no base
  font-size). Empirically counted the first paragraph's top line in
  `docs/audit/screenshots/terms/1440.png` at ~115 characters — clearly past the
  75ch comfortable max. The measure overage is a concrete, rule-cited
  readability concern. (The line-height 1.75 sub-claim is softer — common for
  airy legal text — hence med confidence — but the wide measure is real and the
  project's own D6 directs critics to flag it.)
</content>
