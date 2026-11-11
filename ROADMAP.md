# FinBridge — Product roadmap and release gates

Updated: 2026-11-11. Status: public beta / in progress. This plan distinguishes observed completion from unverified readiness. “P” indicates sequence and priority, not a promise that the step is done.

| Phase | Workstream | Exit criteria | Status |
|---|---|---|---|
| P0 | Desktop/mobile UX smoke tests | Owner checks homepage, navigation, search, AI, salary and location on both screen sizes after releases | Owner reports checked; repeat after major changes |
| P1 | Release quality & traceability | Scheduled QA for GitHub commits and deployment; documented regression checklist and issue history | Two scheduled monitors created; browser E2E pending |
| P2 | Privacy & trust baseline | Accurate privacy/AI/location notices, clear feedback handling, no secret keys in public assets, verified contact details | Needs review; current privacy text partly outdated |
| P3 | Anonymous topic insights | Explicit opt-in, no raw search/chat text, aggregate events only, no user/session identifier, 30-day retention, disable and delete controls | In design; **disabled until deployed and tested** |
| P4 | Private analytics dashboard | Owner-authenticated aggregated reports, no public database access; trend/no-result counts | Planned |
| P5 | Content accuracy | Audit legal, healthcare and tax claims against official dated sources; track last checked and jurisdiction | Ongoing |
| P6 | Journey completeness | Newcomer, work, health professional, Blue Card, PR, citizenship, India-Germany cross-border, departure | Ongoing |
| P7 | Financial tool QA | Boundary tests for tax class, salary, insurance and budget; clear assumptions and relevant tax years | Planned |
| P8 | Performance & accessibility | Keyboard, screen readers, contrast, mobile layout, CWV and error states | Planned |
| P9 | Public beta operations | Domain/hosting assessment; rollback and change log; backups and issue triage | Current GitHub Pages live; migration not required for beta |
| P10 | Growth and learning loop | Monthly aggregated insight review, deduped backlog, prioritization and release notes | Planned; contingent on privacy-safe analytics |

## Monitoring coverage
- FinBridge Release QA: daily around 08:30 Europe/Berlin. Inspect code, public site and regressions; log only verifiable findings.
- FinBridge Content Gaps: Mondays around 09:30 Europe/Berlin.
- Existing FinBridge feedback review: daily.
- Existing Germany expat news watch: twice daily.
- Scheduled checks **cannot** see private Cloudflare D1 dashboards or browser-only transactions without a separately authorized integration. They must not claim real user telemetry without evidence.

## Design rules for visitor insights
1. **No raw text:** Never send or store search queries, AI prompts, replies, history or free-text feedback.
2. **Allowlisted enums:** Only the category (e.g. immigration, tax, healthcare, salary, money, cross-border, other), interaction type (overview_search, library_search, ai_question), and broad outcome (matched, unmatched, success, error).
3. **Explicit opt-in** off by default; the choice stays on device, visitors can switch it off; describe the categories and processor before collection.
4. **Separation:** New `finbridge-insights` Worker and new D1 database, not location-trial, AI or feedback bindings.
5. **Privacy by design:** Do not write IP addresses, UA, referrers, geolocation or client IDs to D1; use a short retention policy for daily aggregates. Avoid logging request bodies.
6. **Abuse protection:** Validate origin and request payload, limit request sizes, rate-limit, and secure admin reports (not by CORS alone). Never expose a public admin API.
7. **Meaningful reporting:** Topic interest counts, no-match counts and AI failure counts. Avoid overinterpreting analytics of opt-in users as all visitors.
8. **Deployment gate:** Frontend `insightsEndpoint` stays blank and emits nothing until privacy review, Cloudflare configuration and live tests pass.

## Issue process
- One issue per confirmed problem or coherent workstream.
- Record evidence (URL, file, date, reproduction), affected environment, priority, test results and acceptance criteria.
- Mark fixed only after code + published site verification, not merely after committing.
- Monitoring findings should update existing issues first to avoid duplicates.

## Recommended release sequence
1. Fix known privacy disclosure mismatch and regression tests.
2. Prepare opt-in aggregated event collector without shipping enabled tracking.
3. Configure isolated Cloudflare Worker + D1; review consent and notices.
4. Enable in a small controlled pilot, then build protected reporting.
5. Review results monthly and prioritize content updates.
