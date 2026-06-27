---
id: perf-findings-grouping
phase: phase3
agent: dedup-consolidator
timestamp: 2026-06-27
chosen: B
---
## Problem
Three verified findings carry `scope: perf` but each is page-unique with a
distinct mechanism and none is a cross-page repeat: `index/hero-lcp-8s` (the hero
is a CSS `background-image` discovered only after CSS parse → LCP 8.3s, fix =
`<link rel=preload as=image fetchpriority=high>` for `hero-banner.jpg`),
`mosques-isocs/will-change-never-released` (`will-change` on the base
`[data-reveal]` selector, `style.css:691`, never cleared on ~41 nodes, fix = drop
it after the reveal), and `our-team/hero-images-unsized-cls` (logo + figure lack
`width`/`height`/`aspect-ratio`, fix = reserve space via CSS `aspect-ratio`).
The dedup brief is to merge *duplicates and cross-page repeats* — these are
neither. Should they be three standalone themes or one grouped theme?
Scoring: 0–10 per criterion, higher = better (risk/cost: higher = lower).

## Alternatives considered
### Option A — Three standalone perf themes
Maximally crisp per finding. But it inflates the theme list with three low-volume
hygiene items and gives the orchestrator three tiny single-finding themes to
schedule. Alignment 7 · Risk 7 · Cost 5 · Reversibility 8 — 27/40
### Option B — One "Core Web Vitals / perf hygiene" theme, three scoped sub-recs
Groups by shared `scope: perf` intent for orchestration economy while keeping the
three recommendations explicitly independent (no shared root cause). The theme's
touched-files union (`index.html`, `style.css`, `script.js`, `our-team.html`)
maps cleanly onto the existing file-ownership partition.
Alignment 8 · Risk 8 · Cost 8 · Reversibility 9 — 33/40
### Option C — Merge only the two `style.css`-touching ones, keep LCP separate
Pairs `will-change` + unsized-images (both touch `style.css`) and leaves LCP
alone. Arbitrary split (will-change also touches `script.js`); least coherent.
Alignment 5 · Risk 7 · Cost 6 · Reversibility 8 — 26/40

## Decision
Chose **B** (33/40). One theme `T7` subsumes the three perf findings as three
clearly-labelled, independent recommendations. This is an organizational grouping
by `scope: perf`, explicitly NOT a duplicate-merge — the `_themes.md` entry states
that the three sub-fixes share no root cause and can be implemented in any order.
Doing so keeps the theme list focused without misrepresenting the findings as the
"same" issue.

## How to reverse
If the planner prefers finer granularity, split `T7` back into three themes in
`_themes.md`; the subsumed finding ids (`hero-lcp-8s`, `will-change-never-released`,
`hero-images-unsized-cls`) are unchanged.
