---
id: coral-text-token-and-dark-eyebrow-scope
phase: phase5
agent: css-implementer
timestamp: 2026-06-27
chosen: A
---

## Problem
T1 needs a darker coral *label* token (`--coral-text`) applied to `.eyebrow` plus the
six named label spans so small coral-on-light text clears 4.5:1. The naive move —
recolour the base `.eyebrow { color: var(--coral) }` rule (style.css:156) — is a
trap: two eyebrows render on **dark** sections and would *regress* if darkened
(coral #e6654f on `--green-dark` is already 3.71:1; a darker label colour drops it
to ~2.4:1, creating a NEW axe failure). Those two are:

- `.impact-copy .eyebrow` ("Community impact", index.html:189) on `.impact-section`
  `background: var(--green-dark)` (style.css:458).
- `.kit-section .eyebrow` ("Run it well", mosques-isocs.html:257) on `.kit-section`
  `background: var(--green-dark)` (style.css:946).

The WS-CSS acceptance is explicit: "hero lime eyebrow and **dark-section eyebrows
unchanged**". A second wrinkle: `.partnership-list span` (one of the six) shares its
rule with `.partner-logo span` (style.css:2366-2372), which renders the same coral
small label ("Previous partnership"/"Community partner", charities.html:56,60) on a
light gradient — the same tell, just unflagged by axe (axe marks contrast over
gradients `incomplete`). I verified the full on-light eyebrow set by grepping every
`.eyebrow`/`var(--coral)` use and mapping each section background; only those two
eyebrows sit on dark surfaces, and 338/341 (`.value-band__heading h2::after` dot)
are decorative coral that must stay `--coral`.

Token value: I darkened in HSL to hold the brand hue. `#bd4631` = H 9.0deg (orig
#e6654f is 8.7deg), contrast 4.84 / 5.14 / 5.05 on `#fbf8ef` / `#ffffff` / `#fffdf7`
(binding bg is the darkest, `#fbf8ef`). Comfortable margin over 4.5:1, still reads as
warm coral.

Scoring 0-10/criterion, higher = better (regression/cost: higher = safer/cheaper).

## Alternatives considered
### Option A — base `.eyebrow` -> `--coral-text`, then override the 2 dark eyebrows back to `--coral`; recolour the shared partner-logo/partnership-list rule too
One token, base rule recoloured, a single 2-selector override
(`.impact-copy .eyebrow, .kit-section .eyebrow { color: var(--coral) }`) restores the
dark-section eyebrows byte-for-byte, and the six (effectively seven, via the shared
rule) light label spans switch to `--coral-text`. Compact, matches the plan's "apply
to `.eyebrow` + the six spans", and keeps same-page coral labels visually consistent.
Alignment 9 · Regression 8 · Cost 8 · Reversibility 9 = **34/40**

### Option B — never touch base `.eyebrow`; enumerate every light-section eyebrow + each label span individually
Avoids the dark-eyebrow issue by listing ~20 light selectors with `--coral-text`.
Huge, fragile diff; a missed selector leaves a live contrast failure; ignores the
plan's "apply to `.eyebrow`" directive.
Alignment 6 · Regression 5 · Cost 3 · Reversibility 7 = **21/40**

### Option C — base `.eyebrow` -> `--coral-text` AND recolour the 2 dark eyebrows to a light colour (lime/white) to "fix" them too
Would also raise the dark-section eyebrows' contrast, but it **changes** dark-section
eyebrows (violates the acceptance) and invents a new dark-eyebrow colour with no
finding to back the pixel change.
Alignment 3 · Regression 3 · Cost 7 · Reversibility 8 = **21/40**

## Decision
Chose **A** (34/40). Add `--coral-text: #bd4631` to `:root`; set base `.eyebrow` and
the on-light label spans (`.partner-grid span`, `.contact-options span`,
`.volunteer-hero__badge span`, `.partner-logo span, .partnership-list span`,
`.work-hero__panel span`, `.team-grid span`) to `var(--coral-text)`; add
`.impact-copy .eyebrow, .kit-section .eyebrow { color: var(--coral); }` immediately
after the existing lime hero override so the two dark-section eyebrows stay exactly
as shipped. The lime `.hero .eyebrow` / `.hero__panel .panel-label` override
(style.css:163-166) and the decorative coral dot (338/341) are left untouched.
Default-motion / non-dark renderings of the changed labels are the only pixels that
move, exactly the finding-approved contrast fix.

## How to reverse
Delete the `--coral-text` token, revert the seven `var(--coral-text)` back to
`var(--coral)`, and delete the `.impact-copy .eyebrow, .kit-section .eyebrow` rule.
No JS/hook/asset/storage touched.
