# Rejected candidates — terms.html (phase3 critic)

Candidates that did NOT clear the adversarial vote (a candidate is verified only
when a majority of skeptics fail to refute it). Each block records the tally and
the skeptics' reasons.

---

## touch-targets-below-44px (REJECTED)
**Severity:** med · **Scope:** a11y · **Tally:** failedToRefute 1 / 3
(refuted by two of three skeptics — short of the verification majority)

**Claim (rejected):** Footer text links are `font-size: 0.94rem` with
`width: fit-content` and no `min-height` (`style.css:2020-2025`), gap 10px
(`style.css:2009`), giving ~21px-tall hit areas; `.footer-social-row a` is
28x28px (`style.css:2115-2117`); the PureBot close button is 34x34px
(`style.css:1650-1654`). All clear the WCAG 2.2 SC 2.5.8 24px minimum (footer
links only via the 10px spacing exception) but none reaches the >=44px
recommended for primary touch (coding-rules A1, design-rules D17/D18).

- **Skeptic 1 (failed to refute, low confidence):** All measurements borne out
  by source: `style.css:2020-2025` `.footer-column a` has font-size 0.94rem
  (~15px) with `width:fit-content` and no `min-height` (~21px line box), `:2009`
  gap 10px; `:2115-2117` `.footer-social-row a` is 28x28px; `:1650-1654`
  `.purebot-header button` (close) is 34x34px. Characterization is accurate — all
  clear the 24px SC 2.5.8 hard minimum but none reaches the 44px aim, and
  coding-rules A1 / design-rules D17/D18 name "PureBot close x" and "footer link
  lists" as 44px-target risks. Low confidence: it is a recommendation gap, not a
  WCAG failure, and whether these secondary controls are "primary touch" is
  arguable — but no value is misstated.
