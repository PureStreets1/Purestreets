---
id: section-arrow-invisible-zero-size
phase: phase3
agent: critic
status: verified
severity: med
scope: a11y
evidence:
  - volunteer-month.html:51-53
  - volunteer-month.html:85-87
  - volunteer-month.html:129-131
  - style.css
  - docs/audit/screenshots/volunteer-month/1440.png
  - docs/audit/screenshots/volunteer-month/375.png
  - docs/audit/screenshots/volunteer-month/1280.png
  - docs/audit/rules/design-rules.md
source: internal
---

## Claim
The three between-section navigation links — `.section-arrow` /
`.section-arrow--cream` — are referenced in the HTML
(`volunteer-month.html:51-53`, `:85-87`, `:129-131`) but have **no CSS rule
anywhere** in `style.css` (`grep -i "arrow" style.css` returns no matches). Each
renders as an empty inline `<a href="#…" aria-label="…"><span></span></a>`:
invisible on screen, a ~0x0 tap/focus target, and a confusing empty Tab stop.
The screenshots (`docs/audit/screenshots/volunteer-month/1440.png`, `375.png`,
`1280.png`) show no chevron/arrow in any of the gaps between the hero, board,
form, and network sections. `design-rules.md` D17 explicitly lists
"`.section-arrow` controls (`volunteer-month.html:51`)" as an expected tap
target, confirming they were meant to be a visible affordance.

Note: `git log -S "section-arrow" style.css` returns nothing — the class was
never styled (unstyled since the initial commit), so this is a long-standing
gap rather than a regression introduced by `f36e24e`.

## Why it matters
Three keyboard Tab stops with no visible affordance and no focus ring violate
SC 2.5.8 target size (rendered box < 24px) and SC 2.4.7 focus visible
(coding-rules A1/A2), and read as broken to AT users. Visually, the intended
scroll-cue affordance between sections is simply absent.

## Recommended action
Either (a) give `.section-arrow` / `.section-arrow--cream` a visible chevron
affordance sized >= 24px (ideally 44x44) with a visible focus state, or (b) if
the arrows were intentionally dropped, remove the orphan `<a>` + `aria-labels`
(and their `data-reveal` items) via this finding. The section IDs live on the
`<section>` elements, not the arrows, so either path breaks no flow or hook.
Pair (a) with `scroll-margin-top` on the targets (see `fixed-header-occludes-
hero`) so a jump does not land the heading under the fixed header.

## How to verify it's fixed
Path (a): a screenshot shows a visible arrow >= 24x24px between sections; Tab to
each link shows a focus ring; activating it scrolls to the target with the
heading clear of the header. Path (b): the three orphan anchors are gone from
the DOM, no empty Tab stop remains, and the section anchors still resolve.

## Vote tally
failedToRefute: 3 / 3

- **Skeptic 1 (failed to refute):** `grep -i arrow style.css` = 0 matches AND
  `git log -S section-arrow style.css` = 0 — the class is entirely unstyled and
  never was. HTML:51-53/85-87/129-131 are `<a href=#... aria-label=...><span>
  </span></a>`: an empty inline link (focusable via href) wrapping an empty span.
  All screenshots show no chevron in the section gaps. design-rules D17 lists
  `.section-arrow` as an expected tap target. Real defect: 3 invisible, ~0-width,
  empty focusable Tab stops (SC 2.4.7 / 2.5.8). Caveat: the 'f36e24e regression'
  sub-claim is unsupported — f36e24e removed only .form-status/.campaign-hero/
  .instagram rules, so 'restore' would be net-new design; but the core problem
  and the alternative 'remove the orphan anchors' fix remain valid and safe.
- **Skeptic 2 (failed to refute):** Core finding REAL: grep for 'arrow' in
  style.css returns nothing, [data-reveal] adds only opacity/transform (no box),
  and the inline `<a class=section-arrow>` wraps an empty `<span>` (HTML:51-53,
  85-87,129-131), so it renders as an invisible, ~0-size, focusable in-page link
  with an aria-label — confirmed by 1440.png/375.png showing no chevrons. Empty
  Tab stop / no visible focus / sub-min target. CAVEAT: the speculated cause is
  FALSE — git log -S section-arrow shows it was NEVER in style.css; these have
  been unstyled since the initial commit. That mis-attribution is hedged and
  doesn't sink the finding. Fix safe either way: section IDs live on the
  `<section>` elements, not the arrows, so styling them OR removing the orphan
  links+aria-labels breaks no flow/hook.
- **Skeptic 3 (failed to refute):** Core claim verified: grep "arrow" in
  style.css returns zero matches, so .section-arrow/.section-arrow--cream are
  entirely unstyled; HTML:51-53,85-87,129-131 are `<a href>`+empty `<span>` with
  aria-labels = focusable, ~0x0 inline Tab stops with no focus ring. Screenshots
  1280.png/1440.png/375.png show no chevron in any inter-section gap. Real SC
  2.4.7 (focus on invisible 0x0 target) + 2.5.8 + confusing empty AT Tab stops.
  Caveat: the candidate's 'f36e24e regression' sub-bullet is FALSE — git -S
  shows the class never existed in style.css — but it is hedged and the finding
  stands on grep + screenshots + DOM. Safe fix.
