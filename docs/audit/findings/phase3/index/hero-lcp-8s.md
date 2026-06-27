---
id: hero-lcp-8s
phase: phase3
agent: critic
status: verified
severity: high
scope: perf
evidence:
  - docs/audit/runs/before/lighthouse/index.json
  - docs/audit/runs/before/lighthouse-summary.json
  - docs/audit/runs/before/network/index.json
  - style.css:133
  - assets/img/hero-banner.jpg
source: internal
---

## Claim
This is the weakest page for performance (73): Largest Contentful Paint is 8.3s
(Lighthouse score 0.02) even though layout is stable (CLS 0.006) and the main
thread is idle (TBT 0ms). `docs/audit/runs/before/lighthouse/index.json` reports
`largest-contentful-paint` 8.3s (score 0.02), `interactive` 8.3s,
`cumulative-layout-shift` 0.006, `total-blocking-time` 0ms, and
`total-byte-weight` "Total size was 3,372 KiB" (score 0.5);
`docs/audit/runs/before/lighthouse-summary.json` confirms index performance 73 is
the lowest of the 9 pages.

The hero is a CSS `background-image` only fetched after `style.css`
downloads/parses — `.hero { background: linear-gradient(…), url('assets/img/hero-banner.jpg')
center / cover }` (`style.css:133`) — i.e. a CSS background, not a preloadable
`<img>`. `assets/img/hero-banner.jpg` is 223KB and served from our own origin.
`docs/audit/runs/before/network/index.json` shows 44 total requests dominated by
33 `tally.so` chunk requests + 3 `sentry.io` POSTs (the lazy Tally embed), which
make up the bulk of the 3,372 KiB byte weight.

## Why it matters
An 8.3s LCP means the hero (the LCP candidate) paints far too late for real users
on slower connections; because TBT/CLS are fine, fixing LCP discovery is the
single highest-leverage perf win on the site (coding-rules P1: do not late-load
the hero/LCP image).

## Recommended action
Preload the hero LCP image render-neutrally: add
`<link rel="preload" as="image" href="assets/img/hero-banner.jpg"
fetchpriority="high">` in `<head>` so it starts downloading immediately instead
of after CSS parse. This is a same-origin preload of an existing asset — no new
domain, no new request (same resource, reprioritized), no visual change. Keep
Tally as a below-fold lazy iframe (coding-rules P5) — no change. Optionally raise
a separate asset-touching finding to ship a responsive/next-gen hero
(image-delivery ~146 KiB).

## How to verify it's fixed
Re-run Lighthouse mobile; confirm LCP drops materially (target <=2.5s) with no
new domains/requests beyond the same hero URL; pixel-diff the hero to confirm it
is unchanged.

## Vote tally
failedToRefute: 3 / 3

- **Skeptic 1 (failed to refute):** All metrics verified exact in
  lighthouse/index.json: LCP 8.3s (score 0.02), interactive 8.3s, CLS 0.006
  (score 1), TBT 0ms (score 1), total-byte-weight 3,372 KiB; performance 0.73 —
  and lighthouse-summary.json confirms index=73 is the lowest of the pages. Hero
  is a CSS background-image not a preloadable <img> (style.css:133),
  hero-banner.jpg=223KB confirmed. Recommended fix (<link rel=preload as=image
  fetchpriority=high> for the same local asset) is render-neutral, adds no
  domain/visual change, and keeps Tally as a lazy iframe per P5. Real,
  highest-leverage perf finding.
- **Skeptic 2 (failed to refute):** LCP 8.3s (score 0.02) confirmed in
  docs/audit/runs/before/lighthouse/index.json (FCP 2.3s, TBT 0, CLS 0.006), and
  the hero is a CSS background-image (style.css:133) which is genuinely
  discovered only after CSS parse — aligns with coding-rules P1 ('avoid
  late-loading the hero/LCP image'). BEHAVIOR/REGRESSION lens: a same-origin
  preload of assets/img/hero-banner.jpg adds no new domain and no new request
  (same resource, reprioritized), and touches no flow/hook/storage/copy. Caveat
  lowering confidence: the trimmed Lighthouse JSON has no
  largest-contentful-paint-element audit, so the hero image being THE LCP element
  is not directly proven; but the metric is real and the fix is behavior-safe
  regardless.
- **Skeptic 3 (failed to refute):** Lighthouse before/lighthouse/index.json
  verified: LCP 8.3s (score 0.02), CLS 0.006, TBT 0ms, total-byte-weight 3,372
  KiB; summary confirms index performance 73 is the lowest of 9 pages. The hero
  is a CSS background-image (style.css:133 url('assets/img/hero-banner.jpg')),
  genuinely discovered only after style.css parses — a real P1 anti-pattern;
  network/index.json confirms the image is served from our own origin and byte
  weight is dominated by 31 tally.so + 3 sentry.io third-party requests
  (candidate correctly leaves Tally lazy per P5). A measured perf defect, not
  taste; the rel=preload fetchpriority=high fix is render-neutral with no new
  domain/request. Confidence med only because the lighthouse LCP-element audit is
  unpopulated so the exact <=2.5s improvement magnitude is unproven — but the
  finding and the safe fix direction are valid and grounded in coding-rules P1.
