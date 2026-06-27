# Pure Streets — Agent Rules

This is a hsigned static site (HTML/CSS/JS, no build). The visual
design is intentional and finished. Treat it as a spec, not a draft.

## Hard rules (never violate)
1. ZERO visual changes. Rendered output must be pixel-identical to the
   previous commit on every page, at 320 / 768 / 1024 / 1440 widths, in
   both default and any interactive states (hover, open menu, modals).
2. Do not touch: colors, fonts, font-sizes, font-weights, line-heights,
   letter-spacing, spacing/padding/margin, border-radius, shadows,
   backgrounds, gradients, z-index, transitions, animations, breakpoints,
   copy/text content, image/video/pdf assets, DOM order, class names that
   are referenced from CSS or JS, or any inline style values.
3. Do not "modernize," "refine," "polish," "unify," or "elevate" anything
   visual. No taste calls. No design opinions.
4. Do not rename files, move files, or change URLs/anchors.
5. Do not add frameworks, build tools, package managers, linters that
   auto-format, CSS resets, normalize.css, Tailwind, PostCSS, etc.
6. Preserve all behavior: counters, PureBot, competition tally + reset,
   volunteer add + points + reset, mobile hamburger, reveals, every
   localStorage key and its exact shape.

## What you ARE allowed to change (code hygiene only)
- Dead code removal (only if provably unreferenced from HTML/CSS/JS).
- De-duplication of identical JS helpers into one definition.
- Consistent quoting / indentation WITHIN a file (do not reflow whole
  files in a way that nukes git blame unless asked).
- Add missing `rel="noopener noreferrer"` on target="_blank" links.
- Add missing `alt=""` on decorative images, descriptive alt on
  meaningful ones (do NOT change which images exist).
- Add missing `lang`, `<meta charset>`, `<meta viewport>` if absent.
- Add `defer` to <script> tags only if it does not change execution order
  observably.
- Replace `var` with `let`/`const` where scope is provably equivalent.
- Extract magic strings (localStorage keys, selectors) to named constants
  in the SAME file — no new files unless strictly necessary.
- Fix actual bugs (e.g., XSS holes, broken event listeners). Flag each
  one in the PR description before fixing.

## Verification gate (must pass before every commit)
- `git diff --stat` shows only files you intended.
- For every HTML page, screenshot before vs after at 1440 and 375 widths
  using headless Chrome; diff must be 0 changed pixels (allow ≤2px of
  antialias noise only with explicit justification).
- All existing interactive flows still work; no new console errors or
  warnings on any page.
- No new network requests, no new external domains.

## How to work
- Make one small, reviewable change at a time. Commit per logical change.
- If a "cleanup" would require any visual change, STOP and ask. Default
  answer is no.
