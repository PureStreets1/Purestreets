---
id: architecture-modernization-scope
phase: phase0
agent: rules-architect
timestamp: 2026-06-27
chosen: C
---
## Problem
This run is a research-grounded visual overhaul of a hand-written, no-build site
(see `docs/audit/decisions/phase0/conflict-resolution-full-overhaul.md`). Current
2025-2026 best practice for static sites favours ES modules (`type="module"`),
CSS cascade layers (`@layer`), container queries, and splitting CSS/JS into
partials (MDN, CSS-Tricks — see `coding-rules.md` citations). But the shipped
architecture is exactly ONE classic `script.js` (462 lines) and ONE flat
`style.css` (2772 lines), loaded with `<script src="script.js">` and a plain
`<link rel="stylesheet">` (evidence: `index.html:13,240`; `wc -l` = 462/2772).
Three hard constraints pull the other way: (1) "Never add a build tool or runtime
dep"; (2) "Preserve all behavior, all flows end-to-end"; (3) the orchestrator's
implementation-partitioning decision keeps `style.css`/`script.js` as single
serialized files to avoid merge conflicts. How modern should the rules *require*
the code to become? This governs `coding-rules.md` and `structure.md`, so it must
be settled before either is written.

Scoring: 0-10 per criterion, higher = better (for risk/cost, higher = lower).

## Alternatives considered
### Option A — Freeze architecture (modern *values* only)
Keep one classic script + one flat stylesheet; allow only in-place token/value
modernization (`clamp()`, custom properties — both already present) and forbid
`@layer`, modules, file splits.
- Pros: zero structural regression risk; git blame intact; trivially reversible.
- Cons: leaves `script.js` as a classic global-scope script and `style.css` as a
  2772-line flat file — misses low-risk, idiomatic wins the overhaul could bank.
- Alignment 5 · Regression-risk 10 · Cost 9 · Reversibility 10 = **34/40**

### Option B — Full modernization (modules + layers + partials)
Mandate splitting `script.js` into ES modules, wrap all CSS in `@layer`, and
break `style.css` into partials (`@import` or concatenated).
- Pros: most "idiomatic" by 2025 standards; best long-term maintainability.
- Cons: `@layer` re-orders the cascade and CAN change rendering — direct conflict
  with "pixel-parity until a finding says otherwise"; ES-module split changes
  load/execution timing (modules are deferred + strict-mode, MDN) and risks the
  global `renderCompetition()`/`setHeaderState()` wiring; nukes blame on both core
  files; fights the orchestrator's single-file serialization decision.
- Alignment 7 · Regression-risk 2 · Cost 3 · Reversibility 5 = **17/40**

### Option C — Additive, behavior-neutral modernization; structure PROPOSE-only
Keep the single-file delivery (`style.css`, `script.js`). Permit modern features
ONLY where they are provably render- and behavior-neutral and resolve a logged
finding: e.g. adding a `@media (prefers-reduced-motion: reduce)` block, head-only
SEO/security meta, `defer` where execution order is unchanged. Forbid `@layer`
retrofits and module splits unless a verified finding proves zero visual/behavior
change. `structure.md` PROPOSES an idiomatic split but moves nothing.
- Pros: captures safe modern wins; honors no-build + behavior-preservation +
  single-file serialization; keeps blame; every change still gated by a finding.
- Cons: stops short of the "fully idiomatic" end-state; the proposed structure
  stays aspirational this run.
- Alignment 8 · Regression-risk 8 · Cost 7 · Reversibility 9 = **32/40**

## Decision
Chose **C (32/40)**. Option A scores marginally higher on pure safety but
under-serves the overhaul (alignment 5); Option B's `@layer`/module retrofits
directly threaten the pixel-parity-until-a-finding rule and the orchestrator's
single-file plan (regression-risk 2). C is the only option that lets the rules
endorse modern best practice while keeping every structural change finding-gated
and behavior-neutral. Consequence: `coding-rules.md` states modern features as
the target idiom but marks `@layer`-retrofit and ES-module splitting as
"propose-via-finding, do not apply blindly"; `structure.md` is explicitly a
proposal, not a migration.

## How to reverse
This decision only sets rule *strictness*. To reverse toward B, edit
`coding-rules.md` to mandate `@layer`/modules and have `structure.md` drive an
actual file move (then re-run later phases). To reverse toward A, delete the
"additive modern features" allowances from `coding-rules.md`. No shipped code
changes from this decision alone, so there is nothing in the site to revert.
