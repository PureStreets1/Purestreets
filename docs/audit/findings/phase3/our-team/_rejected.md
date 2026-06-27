# Rejected candidates — our-team.html (phase3)

Candidates raised during critique that did NOT survive adversarial verification.
Each block: id, tally, and why it was rejected. Kept for audit traceability so the
same candidates are not silently re-raised.

---

## monogram-avatars-not-real-people
**Severity (proposed):** low · **Scope:** content
**Tally:** failedToRefute 1 / 3 — REJECTED (subjective / owner-dependent)

**Claim:** Each "Meet the team" card shows a generic lime monogram (PS / IR / DX /
TX) that does not correspond to the person's name beneath it (Sumayyah->IR,
Maha->DX, Nusaiba->TX), reading as placeholder chrome rather than authentic team
identity. (our-team.html:54,61,68,75 vs names :56,63,70,77; .team-avatar
style.css:2698-2707; D20, anti-slop #15/#21; goodgym.md:27-28 "authentic member
headshots".)

**Why rejected:**
- (refuted) Subjective, no objective rule violated. It is factually true the
  monograms are not the people's initials, but calling them "placeholder slop" is a
  taste interpretation — a uniform lime text monogram reads as an intentional
  non-personal area/brand badge, not stock imagery. anti-slop #15 targets
  AI-generated IMAGERY (a text monogram is not imagery); #21 (interchangeability) is
  weak given the specific real names/roles on each card. No a11y/contrast issue is
  cited for the avatars. The recommended action is itself a COPY/ASSET change
  requiring owner sign-off (the finding admits "do not silently swap"), so it is not
  autonomously actionable under CLAUDE.md.
- (refuted) Subjective content interpretation. The section is titled "Core areas of
  work." (our-team.html:50) with ROLE labels, and the first card's monogram "PS"
  sits over FOUR people (Rayyan, Suweda, Waleed & Alisha) — proving the monograms
  are abstract area/brand codes (PS = PureStreets), not intended as person initials.
  No rule mandates monogram == name initials. The D20 "use real photos" alternative
  is a major content/asset change requiring owner sign-off, out of safe autonomous
  audit scope.
- (failedToRefute) The factual core is true and maps to D20 / anti-slop #21;
  goodgym.md:27-28 citation verified. But the "placeholder/weakens trust" framing is
  subjective and the action is gated on owner sign-off.

**Disposition:** Not an autonomously actionable defect. If pursued, route to content
owners as a copy/asset decision, not an audit-driven CSS/HTML fix.

---

## flat-equal-weight-team-grid
**Severity (proposed):** low · **Scope:** design
**Tally:** failedToRefute 0 / 3 — REJECTED (subjective; carved out by the checklist)

**Claim:** The four areas render as a uniform `repeat(4)` grid of structurally
identical cards (same avatar circle, 8px radius, 300px min-height), so the
most-consequential area carries the same visual weight as a single-person area — a
flat, interchangeable feature-grid (style.css:2682-2696; our-team.html:52-81;
anti-slop #5/#6; D1/D3).

**Why rejected:**
- (refuted) Subjective/unsupported. The factual description is accurate, but the
  asserted defect is a taste call. The content is four genuinely parallel "core
  areas of work" — exactly the case anti-slop #5 EXEMPTS ("Flag when generic/
  interchangeable, NOT when the content is genuinely tabular"). The cards carry
  brand-specific content (real names, role copy, lime avatars, coral labels), so
  they are not interchangeable feature-icons; #6's uniform radius is a documented
  site-wide brand decision (~39 uses). "Make the lead card bigger" is a hierarchy
  opinion the checklist warns against imposing.
- (refuted) Conditional tells arguably PASS. #5 explicitly exempts genuinely
  tabular/parallel content; the four cards are peer areas with specific real names/
  roles, so equal weighting is defensible. #6 (uniform 8px radius) is a calibrated
  conditional the checklist notes is "modest, not the 16px slop value." D3 is about
  descending emphasis within a hierarchy; these are peers, not a ranked list. The
  proposed fix is a sizeable taste-driven redesign, not an objective correction.
- (refuted) Taste call the checklist itself carves out. Four co-equal work-areas are
  genuinely parallel/tabular content with distinct copy per card — equal weight is
  appropriate, not slop. The 8px radius is a deliberate brand token. The section
  already has the D1/D3 ladder (eyebrow "Meet the team" -> h2 "Core areas of work"
  -> cards). "Make the lead card span wider" imposes artificial asymmetry with
  reflow risk — an "elevate/refine" move the rules caution against.

**Disposition:** No objective rule violated; behaviorally harmless but subjective.
Do not change the grid weighting absent a new, rule-grounded finding.
