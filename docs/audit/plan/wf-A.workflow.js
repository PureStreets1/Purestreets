export const meta = {
  name: 'overhaul-A-rules-research',
  description: 'Phase 0+2: rules-architect + agents-author + slop & inspiration researchers (web-grounded, cited)',
  phases: [
    { title: 'Rules', detail: 'new CLAUDE.md, coding/design rules, SKILL, structure, agent defs' },
    { title: 'Research', detail: 'anti-slop checklist + 8-12 inspiration findings' },
  ],
}

const REPO = '/Users/haidertoha/Code/pure_streets'
const RULES = REPO + '/docs/audit/rules'

const MANIFEST = {
  type: 'object', additionalProperties: false,
  required: ['filesWritten', 'summary'],
  properties: {
    filesWritten: { type: 'array', items: { type: 'string' }, description: 'absolute paths written' },
    citations: { type: 'array', items: { type: 'string' }, description: 'source URLs used' },
    decisionsLogged: { type: 'array', items: { type: 'string' } },
    summary: { type: 'string' },
  },
}

const COMMON = `
You share NO context with other agents — only the filesystem under ${REPO}/docs/audit/.
OPERATING RULES (obey all):
- Before producing output, read any existing docs/audit/rules/* and decision logs relevant to you; state which you consulted in your summary.
- Every claim cites evidence: a repo file path, a screenshot path, or a source URL. No evidence => do not write the claim.
- Use WebSearch/WebFetch to ground best-practice claims in CURRENT 2025-2026 sources and cite the URLs. If web tools error, say so in your summary and proceed with clearly-labelled best-practice knowledge.
- If you must make a judgement call with >1 defensible option, write a DECISION file to docs/audit/decisions/<phase>/<slug>.md using this schema: frontmatter {id, phase, agent, timestamp: 2026-06-27, chosen}; then ## Problem, ## Alternatives considered (>=3 options, each Pros/Cons and a /40 score across alignment, regression-risk, cost, reversibility), ## Decision, ## How to reverse.
- Write real files with the Write tool using ABSOLUTE paths. Your returned text is data for the orchestrator, not a human message: return the JSON manifest only.
`

