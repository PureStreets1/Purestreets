# Rejected candidates — mosques-isocs.html (phase3, critic)

Candidates raised against `mosques-isocs.html` that did NOT survive adversarial
verification. Each block: id, severity/scope, why it was rejected, and the
vote tally. Rules reviewed first: `docs/audit/rules/coding-rules.md`,
`design-rules.md`, `anti-slop-checklist.md`, `/CLAUDE.md`; inspiration skimmed
under `docs/audit/findings/inspiration/`.

---

## uniform-long-reveal-motion (med, design) — REJECTED
**Tally: failedToRefute 0 / 3 (all 3 skeptics refuted).**

Claim was that every reveal uses the same 820ms duration on all 41
`[data-reveal]` elements (style.css:687-690), a generic fade/slide applied
identically (anti-slop #18). The factual substrate is correct, but the finding
is a subjective design taste call and its recommended action ("bring duration
into ~300-450ms", "differentiate by role") directly changes transition/animation
timing — a frozen visual property.

- **Skeptic 1 (refuted):** Factual substrate is correct (style.css:687-690 = 820ms
  on the base [data-reveal] rule; 41 attributes; staggers to 620ms at HTML:92), but
  the finding is subjective and its recommendedAction is a direct change to
  transition/animation timing. anti-slop #18 and design-rule D13 are CONDITIONAL
  heuristics; reduced-motion is already handled (style.css:1504-1513) and the
  staggered reveal is intentional, frozen motion. The checklist itself warns not to
  strip intentional craft. Subjective + unsafe-to-act-on.
- **Skeptic 2 (refuted):** anti-slop #18 is CONDITIONAL and fails its own
  justification test. The reveals are NOT identical/templated: they vary by
  direction (data-reveal left/right/up/down map to different translate axes,
  style.css:694-712) and stagger by delay (120/240/360/520/620ms) — deliberate
  directional choreography that DOES build hierarchy. 820ms vs D13's ~150-400ms is a
  soft subjective threshold; reduced-motion already disables it
  (style.css:1504-1513). Re-timing motion is a subjective visual taste call on a
  finished, frozen motion design.
- **Skeptic 3 (refuted):** The core claim 'a generic fade/slide applied identically
  to everything' is false: data-reveal elements vary BOTH direction
  (HTML:40,48,59,73,74) AND delay (120-620ms), with a bespoke easing
  cubic-bezier(0.22,1,0.36,1) (style.css:687-690) — purposeful, staggered,
  hierarchical motion. anti-slop #18's CONDITIONAL gate (>=2 co-tells / no hierarchy
  / no rationale) is NOT met. D13's 150-400ms is a heuristic, not a hard rule;
  cutting 820ms is a taste-driven change to a frozen property. Reduced-motion is
  already handled.

---

## eager-autoplay-video-weight (med, perf) — REJECTED
**Tally: failedToRefute 0 / 3 (all 3 skeptics refuted).**

Claim was that the 6.0 MB hero `<video>` (mosques-isocs.html:49) autoplays and is
fetched eagerly on load (confirmed: network capture line 39 lists
`sisters-southall.mp4`, type media). The fact is real, but the finding is not
safely fixable as written: the headline lever `preload="none"`/`"metadata"` is a
no-op on an `autoplay muted` video — the UA must fetch the resource to satisfy
autoplay regardless of preload. The only effective fixes (remove/gate autoplay,
re-encode/swap the asset) are forbidden behavior/asset changes. "render-blocking
early fetch" also mischaracterizes media (not render-blocking); CLS is already
safe (sized container, style.css:1041-1050 region).

- **Skeptic 1 (refuted):** Core observation is true (asset 6.0MB; HTML:49
  `<video ... autoplay muted ... no preload>`; network json:38-42 fetches it on
  load), but not safely fixable. preload="none"/"metadata" is INEFFECTIVE on an
  autoplay+muted video — the UA must fetch to satisfy autoplay, so it would not stop
  the download. The only effective fixes (remove autoplay, re-encode the asset) are
  forbidden behavior/asset changes under CLAUDE.md. howToVerify premise
  ('render-blocking early fetch') is inaccurate: media is not render-blocking and the
  poster covers the slot. No safe, effective fix exists.
- **Skeptic 2 (refuted):** The recommended low-risk fix misreads behavior: per
  MDN/HTML spec the autoplay attribute takes precedence over preload, so adding
  preload="none"/"metadata" to the muted+autoplay+playsinline `<video>` (html:49)
  will NOT stop the eager fetch — the browser must download to autoplay, and the 6MB
  mp4 still loads. The candidate's howToVerify would fail. The only effective lever
  (remove/gate autoplay) is a behavior+visual change requiring a decision; a
  re-encode is an asset change. Real perf concern, but the prescribed safe action
  does not work.
- **Skeptic 3 (refuted):** Fact is real (network line 39; perf 82) but not safely
  actionable as framed. preload='none'/'metadata' is a no-op while autoplay is
  present. The only effective levers (gate autoplay, re-encode/swap) are a visible
  behavior change to an intentional on-brand hero plus an asset swap — both need
  design sign-off and degrade the authentic community footage design-rule D20
  praises. 'render-blocking early fetch' is a mischaracterization; CLS already safe
  (style.css:1041-1050). Cited coding-rule P5 is about third-party SCRIPTS, not
  video — miscited. No clean safe fix; borderline.

---

## pdf-object-nested-in-anchor (med, structure) — REJECTED
**Tally: failedToRefute 0 / 3 (all 3 skeptics refuted).**

Claim was that the guide preview (mosques-isocs.html:107-111) nests an
interactive `<object type=application/pdf>` inside an `<a>` (invalid
interactive-in-interactive), that clicks may be swallowed, and that the full
721 KB PDF is downloaded on load. All three pillars fail: (1) `<object>` is
interactive content per the HTML spec ONLY with a `usemap` attribute — this one
has none, so nesting in `<a>` is conforming; (2) `style.css:1462-1467` already
sets `pointer-events: none` on `.guide-preview object`, so the anchor is the sole
click target (and is exactly the candidate's own proposed fix — already done);
(3) the before-run network capture (`docs/audit/runs/before/network/
mosques-isocs.json`, 9 requests) contains NO PDF request — the eager-download
claim is unsupported.

- **Skeptic 1 (refuted):** All three pillars fail. (1) Per the HTML spec `<object>`
  is interactive content ONLY with a usemap; this object (HTML:108) has none, so
  nesting in `<a>` is conforming. (2) style.css:1467 already sets pointer-events:none
  on .guide-preview object, so clicks pass through to the anchor — the click-
  reliability concern is already mitigated, and the candidate's own alt-fix is
  already done. (3) The network truth source lists 9 requests and contains NO PDF
  (grep pdf = 0), so the eager-download claim is not borne out. Substantially wrong
  on its factual basis.
- **Skeptic 2 (refuted):** Premise misreads current behavior. (a) Click-capture is
  ALREADY mitigated: style.css:1467 sets pointer-events:none on .guide-preview
  object — the candidate's own 'safe' recommendation is already implemented. (b) The
  '721KB PDF downloaded on initial load' claim is UNSUPPORTED: the source-of-truth
  network capture lists 9 requests with no PDF, and grep across all page captures
  finds the PDF in none. (c) `<object>` without a usemap is not interactive content
  per the HTML content model, and axe did not flag the nesting. The remaining fix
  (swap to a static cover image) is an asset+visual change, propose-only.
- **Skeptic 3 (refuted):** All three load-bearing claims fail. (1) Per the HTML
  spec `<object>` is interactive content only with a usemap; this object (HTML:108)
  has none, so nesting in `<a>` is conforming. (2) style.css:1462-1468 already sets
  pointer-events:none on .guide-preview object, so the `<a>` is the sole click
  target — and the candidate's own recommendedAction proposes setting
  pointer-events:none, which is already done, showing the CSS wasn't checked. (3)
  The before-run network capture (9 requests) does NOT include
  community-litter-pick-guide.pdf — unsupported. Residual perf nuance would be an
  asset (cover-image) change, propose-only, not matching the structural title.
  Refuted.
