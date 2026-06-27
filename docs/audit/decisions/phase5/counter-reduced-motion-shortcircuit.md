---
id: counter-reduced-motion-shortcircuit
phase: phase5
agent: WS-JS
timestamp: 2026-06-27
chosen: A
---
## Problem
Finding `index/reduced-motion-incomplete` (JS half) requires the `#impact`
count-up (`script.js:51-71`) to skip the `setInterval` tick and show the final
values immediately when `matchMedia('(prefers-reduced-motion: reduce)').matches`,
while **preserving the `data-count` contract** (HTML 42/18/96 → "42+/18+/96+")
and the **once-only** semantics (the `counterObserver` fires once then
`observer.disconnect()`s). The `inert`/PureBot half of WS-JS is fully prescribed
by the task brief and planner fork **F-3** (`implementation-plan.md` §"Planner
fork decisions") — `panel.inert = !isOpen` in lockstep with `aria-hidden`,
init `panel.inert = true` — so it carries no judgment latitude and is implemented
as specified, not re-litigated here. This decision resolves only the genuine
fork: **how** to read the media query and **what** to write. Scoring 0–10 per
criterion, higher = better.

## Alternatives considered
### Option A — Read `matchMedia` once inside the observer callback; branch in the per-counter loop; write `${target}+`
Evaluate `const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion:
reduce)').matches;` at the top of the (already once-firing) intersection handler,
then in `counters.forEach` early-return with `counter.textContent = `${target}+``
where `target = Number(counter.dataset.count)`. The value is *derived from*
`data-count`, so the contract is structurally preserved (no literal duplication);
`observer.disconnect()` is untouched so once-only holds; the default-motion path
is byte-for-byte unchanged. The read reflects the user's setting at the moment the
section scrolls into view (the only moment that matters, since the observer then
disconnects). Smallest contiguous diff, lowest blast radius.
- Alignment 10 · Regression risk 9 · Cost 9 · Reversibility 10 — **38/40**

### Option B — Module-scope `const prefersReducedMotion` evaluated at script load
Hoist one shared constant near the top-level refs (`script.js:1-12`) and consume
it in the counter branch. Works, but evaluates reduced-motion at parse time, not
at view time — staler if the OS setting flips mid-session — and introduces a
broader-scoped global than the single consumer needs, spreading the change across
two regions of the file for no behavioral gain.
- Alignment 7 · Risk 8 · Cost 8 · Reversibility 9 — **32/40**

### Option C — Per-counter `matchMedia` call and/or hardcoded "42+/18+/96+" literals
Call `matchMedia` inside each `forEach` iteration and/or write the literal strings
`"42+"`, `"18+"`, `"96+"`. Hardcoding **breaks the `data-count` contract** the
finding explicitly protects (JS would silently diverge if the HTML numbers ever
change) and re-querying per counter is wasteful. Rejected on correctness.
- Alignment 4 · Risk 5 · Cost 8 · Reversibility 9 — **26/40**

## Decision
Chose **A** (38/40). It is the smallest change that satisfies the acceptance
("reduced-motion shows final counters immediately; default still ticks 0→target
once"), keeps the final value *derived* from `data-count` (so the contract is
preserved by construction, not by a parallel literal), leaves the once-only
`observer.disconnect()` and the entire default-motion tick path untouched, and
reads the user's current preference at the single moment the counters would
otherwise animate. The PureBot `inert` change is applied exactly as the task and
fork F-3 mandate (`panel.inert = !isOpen` after the `aria-hidden` line and before
`input.focus()`; `panel.inert = true` at `initPureBot()` since the panel ships
closed) — keeping `.is-open`/`aria-hidden`/`aria-expanded`/all `data-purebot-*`
hooks and the open animation intact.

## How to reverse
Counter: delete the `const prefersReducedMotion = …` line and the
`if (prefersReducedMotion) { counter.textContent = `${target}+`; return; }` guard
inside `counters.forEach`, restoring the unconditional `setInterval` tick.
PureBot: delete the `panel.inert = true;` init line in `initPureBot()` and the
`panel.inert = !isOpen;` line in `setOpen()`.
