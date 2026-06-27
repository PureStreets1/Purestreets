# Rejected candidates — work-with-us.html (phase3 critic)

Candidates that did NOT clear the adversarial vote. A candidate is verified only
when a majority of skeptics fail to refute it; the three below fell short. Each
block records the severity, scope, tally, and the skeptics' reasons.

---

## flattened-type-hierarchy (REJECTED)
**Severity:** med · **Scope:** design · **Tally:** failedToRefute 0 / 3
(refuted by all three skeptics)

**Claim (rejected):** The decorative panel word-stack
(`.work-hero__panel strong` max 3.8rem, `style.css:2601`) is sized almost
identically to the page H2 (`.work-form-section h2` max 3.8rem, `style.css:2618`)
and approaches the H1 (max 5.9rem, `style.css:2569`), flattening the eyebrow ->
H1 -> H2 -> body ladder; and the page's font sizes (5.9 / 3.8 / 3.8 / 1.18 / 0.78
/ 0.76 rem) do not share a single modular ratio (anti-slop #10).

- **Skeptic 1 (refuted):** Sub-facts are accurate (panel strong max 3.8rem at
  style.css:2601 == .work-form-section h2 max 3.8rem at style.css:2618; h1 max
  5.9rem at style.css:2569) but the finding itself is subjective and not borne
  out. screenshots/work-with-us/1440.png shows h1 rendering ~86px vs panel ~53px
  (1.6x larger) — the h1 is the clear focal point, not "rivalled"/"flattened";
  panel and h2 live in different sections (hero vs form) so never compete in one
  view. The "no single modular ratio" part is a site-wide CONDITIONAL anti-slop
  tell (checklist item 10) that the checklist itself flags as likely-intentional
  bespoke craft and warns not to strip on pattern-match alone; the co-occurrence
  justification is weak (the cited "near-duplicate 3.8rem" is the same tell, and
  the mid-word break is a layout bug, not a type-scale issue). Recommendation
  (demote panel, re-anchor all sizes to a modular ratio) is a taste-driven
  restructuring, not a verified defect.
- **Skeptic 2 (refuted):** Subjective design/taste claim that does not clear its
  own bar. The "panel rivals the H1" impression is largely an artifact of the
  separately-flagged H1 clipping (hero-h1-clipped) which hides the eyebrow and
  crops the H1 in the same 1440 screenshot; once that is fixed, H1 (max 5.9rem,
  style.css:2569) clearly dominates panel/H2 (max 3.8rem) via a deliberate 1.55x
  step. The panel strong and h2 sharing 3.8rem (2601 vs 2618) sit in different
  sections that are never co-viewed, and a reused size reads as an intentional
  shared scale, not flattening. anti-slop item 10 is CONDITIONAL and its
  co-occurrence test is applied circularly here (it cites the mid-word bug plus
  the very size-duplication that IS this same claim). The "no single modular
  ratio" point cherry-picks max-clamp values present on one simple hero+form page.
  The recommended fix (re-anchor the whole type scale to one modular ratio via
  :root tokens) is a large, subjective, risky restructuring of many font-sizes.
- **Skeptic 3 (refuted):** Largely subjective and the conditional slop bar is not
  met. The per-section emphasis ladder (D3) is actually intact: hero steps eyebrow
  0.76rem -> h1 5.9rem -> body 1.18rem; the form section steps eyebrow -> h2
  3.8rem -> body. The h1 max 5.9rem (style.css:2569) clearly dominates the panel
  strong 3.8rem (style.css:2601) — a 1.55x gap visible in 1440.png — so the panel
  does not "rival" the H1. h2==panel both 3.8rem is true but they live in
  different sections never seen together as one hierarchy. Item #10 (non-modular
  scale) is a CONDITIONAL, site-wide trait; the cited co-occurrence test fails
  because the mid-word break is an overflow bug, not a checklist tell, and
  "near-duplicate 3.8rem" is the same observation restated. The fix (re-map the
  whole type scale to one modular ratio) is exactly the kind of subjective
  "unify/elevate" redesign the rules caution against.

**Disposition:** 0 / 3 failed to refute — well below the verification majority.
The H1 clearly dominates once the separately-filed clipping bug is fixed; the
remaining "non-modular scale" point is a CONDITIONAL site-wide tell that does not
pass its own co-occurrence test on this page. Rejected.

---

## panel-div-aria-label-ignored (REJECTED)
**Severity:** low · **Scope:** a11y · **Tally:** failedToRefute 1 / 3
(refuted by two of three skeptics — short of the majority)

**Claim (rejected):** The hero panel is a plain `<div>` carrying
`aria-label="PureStreets team areas"` (`work-with-us.html:44`), but `aria-label`
on a generic div with no role is not consistently exposed to AT, and the visible
"Team areas" span already labels the block (`work-with-us.html:45`).

- **Skeptic 1 (failed to refute):** Factually correct. work-with-us.html:44 is a
  bare <div class="work-hero__panel" aria-label="PureStreets team areas"> with no
  role; per ARIA the generic/no-role element does not reliably support naming, so
  the aria-label is unreliably exposed and duplicates the visible "Team areas"
  span (line 45). grep confirms script.js never references work-hero or this
  aria-label, so dropping it is render-neutral and not a behavior/JS hook. Aligns
  with coding-rules.md A4 (keep ARIA honest). Minor but real and safe; not an axe
  violation, hence low severity.
