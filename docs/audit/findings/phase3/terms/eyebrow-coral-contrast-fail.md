---
id: eyebrow-coral-contrast-fail
phase: phase3
agent: critic
status: verified
severity: med
scope: a11y
evidence:
  - terms.html:39
  - style.css:10
  - style.css:154-161
  - style.css:163-166
  - style.css:1943-1946
  - docs/audit/screenshots/terms/375.png
  - docs/audit/screenshots/terms/768.png
source: internal
---

## Claim
The `.eyebrow` is `var(--coral)` `#e6654f` at `font-size: 0.76rem` (~12.16px)
and `font-weight: 800` (`style.css:154-161`; token at `style.css:10`). On the
`.legal-page` near-white background — a `linear-gradient(180deg, #fffdf7,
var(--paper) #fbf8ef)` (`style.css:1945`) — the measured WCAG contrast is
3.12:1 against `#fbf8ef` (and ~3.22:1 against `#fffdf7`), both below the 4.5:1
threshold. The legal-page eyebrow is NOT inside `.hero`, so the lime override at
`style.css:163-166` does not apply — the kicker renders coral (confirmed in
`docs/audit/screenshots/terms/768.png` and `375.png`, "PURESTREETS" in coral on
pale paper). The body sets no base `font-size` (`style.css:23-28`), so the root
is the default 16px and 0.76rem = 12.16px; the bold large-text threshold is
18.66px, so this is normal text that must meet 4.5:1 and does not (SC 1.4.3).
For contrast, the muted body copy `--muted` `#607068` measures ~4.93:1 and
PASSES — so the eyebrow is the real defect, not the paragraphs.

## Why it matters
The eyebrow is the first label in the section's reading order; sub-threshold
contrast makes it hard to read for low-vision users and is a measurable AA
failure (coding-rules A3, design-rules D11, WCAG SC 1.4.3) — measured, not
eyeballed. It is shared with `policies.html`, which uses the same coral eyebrow
on the same `.legal-page` surface.

## Recommended action
Raise the eyebrow's contrast on light legal surfaces to >=4.5:1 — e.g. give the
subpage/legal eyebrow role a darker coral or ink token, or bump it past the
large-text threshold. Scope the change so the lime hero-eyebrow override
(`style.css:163-166`) is unaffected. `script.js` does not reference `.eyebrow`,
so there is no behavior, hook, copy, or asset impact — it is a scoped CSS color
change.

## How to verify it's fixed
Measure the new ratio with a contrast checker (>=4.5:1 against both `#fffdf7`
and `#fbf8ef`). Before/after diff limited to the eyebrow glyph color on legal
pages; the hero lime eyebrow stays unchanged on `index.html`.

## Vote tally
failedToRefute: 3 / 3

- **Skeptic 1 (failed to refute):** Values verified: `style.css:156-158`
  `.eyebrow` color `var(--coral)`, font-size 0.76rem, font-weight 800; `:10`
  `--coral #e6654f`; `:1945` `.legal-page` background `#fffdf7 -> --paper #fbf8ef`.
  The legal-page eyebrow is NOT in `.hero` so the lime override (163-166) does
  not apply (768.png shows coral "PURESTREETS"). Recomputed WCAG contrast of
  `#e6654f` on `#fbf8ef` = 3.12:1 (and ~3.23:1 on `#fffdf7`) — both < 4.5:1.
  0.76rem = 12.16px; bold large-text threshold is 18.66px, so this is normal text
  requiring 4.5:1. AA failure confirmed. Secondary claim also checks out:
  `--muted #607068` on paper measures ~4.93:1 (passes).
- **Skeptic 2 (failed to refute):** CONFIRMED by independent calculation.
  `--coral #e6654f` (`style.css:10`) on the `.legal-page` top gradient stop
  `#fffdf7` -> `--paper #fbf8ef` (`style.css:1945`): computed relative
  luminances give 3.12:1 against `#fbf8ef` (3.22:1 against `#fffdf7`) — both
  < 4.5:1. Eyebrow is 0.76rem=12.16px weight 800 (`style.css:154-161`); root is
  default 16px (no html/body font-size), and 12.16px bold is below the 18.66px
  (14pt-bold) large-text threshold, so 4.5:1 applies and fails (coding-rules A3 /
  design-rules D11, SC 1.4.3). The claim that `--muted #607068` passes also
  checks out (~4.92:1). The fix is a scoped CSS color change to the subpage
  eyebrow role; `script.js` does not reference `.eyebrow` (grep clean), no
  copy/hook/asset impact, hero lime override (`style.css:163-166`) stays
  separate. Behavior-safe, real AA failure.
- **Skeptic 3 (failed to refute):** Measured, objective AA failure, not
  eyeballed. Independently computed WCAG contrast of `--coral #e6654f`
  (`style.css:10,156`) on the legal-page paper `#fbf8ef` (`style.css:1945`) =
  3.12:1, matching the claim. Eyebrow is 0.76rem (~12.16px; body sets no base
  font-size) weight 800 — below the 18.66px bold large-text threshold, so 4.5:1
  applies (SC 1.4.3 / coding-rules A3 / design-rules D11). 3.12 < 4.5 = fail.
  Hero lime override (`style.css:163-166`) is scoped to `.hero` and unaffected
  on legal pages.
</content>
