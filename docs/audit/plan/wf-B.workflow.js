export const meta = {
  name: 'overhaul-B-critique-plan',
  description: 'Phase 1/3/4: critic -> 3 skeptic vote -> writer per page, then consolidate + flow-map + plan',
  phases: [
    { title: 'Critique', detail: 'critic per page -> candidate findings (+ page map)' },
    { title: 'Verify', detail: '3 adversarial skeptics per page; keep >=2 fail-to-refute; writer persists' },
    { title: 'Consolidate', detail: 'dedup into site themes + site-wide flow graph' },
    { title: 'Plan', detail: 'file-partitioned implementation plan' },
  ],
}

const REPO = '/Users/haidertoha/Code/pure_streets'
const PAGES = ['index.html', 'charities.html', 'contact.html', 'mosques-isocs.html', 'our-team.html', 'policies.html', 'terms.html', 'volunteer-month.html', 'work-with-us.html']

const COMMON = `You share NO context with other agents — only the filesystem under ${REPO}.
OPERATING RULES (obey all):
- FIRST read these and name them in your output: ${REPO}/docs/audit/rules/coding-rules.md, design-rules.md, anti-slop-checklist.md, and ${REPO}/CLAUDE.md. Skim ${REPO}/docs/audit/findings/inspiration/ for adaptable patterns.
- Every claim cites concrete evidence: a repo file path (with line refs where possible), a screenshot path, an axe/lighthouse JSON path, or a source URL. No evidence => drop the claim.
- Respect behavior: never propose changing a localStorage key/shape, a data-* hook used by script.js, copy/text, or assets unless it is itself the finding and justified. The site must stay no-build (no framework/runtime dep).
- Your returned text is DATA for the orchestrator, not a human message. Return ONLY the requested JSON.`

const CANDIDATES = {
  type: 'object', additionalProperties: false,
  required: ['page', 'pageMap', 'candidates'],
  properties: {
    page: { type: 'string' },
    pageMap: {
      type: 'object', additionalProperties: false,
      required: ['purpose', 'flows', 'ctas', 'jsBehaviors'],
      properties: {
        purpose: { type: 'string' },
        flows: { type: 'array', items: { type: 'string' } },
        ctas: { type: 'array', items: { type: 'string' } },
        jsBehaviors: { type: 'array', items: { type: 'string' } },
      },
    },
    candidates: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false,
        required: ['id', 'title', 'severity', 'scope', 'claim', 'evidence', 'whyItMatters', 'recommendedAction', 'howToVerify'],
        properties: {
          id: { type: 'string', description: 'kebab slug, unique within page' },
          title: { type: 'string' },
          severity: { enum: ['low', 'med', 'high'] },
          scope: { enum: ['code', 'design', 'a11y', 'perf', 'content', 'structure'] },
          claim: { type: 'string' },
          evidence: { type: 'array', items: { type: 'string' } },
          whyItMatters: { type: 'string' },
          recommendedAction: { type: 'string' },
          howToVerify: { type: 'string' },
        },
      },
    },
  },
}

const VERDICTS = {
  type: 'object', additionalProperties: false, required: ['verdicts'],
  properties: {
    verdicts: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false, required: ['id', 'refuted', 'reason'],
        properties: {
          id: { type: 'string' },
          refuted: { type: 'boolean', description: 'true = the candidate is wrong/unsupported/subjective/would break behavior' },
          reason: { type: 'string' },
          confidence: { enum: ['low', 'med', 'high'] },
        },
      },
    },
  },
}

const MANIFEST = { type: 'object', additionalProperties: false, required: ['filesWritten', 'summary'], properties: { filesWritten: { type: 'array', items: { type: 'string' } }, summary: { type: 'string' } } }

const PLAN = {
  type: 'object', additionalProperties: false, required: ['workstreams', 'dependencyOrder', 'notes'],
  properties: {
    workstreams: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false,
        required: ['id', 'file', 'findingIds', 'summary', 'acceptanceCriteria', 'risk'],
        properties: {
          id: { type: 'string', description: 'e.g. WS-CSS, WS-JS, WS-HTML-index' },
          file: { type: 'string', description: 'primary file this workstream owns' },
          findingIds: { type: 'array', items: { type: 'string' } },
          summary: { type: 'string' },
          acceptanceCriteria: { type: 'array', items: { type: 'string' } },
          risk: { type: 'string' },
        },
      },
    },
    dependencyOrder: { type: 'array', items: { type: 'string' } },
    notes: { type: 'string' },
  },
}

