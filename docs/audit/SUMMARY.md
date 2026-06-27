# PureStreets — Anti-Slop Overhaul (audit-driven, no-build static site)

An evidence-driven overhaul of the hand-written static site. Every change traces
to a verified finding in `docs/audit/findings/` and every judgment call to a
logged decision in `docs/audit/decisions/`. The shipped site stays no-build
(single `style.css` + `script.js`, only Google Fonts + Tally.so as external deps).

> Mandate note: this run intentionally **supersedes** the prior "ZERO visual
> changes" `CLAUDE.md`. The change of mandate was surfaced to and chosen by the
> maintainer (full visual overhaul) and is logged at
> `docs/audit/decisions/phase0/conflict-resolution-full-overhaul.md`.

## Results at a glance

| Metric (avg, 9 pages) | Before | After | Δ |
|---|---|---|---|
| Lighthouse Performance | 90 | 91 | +1 (index +10) |
| Lighthouse Accessibility | 91 | **99** | **+8** |
| Lighthouse Best-Practices | 100 | 100 | = |
| Lighthouse SEO | 100 | 100 | = |
| axe violations (total) | 18 | **7** | **−11** |
| Console errors | 0 | 0 | = |
| Behavior flows passing | 8/8 | 8/8 | = |

All gates green: Lighthouse equal-or-better on every page (perf within run-to-run
noise tolerance of 3); axe lower on every page; zero console errors; all 8 frozen
JS flows verified end-to-end in a real browser; every hero clears the fixed
header at all four viewports.

## Findings

| Status | Count |
|---|---|
| Verified → **fixed** | **53** |
| Open / verified-not-fixed | 0 |
| Rejected (adversarial vote) | ~24 |
| Inspiration (reference) | 10 |
| Review (Phase 6) | 11 |

Findings were produced by a critic per page, then **3 independent skeptics tried
to refute each** — only findings ≥2 skeptics failed to refute were kept. Rejected
examples: "non-modular type scale", "badge outsizes H1", "tap targets <44px"
(already cleared the 24px AA minimum) — subjective or unsupported claims correctly
filtered out.

## Decisions

**31 decisions** logged under `docs/audit/decisions/` (schema: problem → ≥3 scored
alternatives → choice → how-to-reverse): orchestration 4, phase0 3, phase1 1,
phase2 2, phase3 3, phase5 15, phase7 3. Notable ones: full-overhaul vs
zero-change mandate; file-partitioned implementers (single `style.css`/`script.js`
make naive parallel worktrees conflict-prone); coral *label* token instead of
darkening the shared `--coral` (keeps coral-on-dark-green + decorative accents);
hero clearance via `--header-h` padding rather than capping the logo; applying the
two content fixes (grammar + a11y name) and extending canonical/OG to all 9 pages.

## What changed (15 themes, T1–T15)

- **T1 contrast** — new `--coral-text` (#b8432e, ≥4.5:1 AA on every eyebrow
  background incl. the warmer schedule bg) for eyebrows + label spans; shared
  `--coral` and dark-section eyebrows untouched. (8 findings)
- **T2 PureBot focus** — closed panel now `inert` in lockstep with `aria-hidden`
  (cleared before `input.focus()`); kills the `aria-hidden-focus` trap on all 9
  pages with no visual change. (8)
- **T3/T4 hero header clearance** — every subpage hero eyebrow + H1, and the index
  hero headline, now clear the fixed header at 375/768/1280/1440 (was clipped/
  occluded), via `--header-h`-derived top padding. (7)
- **T5 reduced-motion** — extended the existing `@media (prefers-reduced-motion)`
  block + JS counter guard so anchored scroll, reveals, counters, and hover/panel
  transitions all respect the user setting. (6)
- **T6 SEO head metadata** — canonical + Open Graph + Twitter + inline JSON-LD
  (Organization, plus Events on index, Persons on our-team) on **all 9 pages**;
  render-neutral, SEO stays 100. (9)
- **T7 performance** — index hero `preload` (LCP/perf 73→83), `will-change`
  released after reveal, our-team hero/logo `aspect-ratio` to reserve space (CLS).
- **T8–T15** — legal reading measure; contact iframe light background; work-hero
  word-break; volunteer orphan-arrow removal + ARIA `rowgroup`; mosques
  `role="img"`/aria fixes; team-contact tap target; two content corrections
  (PureBot greeting "i"→"I" ×9; charities iframe accessible name).

Full mapping: `docs/audit/findings/phase3/_themes.md` and
`docs/audit/plan/implementation-plan.md`.

## Lighthouse — per page (before → after)

