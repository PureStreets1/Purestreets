export const meta = {
  name: 'overhaul-C-implement',
  description: 'Phase 5: file-partitioned implementers — 9 HTML (parallel) -> style.css -> script.js',
  phases: [
    { title: 'HTML', detail: '9 page-implementers (disjoint files): head-meta, greeting, page-specific a11y' },
    { title: 'CSS', detail: 'single style.css pass: contrast, header overlap, reduced-motion, perf, measure' },
    { title: 'JS', detail: 'script.js: PureBot inert + reduced-motion counter' },
  ],
}

const REPO = '/Users/haidertoha/Code/pure_streets'
// Canonical/OG origin derived from the git remote (github.com/PureStreets1/Purestreets).
// The contact email is gmail (no confirmed custom domain), so this is the GitHub Pages
// default. Implementers must flag it as an assumption to confirm before production.
const ORIGIN = 'https://purestreets1.github.io/Purestreets/'

const IMPL = {
  type: 'object', additionalProperties: false,
  required: ['filesChanged', 'findingsFixed', 'diffSummary', 'acceptanceSelfCheck'],
  properties: {
    filesChanged: { type: 'array', items: { type: 'string' } },
    findingsFixed: { type: 'array', items: { type: 'string' } },
    decisionsLogged: { type: 'array', items: { type: 'string' } },
    diffSummary: { type: 'string' },
    acceptanceSelfCheck: { type: 'string', description: 'how each acceptance criterion was met' },
    behaviorPreserved: { type: 'string', description: 'confirmation no localStorage/data-*/anchor/asset changed' },
    notes: { type: 'string' },
  },
}

const COMMON = `You share NO context with other agents — only the filesystem under ${REPO}.
READ FIRST and name in your output: ${REPO}/docs/audit/plan/implementation-plan.md (your workstream section), your assigned finding files, ${REPO}/docs/audit/rules/coding-rules.md, design-rules.md, anti-slop-checklist.md, and ${REPO}/CLAUDE.md (especially BEHAVIOR-PRESERVATION).
RULES:
- Make the SMALLEST change that satisfies each finding's acceptance criteria. NO scope beyond your assigned findings.
- Before editing, enumerate >=3 options for your most consequential judgment call, score them (alignment/regression-risk/cost/reversibility, /40), write a DECISION to ${REPO}/docs/audit/decisions/phase5/<slug>.md (frontmatter {id,phase:phase5,agent,timestamp:2026-06-27,chosen}; Problem; Alternatives; Decision; How to reverse), then implement the winner. A trivial mechanical change that mirrors a sibling may reference that sibling's decision instead of duplicating.
- FROZEN (never change): localStorage keys/shapes, data-* hooks read by script.js, internal #anchors, Tally form ids/URLs, filenames, image/video/pdf assets. Preserve all behavior.
- Edit ONLY your owned file(s). Do NOT git commit. Do NOT start servers or run captures.
- After editing, set each finding you resolved from "status: verified" to "status: fixed" in its finding .md frontmatter (Edit). Only flip findings located in your assigned set.
- Return the IMPL JSON (your text is data, not a message).`

const HTML_PAGES = [
  { stem: 'index', extra: `Also: add hero LCP preload <link rel="preload" as="image" href="assets/img/hero-banner.jpg" fetchpriority="high"> in <head>. JSON-LD: Organization (site-wide) AND Event for the visible pickup cards (index.html:101-126). index canonical = ${ORIGIN}` },
  { stem: 'charities', extra: `Also: fix the Tally iframe title "PureStreets contact form" -> "PureStreets charity partner form" (charities.html:82) [finding iframe-title-mislabel].` },
  { stem: 'contact', extra: `Head-meta + greeting only.` },
  { stem: 'our-team', extra: `JSON-LD Organization plus optional Person entries for the visible team cards.` },
  { stem: 'terms', extra: `Head-meta + greeting only.` },
  { stem: 'volunteer-month', extra: `Also: remove the 3 orphan <a class="section-arrow ..."> nodes (~lines 51-53, 85-87, 129-131) including their data-reveal attrs — the section IDs live on the <section> elements, so deep-links/scrollspy still work [finding section-arrow-invisible-zero-size]. Add role="rowgroup" to [data-volunteer-rows] (~line 80); KEEP the data-volunteer-empty hook; do NOT convert to a native <table> [finding aria-table-required-children].` },
  { stem: 'work-with-us', extra: `Head-meta + greeting only.` },
  { stem: 'mosques-isocs', extra: `Also: add role="img" to .poster-scenes (~line 76) so its aria-label is valid; remove the redundant aria-label on .campaign-hero__video (~line 48) OR give it role="group" [finding div-aria-label-prohibited]. This page owns the shared purebot-greeting-lowercase-i finding — flip ITS status here.` },
  { stem: 'policies', extra: `Head-meta (authorised by decisions/phase5/extend-t6-canonical-to-all-pages.md) + greeting only.` },
]

