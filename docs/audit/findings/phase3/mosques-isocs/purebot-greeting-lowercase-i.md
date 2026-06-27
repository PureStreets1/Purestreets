---
id: purebot-greeting-lowercase-i
phase: phase3
agent: critic
status: fixed
severity: low
scope: content
evidence:
  - mosques-isocs.html:327
  - docs/audit/screenshots/mosques-isocs/1280-purebot.png
source: internal
---

## Claim
The PureBot opening message reads "how can i help you?" with an uncapitalized
first-person pronoun "i" — a small prose-quality defect visible in the default
panel state.

- `mosques-isocs.html:327` — `<p class="purebot-message purebot-message--bot">
  Assalamu alaikum, how can i help you?</p>`.
- Visible in the open-panel screenshot
  `docs/audit/screenshots/mosques-isocs/1280-purebot.png` (PureBot panel top).
- The same string is hard-coded on all 9 pages (`grep -rl 'how can i help you'`
  matches every `*.html`).
- This greeting is a static HTML string, not produced by PureBot's
  `getReply()`/`addMessage()` (`script.js`), so correcting it breaks no JS flow,
  data hook, localStorage shape, or asset.
- anti-slop checklist #17 (untouched, un-polished prose tells).

## Why it matters
The first-person singular pronoun is always "I"; lowercase "i" is an objective
English copy error (the same sentence capitalizes "Assalamu", so this is not an
all-lowercase brand style). It is the first line users see when they open the
assistant and it undercuts the warm, human voice the org is going for.

## Recommended action
Capitalize to "how can I help you?". Per CLAUDE.md a copy change needs explicit
content sign-off — flag, do not silently edit. The same string recurs across all
9 pages; fix consistently.

## How to verify it's fixed
Open PureBot on each page and confirm the greeting reads "how can I help you?".
Grep the repo for the old string to ensure no stray copies remain. Visual diff is
confined to the single corrected glyph.

## Vote tally
failedToRefute: 3 / 3

- **Skeptic 1 (not refuted):** Verified. HTML:327 reads exactly 'Assalamu alaikum,
  how can i help you?' with an uncapitalized first-person 'i' — an objective English
  copy error (the first-person singular pronoun is always 'I'), not a subjective
  taste call, and inconsistent with the site's otherwise proper capitalization (e.g.
  h1 HTML:41, 'LITTER LEADERBOARD'). It is the first line shown when PureBot opens
  (visible in the open-panel screenshot). The candidate correctly scopes it as a
  copy change needing content sign-off (flag, not silent edit) per CLAUDE.md — and
  copy is permitted as a finding when it IS the finding and justified. anti-slop #17.
  Real defect, correctly handled.
- **Skeptic 2 (not refuted):** Real, objective copy error: html:327 'how can i help
  you?' lowercases first-person 'I', inconsistent with the same sentence's
  capitalized 'Assalamu' (so not an all-lowercase brand style); recurs on all 9
  pages (grep). The greeting is a static HTML string, not matched by PureBot's
  getReply()/addMessage() (script.js), so correcting it breaks no JS
  flow/data-hook/localStorage/asset — behavior-safe. Candidate correctly flags it as
  copy needing content sign-off (propose-only, no silent edit), which is
  CLAUDE.md-compliant. Valid finding; no behavior grounds to refute.
- **Skeptic 3 (not refuted):** Verified real. HTML:327 reads 'Assalamu alaikum, how
  can i help you?' with a lowercase first-person pronoun 'i' — an objective English
  copy error (the pronoun I is always capitalized), not a stylistic choice, since
  the sentence otherwise capitalizes correctly. Visible in the open panel
  (screenshot 1280-purebot.png). Grounded in anti-slop #17 (un-polished prose tells).
  The candidate correctly scopes it as a flagged content change needing sign-off
  rather than a silent edit, so it is safe and defensible. Low severity but a
  genuine defect, not subjective.
