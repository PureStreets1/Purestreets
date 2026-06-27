---
id: aria-table-required-children
phase: phase3
agent: critic
status: fixed
severity: low
scope: structure
evidence:
  - volunteer-month.html:71
  - volunteer-month.html:72-78
  - volunteer-month.html:79
  - volunteer-month.html:80
  - script.js:407-423
source: internal
---

## Claim
`.volunteer-table[role="table"]` (`volunteer-month.html:71`) directly contains a
header row (`volunteer-month.html:72-78`, `role="row"`), then a non-row text div
`.volunteer-empty` (`volunteer-month.html:79`, roleless) and a roleless wrapper
`[data-volunteer-rows]` (`volunteer-month.html:80`). `renderBoard()` appends the
data rows — `role="row"` `<article>`s — *inside* that roleless wrapper
(`script.js:407-423`). ARIA/APG require a `table`'s owned elements to be rows or
rowgroups, and rows to have a table/rowgroup parent; the generic
`[data-volunteer-rows]` wrapper severs that ownership once the board is
populated, so AT may lose row/column semantics for the leaderboard.

axe passed `aria-required-children` on this page only because the captured DOM
is the empty state — the header row at `volunteer-month.html:72` satisfies the
"table owns >= 1 row" check, but the *data* rows nested under the roleless
wrapper are the latent concern. (See the dissent in the vote tally below.)

## Why it matters
The APG table pattern expects `table -> row | rowgroup` ownership; a roleless
generic wrapper holding the data rows is a structural-conformance deviation that
can cost row/column semantics for the populated leaderboard (the tracker's whole
purpose). Low severity, but concrete and spec-grounded.

## Recommended action
Add `role="rowgroup"` to `[data-volunteer-rows]` (`volunteer-month.html:80`) so
the appended rows are owned correctly, and move/handle `.volunteer-empty`
outside the table region. This is render-neutral and preserves the `data-*`
hooks and the localStorage shape. Do NOT convert to a real
`<table>`/`<thead>`/`<tbody>`: the layout is CSS-grid-based on
`.volunteer-table`/`.volunteer-row`, so a native-table conversion would break
the grid (see the dissenting skeptic).

## How to verify it's fixed
Populate an entry, run axe (`aria-required-children` clean in both empty and
populated states), and confirm VoiceOver/NVDA announces the data rows and column
headers; before/after screenshots remain pixel-identical.

## Vote tally
failedToRefute: 2 / 3

- **Skeptic 1 (failed to refute):** Structure verified:
  `.volunteer-table[role=table]` (HTML:71) directly contains a roleless
  `.volunteer-empty` div (79) and a roleless `[data-volunteer-rows]` wrapper
  (80); renderBoard appends `role=row` `<article>`s into that wrapper
  (script.js:407-423). ARIA requires a table's owned elements to be row/rowgroup,
  and rows to have a table/rowgroup parent; the generic wrapper severs that
  ownership once populated. axe passed aria-required-children here only because
  the captured DOM is the empty state — the candidate states this honestly, so it
  is a latent, not fabricated, issue. Fix (role=rowgroup on [data-volunteer-rows])
  is render-neutral and preserves the data-* hook and localStorage shape. Real
  structural conformance issue, low severity.
- **Skeptic 2 (REFUTED):** Premise misreads why axe passes. The header row
  `.volunteer-row--head[role=row]` is a DIRECT child of `.volunteer-table[role=
  table]` (HTML:71-72) and is present in EVERY state, so aria-required-children
  (table must own >= 1 row/rowgroup) is satisfied now AND when populated — axe
  does not pass merely 'because the DOM is empty', so the claimed 'latent failure
  once entries exist' is unsupported (no populated axe run / AT test provided).
  The genuine underlying nicety (data rows appended into the roleless
  [data-volunteer-rows], script.js:407-423, would be cleaner as role=rowgroup) is
  minor and unverified. Also one recommended fix is UNSAFE: the table is built on
  CSS grid (display:grid + grid-template-columns on .volunteer-table/
  .volunteer-row; .volunteer-row--head display:none at mobile), so converting to
  real `<table>`/`<thead>`/`<tbody>` would break the layout; 'move
  .volunteer-empty out' is a DOM reorder of a data-* hook. Refuted on the misread
  premise + unsafe headline fix.
- **Skeptic 3 (failed to refute):** Concrete, spec-grounded structural smell,
  not taste. Verified: `role="table"` (HTML:71) directly contains a roleless
  non-row text div `.volunteer-empty` (HTML:79) and roleless `[data-volunteer-
  rows]` (HTML:80); script.js:407-423 appends `role="row"` `<article>`s into that
  roleless wrapper; grep confirms no rowgroup anywhere. A stray generic text div
  as a direct child of role=table plus rows nested under a roleless wrapper
  deviates from the ARIA/APG table->rowgroup->row model. axe passes only because
  the audited DOM is the empty state — latent once populated. Fix (role="rowgroup"
  + relocate empty) is additive, no visual/behavior/key change. Low confidence:
  rows are still owned as descendants and it is not axe-confirmed, but the
  inconsistency is real and the fix is safe.

**Disposition note:** 2 of 3 skeptics failed to refute (verification majority
met). The dissenting skeptic's two cautions are folded into the Recommended
action: the headline fix is the additive `role="rowgroup"` (NOT a native-table
conversion, which would break the CSS grid), and the empty-state relocation must
preserve the `data-volunteer-empty` hook. Treat the populated-state assertion as
latent (not yet axe-confirmed) and re-run axe against a populated board when
fixing.
