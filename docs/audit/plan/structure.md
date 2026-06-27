# Proposed Directory Structure — PureStreets (PROPOSE ONLY)

**This is a proposal, not a migration.** Per `/CLAUDE.md`, file moves/renames are
**out of scope** unless a verified finding in `docs/audit/findings/` requires one
(renames break inbound links, anchors, and scrollspy — `coding-rules.md` S5).
Rule strictness for any structural change is set by
`docs/audit/decisions/phase0/architecture-modernization-scope.md` (chosen:
additive, behavior-neutral; single delivered `style.css`/`script.js`).

## Current layout (verified)
```
pure_streets/
├── index.html  mosques-isocs.html  volunteer-month.html
├── charities.html  work-with-us.html  our-team.html
├── contact.html  policies.html  terms.html      # 9 pages, all at root
├── style.css                                    # ~2772 lines, flat
├── script.js                                    # ~462 lines, one classic script
├── CLAUDE.md
├── assets/
│   ├── img/   # favicon.png logo.png hero-banner.jpg figure.png video-poster.jpg
│   ├── video/ # sisters-southall.mp4
│   └── docs/  # community-litter-pick-guide.pdf
└── docs/audit/                                   # this audit (gitignored runs/)
```
Evidence: `ls` of repo root; `find assets -type f`; `wc -l style.css script.js`.

## Assessment
A flat root of `.html` pages plus an organized `assets/` tree is already an
**idiomatic no-build multi-page layout** — pages resolve relative URLs simply,
there is no router, and assets are namespaced by type. The asset organization
(`img/`, `video/`, `docs/`) is good and should stay. The only arguable
non-idealities are the two large single files (`style.css`, `script.js`). Source:
hand-authored static sites favour direct, build-free file resolution over nested
app trees (https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content;
no-build module guidance https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules).

## Proposed target layout (aspirational — adopt only via a finding)
```
pure_streets/
├── *.html                      # unchanged — keep pages at root (no router, no rename)
├── style.css                   # KEEP as the single delivered stylesheet
├── script.js                   # KEEP as the single delivered script
├── assets/
│   ├── img/                    # (unchanged)
│   ├── video/                  # (unchanged)
│   ├── docs/                   # (unchanged)
│   └── fonts/                  # OPTIONAL: only if self-hosting Manrope (see note)
└── src/                        # OPTIONAL author-time sources, IF a split is ever justified
    ├── styles/                 # tokens.css, base.css, layout.css, components.css, pages/*.css
    └── scripts/                # nav.js, reveal.js, counters.js, purebot.js,
                                #   competition.js, volunteer.js, main.js (ES modules)
```

### Notes on the optional pieces (each gated by a finding + decision)
- **`src/styles/` and `src/scripts/`** are shown to illustrate *where* a future
  split would live. They are **not** adopted this run: splitting `style.css` into
  `@import`ed partials adds render-blocking requests (`coding-rules.md` C8) and a
  flat-file split that re-orders rules can change rendering; splitting `script.js`
  into ES modules changes load timing and the global wiring of
  `renderCompetition()`/`setHeaderState()` (`coding-rules.md` J5). If ever done,
  it must stay no-build — native `<link>`s or native `type="module"` imports, no
  bundler — and be proven render/behavior-neutral first.
- **`assets/fonts/`** would exist only if a finding chose to **self-host Manrope**
  (to drop the `fonts.googleapis.com`/`fonts.gstatic.com` origins and remove a
  third-party request). That is a real, defensible option but a network/behavior
  change — log a decision before adopting; otherwise keep the current Google
  Fonts `<link>` (`index.html:8-10`).
- **Page partials (shared header/nav/footer/PureBot):** the same chrome is copied
  into all 9 pages (verified: identical `<header>`/`<footer>`/`.purebot` blocks in
  `index.html` and `mosques-isocs.html`). A no-build site **cannot** DRY this
  without either a build step (forbidden) or runtime JS injection (which would
  change DOM timing and risk the flows). Recommendation: **keep the duplication**;
  treat drift between copies as the thing to police, not the duplication itself.

## Recommendation for THIS run
Change **no** file locations. Keep pages at root, keep the single `style.css` and
`script.js`, keep `assets/` as-is. Treat everything in the "Proposed target
layout" as a backlog the team can adopt later, each item behind its own finding
and decision. This honors the no-build mandate, the single-file serialization in
`decisions/orchestration/implementation-partitioning.md`, and preserves git blame
on the two core files.
