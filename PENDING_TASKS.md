# AtlasEveryday selected-task checklist

Public website name: **AtlasEveryday — Germany · Deutschland** (approved 13 November 2026). Existing FinBridge repository/service identifiers and the tester link are retained; the scheduled security, Sunday and hosting work below keeps its existing scope.

Owner selection: 13 November 2026. IDs 1–18 match the original chat checklist; items 19–21 record the security work, homepage/topic organization and investment-planner expansion approved on 13 November. Check an item only after its implementation and relevant published-site verification. The wider roadmap can retain additional coverage even when a bounded release item is complete.

## Completed and verified — 13 November 2026

- [x] **1. Asset versions:** dependency-based versions, repeatable freshness check and shipped-build footer verified on a normal reload.
- [x] **2. Page wording:** local search versus contextual AI explained; return card no longer promises four steps.
- [x] **4. Guided tax opportunity finder:** employee, student, family, newcomer and returnee starting points; evidence and review statuses.
- [x] **9. Insurance, pension and donation checks:** certificate/prefilled/duplicate review, net personal spending and supported ordinary donation screening.
- [x] **10. Family, student and part-year paths:** assessment, childcare, initial/subsequent education and arrival/departure preparation.
- [x] **11. Germany–India guidance:** tax/residence/RNOR, banking redesignation, income/investment literacy, gifts/assets, return and transfer-quote comparison.
- [x] **12. Adviser exports and supported tax-effect estimates:** year-filtered TXT/CSV/print packs, private receipt/date/basis fields and guarded 2026 tariff illustrations.
- [x] **13. Calculator reference checks:** 64 passing local checks, including 40 new planning/reference tests and three independently observed official tariff outputs plus one official payroll example. Broader individual payroll/financial coverage remains in QA.

- [x] **20. Homepage and topic organization:** featured arrival guide, reviewed updates, four life stages, six topic hubs, guide cards and connected tools/official sources. Published and live-verified; desktop/mobile, search and keyboard checks passed. [Release evidence](REVIEWS/2026-11-13-portal-navigation.md).

Tax-planning feature commit [`8e753ad8af4a`](https://github.com/nikunjsb/Finbridge/commit/8e753ad8af4ad5d358bb8ad4cf856cafd1aeadf9) passed [Pages deployment](https://github.com/nikunjsb/Finbridge/actions/runs/43398676203) at **10:13 CET**. Live checks verified the planner, review states, downloads/year selection and key existing calculators. See the release review for scope and limits.

## Awaiting publication verification

- [ ] **21. Broader investment and savings planner:** goals, contribution increases/top-ups, fees, inflation, three growth assumptions, EUR/INR illustrations, saved comparisons, yearly CSV and investment-type guidance. Implemented with 27 new reference/validation checks (91 total); preview checks passed for desktop/mobile, saving, comparisons, goals, currency, CSV and backup inclusion. Awaiting successful Pages publication and live verification.

## Scheduled for Sunday, 15 November 2026

- [ ] **15. Cloudflare verification:** deployed versions/bindings, logging, cron executions and retention. Authenticated owner evidence is still required; local tests do not complete this task.
- [ ] **14. Wider accessibility and performance checks:** keyboard, screen-reader names, contrast, reflow/mobile, load size and error states. Added to the existing Sunday Release QA run.

## Scheduled for Friday, 20 November 2026

- [ ] **19. Security review and hardening:** backup/import and rendering safety, browser policy/headers, third-party scripts, Worker validation/rate limits, repository protection and secret/account controls. Assigned to Friday’s existing Release QA run. [Scope and completion criteria](SECURITY_PLAN.md). Account access and verified deployment may leave some items blocked; the date is a work target, not a security certification.

## Other pending work

- [ ] **3. Full desktop/mobile regression:** new release flows will be checked during publication; a complete whole-site regression remains with Sunday QA and future releases.
- [ ] **5. Deeper work-expense planning:** dated attendance, reimbursements/overlaps, equipment/depreciation and training screening (TS02–TS03).
- [ ] **6. Relocation/double-household extension:** full eligibility, actual flights, furnishings/meals and reimbursement handling (TS04).
- [ ] **7. Parent-support calculator:** recipient income/assets, support months, country adjustment and household allocation (TS05).
- [ ] **8. Household-services checker:** labour/materials, bank payment, limits and direct tax-credit calculation (TS06).
- [ ] **16. Private owner dashboard:** authentication and protected reporting; final endpoint undecided.
- [ ] **17. Operator/contact and legal notices:** awaiting chosen public operator details and review.
- [ ] **18. Hosting/domain review:** **22 November 2026**, preserving the existing tester link. This is a review date, not a migration commitment.

Release destinations and dependencies: [RELEASE_PLAN.md](RELEASE_PLAN.md). Detailed tax criteria: [TAX_SAVINGS_ROADMAP.md](TAX_SAVINGS_ROADMAP.md). Validation: [13 November review](REVIEWS/2026-11-13-tax-planning.md).
