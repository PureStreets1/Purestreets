# Anti-Slop Checklist

Owner: slop-researcher (Phase 2 / R1). Primary input to the Phase 3 critics.
Last updated: 2026-06-27.

"AI slop" / templated design = the **statistical-average website**: the look an
image- or code-model defaults to when given no constraints. Multiple current
sources trace the canonical version to Tailwind's `bg-indigo-500` default
flooding training data — "purple gradients, Inter font, three boxes, rounded
corners… statistical average design"
(https://dev.to/alanwest/why-every-ai-built-website-looks-the-same-blame-tailwinds-indigo-500-3h2p ,
https://prg.sh/ramblings/Why-Your-AI-Keeps-Building-the-Same-Purple-Gradient-Website).
The deeper tell is *interchangeability*: "a fintech startup's homepage could
belong to a project-management tool or a CRM with zero changes"
(https://www.925studios.co/blog/ai-slop-web-design-guide). Slop is "polished
with AI and templates but lacks any sense of intention"
(https://www.creativeboom.com/insight/10-trends-creatives-are-so-over-in-2026/).

## How to use this checklist (read before raising findings)

Per decision `docs/audit/decisions/phase2/tell-severity-model.md`, every tell is
tagged:

- **[HARD]** — almost always slop regardless of context. Raise as a finding on
  sight.
- **[CONDITIONAL]** — only slop when *unjustified*. Several current authorities
  endorse these same techniques when used deliberately (e.g. NN/g on
  glassmorphism, SaaS-trend writers on big type / bento). Raise a CONDITIONAL
  smell **only if it passes the co-occurrence / justification test**:
  1. it co-occurs with **>=2 other tells** on the same page or component, **OR**
  2. it is applied **uniformly with no hierarchy** (same value on every surface), **OR**
  3. there is **no design rationale** for it (decorative, not load-bearing).

Severity tags are guidance, not a gate — a critic may override one **with
written rationale in the finding**. Do not strip intentional craft just because
it pattern-matches a tell.

**Where to pull evidence.** Live-page screenshots live under
`docs/audit/screenshots/<page>/` (pages: index, charities, contact,
mosques-isocs, our-team, policies, terms, volunteer-month, work-with-us). CSS
truth is `/style.css`; DOM is the page `*.html`. Cite a screenshot path, a
`style.css` line, or a source URL for every finding.

**Repo calibration (evidence: `/style.css`).** This site is NOT default-slop and
several tells already PASS — do not false-positive them: it uses **Manrope**
(a chosen brand sans, not Inter/system-ui) and **colored, layered, brand-tinted
shadows** (`rgba(39,100,71,…)`, `rgba(18,60,43,…)`) rather than generic
black-0.1. The CONDITIONAL smells most worth a critic's attention *here* are
flagged inline below: a dominant uniform `border-radius: 8px` (~39 uses), pastel
`radial-gradient` "blobs", and ~40 hand-tuned `clamp()` font-sizes with no
single modular ratio.

---

## The checklist

### 1. Statistical-average brand color: purple / indigo→blue [HARD]
- **Tell:** Indigo/violet→blue as the primary or only brand color — the
  `bg-indigo-500` / `from-indigo-500 to-purple-600` default.
- **Detect:** Screenshot — is the dominant accent a generic purple/blue with no
  tie to the subject? CSS — grep `style.css` for `#6366f1`, `#4f46e5`, `indigo`,
  `blueviolet`, or `linear-gradient(...purple/blue...)` on buttons/headings.
  (This repo PASSES: green/warm palette, evidence `/style.css`.)
- **Fix:** A palette derived from the brand/subject; "dominant colors with sharp
  accents outperform timid, evenly-distributed palettes."
- **Cite:** https://dev.to/alanwest/why-every-ai-built-website-looks-the-same-blame-tailwinds-indigo-500-3h2p ,
  https://prg.sh/ramblings/Why-Your-AI-Keeps-Building-the-Same-Purple-Gradient-Website ,
  https://www.925studios.co/blog/ai-slop-web-design-guide

### 2. Default UI font as the brand voice (Inter / Roboto / Open Sans / Lato / system-ui) [CONDITIONAL]
- **Tell:** Headlines and brand set in the model-default sans. "Default Inter
  font paired with system-sans fallbacks signals AI defaults."
- **Detect:** CSS — `grep -i "font-family" style.css`; flag if the *display*/
  heading face is Inter/Roboto/Open Sans/Lato/Arial/system-ui with no distinctive
  face. Screenshot — do headings have any personality? (This repo PASSES for
  body: **Manrope**, evidence `/style.css`. Critic: confirm the display face is
  intentional, not a fallback.)
- **Fix:** "Pick one display font for headlines that reflects brand personality"
  (e.g. a serif/grotesque pairing) — keep a system fallback in the stack only.
- **Cite:** https://www.925studios.co/blog/ai-slop-web-design-guide ,
  https://prg.sh/ramblings/Why-Your-AI-Keeps-Building-the-Same-Purple-Gradient-Website ,
  https://originality.ai/blog/how-to-identify-ai-generated-websites

### 3. Generic centered hero: big vague headline + subhead + one CTA [HARD when whole pattern present]
- **Tell:** "Oversized hero with a vague headline," centered text and a single
  CTA button, over a gradient — the canonical AI landing page.
- **Detect:** Screenshot of `index` hero — is it center-stacked H1 + one line +
  one button on a gradient, with nothing specific to the org? DOM — hero section
  is `text-align:center` with a lone `.btn`. Treat the *combination* as the tell,
  not centering alone (see #13, #4, #17).
- **Fix:** Ground the hero in something concrete to this org (a real photo, a
  real number, a real place/name); break the dead-center template; let copy do
  specific work.
- **Cite:** https://prg.sh/ramblings/Why-Your-AI-Keeps-Building-the-Same-Purple-Gradient-Website ,
  https://www.925studios.co/blog/ai-slop-web-design-guide ,
  https://originality.ai/blog/how-to-identify-ai-generated-websites

### 4. Pastel gradient / abstract 3D-blob backdrop [CONDITIONAL]
- **Tell:** Decorative pastel gradient or "abstract 3D blobs floating in space"
  behind the hero/sections, carrying no meaning.
- **Detect:** Screenshot — soft pink/lilac/teal washes or floating gloss blobs
  with no semantic role. CSS — `radial-gradient(circle at …)` pastels, large
  blurred decorative pseudo-elements. **This repo: inspect** the pastel
  `radial-gradient(circle at 22% 28%, rgba(242,142,166,…))` etc. (evidence
  `/style.css`) — apply the co-occurrence test before flagging; brand-tied warm/
  green gradients are likely intentional.
- **Fix:** Keep gradients that carry brand meaning; cut purely decorative
  pastel blobs, or replace with real imagery/texture relevant to the cause.
- **Cite:** https://www.925studios.co/blog/ai-slop-web-design-guide ,
  https://www.creativeboom.com/insight/10-trends-creatives-are-so-over-in-2026/

### 5. Three/four-column icon-grid "features" row [CONDITIONAL]
- **Tell:** "Three features in boxes below, each with an icon" — the default
  card grid that any product could use.
- **Detect:** Screenshot — a tidy row of 3-4 equal cards, icon-on-top, short
  heading, one sentence. DOM — repeated `.feature`/`.card` in a 3-col grid with
  identical structure. Flag when generic/interchangeable, not when the content is
  genuinely tabular.
- **Fix:** Vary rhythm/weighting; let real content drive layout; avoid forcing
  exactly three identical boxes; use real imagery over generic icons where it
  earns its place.
- **Cite:** https://dev.to/alanwest/why-every-ai-built-website-looks-the-same-blame-tailwinds-indigo-500-3h2p ,
  https://prg.sh/ramblings/Why-Your-AI-Keeps-Building-the-Same-Purple-Gradient-Website ,
  https://www.925studios.co/blog/ai-slop-web-design-guide

### 6. Uniform / oversized border-radius on every surface [CONDITIONAL]
- **Tell:** The same large radius on everything — "16px border radius
  everywhere" / "border-radius: 0.5rem on everything" — flattening hierarchy.
- **Detect:** CSS — `grep -c "border-radius" style.css`; count distinct values;
  flag if one large value dominates all cards/buttons/inputs. **This repo:
  `border-radius: 8px` appears ~39× (evidence `/style.css`)** — modest, not the
  16px slop value, but a uniformity signal; apply the co-occurrence test.
- **Fix:** Differentiate radii by element role (or commit to a deliberate single
  radius as a brand decision, documented); don't let one value blanket every
  surface by default.
- **Cite:** https://originality.ai/blog/how-to-identify-ai-generated-websites ,
  https://www.925studios.co/blog/ai-slop-web-design-guide ,
  https://dev.to/alanwest/why-every-ai-built-website-looks-the-same-blame-tailwinds-indigo-500-3h2p

### 7. Over-rounded / full-pill buttons by default [CONDITIONAL]
- **Tell:** Primary actions defaulting to full pills (`border-radius: 999px`)
  with a stock gradient fill — part of the "rounded corners on everything" /
  "gradients for everything" reflex.
- **Detect:** Screenshot — are all buttons identical glossy pills? CSS —
  `border-radius: 999px` + `linear-gradient(...)` on `.btn`. (This repo uses
  `999px` on 4 elements, evidence `/style.css` — check it's a deliberate accent,
  not the global button default.)
- **Fix:** Let button shape express brand intent and match the radius system;
  reserve pills/gradient fills for where they mean something.
- **Cite:** https://www.creativeboom.com/insight/10-trends-creatives-are-so-over-in-2026/ ,
  https://dev.to/alanwest/why-every-ai-built-website-looks-the-same-blame-tailwinds-indigo-500-3h2p ,
  https://www.925studios.co/blog/ai-slop-web-design-guide

### 8. Uniform / excessive drop shadows [CONDITIONAL]
- **Tell:** The same soft shadow at "exactly 0.1 opacity" black on every card
  (flat, generic depth), OR too many/too-heavy shadows making the UI "noisy,
  cluttered and dated."
- **Detect:** CSS — `grep "box-shadow" style.css`; flag a single
  `rgba(0,0,0,0.1)`-ish shadow repeated on everything, or many competing heavy
  shadows. **This repo PASSES the "generic 0.1 black" test:** shadows are
  brand-tinted and layered (`rgba(39,100,71,…)`, `rgba(18,60,43,…)`, evidence
  `/style.css`) — only flag if depth is *inconsistent* (some cards shadowed,
  peers not) or genuinely noisy.
- **Fix:** A small, intentional elevation scale; colored/soft shadows used
  consistently for real hierarchy, not decoration; avoid solid-black shadows.
- **Cite:** https://prg.sh/ramblings/Why-Your-AI-Keeps-Building-the-Same-Purple-Gradient-Website ,
  https://dev.to/alanwest/why-every-ai-built-website-looks-the-same-blame-tailwinds-indigo-500-3h2p ,
  https://blog.logrocket.com/ux-design/shadows-ui-design-tips-best-practices/

### 9. Decorative glassmorphism / frosted-glass panels [CONDITIONAL]
- **Tell:** Translucent blurred "glass" panels used widely and decoratively —
  "glass everything." Backlash-heavy and a contrast/legibility risk.
- **Detect:** CSS — `backdrop-filter: blur(...)` + semi-transparent backgrounds;
  Screenshot — frosted cards/navbars over busy backdrops. Check text contrast
  over the glass.
- **Fix:** Use only "judiciously… in the right places" with verified contrast and
  maximal blur over complex backgrounds; remove where it adds no meaning or risks
  legibility.
- **Cite:** https://www.nngroup.com/articles/glassmorphism/ ,
  https://www.creativeboom.com/insight/10-trends-creatives-are-so-over-in-2026/

### 10. Non-modular / arbitrary type scale [CONDITIONAL]
- **Tell:** Many hand-picked font-sizes with no consistent ratio — "any visual
  hierarchy beyond 'bigger text = header'." Arbitrary "magic number" sizes break
  vertical rhythm.
- **Detect:** CSS — list distinct `font-size` values (`grep -oE 'font-size:[^;]*'
  style.css | sort -u`); a modular scale shows a small set of values stepping by
  a constant ratio (e.g. 1.2/1.25/1.333). **This repo: ~40 distinct sizes,
  mostly bespoke `clamp()` tuples with no single ratio (evidence `/style.css`)** —
  a strong candidate to inspect for hierarchy/consistency.
- **Fix:** Define one modular scale (base × ratio) as CSS custom properties and
  map every size onto a step; keep responsive `clamp()` but anchor min/max to the
  scale.
- **Cite:** https://alistapart.com/article/more-meaningful-typography/ ,
  https://imperavi.com/books/ui-typography/principles/modular-scale/ ,
  https://www.kalamuna.com/blog/modular-type-scaling-frontend-developers ,
  https://prg.sh/ramblings/Why-Your-AI-Keeps-Building-the-Same-Purple-Gradient-Website

### 11. Flat spacing: uniform padding, no rhythm [CONDITIONAL]
- **Tell:** Identical padding everywhere (e.g. "24px padding" on every block),
  producing a "flat visual hierarchy lacking intentional variation."
- **Detect:** CSS — is one padding/gap value reused on most containers with no
  spacing scale? Screenshot — every section feels equally weighted, no breathing
  room contrast between primary and secondary content.
- **Fix:** A spacing scale (tokens) with deliberate larger gaps around hero/key
  sections and tighter rhythm within groups; align spacing to the type scale.
- **Cite:** https://www.925studios.co/blog/ai-slop-web-design-guide ,
  https://www.kalamuna.com/blog/modular-type-scaling-frontend-developers

### 12. Everything center-aligned (incl. body paragraphs) [HARD for body copy; CONDITIONAL overall]
- **Tell:** Whole pages centered, including multi-line paragraphs. Centered body
  text harms readability — "without a straight left edge there is no consistent
  place to return the eyes."
- **Detect:** Screenshot — multi-line paragraphs centered (ragged both edges).
  CSS — `text-align:center` on body/`p`/long-text containers. Centered *headlines
  and short lines* are fine; centered *paragraphs* are the fail. **This repo:
  `text-align:center` 7× vs `left` 4× (evidence `/style.css`)** — check none wrap
  long paragraphs.
- **Fix:** Left-align body/long-form text; keep centering for short headlines
  only; "centered headings go with centered text, left-aligned with left."
- **Cite:** https://uxmovement.com/content/why-you-should-never-center-align-paragraph-text/ ,
  https://www.925studios.co/blog/ai-slop-web-design-guide

### 13. Emoji used as iconography / standing in for an icon system [HARD]
- **Tell:** Emoji deployed as UI/feature icons instead of a real icon set —
  inconsistent across platforms, ambiguous meaning, accessibility gaps.
- **Detect:** DOM/screenshot — literal emoji glyphs (✅🚀🌍) as feature/section
  icons or bullets; `grep -P "[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}]" *.html`.
  Cross-platform rendering and missing `aria-label` are the giveaways.
- **Fix:** A consistent SVG icon set with proper `aria-label`/`alt`; reserve
  emoji for genuine inline tone, never as the icon system.
- **Cite:** https://nolanlawson.com/2022/04/08/the-struggle-of-using-native-emoji-on-the-web/ ,
  https://smarticons.co/blog/emoji-icons-web-design/ ,
  https://dev.to/iamludal/you-are-using-emojis-the-wrong-way-i71

### 14. The four-point "AI sparkle" glyph as motif/logo [HARD]
- **Tell:** The ✦ four-pointed star/sparkle used as an "AI" signifier or general
  decorative motif — "four-pointed star for AI logos and gradients for
  everything. Give it a rest."
- **Detect:** Screenshot/DOM — four-point sparkle icons near headings, buttons,
  or as a logo accent; inline `<svg>` star paths or the ✦/✧ characters.
- **Fix:** Remove the generic AI sparkle; use motifs drawn from the brand's own
  identity.
- **Cite:** https://www.creativeboom.com/insight/10-trends-creatives-are-so-over-in-2026/

### 15. AI-generated stock imagery / illustration [HARD]
- **Tell:** "Diverse group of people looking at a laptop in an impossibly
  well-lit office," abstract 3D blobs, or illustrations that are "slightly too
  smooth, too symmetrical, with a plastic quality"; extra limbs, garbled
  background text.
- **Detect:** Screenshot — examine photos/illustrations for the plastic AI sheen,
  anatomical errors, nonsense signage; do images feel generic/stocky vs. real to
  this org?
- **Fix:** Replace with real photography of the actual community/events, real
  team photos, or commissioned custom illustration.
- **Cite:** https://www.925studios.co/blog/ai-slop-web-design-guide ,
  https://originality.ai/blog/how-to-identify-ai-generated-websites ,
  https://www.creativeboom.com/insight/10-trends-creatives-are-so-over-in-2026/

### 16. Vague aspirational marketing copy [HARD]
- **Tell:** Hollow headlines — "Build the future of work," "Your all-in-one
  platform," "Scale without limits" — plus generic superlatives ("best-in-class,"
  "cutting-edge") and hedging ("may help," "can potentially").
- **Detect:** Read the copy: could it sit on any company's site unchanged? Any
  concrete nouns, names, numbers, places? Absence of specifics is the tell.
- **Fix:** Replace with specific, true claims about *this* org — who, where, what
  actually happens, real outcomes.
- **Cite:** https://www.925studios.co/blog/ai-slop-web-design-guide ,
  https://originality.ai/blog/how-to-identify-ai-generated-websites

### 17. Templated copy/punctuation tells [CONDITIONAL — copy, not visual]
- **Tell:** Untouched-from-the-box prose: straight quotes/apostrophes instead of
  curly, unspaced em-dashes "like this—", semicolons "sprinkled like seasoning,"
  uniform paragraph cadence with no human voice or anecdote.
- **Detect:** Read copy for straight quotes (`'` `"`), `—` without spacing,
  over-frequent semicolons, and absence of personal/specific voice.
- **Fix:** Edit to the org's real voice; fix typography of quotes/dashes; add the
  specific human detail AI omits. (Copy-side; coordinate with content owners —
  per CLAUDE.md, copy changes need a verified finding.)
- **Cite:** https://www.th3design.co.uk/2025/08/how-to-spot-ai-generated-content/ ,
  https://originality.ai/blog/how-to-identify-ai-generated-websites

### 18. Predictable/identical or missing hover & motion [CONDITIONAL]
- **Tell:** "Missing hover states or buttons that snap instead of easing,"
  "generic fade-in animations applied identically to every element," or "motion
  for motion's sake" with no communicative purpose.
- **Detect:** Hover every interactive element in-browser — identical generic
  transition or none? CSS — one `transition`/`@keyframes fadeIn` reused on
  everything; reveal-on-scroll firing uniformly with no intent. Check
  `prefers-reduced-motion` is honored.
- **Fix:** Purposeful, differentiated micro-interactions; motion that
  communicates (state, hierarchy) not decorates; respect reduced-motion.
- **Cite:** https://www.925studios.co/blog/ai-slop-web-design-guide ,
  https://www.creativeboom.com/insight/10-trends-creatives-are-so-over-in-2026/

### 19. Bento-grid layout used as the default structure [CONDITIONAL]
- **Tell:** The Apple-style modular "bento box" grid reached for reflexively —
  "effective… but can't stop using them," now a cliché.
- **Detect:** Screenshot/DOM — a mosaic of mixed-size rounded tiles as the
  primary page structure regardless of content fit.
- **Fix:** Use bento only where the content is genuinely modular; otherwise let
  content dictate layout.
- **Cite:** https://www.creativeboom.com/insight/10-trends-creatives-are-so-over-in-2026/ ,
  https://www.eloqwnt.com/blog/saas-website-design-trends

### 20. Decorative color with no semantic system [CONDITIONAL]
- **Tell:** Colors chosen for vibe with no token system or meaning — "decorative
  color use that carries no semantic meaning," "timid, evenly-distributed
  palettes."
- **Detect:** CSS — are colors raw hex scattered inline, or named custom
  properties with roles? Is there a clear dominant + accent, or a flat even
  spread? (This repo uses `--green-dark`, `--lime`, `--paper` etc. — a token
  system, evidence `/style.css`; a PASS signal.)
- **Fix:** Semantic color tokens (`--color-action-primary`, surfaces, text);
  commit to a dominant color with sharp, sparing accents.
- **Cite:** https://www.925studios.co/blog/ai-slop-web-design-guide ,
  https://prg.sh/ramblings/Why-Your-AI-Keeps-Building-the-Same-Purple-Gradient-Website

### 21. Cross-page / cross-org interchangeability [HARD — the meta-tell]
- **Tell:** The strongest single signal: the pages are indistinguishable from one
  another and from any other org's site — "could belong to a CRM with zero
  changes." Repeated identical layout shells across pages.
- **Detect:** Compare screenshots across `docs/audit/screenshots/<page>/` — do
  pages share one generic shell with only swapped text? Squint test: strip the
  copy — is anything recognizably *this* org left?
- **Fix:** Inject specificity and identity that only this org could have
  (its photography, palette, voice, motifs, real data) so each page is
  unmistakably theirs.
- **Cite:** https://www.925studios.co/blog/ai-slop-web-design-guide ,
  https://originality.ai/blog/how-to-identify-ai-generated-websites ,
  https://dev.to/alanwest/why-every-ai-built-website-looks-the-same-blame-tailwinds-indigo-500-3h2p

---

## Sources
- 925studios — AI Slop Web Design guide (2026): https://www.925studios.co/blog/ai-slop-web-design-guide
- DEV / Alan West — "Blame Tailwind's Indigo-500": https://dev.to/alanwest/why-every-ai-built-website-looks-the-same-blame-tailwinds-indigo-500-3h2p
- prg.sh — "Why Your AI Keeps Building the Same Purple Gradient Website": https://prg.sh/ramblings/Why-Your-AI-Keeps-Building-the-Same-Purple-Gradient-Website
- Creative Boom — "10 trends creatives are so over in 2026": https://www.creativeboom.com/insight/10-trends-creatives-are-so-over-in-2026/
- Originality.ai — "How to identify AI-generated websites": https://originality.ai/blog/how-to-identify-ai-generated-websites
- TH3 Design — "How to spot AI-generated content" (2025): https://www.th3design.co.uk/2025/08/how-to-spot-ai-generated-content/
- NN/g — "Glassmorphism: Definition and Best Practices": https://www.nngroup.com/articles/glassmorphism/
- UX Movement — "Why You Should Never Center-Align Paragraph Text": https://uxmovement.com/content/why-you-should-never-center-align-paragraph-text/
- A List Apart — "More Meaningful Typography" (modular scale): https://alistapart.com/article/more-meaningful-typography/
- Imperavi UI Typography — "Modular scale": https://imperavi.com/books/ui-typography/principles/modular-scale/
- Kalamuna — "Modular Type Scaling for Frontend Developers": https://www.kalamuna.com/blog/modular-type-scaling-frontend-developers
- LogRocket — "Shadows in UI design: tips and best practices": https://blog.logrocket.com/ux-design/shadows-ui-design-tips-best-practices/
- Nolan Lawson — "The struggle of using native emoji on the web": https://nolanlawson.com/2022/04/08/the-struggle-of-using-native-emoji-on-the-web/
- SmartIcons — "The Power of Emoji Icons in Web Design": https://smarticons.co/blog/emoji-icons-web-design/
- DEV / iamludal — "You Are Using Emojis The Wrong Way": https://dev.to/iamludal/you-are-using-emojis-the-wrong-way-i71
- Eloqwnt — "SaaS Website Design Trends 2026": https://www.eloqwnt.com/blog/saas-website-design-trends

Decision affecting this file: `docs/audit/decisions/phase2/tell-severity-model.md`
