# Rejected candidates — charities.html (phase3 critic)

Candidates that did NOT clear the adversarial vote (a candidate is verified only
when it fails to be refuted by a majority of skeptics). Each block records the
tally and the skeptics' reasons.

---

## nonmodular-type-scale (REJECTED)
**Severity:** med · **Scope:** design · **Tally:** failedToRefute 0 / 3
(refuted by all three skeptics)

**Claim (rejected):** Type sizes are hand-tuned with no consistent step ratio
(h1 5.9rem max, partner strong 3rem max, partner-mark 1.35rem, labels 0.78rem,
eyebrow 0.76rem) and the page also blankets nearly every surface with
`border-radius: 8px`, allegedly meeting the anti-slop co-occurrence test
(checklist #10 CONDITIONAL + #6 uniform radius).

- **Skeptic 1 (refuted):** Cited values accurate (h1 clamp max 5.9rem
  style.css:2338; partner strong max 3rem 2406; partner-mark 1.35rem 2472; span
  0.78rem 2369; eyebrow 0.76rem 157; 8px radius across surfaces) BUT the finding
  is a subjective CONDITIONAL slop tell (anti-slop #10), and the
  recommendedAction is self-contradictory: you cannot map sizes onto 'one
  modular ratio' while keeping clamp min/max 'anchored to current values' for
  0px diff — anchoring to current arbitrary values leaves them non-modular (a
  no-op rename), while actually imposing a ratio changes pixels (a taste-driven
  redesign of the whole type scale). Display type (76px h1) and 12px micro-labels
  legitimately live on different scales; anti-slop-checklist itself warns 'do
  not strip intentional craft' and calibrates this repo as NOT default-slop.
  Subjective + non-actionable safely => refute.
- **Skeptic 2 (refuted):** Facts are true (sizes style.css:2338/2406/2472/2369/157;
  8px radius at 2359/2379/2469/2459/2537/106) but this is a subjective
  design-taste call, not a defect. anti-slop #10 and #6 are CONDITIONAL, and the
  checklist explicitly calibrates THIS repo as non-slop intentional craft ('do
  not strip intentional craft just because it pattern-matches a tell'); CLAUDE.md
  calls the design intentional/finished and screenshots read as polished. A
  genuine modular-scale fix means changing font-sizes = a taste change to a
  deliberate design with no objective correctness. The candidate's own
  0px-diff path (alias existing clamp() values to :root vars) yields no actual
  improvement while churning git blame. Subjective / no objective defect /
  visual-risk to an intentional design -> refute.
- **Skeptic 3 (refuted):** SLOP / fails the anti-slop CONDITIONAL gate.
  anti-slop-checklist.md #10 is CONDITIONAL and may be raised only if it (1)
  co-occurs with >=2 OTHER tells, (2) is applied uniformly with no hierarchy, or
  (3) has no rationale. The claim offers only ONE co-tell (#6 radius) = fails
  (1). The type sizes are clearly hierarchical and load-bearing (h1 5.9rem >>
  strong 3rem >> mark 1.35rem >> labels 0.78/0.76rem at style.css:2338,2406,2472,
  2369,157), so they create hierarchy = fails (2) and (3). The co-tell #6 is
  itself weak: radius is NOT uniform (grep: 39x 8px but also 4x 999px, 4x 50%,
  plus 7px/6px/18px/0 = role-differentiated). coding-rules C2 endorses bespoke
  clamp() as the target idiom. The recommended fix is self-defeating: 'anchor to
  current values, verify 0px diff' = a pure rename with zero design value, while
  any real ratio change is a subjective, visual-risk re-tuning. Taste call, not
  a defensible defect.

---

## perf-embed-weight-and-unsized-images (REJECTED)
**Severity:** low · **Scope:** perf · **Tally:** failedToRefute 1 / 3
(refuted by two of three skeptics — short of the verification majority)

**Claim (rejected):** The Tally iframe is correctly lazy-loaded with reserved
height (CLS-safe), but it transitively loads ~40 tally.so chunks plus 3 Sentry
telemetry POSTs (4th-party origin), and the logo/figure chrome images
(`charities.html:18`, `:143`) ship without intrinsic dimensions (P1).

- **Skeptic 1 (refuted):** Cited facts mostly check out (iframe loading=lazy
  charities.html:82; min-height:720px style.css:2535; exactly 3 Sentry POSTs
  network/charities.json; logo/figure imgs lack width/height) but it is largely
  already-fine and the weight claim overstates: network JSON has ~33 tally-domain
  requests (~28 script chunks), not ~40. The only actionable item (size the
  chrome images) yields ~zero material CLS: figure.png is CSS-locked to 46x46
  inside a fixed 64x64 toggle (style.css:1766-1769) so its box is already
  reserved, and logo.png sits in a position:fixed header that does not shift
  in-flow content. iframe is already lazy+reserved and Sentry is unremovable
  (both self-admitted). coding-rules P1 concerns the LCP/hero image and embeds,
  not these. No material problem to fix.
- **Skeptic 2 (refuted):** Premise misreads behavior and the headline fix is
  unsafe. The figure is NOT unsized: .purebot-toggle img is CSS-locked to
  width:46px;height:46px;object-fit:contain (style.css:1766-1769), so its box is
  already reserved (no CLS). For the logo, the recommended width/height
  ATTRIBUTES would distort it: global img{max-width:100%} has no height:auto
  (style.css:30-33) and there is no .brand img rule, so width caps to 112px while
  the height attribute forces 480px -> a stretched logo on every shared page
  (visual regression). Both images sit in position:fixed chrome (header /
  purebot aside) that does not shift document flow, so the CLS benefit is
  negligible. The Tally/Sentry weight (network/charities.json: 33 tally + 3
  sentry refs) is acknowledged unremovable/non-actionable. Wrong premise +
  unsafe method + negligible value -> refute.
- **Skeptic 3 (failed to refute):** Actionable core is REAL; framing is
  accurate. The claim correctly treats the ~40 tally.so chunks + 3 Sentry POSTs
  (verified in network/charities.json) as already-handled/accepted (iframe
  loading="lazy" charities.html:82, min-height:720px reservation style.css:2535)
  rather than a fix. The fixable item — logo (charities.html:18) and figure
  (charities.html:143) imgs lack width/height/aspect-ratio (P1) — is factually
  true (no aspect-ratio on header logo per grep), and the logo rendering
  differently between 1280.png and 1280-purebot.png is empirical CLS evidence.
  Implementer must use aspect-ratio/height:auto to avoid distortion (global img
  rule lacks height:auto), but that is an implementation detail, not a
  refutation. Low severity, render-neutral when done correctly.

**Disposition note:** Two of three skeptics refuted (figure.png box is already
CSS-locked at 46x46 so no CLS; width/height attributes on the logo would
distort it given the global `img` rule lacks `height: auto`; the embed weight
and Sentry origin are acknowledged unremovable). The lone non-refuting skeptic
concedes the only safe path is `aspect-ratio`/`height: auto`, not the raw
width/height attributes the candidate recommends. Below the verification
threshold -> rejected. Note the overlap with the verified
`charity-hero-header-overlap` finding, which already covers the missing logo
height/aspect cap from a layout-correctness angle.