function pagePrompt(p) {
  return `You are the page-implementer for ${p.stem}.html (Phase 5, WS-HTML-${p.stem}). ${COMMON}
Your owned file: ${REPO}/${p.stem}.html. Your findings: every .md in ${REPO}/docs/audit/findings/phase3/${p.stem}/ that is status: verified (read them).
TASKS:
1. HEAD METADATA (all pages): add a self-referential <link rel="canonical">, Open Graph (og:title/description/type/url/image), twitter:card, and minimal INLINE JSON-LD. Origin base = ${ORIGIN} (canonical/og:url = origin + "${p.stem}.html"; og:image = origin + "assets/img/hero-banner.jpg"). This is the GitHub-Pages default derived from the git remote — note in your decision that it must be confirmed/replaced if a custom domain is used. Reuse existing page copy (title/description). JSON-LD must be inline (no external fetch). HEAD-ONLY, render-neutral.
2. GREETING (all pages): change the PureBot static greeting "how can i help you?" -> "how can I help you?" in this file's purebot-message--bot line [authorised by decisions/phase5/apply-t13-content-items.md]. Do not touch the mosques-owned greeting finding status unless you are the mosques implementer.
3. PAGE-SPECIFIC: ${p.extra}
Acceptance: head validates (canonical+OG+JSON-LD present); Lighthouse SEO must stay 100; ZERO visual diff at 375/1440 (head + a11y attrs are render-neutral; the only intended pixel changes are global and come from WS-CSS, not you); no new console error, no new network request/domain. Preserve all 8 JS flows and both localStorage shapes. Return IMPL.`
}

const cssPrompt = `You are the css-implementer (Phase 5, WS-CSS — single coherent pass). ${COMMON}
Your owned file: ${REPO}/style.css ONLY. Implement the WS-CSS table in implementation-plan.md (themes T1, T3, T4, T5-css, T7.2, T7.3, T8, T9, T10, T15) using the EXISTING selectors/line-refs named there. Key constraints from the plan:
- T1 coral contrast: add a NEW darker label token (e.g. --coral-text >=4.5:1 on #fbf8ef/#ffffff/#fffdf7) and apply to .eyebrow + the six named label spans. DO NOT darken the shared --coral token; DO NOT touch the hero lime eyebrow override.
- T3 subpage header overlap: use the HERO-PADDING lever (raise padding-block-start on the 6 named hero rules, ideally via a shared --header-h custom property; add scroll-padding/scroll-margin-top for volunteer anchors). This keeps .brand img UNTOUCHED so it cannot collide with T7.3.
- T4 index hero clip: disjoint selectors from T3 (align-items end->start / reduce translateY / cap H1 max) so the headline is never top-clipped at short viewport heights.
- T5 (css half): EXTEND the existing @media (prefers-reduced-motion: reduce) block (style.css:1504-1513) — do not add a second query — covering scroll-behavior + the named hover/panel transitions.
- T7.2 will-change: move it onto [data-reveal]:not(.is-visible). T7.3: reserve our-team hero/logo space via aspect-ratio + height:auto (binding constraint: global img has no height:auto, style.css:30-33; reproduce current rendered size exactly).
- T8 legal measure (.legal-copy ~60-70ch); T9 contact iframe light bg; T10 work-hero word-break (no mid-word split, keep copy); T15 team-contact >=44px hit area without changing the visible pill or card min-height.
Meet ALL WS-CSS acceptance criteria. The ONLY file in your git diff must be style.css. These ARE finding-approved pixel changes — that is expected. Default-motion users must stay pixel/behaviour-identical. Return IMPL.`

const jsPrompt = `You are the js-implementer (Phase 5, WS-JS — runs last). ${COMMON}
Your owned file: ${REPO}/script.js ONLY. Implement the WS-JS table in implementation-plan.md (T2 + JS half of T5):
- T2 PureBot focus: in setOpen() (script.js:249-255) set panel.inert = !isOpen IN LOCKSTEP with aria-hidden, BEFORE the "if (isOpen) input.focus()" call; initialise panel.inert = true in initPureBot() (panel ships closed). Keep .is-open / aria-hidden / aria-expanded / every data-purebot-* hook and the open animation intact. This one change fixes PureBot focus on all 9 pages.
- T5 counter: in the #impact counter (script.js:51-71), when matchMedia('(prefers-reduced-motion: reduce)').matches write the final values (42+/18+/96+) immediately instead of running the setInterval tick; preserve the data-count contract and once-only semantics.
Acceptance: with PureBot closed, Tab never enters the panel (axe aria-hidden-focus gone); open/close, 3 quick prompts, both link-outs, free-text submit (~180ms), and "open focuses the input" all still work; reduced-motion shows final counters immediately, default still ticks 0->target once. The ONLY file in your git diff must be script.js. Both localStorage keys still read in their documented shape. Return IMPL.`

// ---- Phase 5: HTML (parallel, disjoint files) -> CSS -> JS ----
phase('HTML')
const htmlResults = await parallel(HTML_PAGES.map((p) => () =>
  agent(pagePrompt(p), { label: `impl:${p.stem}`, phase: 'HTML', schema: IMPL })))
log(`HTML done: ${htmlResults.filter(Boolean).length}/9 page-implementers; findings fixed ${htmlResults.filter(Boolean).reduce((n, r) => n + (r.findingsFixed?.length || 0), 0)}`)

phase('CSS')
const cssResult = await agent(cssPrompt, { label: 'css-implementer', phase: 'CSS', schema: IMPL })
log(`CSS done: ${cssResult?.findingsFixed?.length || 0} findings fixed`)

phase('JS')
const jsResult = await agent(jsPrompt, { label: 'js-implementer', phase: 'JS', schema: IMPL })
log(`JS done: ${jsResult?.findingsFixed?.length || 0} findings fixed`)

return { htmlResults, cssResult, jsResult }