function criticPrompt(stem) {
  return `You are the critic for the page "${stem}.html". ${COMMON}
EVIDENCE TO EXAMINE:
- Screenshots (multiple viewports 375/768/1280/1440 + interactive states): view files in ${REPO}/docs/audit/screenshots/${stem}/
- Source: ${REPO}/${stem}.html , ${REPO}/style.css , ${REPO}/script.js (read the parts relevant to this page)
- Runtime data: ${REPO}/docs/audit/runs/before/axe/${stem}.json (a11y violations), ${REPO}/docs/audit/runs/before/network/${stem}.json, console/${stem}.json, and ${REPO}/docs/audit/runs/before/lighthouse-summary.json (this page's perf/a11y/best/seo).

PRODUCE 6-9 of the HIGHEST-VALUE candidate findings. Cover, where applicable: visual hierarchy; modular type scale; color usage + WCAG 2.2 contrast; spacing/vertical rhythm; responsive behaviour (font scaling, layout at 375, tap targets >=44px); motion restraint; copy; accessibility (cross-reference the axe JSON — turn real violations into findings); performance (cross-reference lighthouse; the home page perf is the weakest); DOM/code smells; and specific anti-slop-checklist matches. Prefer findings that are concrete, evidence-backed, and actionable over vague taste. Each candidate needs evidence (cite screenshot path / CSS line / axe id). Also output a concise pageMap (purpose, user flows, CTAs, JS behaviours). Return the CANDIDATES JSON.`
}

function skepticPrompt(stem, candidates, i) {
  const lenses = [
    'CORRECTNESS lens: is the claim factually right against the actual CSS/HTML values and the screenshots? Verify exact values in style.css/the HTML — refute anything not borne out by the source.',
    'BEHAVIOR/REGRESSION lens: would acting on this break a JS flow, a data-* hook, a localStorage key/shape, copy, or an asset, or violate CLAUDE.md / no-build? Refute findings whose fix is unsafe or whose premise misreads behavior.',
    'SLOP/SUBJECTIVITY lens: is this a real, defensible design problem grounded in the rules/anti-slop-checklist, or a subjective taste call / non-issue / already-fine? Refute taste-only or unsupported claims.',
  ]
  return `You are skeptic #${i + 1} of 3 for "${stem}.html", trying to REFUTE candidate findings. ${COMMON}
Apply primarily this ${lenses[i]}
For EACH candidate below, decide refuted=true (wrong / unsupported / subjective / unsafe / already-fine) or refuted=false (a real, evidence-backed, safe-to-fix problem). Verify against the source of truth: ${REPO}/${stem}.html, ${REPO}/style.css, ${REPO}/script.js, ${REPO}/docs/audit/runs/before/axe/${stem}.json, and screenshots in ${REPO}/docs/audit/screenshots/${stem}/. Be adversarial: default to refuted=true when genuinely uncertain. Return a verdict for EVERY candidate id.
CANDIDATES:
${JSON.stringify(candidates)}
Return the VERDICTS JSON.`
}

function writerPrompt(stem, pageMap, verified, rejected) {
  return `You are the writer for "${stem}.html". ${COMMON}
Persist the adversarially-verified results to disk. Tasks:
1. For EACH verified finding below, write ${REPO}/docs/audit/findings/phase3/${stem}/<id>.md using the FINDINGS schema: frontmatter {id, phase: phase3, agent: critic, status: verified, severity, scope, evidence: [paths], source: internal}; then ## Claim, ## Why it matters, ## Recommended action, ## How to verify it's fixed, ## Vote tally (failedToRefute/total + the skeptics' reasons).
2. Write ${REPO}/docs/audit/findings/phase3/${stem}/_rejected.md listing rejected candidates with their tallies + reasons (one short block each).
3. Write ${REPO}/docs/audit/findings/phase3/${stem}/_page-map.md with the page purpose, user flows, CTAs, JS behaviours.
Use ABSOLUTE paths. Return MANIFEST (filesWritten + one-line summary with verified/rejected counts).
VERIFIED (${verified.length}):
${JSON.stringify(verified)}
REJECTED (${rejected.length}):
${JSON.stringify(rejected)}
PAGE MAP:
${JSON.stringify(pageMap)}`
}