const results = await parallel([
  () => agent(`You are rules-architect (Phase 0).${COMMON}
GROUND YOURSELF FIRST by reading these repo files: ${REPO}/CLAUDE.md (the OLD spec, which is being intentionally replaced this run — see docs/audit/decisions/phase0/conflict-resolution-full-overhaul.md), ${REPO}/index.html, ${REPO}/script.js, the first ~140 lines of ${REPO}/style.css, and ${REPO}/mosques-isocs.html. Note the real external deps (Google Fonts, Tally.so) and the exact JS behaviours + localStorage keys.

Then WebSearch CURRENT (2025-2026) best practices for HAND-WRITTEN, no-build, multi-page static HTML/CSS/JS and cite URLs: idiomatic file layout; semantic HTML5; modern CSS (custom properties, @layer/cascade layers, container queries, clamp() type scales, logical properties); vanilla JS module patterns (type=module, defer, event delegation); accessibility WCAG 2.2 AA; Core Web Vitals (LCP/CLS/INP); SEO (meta, Open Graph, structured data, canonical); security (CSP, rel=noopener noreferrer, SRI for third-party assets). When a convention is genuinely ambiguous, log a DECISION.

WRITE these files (absolute paths):
1. ${REPO}/CLAUDE.md — the NEW project contract. It MUST contain, verbatim, these four hard constraints as bullets:
   - "Every change must resolve a finding in docs/audit/findings/."
   - "Every decision must be logged in docs/audit/decisions/."
   - "Preserve all behavior. All user flows must work end-to-end."
   - "Never add a build tool or runtime dep to the shipped site."
   Also include: what the project is (no-build static site, 9 pages, style.css + script.js); an audit-driven workflow section; and a BEHAVIOR-PRESERVATION section that lists every JS flow (mobile nav toggle, scrollspy, animated counters, reveal-on-scroll, PureBot keyword assistant, ISOC competition counter+reset, volunteer tracker add+points+reset) and the EXACT localStorage keys and value shapes — extract them precisely by reading script.js (there are two keys; one stores per-team {brothers,sisters} integers, one stores an array of volunteer entries with a points formula). Keep it tight and enforceable.
2. ${RULES}/coding-rules.md — the law all agents obey: concrete HTML / CSS / JS / a11y / perf / SEO / security rules, each with a one-line cited rationale. This is consumed by every later phase.
3. ${RULES}/design-rules.md — design-QUALITY heuristics for the critique phase: visual hierarchy, modular type scale, spacing rhythm/vertical rhythm, color usage + WCAG contrast, motion restraint, responsive behaviour and >=44px tap targets, photography/imagery use. (Do NOT duplicate the AI-slop tell list — that is a separate file owned by slop-researcher; cross-reference it.)
4. ${REPO}/.claude/skills/static-site/SKILL.md — distilled best practices in skill format: frontmatter with name and a one-line description, then a concise body an implementer can follow.
5. ${REPO}/docs/audit/plan/structure.md — PROPOSE an idiomatic target directory layout for this site (e.g. assets/ organisation, where partials/styles/scripts would live if split). PROPOSE ONLY — do not move any files; note that file moves are out of scope unless a verified finding requires one.
Return the manifest.`, { label: 'rules-architect', phase: 'Rules', schema: MANIFEST }),

  () => agent(`You are agents-author (Phase 0).${COMMON}
Write one Claude Code subagent definition file per role in this overhaul workflow, to ${REPO}/.claude/agents/<role>.md. Roles:
rules-architect, agents-author, slop-researcher, inspiration-researcher, page-mapper, critic, skeptic, dedup-consolidator, flow-mapper, planner, page-implementer, css-implementer, js-implementer, merger, reviewer, flow-verifier, summary-agent.
Each file format: YAML frontmatter with: name (kebab-case == filename), description (one line: when to use this agent), tools (a sensible subset, e.g. "Read, Grep, Glob, Write, Bash, WebSearch, WebFetch" — implementers also get Edit), and optionally model. Then a body that is the agent's system prompt: its MANDATE, the docs/audit/* inputs it must read first, the exact outputs it writes, and the shared operating rules (read rules/* + relevant findings first and cite them; every claim cites evidence; log decisions before acting; never add a build/runtime dep to the shipped site; never change behavior/copy/assets without a verified finding). Make each accurate to THIS pipeline and concise (~30-55 lines). Read ${REPO}/docs/audit/decisions/orchestration/*.md and ${REPO}/CLAUDE.md (if already written) to stay consistent. Return the manifest (filesWritten = all 17 paths).`, { label: 'agents-author', phase: 'Rules', schema: MANIFEST }),

  () => agent(`You are slop-researcher (Phase 2 / R1).${COMMON}
WebSearch/WebFetch current (2025-2026) writing on how to recognise AI-generated / templated website design — the visual "tells" of slop. Gather concrete, sourced patterns, e.g.: generic centered hero with a gradient/blob backdrop; three- or four-column icon-grid "features"; pastel glassmorphism; uniform oversized border-radius on every card; vague lorem-ish marketing copy; inconsistent or non-modular type scale; predictable identical hover states; emoji used as iconography; everything center-aligned; over-rounded buttons; default system-ish spacing with no rhythm; stocky gradient buttons; excessive drop shadows. For each, record the SOURCE URL.
WRITE ${RULES}/anti-slop-checklist.md: a numbered checklist where each item has (a) the tell, (b) how to DETECT it on a live page (what to look for in screenshots/CSS/DOM), (c) the fix direction, (d) citation(s). This is a primary input to the Phase 3 critics. When sources conflict, log a DECISION to docs/audit/decisions/phase2/. Return the manifest.`, { label: 'slop-researcher', phase: 'Research', schema: MANIFEST }),

  () => agent(`You are inspiration-researcher (Phase 2 / R2).${COMMON}
Find 8-12 genuinely well-designed charity / community / grassroots / faith / mutual-aid org websites (real orgs, NOT award-bait portfolio pieces, NOT generic templates). Use WebSearch/WebFetch; verify each site is real and cite its URL.
For EACH site write ${REPO}/docs/audit/findings/inspiration/<slug>.md with frontmatter {id: <slug>, phase: phase2, agent: inspiration-researcher, status: verified, scope: design, source: <url>} then sections: ## What it is, ## What works (type, restraint, color, density, motion, photography — be specific and concrete), ## One pattern to adapt (ONE concrete, copyable-in-spirit-not-in-pixels idea this grassroots litter-picking site could use). Keep each ~25-40 lines. This site (PureStreets) is a faith-inspired community litter-picking movement — favour inspirations relevant to grassroots/community/faith/volunteering. When choosing between comparable sites, log a DECISION to docs/audit/decisions/phase2/. Return the manifest (filesWritten = each inspiration file).`, { label: 'inspiration-researcher', phase: 'Research', schema: MANIFEST }),
])

log('Workflow A complete: ' + results.filter(Boolean).length + '/4 agents returned')
return { agents: results }
