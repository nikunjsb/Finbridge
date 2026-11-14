# AtlasEveryday pending work and release plan

Public branding approved on 13 November 2026: **AtlasEveryday**, with the country label **Germany · Deutschland**. The header, page title, visitor copy and download labels use the new name. The existing repository, tester URL, browser-storage keys and separate service identifiers retain their FinBridge names for continuity. Germany–India guidance remains part of the site; domain/hosting review stays on 22 November.

Baseline: 13 November 2026. The owner selected items 1, 2, 4, 9, 10, 11, 12 and 13 for the current release. The selected tax-planning items are deployed and verified complete. That release passed 64 local checks; the current combined suite has 174, including 18 expense-workspace checks, including 16 self-filing companion checks, 27 investment-planner and 49 new expense/support/household worksheet checks. Other pending feature release dates have not been agreed. The confirmed hosting milestone is a discussion/review on 22 November, not an automatic migration.

## Where updates are released

| Update type | Destination | Verification needed |
|---|---|---|
| Public guides, tax tools and website UI | Existing GitHub Pages site: https://nikunjsb.github.io/Finbridge/ | Matching successful Pages deployment plus relevant live checks |
| Backlog, task statuses, tests and source documentation | `nikunjsb/Finbridge` repository and its existing GitHub issues | Evidence for the status change; docs commits follow the same Pages release interlock |
| Analytics/location/feedback backend changes | The existing, separate Cloudflare Workers and D1 databases | Separate authenticated backend deployment and verification; Pages success alone is insufficient |
| Private owner dashboard | Owner-authenticated reporting service; final endpoint not selected | Server-side authentication and private database access before publication |

Keep the existing tester URL working. Domain, DNS and hosting migration work is deferred until 22 November.

## Completed release — 13 November 2026

