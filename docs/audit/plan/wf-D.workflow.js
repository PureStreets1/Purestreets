export const meta = {
  name: 'overhaul-D-review',
  description: 'Phase 6: per-page before/after reviewer -> issue skeptic-vote -> flow-verifier',
  phases: [
    { title: 'Review', detail: 'before/after visual + mechanical-delta review per page' },
    { title: 'Verify', detail: 'adversarial vote on flagged issues (keep unless >=2 dismiss)' },
    { title: 'Flow', detail: 'flow-verifier over deterministic flow-test results' },
  ],
}

const REPO = '/Users/haidertoha/Code/pure_streets'
const PAGES = ['index', 'charities', 'contact', 'mosques-isocs', 'our-team', 'policies', 'terms', 'volunteer-month', 'work-with-us']

const REVIEW = {
  type: 'object', additionalProperties: false,
  required: ['page', 'confirmedFixed', 'issues', 'summary'],
  properties: {
    page: { type: 'string' },
    confirmedFixed: { type: 'array', items: { type: 'string' }, description: 'finding ids judged properly fixed' },
    issues: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false,
        required: ['id', 'kind', 'severity', 'evidence', 'reason'],
        properties: {
          id: { type: 'string', description: 'stable kebab slug for this issue' },
          kind: { enum: ['regressed', 'insufficient', 'new-regression'] },
          findingId: { type: 'string' },
          title: { type: 'string' },
          severity: { enum: ['low', 'med', 'high'] },
          viewport: { type: 'string' },
          evidence: { type: 'array', items: { type: 'string' } },
          reason: { type: 'string' },
        },
      },
    },
    summary: { type: 'string' },
  },
}

const ISSUE_VOTE = {
  type: 'object', additionalProperties: false, required: ['verdicts'],
  properties: {
    verdicts: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false, required: ['id', 'refuted', 'reason'],
        properties: { id: { type: 'string' }, refuted: { type: 'boolean', description: 'true = confidently NOT a real problem (intended/acceptable/false)' }, reason: { type: 'string' } },
      },
    },
  },
}

const FLOW = {
  type: 'object', additionalProperties: false, required: ['allPass', 'flows', 'summary'],
  properties: {
    allPass: { type: 'boolean' },
    flows: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['name', 'pass', 'note'], properties: { name: { type: 'string' }, pass: { type: 'boolean' }, note: { type: 'string' } } } },
    summary: { type: 'string' },
  },
}

const MANIFEST = { type: 'object', additionalProperties: false, required: ['filesWritten', 'summary'], properties: { filesWritten: { type: 'array', items: { type: 'string' } }, summary: { type: 'string' } } }

function reviewerPrompt(page) {
  return `You are the reviewer for ${page}.html (Phase 6, adversarial review). Judge the overhaul changes on this page: are the fixed findings actually fixed, and did anything get UNINTENDEDLY worse?
READ:
- BEFORE screenshots: ${REPO}/docs/audit/screenshots/${page}/ (375, 768, 1280, 1440 + interactive states).
- AFTER screenshots: ${REPO}/docs/audit/screenshots-after/${page}/ (same set). Compare them carefully at every viewport + state.
- Code changes: run "git -C ${REPO} diff main -- ${page}.html style.css script.js" (Bash) to see exactly what changed.
- Fixed findings: the status: fixed files in ${REPO}/docs/audit/findings/phase3/${page}/ AND the global findings that affect this page's render (coral contrast, subpage header overlap, reduced-motion, etc. — read ${REPO}/docs/audit/plan/implementation-plan.md for the WS-CSS/WS-JS items and acceptance criteria).
- Mechanical deltas (already computed, READ them): a11y ${REPO}/docs/audit/runs/before/axe/${page}.json vs ${REPO}/docs/audit/runs/after/axe/${page}.json; new console errors ${REPO}/docs/audit/runs/after/console/${page}.json; perf ${REPO}/docs/audit/runs/after/lighthouse-summary.json vs before; behavior ${REPO}/docs/audit/runs/flow-test.json.
JUDGE:
1. For each fixed finding affecting this page: verdict fixed | regressed | insufficient, each with concrete before/after evidence (cite the screenshot pair / axe id / line).
2. HUNT NEW REGRESSIONS at ALL 4 viewports + interactive states: layout breaks, element overlap, clipped/wrapped text, spacing or color that got worse, a broken component, a NEW axe violation, a NEW console error, or a Lighthouse drop. The INTENDED changes are expected — darker coral labels, increased hero top padding, light contact-iframe bg, removed volunteer arrows, head metadata — do NOT flag those. Only flag UNINTENDED degradations. Be specific; vague unease is not an issue.
WRITE ${REPO}/docs/audit/findings/review/${page}.md (the verdicts + any issues, with evidence). Give each issue a stable kebab id. RETURN the REVIEW JSON. Your text is data.`
}