async function critiquePage(page) {
  const stem = page.replace('.html', '')
  const c = await agent(criticPrompt(stem), { label: `critic:${stem}`, phase: 'Critique', schema: CANDIDATES })
  if (!c || !Array.isArray(c.candidates) || !c.candidates.length) {
    log(`critic:${stem} produced no candidates`)
    return { page: stem, verified: [], rejected: [], verifiedCount: 0 }
  }
  const skeptics = (await parallel([0, 1, 2].map((i) => () =>
    agent(skepticPrompt(stem, c.candidates, i), { label: `skeptic${i + 1}:${stem}`, phase: 'Verify', schema: VERDICTS })
  ))).filter(Boolean)

  const byId = {}
  skeptics.forEach((s) => (s.verdicts || []).forEach((v) => { (byId[v.id] ||= []).push(v) }))

  const verified = [], rejected = []
  for (const cand of c.candidates) {
    const vs = byId[cand.id] || []
    const failedToRefute = vs.filter((v) => v.refuted === false).length
    const tally = { failedToRefute, total: vs.length, reasons: vs.map((v) => ({ refuted: v.refuted, reason: v.reason })) }
    if (failedToRefute >= 2) verified.push({ ...cand, tally })
    else rejected.push({ ...cand, tally })
  }
  log(`${stem}: ${verified.length} verified / ${rejected.length} rejected (of ${c.candidates.length})`)
  await agent(writerPrompt(stem, c.pageMap, verified, rejected), { label: `writer:${stem}`, phase: 'Verify', schema: MANIFEST })
  return { page: stem, verified: verified.map((v) => v.id), rejected: rejected.map((r) => r.id), verifiedCount: verified.length }
}

// ---- Phase 1/3: critique + adversarial verify (barrier: need all findings before consolidate/plan) ----
const pageResults = await parallel(PAGES.map((p) => () => critiquePage(p)))
const totalVerified = pageResults.filter(Boolean).reduce((n, r) => n + r.verifiedCount, 0)
log(`Critique done: ${totalVerified} verified findings across ${PAGES.length} pages`)

// ---- Consolidate + flow graph (parallel: independent) ----
const [themes, siteMap] = await parallel([
  () => agent(`You are dedup-consolidator. ${COMMON}
Read ALL verified findings in ${REPO}/docs/audit/findings/phase3/*/ (the per-id .md files, not _rejected/_page-map). Merge duplicates and cross-page repeats into site-wide THEMES. Write ${REPO}/docs/audit/findings/phase3/_themes.md: for each theme give a title, the finding ids it subsumes, the single unified recommendation, and the file(s) it touches (style.css / script.js / specific HTML). If a merge is non-obvious, log a DECISION to ${REPO}/docs/audit/decisions/phase3/. Return MANIFEST.`, { label: 'dedup-consolidator', phase: 'Consolidate', schema: MANIFEST }),
  () => agent(`You are flow-mapper. ${COMMON}
Read all 9 page HTML files in ${REPO}/ , ${REPO}/script.js, and the per-page maps ${REPO}/docs/audit/findings/phase3/*/_page-map.md. Write ${REPO}/docs/audit/findings/flows/site-map.md: the site-wide flow graph — global nav + footer link graph across pages; each page's on-page user flows; all JS-driven flows (mobile nav, scrollspy, counters, reveals, PureBot Q&A, ISOC competition counter+reset, volunteer tracker add+points+reset); every form and external link (Tally, mailto, socials). This is the end-to-end checklist the flow-verifier will re-walk after changes. Return MANIFEST.`, { label: 'flow-mapper', phase: 'Consolidate', schema: MANIFEST }),
])

// ---- Plan ----
const plan = await agent(`You are the planner (Phase 4). ${COMMON}
Read ALL verified findings ${REPO}/docs/audit/findings/phase3/*/<id>.md, the themes ${REPO}/docs/audit/findings/phase3/_themes.md, the flow graph ${REPO}/docs/audit/findings/flows/site-map.md, ${REPO}/docs/audit/plan/structure.md, and all rules.
Write ${REPO}/docs/audit/plan/implementation-plan.md AND return the PLAN JSON.
Group work into FILE-PARTITIONED workstreams so no two implementers touch the same file (this is mandated by docs/audit/decisions/orchestration/implementation-partitioning.md):
- WS-CSS owns style.css (all visual/type/spacing/color/motion changes).
- WS-JS owns script.js (behaviour-safe code changes only).
- WS-HTML-<page> owns one page's .html (semantic/a11y/markup changes) — only create one per page that actually has findings requiring HTML edits.
Each workstream: list the finding ids it resolves, a summary, concrete acceptance criteria (from each finding's "How to verify"), and a risk note with mitigation. Provide dependencyOrder = the order the merger should apply workstreams (page HTML before WS-CSS so CSS can account for markup; WS-JS last). In the markdown, make each work item link its finding id(s). Critically: every change MUST map to a verified finding; do not invent scope. The home page perf (73) and any a11y deltas must not regress. Return PLAN.`, { label: 'planner', phase: 'Plan', schema: PLAN })

log(`Plan: ${plan?.workstreams?.length || 0} workstreams; order ${JSON.stringify(plan?.dependencyOrder || [])}`)
return { pageResults, totalVerified, themes, siteMap, plan }
