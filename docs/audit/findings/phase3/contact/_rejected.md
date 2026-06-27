# Rejected candidates — contact.html (phase3 critic)

Candidates that did NOT clear the adversarial vote (a candidate is verified only
when it fails to be refuted by a majority of skeptics). Each block records the
tally and the skeptics' reasons.

---

## unused-tally-embed-contact-class (REJECTED)
**Severity:** low · **Scope:** code · **Tally:** failedToRefute 1 / 2
(refuted by one of two skeptics — short of the verification majority)

**Claim (rejected):** The contact form wrapper carries class
`tally-embed--contact` (`contact.html:74`), but that modifier has no rule in
`style.css` and no reference in `script.js`, so it is an inert, misleading hook
that should be removed.

- **Skeptic 1 (failed to refute):** The core title claim is factually verified:
  grep finds no .tally-embed--contact rule in style.css and no reference in
  script.js, so the modifier is unstyled/unreferenced (allowed
  "provably-unreferenced" hygiene scope per /CLAUDE.md). However the evidence
  wording is imprecise: the class appears on THREE pages (contact.html:74,
  charities.html:81, index.html:150), not only contact, and it parallels the
  styled .tally-embed--work (style.css:2621). So it reads as a deliberate
  cross-page BEM convention, not accidental dead code; removing it from one page
  would reduce consistency. Kept failed-to-refute because the literal assertion (no
  CSS/JS reference) is true and verifiable, but the better remediation is to USE
  it to scope the contact-iframe-dark-bg fix rather than delete it.
- **Skeptic 2 (refuted):** Evidence is factually wrong: "tally-embed--contact" is
  NOT "the single contact.html occurrence" — grep shows it on index.html:150,
  charities.html:81 and contact.html:74, i.e. a deliberate, consistent semantic
  modifier applied to all three contact-style embeds, paralleling the functional
  .tally-embed--work. Characterizing it as "inert/misleading dead code" is
  subjective; it is a benign, intentional hook. Removal also directly conflicts
  with sibling finding contact-form-iframe-dark-bg-contrast, which recommends USING
  this exact modifier to scope the iframe background, and removing it from
  contact.html alone would desync the three pages. Not a real problem.

**Disposition note:** Only one of two skeptics failed to refute (a tie, not a
majority), and that skeptic concedes the right action is to KEEP and reuse the
modifier rather than delete it. Below the verification threshold -> rejected. The
class is intentionally retained for the verified
`contact-form-iframe-dark-bg-contrast` finding to scope its CSS.

---

## bespoke-per-hero-h1-clamp-nonmodular (REJECTED)
**Severity:** med · **Scope:** design · **Tally:** failedToRefute 0 / 2
(refuted by both skeptics)

**Claim (rejected):** The contact hero H1 is `clamp(3rem, 7vw, 7rem)`
(`style.css:1813-1816`), overriding the global h1 `clamp(3rem, 8vw, 7.8rem)`
(`style.css:202-206`), and other heroes use yet different bespoke clamps
(`.work-hero` `clamp(2.8rem, 6vw, 5.9rem)` style.css:2566-2569; `.volunteer-hero`
similar) — so there is no single modular ratio anchoring these display sizes
(anti-slop #10).

- **Skeptic 1 (refuted):** The factual observation is true (global h1
  clamp(3rem,8vw,7.8rem) at style.css:205; .contact-hero h1 clamp(3rem,7vw,7rem)
  at style.css:1815; .work-hero clamp(2.8rem,6vw,5.9rem) at style.css:2569;
  .volunteer-hero clamp(2.7rem,6vw,5.8rem) at style.css:2156), but the finding is
  subjective and fails its own gate. anti-slop-checklist.md item 10 is explicitly
  [CONDITIONAL]: raise only if it co-occurs with >=2 other tells, OR is
  uniform-with-no-hierarchy, OR has no rationale. Here it co-occurs with a single
  layout bug (the clipping), not >=2 tells; per-page display sizes are
  content-tuned and have plausible design rationale; and the proposed "map onto one
  modular ratio" fix would change pixel values (e.g. 7rem -> a ratio step), so it
  is NOT the zero-pixel-change refactor it claims to be. Subjective +
  conditional-gate-unmet + not render-neutral-safe => refuted.
- **Skeptic 2 (refuted):** Premise is factually true (contact clamp(3rem,7vw,7rem)
  style.css:1815; global clamp(3rem,8vw,7.8rem) style.css:205; work 5.9rem
  style.css:2569; volunteer 5.8rem style.css:2156) but the cited tell (anti-slop
  #10) is CONDITIONAL and fails its own gate: it does not co-occur with >=2 other
  slop tells (the candidate cites only the layout-clipping bug, which is not a slop
  tell), the sizes are NOT applied uniformly-without-hierarchy, and there is a
  plausible design rationale (the short headline "Speak to PureStreets." gets a
  larger max than the longer work/volunteer headlines). The anti-slop file warns
  against false-positiving intentional craft on this non-default-slop repo. The fix
  is self-defeating: mapping every clamp onto one ratio changes the rem values and
  therefore the pixels, violating the audit's zero-pixel-diff gate the candidate
  itself invokes — so it is propose-only and non-actionable.

---

## standalone-link-tap-targets-under-24px (REJECTED)
**Severity:** med · **Scope:** a11y · **Tally:** failedToRefute 0 / 2
(refuted by both skeptics)

**Claim (rejected):** The option-card CTA links (`contact.html:52,58,64`) and
footer links (`contact.html:88-100`) are bare text links with no padding
(`.contact-options a`, `style.css:1869-1875`), so their hit area is ~one 16px
line (~21px tall) — under the 24x24px SC 2.5.8 minimum — and they are not
inline-in-sentence so the inline exception does not apply.

- **Skeptic 1 (refuted):** The height measurement is roughly right
  (.contact-options a has no padding, style.css:1869-1875; footer links small) but
  the SC 2.5.8 conclusion is wrong because the candidate only rebuts the inline
  exception and ignores the controlling SPACING exception. Option-card links are
  isolated (one link per 300px-min card with clamp(24px,5vw,52px) padding), so a
  24px circle never intersects another target. Footer links use .footer-column gap
  over ~18-20px line boxes => center-to-center ~28-30px (>=24px even in the worst
  case), so the 24px circles do not intersect adjacent targets. Both groups
  therefore PASS SC 2.5.8 via spacing. Corroborated by axe contact.json reporting
  NO target-size violation (only aria-hidden-focus, color-contrast, link-name). The
  proposed padding/min-height change would add unjustified spacing for a
  non-failure (design-rules D17 "aim 44px" is aspiration, not the 24px hard floor).
- **Skeptic 2 (refuted):** Misreads WCAG 2.5.8: the candidate rebuts only the
  INLINE exception and ignores the operative SPACING exception. Footer links are
  .footer-column a at ~19-20px tall with .footer-column gap -> ~29-30px
  center-to-center, so the 24px-diameter circles do not intersect -> PASS. The
  three .contact-options a are one-per-card, isolated across separate grid columns
  / large clamp(24-52px) padding (style.css:1838-1875) with no neighboring target
  inside 24px -> PASS. axe (WCAG 2.2 ruleset) reports NO target-size violation on
  this page (contact.json lists only aria-hidden-focus, color-contrast, link-name).
  The proposed padding/min-height fix would also shift deliberate design (the lime
  underline offset on .contact-options a, footer link rhythm).