function issueSkepticPrompt(issues, i) {
  const lens = [
    'Is each flagged issue a REAL unintended degradation, or is it an INTENDED finding-approved change being mis-read as a regression? Refute (refuted=true) only if you are confident it is intended/acceptable.',
    'Re-check each issue against the actual AFTER screenshot + the git diff + the mechanical deltas. Refute only if the evidence clearly shows no real problem (e.g., the "regression" is not visible in the after image, or axe/console/lighthouse show no delta).',
    'Severity/safety lens: even if minor, could this ship a visibly broken or less-accessible page? Refute (refuted=true) ONLY when confident it is a non-problem; if genuinely unsure, refuted=false (we would rather fix a borderline issue than ship a regression).',
  ][i]
  return `You are issue-skeptic #${i + 1} of 3 (Phase 6 verification). ${lens}
For EACH issue below decide refuted (true = confidently NOT a real problem) or refuted=false (a genuine issue OR you are unsure — bias toward keeping, since this gates regressions). Verify against ${REPO}/docs/audit/screenshots-after/, the git diff (Bash: git -C ${REPO} diff main -- <file>), and the axe/console/lighthouse/flow-test JSON under ${REPO}/docs/audit/runs/. Return a verdict for every id.
ISSUES:
${JSON.stringify(issues)}
Return ISSUE_VOTE JSON.`
}

// ---- Phase 6: Review -> Verify -> Flow ----
phase('Review')
const reviews = (await parallel(PAGES.map((p) => () =>
  agent(reviewerPrompt(p), { label: `review:${p}`, phase: 'Review', schema: REVIEW })))).filter(Boolean)
const issues = reviews.flatMap((r) => (r.issues || []).map((it) => ({ ...it, page: r.page, id: `${r.page}:${it.id}` })))
const confirmedFixedCount = reviews.reduce((n, r) => n + (r.confirmedFixed?.length || 0), 0)
log(`Review: ${confirmedFixedCount} confirmed-fixed; ${issues.length} candidate issues across ${reviews.length} pages`)

phase('Verify')
let confirmedIssues = []
if (issues.length) {
  const votes = (await parallel([0, 1, 2].map((i) => () =>
    agent(issueSkepticPrompt(issues, i), { label: `issue-skeptic${i + 1}`, phase: 'Verify', schema: ISSUE_VOTE })))).filter(Boolean)
  const byId = {}
  votes.forEach((v) => (v.verdicts || []).forEach((x) => { (byId[x.id] ||= []).push(x) }))
  confirmedIssues = issues.filter((it) => {
    const vs = byId[it.id] || []
    const dismissed = vs.filter((v) => v.refuted === true).length
    return dismissed < 2 // keep unless >=2 of 3 confidently dismiss
  })
}
log(`Verify: ${confirmedIssues.length}/${issues.length} issues confirmed (kept unless >=2 dismissed)`)

phase('Flow')
const flowVerdict = await agent(`You are the flow-verifier (Phase 6). The deterministic Playwright flow-test already ran; READ its results at ${REPO}/docs/audit/runs/flow-test.json and confirm every one of the 8 frozen flows passed (mobile nav, header scroll state, scrollspy, counters incl. reduced-motion, reveals, PureBot inert+open+reply+close, ISOC competition counter/shape/reset, volunteer add/points=20+bags*5+hours*10+bonus/shape/reset). Also read ${REPO}/script.js to sanity-check that no data-* hook, localStorage key, or anchor was renamed (Bash: git -C ${REPO} diff main -- script.js). Report allPass and per-flow status. If flow-test.json shows any FAIL, allPass=false and explain. RETURN FLOW JSON.`, { label: 'flow-verifier', phase: 'Flow', schema: FLOW })

await agent(`You are review-scribe. Write ${REPO}/docs/audit/findings/review/_summary.md: a Phase 6 result table — per page: confirmed-fixed count and any issues; then the CONFIRMED issues list (these drive the fix loop) and the flow-verifier verdict. Data:
REVIEWS: ${JSON.stringify(reviews.map((r) => ({ page: r.page, confirmedFixed: r.confirmedFixed?.length || 0, issues: r.issues?.length || 0, summary: r.summary })))}
CONFIRMED_ISSUES: ${JSON.stringify(confirmedIssues)}
FLOW: ${JSON.stringify(flowVerdict)}
RETURN MANIFEST.`, { label: 'review-scribe', phase: 'Flow', schema: MANIFEST })

return { reviews, issues, confirmedIssues, flowVerdict }
