# Rejected candidates — index.html (phase3)

Candidates raised against `index.html` that the skeptic panel refuted. Each block
records the candidate, its vote tally, and why it was rejected. Not findings — do
NOT action these.

---

## non-modular-type-scale — REJECTED (0 / 3 failed to refute)
**Title:** ~40 distinct font-sizes with no single modular ratio (anti-slop #10)
**Severity (claimed):** med · **Scope:** design
**Claim:** `style.css` carries ~49 font-size declarations across ~40 distinct
values — a dense cluster of one-off rem sizes (0.76/0.78/0.82/0.84/0.86/0.88/0.9/
0.92/0.94/0.96/1/1.08/1.1/1.15/1.18/1.25/1.28/1.35rem) plus ~30 bespoke `clamp()`
tuples — that do not step by any consistent ratio, the canonical AI "bigger text
= header" tell.

**Verdict:** Refuted 3/3 as a subjective/taste refactor that fails the anti-slop
checklist's own CONDITIONAL gate. Reasons:

- **Skeptic 1 (refuted):** Refuted on correctness + subjectivity. Headline counts
  are wrong: style.css has 80 font-size declarations across 49 DISTINCT values,
  not the claimed "~49 declarations / ~40 distinct" (candidate appears to have
  conflated the two and undercounted distinct values). It is a CONDITIONAL
  anti-slop tell (#10) and FAILS the checklist's own co-occurrence gate: branch 1
  needs >=2 other co-occurring tells but only border-radius:8px (#6) is cited;
  branch 2 ("applied uniformly with no hierarchy") is contradicted by the
  finding's own evidence of 49 distinct sizes forming a clear h1>h2>h3>body>eyebrow
  ladder; branch 3 ("no rationale") fails because the sizes are load-bearing
  hierarchy. The checklist explicitly warns this site is "NOT default-slop" with
  "intentional craft" and not to strip craft that merely pattern-matches a tell.
  "No single ratio = defect" is a taste call, and the recommended remedy
  (collapsing ~80 declarations onto one modular scale "within ~2px" across 9
  pages) is a sweeping, regression-prone refactor, not a discrete bug.
  (border-radius:8px 39-of-52 is accurate, but that alone does not satisfy the
  gate.)
- **Skeptic 2 (refuted):** Subjective design refactor, not a defect. The 49
  distinct font-size values are real, but anti-slop #10 is CONDITIONAL and the
  checklist explicitly calibrates THIS repo as "NOT default-slop," calling the
  bespoke clamp sizes merely "worth a critic's attention"/"worth inspecting" —
  the co-occurrence test is weakly met (the only cited co-tell, 8px radius, is
  itself flagged as "modest, not the 16px slop value"). Screenshots
  (768.png/1440.png) show a clear, working hierarchy, so there is no concrete
  user-facing harm. The recommended fix admits "within ~2px" rendering change
  (i.e. NOT visual-neutral) and would rewrite ~49 declarations across the single
  shared stylesheet, a high regression surface over 9 pages that nukes git blame
  against CLAUDE.md hygiene guidance. Refuted as subjective/taste-driven with the
  conditional justification not convincingly met.
- **Skeptic 3 (refuted):** This is a CONDITIONAL anti-slop tell (#10) that fails
  the checklist's own co-occurrence/justification gate, so per
  anti-slop-checklist.md lines 29-35 it should not be raised. Test (2) "uniform
  with no hierarchy" is the OPPOSITE of true — the grep shows 80 font-size
  declarations / ~50 distinct values forming a strong, clearly-ranked hierarchy
  (the screenshots render a legible eyebrow->h1->h2->h3->body ladder, no
  "bigger=header" noise). Test (3) fails: fluid clamp() type is load-bearing with
  explicit rationale (coding-rules C2 / design-rules D5). Test (1) fails: the
  candidate musters only ONE co-occurring CONDITIONAL signal (border-radius:8px
  x39), not >=2 tells, and the checklist explicitly calibrates this repo as "NOT
  default-slop" (Manrope, green palette, brand shadows, token system all PASS). No
  user-facing defect is evidenced — the assertion that the hierarchy "reads as
  hand-tuned noise" is contradicted by every screenshot. The recommended "collapse
  near-duplicate sizes / map onto steps" is a subjective taste refactor across the
  whole stylesheet that risks visual regression for no proven benefit;
  anti-slop-checklist line 35 warns against stripping intentional craft. Refuted
  as taste/unsupported (a narrow zero-render tokenization would be mere hygiene,
  not the design defect claimed).