**TAX-PREP-1 / checklist items 1, 2, 4, 9–13** is deployed and live-verified. Feature commit `8e753ad8af4ad5d358bb8ad4cf856cafd1aeadf9`; [successful Pages run](https://github.com/nikunjsb/Finbridge/actions/runs/43398676203) completed at 10:13 CET. The site served app version `6777156d3e20` / build `58b29cf43e83` after a normal reload from the previous cached build. Planner/check/path flows, bounded tariff estimates, residence/transfer examples, TXT/CSV download/year filtering and key calculator regressions were checked. [Detailed evidence](REVIEWS/2026-11-13-tax-planning.md).

**PORTAL / checklist item 20** is also deployed and live-verified. Feature commit `1b604400aede4851c641556f15ad3668971e5530`; [successful Pages run](https://github.com/nikunjsb/Finbridge/actions/runs/43414847487) completed at **12:11 CET**. The public site served build `0a1bb9db1f19` / app `0a46144324db` on a normal reload. Six topic hubs, four life stages, featured/recommended guides, source links, existing tools, search and specific news links are connected. [Verification and screenshot](REVIEWS/2026-11-13-portal-navigation.md). This completes the bounded organization work; the wider Sunday audit remains pending.

**INVEST / checklist item 21** is deployed and live-verified. Feature commit `ee7a986614b5718b4831f26432485d4353e6ffa4`; [successful Pages run](https://github.com/nikunjsb/Finbridge/actions/runs/43434520467) completed at **14:33 CET**. Normal navigation served build `016a06250c43` / app `1e34fe4312d9`. Goals, contribution changes/top-ups, fees, inflation, three assumptions, manual EUR/INR, saved comparisons, CSV and investment-type guidance are implemented. The model uses effective annual growth and before-tax figures; wider product/tax/retirement models are outside this release. [Verification, model scope and screenshot](REVIEWS/2026-11-13-investment-planner.md).

**STYLE / checklist item 22** is deployed and live-verified. Feature commit `fd28c8bb98e84c0d802f4bb1dde7d6e5c42da8ed`; [successful Pages run](https://github.com/nikunjsb/Finbridge/actions/runs/43439913699) completed at **15:09 CET**. A normal reload served build `f4335e286f56` / app `049d43d4a783`. The existing four-colour overview palette now accents inner-page cards, icons, labels, selected categories and keyboard focus. [Verification and screenshot](REVIEWS/2026-11-13-page-colours.md). The wider Sunday accessibility/performance audit remains pending.

## Completed release — 14 November 2026

**TAX-WORKSHEETS / checklist 5, 7 and 8 (TS02–TS03, TS05–TS06)** is deployed and live-verified. Feature commit `db09964c06de7bfaebff0900b41e2b2132829047`; [successful Pages run](https://github.com/nikunjsb/Finbridge/actions/runs/43583872978) finished its deploy job at **11:09:34 CET**. A normal reload served build `3350150dd886` / app `7b362ca58cd9` / CSS `ebaf95602244`. Work expense, parent-support and household-service worksheets cover 2025/2026, with explicit evidence/scope gates, separate deductions/direct credits, local per-year snapshots and adviser exports. **140 tests pass**, including 49 new reference/boundary checks. Desktop/mobile and live examples passed. [Detailed rules, scope, verification and screenshot](REVIEWS/2026-11-14-tax-workbenches.md). TS04 and the broader scheduled audits remain pending.

## Additional completed release — 14 November 2026

**SELF-FILING / checklist 23–25:** questionnaire, working-student/commuting preparation journeys, TXT export and investment-tax comparison requirements are deployed and live-verified (156 tests). Feature commit `dc5f801977afc23b2b2d508ec95cf00777b07420` passed [Pages run 43603523397](https://github.com/nikunjsb/Finbridge/actions/runs/43603523397); a normal reload served build `6399c4aac147`. Both journeys, TXT download and existing work-worksheet navigation passed public-site checks. [Scope and evidence](REVIEWS/2026-11-14-self-filing-companion.md). The investment optimiser and full tax assessment are not implemented; retain them as future work. TS04 remains pending.

## Pending queue

| ID | Pending work | Status / next requirement | Proposed release position | Target date | Destination |
|---|---|---|---|---|---|
| SEC | Security review/hardening: browser data and imports, CSP/headers, dependencies, Worker abuse controls and repository/account protection | Planned; see SECURITY_PLAN.md and checklist item 19. Review Sunday findings; verify access and release readiness | Owner-selected security work session | 20 November 2026 — scheduled work; release depends on verification | Repository/public site; separate Workers/settings where authorized |
| TAX-B | Relocation/double-household extension (TS04; checklist 6) | Pending; extend eligibility, furnishings/meals, actual flights, reimbursement and overlap handling. Parent-support/household-service work (TS05–TS06) is completed in TAX-WORKSHEETS | Next proposed tax-tools extension | Not scheduled | Existing public website |
| QA-FIN | Wider individual payroll, special-expense and complex treaty/foreign-tax reference coverage | Focused preparation models/reference suite implemented; wider coverage remains | Further validation with relevant releases | Not scheduled | Repository checks and public website |
| OPS-LIVE | Verify deployed Cloudflare versions, bindings/log settings, cron history and retained-row counts | Awaiting authenticated owner evidence; included in existing Sunday QA | Operational verification | 15 November 2026 — scheduled check | Existing Cloudflare services |
| OWNER | Protected analytics dashboard | Planned; owner authentication and protected reporting path needed. Read-only D1 console queries are ready | Separate private-service release | Not scheduled | Private reporting service; endpoint to be agreed |
| PRIVACY | Complete operator-specific public identity/contact notices | Awaiting the owner's chosen public operator/contact details and review | Public information update once supplied | Not scheduled | Existing public website |
| QA | Full desktop/mobile, accessibility and performance checks | Wider audit added to existing Sunday Release QA; release-specific functional checks remain required now | Scheduled audit; fixes depend on findings | 15 November 2026 — scheduled check | Repository checks and public website fixes |
| CONTENT | Wider immigration/healthcare source review and further case coverage | Residence/account scenarios, investment literacy and two-quote transfer worksheet delivered in TAX-PREP-1; wider audit continues | Following visitor-feature releases | Not scheduled | Existing public website |
| HOSTING | Revisit AtlasEveryday/domain/hosting and tester-link continuity | Deferred; reminder set | Planning review only | 22 November 2026 — confirmed review | Hosting/domain choice remains to be agreed |

Tax details and individual completion criteria: [tax-saving roadmap](TAX_SAVINGS_ROADMAP.md) and [issue #6](https://github.com/nikunjsb/Finbridge/issues/6). The monitor must retain the incomplete TS IDs when a tax group is partly finished.

Related work: [privacy/release QA #2](https://github.com/nikunjsb/Finbridge/issues/2), [Insights verification #3](https://github.com/nikunjsb/Finbridge/issues/3), [private dashboard #4](https://github.com/nikunjsb/Finbridge/issues/4), [content/calculator/accessibility work #5](https://github.com/nikunjsb/Finbridge/issues/5), and [immigration guidance #1](https://github.com/nikunjsb/Finbridge/issues/1).

The selected-task checklist is maintained in [PENDING_TASKS.md](PENDING_TASKS.md); only verified items are checked.

## Completion baseline

- Money self-check, detailed payslip explainer, family-support preparation and double-household/departure evidence checklists are implemented; they should not reappear as wholly unbuilt tasks.
- The combined suite currently has 174 passing local tests, including 16 self-filing companion checks, 49 new expense/support/household checks, 27 investment checks, 40 prior tax-planning checks and the original 24 money/service checks. Those tests do not prove that a deployed Cloudflare cron ran.
- Private feedback review is included in daily Release QA through 19 December 2026. The older standalone feedback task stays paused within the five-active-task limit.
- TS01 and TS07–TS10 preparation features are deployed and live-verified in TAX-PREP-1. TS02–TS03 and TS05–TS06 are deployed and live-verified in TAX-WORKSHEETS; TS04 remains planned. The bounded tariff model is not a full tax assessment; broader reference coverage remains in QA.

## Daily monitor rules

The **FinBridge Pending & Releases** automation reviews this file, ROADMAP.md, TAX_SAVINGS_ROADMAP.md, existing issues, recent source changes and actual deployment evidence. It reports around 09:30 Europe/Berlin, with the original content-gap review retained on Mondays.

For each item, report status, blocker/next action, proposed release position, target date/window and destination. Distinguish confirmed dates from proposals and from not-scheduled work. Keep a concise complete pending list in each report, including when nothing changed.

Update saved task/status records only for material, evidenced changes. Preserve IDs and remaining acceptance criteria, and distinguish implemented, awaiting verification and completed. Keep private feedback and personal information out of public files/issues. Do not invent dates, release URLs, live analytics or progress.

Before any documentation commit, re-read main and Pages status. Wait until the previous latest commit has a successful deployment and no Pages run is active. Make at most one necessary documentation commit, preserve concurrent edits, and verify its deployment. When blocked, report the update as pending and retain the existing tracker. No automatic feature implementation, workflow cancellation, DNS change or hosting migration is part of this monitor.

Use live reports for the latest head/deployment status. Do not create a commit solely to record the monitor's own commit SHA, run number, check timestamp or an unchanged list; this prevents a self-generated documentation-update loop.

**EXPENSE-WORKSPACE / checklist 26a–26b:** edit-in-place records, paid/planned separation, reviewed ordinary 2026 work-tax comparison, checklist selections and tax ZIP/PDF exports are implemented. 174 tests and local calculation/download checks pass. Publication/reload/responsive verification is pending. Browser file-selection permission was declined; local evidence/ZIP-restore end-to-end verification remains explicitly pending. [Scope and review](REVIEWS/2026-11-14-expense-workspace.md).
