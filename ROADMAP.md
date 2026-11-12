# FinBridge — Product roadmap and release gates

Updated: 2026-11-12. Status: public beta / in progress. This plan distinguishes implementation, local verification and live-service verification. “P” indicates a workstream, not a promise that the entire phase is done.

| Phase | Workstream | Exit criteria | Status |
|---|---|---|---|
| P0 | Desktop/mobile UX smoke tests | Critical journeys checked on both screen sizes after relevant changes | Money-check/payslip links, saved choices, reset, evidence counters and a 390px viewport checked on 12 November; full-site regression continues |
| P1 | Release quality & traceability | Scheduled QA, deployment checks and repeatable tests | Release QA and hourly monitoring active; 24 local tests pass; news automation carries the release interlock |
| P2 | Privacy & trust baseline | Accurate service notices and operator/contact information | Service disclosures exist and stale setup notes are reconciled; operator-specific details and full review remain pending |
| P3 | Optional topic insights | Explicit opt-in, fixed enums, aggregate-only rows and 30 UTC-date retention | Worker/D1 setup previously confirmed; frontend configured and off by default per visitor. Local tests pass; live cron/log verification remains pending |
| P4 | Private analytics dashboard | Owner-authenticated reports; no public database access | Read-only D1 aggregate queries ready; protected dashboard UI and authenticated reporting still planned |
| P5 | Content accuracy | Dated, jurisdiction-relevant official sources | Money guidance, pension refund, German-course and fund-exit-tax updates reviewed on 12 November; wider audit continues |
| P6 | Journey completeness | Relevant newcomer, healthcare, immigration and cross-border paths | Nine newcomer profiles, healthcare recognition and departure journeys implemented; fuller residency/account scenarios planned |
| P7 | Financial tool QA | Independent boundary/reference tests for salary, insurance and budget | Calculators implemented; broad financial reference-case suite pending |
| P8 | Performance & accessibility | Keyboard, screen readers, contrast and mobile/error states | Narrow-screen money-guidance checks complete; wider accessibility/performance audit pending |
| P9 | Public beta operations | Reliable releases and preserved tester access | GitHub Pages live; domain/hosting work deferred until 22 November 2026 |
| P10 | Feedback and learning loop | Private feedback review and actionable, deduplicated findings | Private repository read access verified; daily QA includes feedback through 19 December; owner analytics review awaits live report verification |
| P11 | Tax-saving guidance and tools | Guided opportunities, evidence checks, year-specific estimates and independent reference cases | Requested 12 November; planned in [TAX_SAVINGS_ROADMAP.md](TAX_SAVINGS_ROADMAP.md). Extend existing claim/workspace guides; implementation pending |

## Current implementation inventory
- The site includes the money self-check, detailed payslip guide, family-support preparation, double-household evidence and departure document packs.
- Location-trial and topic-insights endpoints are configured separately from AI and feedback. Topic analytics remains off by default for each visitor.
- Local tests exercise 14-day location expiry and the latest 30 UTC-date Insights cleanup using the actual SQL schemas. They do not verify that a deployed Cloudflare cron ran.
- The 6 November proposal list in `ROADMAP_2026-11-07.md` is historical, not a current list of unfinished features.
- The dedicated tax-saving backlog separates existing guides from the remaining screening/calculator work; see [TAX_SAVINGS_ROADMAP.md](TAX_SAVINGS_ROADMAP.md).

## Monitoring coverage
- FinBridge Release QA: daily around 08:30 Europe/Berlin. Inspect code, public site and regressions; also review private `nikunjsb/finbridge-feedback` through 19 December 2026. Keep private submissions out of public reports/code.
- FinBridge Pending & Releases: daily around 09:30 Europe/Berlin. Maintain [pending work and release destinations](RELEASE_PLAN.md); retain the original content-gap review on Mondays. Update records for evidenced changes and distinguish confirmed/proposed/unscheduled dates.
- The corrected standalone feedback review is paused; feedback is consolidated into Release QA to stay within five active tasks.
- Germany expat news watch: twice daily, with previous-deployment verification before any commit.
- Hosting discussion reminder: 22 November 2026; no automatic domain purchase, DNS change or migration.
- Scheduled checks **cannot** see private Cloudflare D1 dashboards or browser-only transactions without a separately authorized integration. They must not claim real user telemetry without evidence.

## Design rules for visitor insights
1. **No raw text:** Never send or store search queries, AI prompts, replies, history or free-text feedback.
2. **Allowlisted enums:** Only the category (e.g. immigration, tax, healthcare, salary, money, cross-border, other), interaction type (overview_search, library_search, ai_question), and broad outcome (matched, unmatched, success, error).
3. **Explicit opt-in** off by default; the choice stays on device, visitors can switch it off; describe the categories and processor before collection.
4. **Separation:** Dedicated `finbridge-insights` Worker and D1 database; keep location-trial, AI and feedback bindings separate.
5. **Privacy by design:** Do not write IP addresses, UA, referrers, geolocation or client IDs to D1; use a short retention policy for daily aggregates. Avoid logging request bodies.
6. **Abuse protection:** Validate origin and request payload, limit request sizes, rate-limit, and secure admin reports (not by CORS alone). Never expose a public admin API.
7. **Meaningful reporting:** Topic interest counts, no-match counts and AI failure counts. Avoid overinterpreting analytics of opt-in users as all visitors.
8. **Current frontend gate:** The configured endpoint emits no topic events until the visitor opts in. Preserve opt-out/withdrawal behavior; verify production settings and retention before broad promotion.

## Issue process
- One issue per confirmed problem or coherent workstream.
- Record evidence (URL, file, date, reproduction), affected environment, priority, test results and acceptance criteria.
- Mark fixed only after code + published site verification, not merely after committing.
- Monitoring findings should update existing issues first to avoid duplicates.

## Next work, with hosting deferred
See [RELEASE_PLAN.md](RELEASE_PLAN.md) for the pending queue, proposed release order, dependencies and destinations. Hosting is the only dated review milestone; other feature dates are not yet scheduled.

1. Verify deployed Cloudflare cron executions, binding/log settings and retained-row counts using authenticated owner access.
2. Prepare operator-specific public contact/identity details for the privacy/operator notices; do not invent or expose a private home address.
3. Work through the [tax-saving priorities](TAX_SAVINGS_ROADMAP.md): guided claim finder, work expenses, relocation/double households, parent support and household services, with independent calculator reference cases and wider accessibility checks.
4. Build protected owner reporting from the aggregate queries, with server-side authentication before exposing any report endpoint.
5. Expand Germany–India residency/account scenarios and the transfer-cost worksheet using official sources.
6. Revisit domain/hosting on 22 November, preserving the tester link and user backups.