- **Skeptic 2 (refuted):** Already-fine for conformance + the fix risks a visual
  regression. The finding itself concedes all three targets clear WCAG 2.2 SC
  2.5.8 (24px): footer links via the spacing exception (gap 10px, `:2009`; no
  min-height, `:2020-2025`), `.footer-social-row a` is 28x28 (`:2115-2117`),
  PureBot close is 34x34 (`:1650-1654`). So there is NO AA failure. 44px is only
  an "aim" for PRIMARY touch controls (coding-rules A1 / design-rules D17) —
  these are secondary footer nav and a utility close, not primary CTAs.
  Critically the fix is self-contradictory: genuinely enlarging eight tightly
  stacked footer links to a 44px hit area must add height (min-height or padding
  in a 10px-gap grid), which changes footer height/rhythm — the exact thing the
  finding says to "verify it does not change". Either the fix is ineffective
  (hit area didn't grow) or a regression. Marginal a11y benefit, real layout
  risk.
- **Skeptic 3 (refuted):** Already-fine against the actual standard + unsafe fix.
  The candidate itself concedes every target clears WCAG 2.2 AA SC 2.5.8 (24px):
  footer links ~19px tall pass via the 10px-gap spacing exception (centers ~29px
  apart > 24px), `.footer-social-row a` is 28x28 (`:2115-2117`, >=24), PureBot
  close is 34x34 (`:1650-1654`, >=24). The 44px figure is only an "aim … for
  primary touch controls" (coding-rules A1); footer/social/close are secondary
  utility controls, not primary. Worse, padding ~19px footer links to a 44px hit
  area cannot be done without changing the finished footer rhythm, contradicting
  the finding's own "layout unchanged" verification. No AA defect; soft
  could-be-bigger enhancement with a visually-unsafe fix.

**Disposition note:** Two of three skeptics refuted. The values are accurate but
the finding concedes there is no WCAG AA failure (all targets clear the 24px
hard minimum), the 44px figure is only an aim for *primary* controls (these are
secondary footer/utility controls), and any genuine enlargement of the tightly
stacked footer links would change the finished footer rhythm — contradicting the
finding's own "layout unchanged" verification. Below the verification threshold
-> rejected.

---

## redundant-brand-eyebrow (REJECTED)
**Severity:** low · **Scope:** design · **Tally:** failedToRefute 0 / 3
(refuted by all three skeptics)

**Claim (rejected):** The kicker above the H1 reads "PureStreets"
(`terms.html:39`) — directly beneath the PureStreets logo in the header
(`terms.html:17-19`) — so the eyebrow -> heading ladder (design-rules D3) opens
with a redundant brand restatement rather than a label that situates the page
(e.g. "Legal"). Claimed adjacent to anti-slop tell #16 (vague/empty labelling).

- **Skeptic 1 (refuted):** The factual observation is true (`terms.html:39`
  eyebrow "PureStreets"; logo alt "PureStreets" at `:17-19`), but the finding
  (that this is a hierarchy defect needing a fix) is a subjective taste call with
  misapplied citations. anti-slop #16 is specifically "vague aspirational
  MARKETING copy" (hollow superlatives/hedging) — a concrete brand name is the
  opposite of vague, so #16 does not apply. design-rules D3 concerns descending
  EMPHASIS/weight, not content redundancy with the header. At desktop the eyebrow
  is clipped behind the header anyway (finding
  `h1-eyebrow-clipped-under-fixed-header`), so "redundant adjacency" is weak. It
  also proposes a copy change, which CLAUDE.md / coding-rules H6 restrict and
  which the candidate admits needs content-owner sign-off. A cross-page-
  consistency angle exists (every other page uses an orienting eyebrow; only
  terms/policies restate the brand) but the finding does not rest on it and it
  remains a subjective copy decision.
- **Skeptic 2 (refuted):** Refuted on balance (genuinely contestable). The
  recommended action is a COPY change ("PureStreets" -> "Legal" or removal),
  which CLAUDE.md / coding-rules H6 gate behind content-owner sign-off — the
  finding concedes this, so it is not an autonomous audit fix. The anti-slop #16
  citation is misapplied: #16 targets vague aspirational MARKETING copy ("Build
  the future of work"); "PureStreets" is a concrete brand name, the opposite of
  vague. Whether a brand kicker on a legal page is "redundant" vs an intentional
  entity statement is a subjective hierarchy judgment with no single correct
  answer. Counter-evidence both ways: a cross-page grep shows every other eyebrow
  orients its section while only `terms.html:39` and `policies.html:39` use the
  bare brand — a real convention deviation that lends the premise some merit —
  but that does not make a gated, subjective copy edit a safe mechanical fix.
  Behavior-wise `script.js` never reads `.eyebrow`, so it wouldn't break a flow;
  the disqualifier is its subjective + copy-gated nature.
- **Skeptic 3 (refuted):** Subjective copy/editorial call with weak rule
  grounding, and a gated copy change. The cited rules don't squarely apply:
  design-rules D3 concerns the eyebrow -> h1 EMPHASIS ladder, which is satisfied
  (small uppercase eyebrow -> huge H1); anti-slop tell #16 targets vague
  aspirational MARKETING copy ("Build the future of work"), and a concrete brand
  name is not that (candidate concedes "adjacent to", not a match).
  "PureStreets" as a brand-first eyebrow on legal pages is a defensible choice,
  and whether "Legal" is "better" is taste. The candidate itself flags this needs
  content-owner sign-off per CLAUDE.md. (Note: grep shows other pages use
  orienting eyebrows while policies.html/terms.html both use "PureStreets", so a
  cross-page consistency observation exists — but that is not the finding as
  framed, and it remains a sign-off-gated copy preference, not a defect.)

**Disposition note:** Unanimously refuted. The cited rules are misapplied
(design-rules D3 is about descending *emphasis*, which is satisfied; anti-slop
#16 is about vague *marketing* copy, and a concrete brand name is the opposite
of vague), the call is subjective, and the recommended action is a copy change
gated behind content-owner sign-off per CLAUDE.md / coding-rules H6 — not an
autonomous audit fix. Rejected.
</content>