- **Skeptic 2 (refuted):** Unsupported/overstated premise. This is not an axe
  violation (work-with-us.json does not flag it) and there is no concrete AT trace
  showing it fails on this page; per "no evidence => drop the claim" it is an
  assertion, not a finding. In practice modern screen readers (NVDA/JAWS/VoiceOver)
  do announce aria-label on a content-bearing div, so "not reliably exposed" is
  overstated, and the inner span/strong text is read regardless, so nothing is
  demonstrably broken. The candidate itself rates the impact "minor noise."
  Removing the attribute would be behavior-safe (work-with-us.html:44 aria-label
  is not a data-* hook and is referenced by no CSS/JS), but the finding addresses
  a non-problem rather than a real defect.
- **Skeptic 3 (refuted):** Effectively a non-issue / already-fine. It is NOT in
  the page's axe violations (docs/audit/runs/before/axe/work-with-us.json shows
  only aria-hidden-focus and color-contrast), and no WCAG SC is violated: the
  panel is non-interactive content already named by its visible "Team areas" span
  (work-with-us.html:45). If the aria-label on the roleless div is honored it
  merely adds "PureStreets" context; if ignored, the visible text still labels it
  — so it is inert, neither harmful nor a defect. The cited rule (coding-rules A4)
  is about aria-expanded/hidden/live tracking real STATE, not about
  name-prohibition on generic elements, so it does not support the claim.
  Trivial-at-most cleanup, not a real problem.

**Disposition:** Only 1 / 3 failed to refute. No axe/AT trace demonstrates a real
failure on this page, and the inner visible text labels the block regardless, so
the attribute is inert at worst. Below threshold — rejected.

---

## arbitrary-iframe-min-heights (REJECTED)
**Severity:** low · **Scope:** code · **Tally:** failedToRefute 0 / 3
(refuted by all three skeptics)

**Claim (rejected):** The embedded Tally form's reserved height is hard-coded to
four different arbitrary pixel values across selectors/breakpoints with no shared
token (`style.css:2535` 720px; `style.css:2554` 780px @max-560; `style.css:2622`
760px; `style.css:2639` 820px @max-560), and the mobile floor (820px) reserves a
large block that appears mostly empty at 375 (`screenshots/work-with-us/375.png`).

- **Skeptic 1 (refuted):** The four values are factually correct (style.css:2535
  720px, 2554 780px@560, 2622 760px, 2639 820px@560) but the "defect" framing is
  unsupported/subjective and partly unsafe. coding-rules.md C1 only bars
  hard-coding a value that ALREADY has a token — none exists here, so C1 is not
  violated; design-rules.md D7 concerns visual spacing rhythm, not functional CLS
  reserves. The four values are not interchangeable: two distinct embeds x two
  breakpoints, deliberately taller on narrow screens where fields stack — sensible
  per-breakpoint CLS floors, not arbitrary. The "mostly-empty 820px box" in
  screenshots/work-with-us/375.png is a capture artifact (the Tally iframe content
  did not render in the static screenshot); with dynamicHeight=1 the loaded form
  fills it. The recommended "right-size the mobile floor" risks reintroducing the
  CLS the floor prevents. Tokenizing single-use values adds little. Weak
  code-smell opinion, not a verified safe defect.
- **Skeptic 2 (refuted):** Central evidence is a misread capture artifact, and the
  recommended action is partly unsafe. The "tall, nearly-empty white box" at 375
  is the lazy-loaded Tally iframe sitting at its min-height floor because
  dynamicHeight=1 never ran its postMessage resize in the headless screenshot
  (even 1440.png shows the embed only partially rendered), not proof the floor
  exceeds real form height (no measurement was taken). The four min-heights
  (style.css:2535,2554,2622,2639) are intentional per-form/per-breakpoint CLS
  reservations endorsed by coding-rules P1, not slop magic numbers; C1 targets
  values that already have a token, which these do not, so tokenizing four
  independent embed heights is low/no value. "Right-sizing the mobile floor"
  downward risks reintroducing CLS when the form loads taller than the reduced
  floor, contradicting the P1/CLS<=0.1 target. The finding bundles a low-value
  cleanup with a risky value change founded on misread evidence.
- **Skeptic 3 (refuted):** The four values (style.css:2535,2554,2622,2639) are
  real but deliberate, not magic-number slop: they are CLS-reservation floors
  tuned per context (the work form is consistently +40px taller than the base
  embed at each breakpoint; mobile floors are taller than desktop because the form
  reflows taller). coding-rules C1 forbids hard-coding a value that ALREADY has a
  token — none of these duplicate an existing token. design-rules D7 governs
  padding/margin/gap rhythm, not a third-party iframe's reservation height, so it
  is misapplied. The "tall empty white box at 375" in
  docs/audit/screenshots/work-with-us/375.png is an artifact of Tally not
  rendering in the headless capture, not proof of dead space: the iframe uses
  dynamicHeight=1 (work-with-us.html:57) so min-height is only a pre-load floor.
  The proposed "right-size the mobile floor to actual rendered form height" is
  itself a non-render-neutral CLS change that cannot be determined statically.
  Low-value smell, effectively a non-issue.

**Disposition:** 0 / 3 failed to refute. The four floors are intentional
per-embed / per-breakpoint CLS reservations (coding-rules P1), C1 is not violated
(no pre-existing token duplicated), and the "empty box" evidence is a headless
capture artifact under `dynamicHeight=1`. The proposed down-sizing is itself a
risky CLS change. Rejected.
