# Rejected candidates — volunteer-month.html (phase3 critic)

Candidates that did NOT clear the adversarial vote (a candidate is verified only
when a majority of skeptics fail to refute it). Each block records the claim,
the tally, and the skeptics' reasons.

---

## badge-stat-outsizes-h1 (REJECTED)
**Severity:** med · **Scope:** design · **Tally:** failedToRefute 0 / 3
(refuted by all three skeptics)

**Claim (rejected):** The decorative badge number is
`font-size: clamp(4rem, 9vw, 7.2rem)` (`style.css:2184-2186`) while the page's
single H1 is `clamp(2.7rem, 6vw, 5.8rem)` (`style.css:2153-2156`); from ~1280px
up the secondary stat "20" renders larger than the primary headline (~115px vs
~86px at 1440), allegedly inverting the intended visual hierarchy — framed as a
symptom of the hand-tuned, non-modular type scale (anti-slop #10, design-rules
D4/D1/D3).

- **Skeptic 1 (refuted):** The size FACT is correct — badge strong
  clamp(4rem,9vw,7.2rem) (style.css:2186) vs h1 clamp(2.7rem,6vw,5.8rem)
  (style.css:2156) yields ~115px vs ~77-86px at 1280-1440 — but the conclusion
  ('hierarchy inversion / flattened ladder') is a subjective design opinion, not
  a defect. In 1280-volunteer.png the '20' is a stat inside a bordered white
  side-card (POINTS label above, explainer below) in a narrow grid column
  (minmax(260px,0.42fr)); the H1 unmistakably reads as the headline by position,
  length and context. An oversized hero metric is a deliberate, common editorial
  device; no hard rule requires the H1 to be the largest type on the page.
  anti-slop #10 is CONDITIONAL and fails its co-occurrence/rationale test here.
  Shrinking the badge is an unrequested visual taste call.
- **Skeptic 2 (refuted):** Numbers are accurate (style.css:2156 H1
  clamp(2.7rem,6vw,5.8rem) -> ~86px@1440; 2184-2186 badge strong
  clamp(4rem,9vw,7.2rem) -> 115px, so badge>H1 from ~1280 up), but this is a
  DESIGN-TASTE call, not a behavior or a11y defect. The '20' is a deliberate
  oversized metric inside a separate bordered white stat card (distinct column/
  color/context, style.css:2166-2188); hierarchy is also carried by reading
  order, position and color, so 'headline must be the largest type in view' is
  not a hard rule. Oversized-number callouts are an established device (brand
  'confident elevation'). No behavior/data/copy impact, but the premise is
  subjective/arguable — refuted on subjectivity per adversarial default.
- **Skeptic 3 (refuted):** Subjective taste call. The numbers are correct
  (style.css:2156 H1 max 5.8rem; 2186 badge max 7.2rem; badge renders larger
  >=1280) but 'hierarchy inversion' is contradicted by the render: in
  1280-volunteer.png the H1 is the unmistakable focal point (3-line dominant left
  column, dark green) per design-rules D1, while '20' is a deliberate big-number
  stat in a supporting white card with explicit rationale ('20 per attended
  clean-up'). anti-slop #10 is CONDITIONAL and FAILS the co-occurrence/
  justification test (load-bearing, rationalized, not uniform, not co-occurring
  with >=2 tells). Big-number stat callouts being typographically tall is
  intentional craft, not slop; capping the stat to 'fix' a non-defect is a design
  opinion.

---

## purebot-greeting-copy-polish (REJECTED)
**Severity:** low · **Scope:** content · **Tally:** failedToRefute 1 / 3
(refuted by two of three skeptics — short of the verification majority)

**Claim (rejected):** The seeded PureBot message reads "Assalamu alaikum, how
can i help you?" with a lowercase first-person "i" (`volunteer-month.html:211`),
and the close control's visible text is a literal lowercase "x" rather than a
multiplication-sign glyph (`volunteer-month.html:208`, `aria-label="Close
PureBot"` present). Proposes capitalizing "I" and optionally swapping "x" for
"×".

- **Skeptic 1 (failed to refute):** Both observations are factually correct:
  HTML:211 reads 'Assalamu alaikum, how can i help you?' with a lowercase
  first-person 'i', and HTML:208 close button visible text is the literal 'x'
  (aria-label='Close PureBot' present and unchanged). Capitalizing 'i'->'I' is an
  objective English-grammar correctness fix that traces to a finding per
  CLAUDE.md's copy-change requirement and touches no data-*/localStorage/selector.
  The '×' glyph swap is explicitly flagged optional and is subjective/visual, but
  the primary fix is valid and safe. Low severity.
- **Skeptic 2 (refuted):** Borderline, refuted on subjectivity + bundled visual
  change. 'i'->'I' (HTML:211) is a defensible grammar point and is behavior-safe
  (the seeded purebot-message is static HTML, never read/matched by script.js),
  but it edits the org's intentional, on-brand greeting ('Assalamu alaikum...'),
  which the candidate itself says PASSES anti-slop #21 — so treating the casual
  lowercase 'i' as a defect is a judgment call on protected brand voice. The
  second half ('x'->'×', HTML:208) is an explicit VISUAL glyph change and is
  flagged 'optional' — the kind of 'polish/refine' the rules discourage without
  strong justification. Net: very low value, mixes protected copy with an optional
  visual tweak; per adversarial default this should only proceed (if at all) as an
  explicit deliberate copy decision, not as silent polish.
- **Skeptic 3 (refuted):** Subjective copy/typography polish with no rule anchor.
  The 'x'->'×' swap is explicitly 'optional' and the literal 'x' is functional
  with aria-label="Close PureBot" (HTML:208); nothing requires the multiplication
  glyph. The lowercase 'i'->'I' (HTML:211) is a grammar nit not grounded in
  design-rules (visual heuristics), coding-rules, or the anti-slop checklist — a
  casual lowercase 'i' is the opposite of an AI-slop tell (anti-slop #17 targets
  straight quotes/em-dashes/semicolons; the candidate itself concedes the greeting
  PASSES #21). Editing frozen-style bot copy for a cosmetic letter is an editorial
  taste call, not a defensible design defect, and CLAUDE.md treats copy as
  sensitive. Refute under the slop/subjectivity lens.

**Disposition note:** Below the verification majority (1/3). If the content owner
wants the grammar fix, it can be raised separately as an explicit, deliberate
copy decision (per CLAUDE.md's copy-change requirement) — but the "×" glyph swap
is an optional visual change and should be dropped. Either way, the
`data-purebot-close` hook and `aria-label="Close PureBot"` must stay unchanged so
the close flow keeps working.