| Page | Perf | A11y | Best | SEO |
|---|---|---|---|---|
| index | 73 → 83 (+10) | 91 → 95 | 100 | 100 |
| charities | 90 → 94 | 90 → 100 | 100 | 100 |
| contact | 94 → 95 | 90 → 100 | 100 | 100 |
| mosques-isocs | 82 → 86 | 93 → 100 | 100 | 100 |
| our-team | 94 → 93* | 90 → 100 | 100 | 100 |
| policies | 95 → 93* | 95 → 100 | 100 | 100 |
| terms | 93 → 93 | 95 → 100 | 100 | 100 |
| volunteer-month | 93 → 93 | 87 → 95 | 100 | 100 |
| work-with-us | 94 → 93* | 90 → 100 | 100 | 100 |
| **Average** | **90 → 91** | **91 → 99** | **100** | **100** |

\* −1/−2 perf are within Lighthouse run-to-run variance (those pages received only
render-neutral head metadata and/or a CLS-reducing `aspect-ratio` — nothing
perf-affecting). Accessibility rose on every page.

## Accessibility (axe-core, WCAG 2.2 AA)

Total violations **18 → 7** (−11). Per page: index 3→2, charities 2→1, contact
3→2, mosques 2→**0**, our-team 2→**0**, policies 1→**0**, terms 1→**0**,
volunteer 2→1, work 2→1. The remaining 7 are predominantly third-party Tally
**iframe** content (outside the site's control) and one intentional dark-section
eyebrow (kept per the design-rules decision).

## Behavior preserved (verified in a real browser)

`docs/audit/runs/tooling/flow-test.mjs` exercises all 8 frozen flows — **12/12
checks pass**: mobile nav, header scroll-state, scrollspy, animated counters
(incl. reduced-motion → final values immediately), reveal-on-scroll, PureBot
(inert-when-closed → opens → focuses input → replies → re-inert), ISOC
competition (counter + `{brothers,sisters}` localStorage shape + reset), volunteer
tracker (add + points `20+bags*5+hours*10+bonus`=60 + array shape + reset),
section anchors intact after orphan-arrow removal. Both `localStorage` keys and
every `data-*` hook unchanged.

`docs/audit/runs/tooling/hero-probe.mjs` (header-clearance): **32/32**.

## Process

Orchestrated as staged Claude Code dynamic workflows (scripts in
`docs/audit/plan/wf-*.workflow.js`), with the orchestrator running deterministic
capture/git/verification between them:
Phase 0 rules+research → Phase 1/3/4 critique→3× skeptic vote→consolidate→plan →
Phase 5 implement (9 HTML parallel + CSS + JS) → Phase 6 adversarial review →
Phase 7 fix loop (2 rounds) → deterministic gate + final adversarial review.

## Halt conditions & recoveries

No halt conditions hit. Two **transient API outages** (ConnectionRefused / 529
Overloaded) interrupted the critique workflow's back half; both were recovered by
**workflow resume** (cached agents replay instantly, only failed agents re-run) —
logged at `docs/audit/decisions/phase3/transient-failure-recovery.md`. No findings
or work were lost.

## Intentionally deferred / follow-ups

- **Canonical/OG origin** uses the GitHub-Pages default
  `https://purestreets1.github.io/Purestreets/` (derived from the git remote; the
  contact email is gmail, so no custom domain is confirmed). **Confirm/replace**
  the absolute base if a custom domain/CNAME is configured (single find-replace
  per page).
- **Structure modernization** (src/ split, font self-hosting, `@layer` retrofit)
  is proposed-only in `docs/audit/plan/structure.md` and intentionally NOT done
  this run (no-build + behavior-neutral mandate; see
  `decisions/phase0/architecture-modernization-scope.md`).
- Remaining axe items are third-party Tally iframe content (not site-controlled).

## Screenshots

Before/after full-page captures (4 viewports + interactive states per page) are in
`docs/audit/screenshots/` and `docs/audit/screenshots-after/` (gitignored binaries;
reproduce with `bash docs/audit/runs/tooling/run-audit.sh before|after`).

## Final review — VERDICT: CLEAN

An independent final adversarial reviewer (`docs/audit/findings/review/_final-review.md`)
confirmed the final state: Phase 7's diff is bounded to `style.css`; the darker
`--coral-text` only raises contrast on its (light-section) labels and reads as a
saturated coral, not muddy; every hero now shows its eyebrow + full H1 with no
overlap, clipping, or awkward whitespace; all interactive states render correctly;
and every gate passes (hero-probe 32/32, flow-test 12/12, 0 console errors, axe
after ≤ before per page, Lighthouse a11y/SEO/best not regressed, perf within ~3).

Combined with the deterministic gate, this is **two consecutive clean rounds** with
zero confirmed regressions — the fix loop terminates.

> Documented non-regression: in full-page screenshots the captured header bar
> renders taller/opaque than the live header, so a few topmost elements appear
> under it in the *captures*; the live-viewport hero-probe measures them as
> clearing (32/32), and they are identical-or-better than the before captures.
> A known capture-vs-live artifact, not a defect.
