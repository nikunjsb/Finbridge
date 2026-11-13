# FinBridge pending work and release plan

Baseline: 13 November 2026. The owner selected items 1, 2, 4, 9, 10, 11, 12 and 13 for the current release. Implementation and 64 local checks are complete; publication/live verification is pending. Other feature release dates have not been agreed. The confirmed hosting milestone is a discussion/review on 22 November, not an automatic migration.

## Where updates are released

| Update type | Destination | Verification needed |
|---|---|---|
| Public guides, tax tools and website UI | Existing GitHub Pages site: https://nikunjsb.github.io/Finbridge/ | Matching successful Pages deployment plus relevant live checks |
| Backlog, task statuses, tests and source documentation | `nikunjsb/Finbridge` repository and its existing GitHub issues | Evidence for the status change; docs commits follow the same Pages release interlock |
| Analytics/location/feedback backend changes | The existing, separate Cloudflare Workers and D1 databases | Separate authenticated backend deployment and verification; Pages success alone is insufficient |
| Private owner dashboard | Owner-authenticated reporting service; final endpoint not selected | Server-side authentication and private database access before publication |

Keep the existing tester URL working. Domain, DNS and hosting migration work is deferred until 22 November.

## Pending queue

| ID | Pending work | Status / next requirement | Proposed release position | Target date | Destination |
|---|---|---|---|---|---|
| TAX-PREP-1 | Selected checklist items 1, 2, 4, 9–13: preparation tools, exports, references, asset/wording fixes (TS01, TS07–TS10) | Implemented; awaiting successful publication/live checks | Current owner-selected release | 13 November 2026 — implementation/release target | Existing public website |
| TAX-A | Deeper work-expense screening (TS02–TS03) | Pending; existing calculator regressions pass, but dated attendance, depreciation and reimbursement improvements remain | Next proposed visitor-feature release | Not scheduled | Existing public website |
| TAX-B | Relocation/double households, parent-support screening and household-services checker (TS04–TS06) | Planned extensions of existing guides; requires sourced eligibility/calculation cases | Following tax-tools release | Not scheduled | Existing public website |
| QA-FIN | Wider individual payroll, special-expense and complex treaty/foreign-tax reference coverage | Focused preparation models/reference suite implemented; wider coverage remains | Further validation with relevant releases | Not scheduled | Repository checks and public website |
| OPS-LIVE | Verify deployed Cloudflare versions, bindings/log settings, cron history and retained-row counts | Awaiting authenticated owner evidence; included in existing Sunday QA | Operational verification | 15 November 2026 — scheduled check | Existing Cloudflare services |
| OWNER | Protected analytics dashboard | Planned; owner authentication and protected reporting path needed. Read-only D1 console queries are ready | Separate private-service release | Not scheduled | Private reporting service; endpoint to be agreed |
| PRIVACY | Complete operator-specific public identity/contact notices | Awaiting the owner's chosen public operator/contact details and review | Public information update once supplied | Not scheduled | Existing public website |
| QA | Full desktop/mobile, accessibility and performance checks | Wider audit added to existing Sunday Release QA; release-specific functional checks remain required now | Scheduled audit; fixes depend on findings | 15 November 2026 — scheduled check | Repository checks and public website fixes |
| CONTENT | Wider immigration/healthcare source review and further case coverage | Residence/account scenarios, investment literacy and two-quote transfer worksheet implemented in TAX-PREP-1; wider audit continues | Following visitor-feature releases | Not scheduled | Existing public website |
| HOSTING | Revisit AtlasEveryday/domain/hosting and tester-link continuity | Deferred; reminder set | Planning review only | 22 November 2026 — confirmed review | Hosting/domain choice remains to be agreed |

Tax details and individual completion criteria: [tax-saving roadmap](TAX_SAVINGS_ROADMAP.md) and [issue #6](https://github.com/nikunjsb/Finbridge/issues/6). The monitor must retain the incomplete TS IDs when a tax group is partly finished.

Related work: [privacy/release QA #2](https://github.com/nikunjsb/Finbridge/issues/2), [Insights verification #3](https://github.com/nikunjsb/Finbridge/issues/3), [private dashboard #4](https://github.com/nikunjsb/Finbridge/issues/4), [content/calculator/accessibility work #5](https://github.com/nikunjsb/Finbridge/issues/5), and [immigration guidance #1](https://github.com/nikunjsb/Finbridge/issues/1).

The eighteen-item task checklist is maintained in [PENDING_TASKS.md](PENDING_TASKS.md); only verified items are checked.

## Completion baseline

- Money self-check, detailed payslip explainer, family-support preparation and double-household/departure evidence checklists are implemented; they should not reappear as wholly unbuilt tasks.
- The service/money-guidance suite has 24 passing local tests. Those tests do not prove that a deployed Cloudflare cron ran.
- Private feedback review is included in daily Release QA through 19 December 2026. The older standalone feedback task stays paused within the five-active-task limit.
- Selected tax preparation features are implemented but await publication/live verification. TS02–TS06 remain planned. Creating an issue or passing source tests does not mean a feature has shipped.

## Daily monitor rules

The **FinBridge Pending & Releases** automation reviews this file, ROADMAP.md, TAX_SAVINGS_ROADMAP.md, existing issues, recent source changes and actual deployment evidence. It reports around 09:30 Europe/Berlin, with the original content-gap review retained on Mondays.

For each item, report status, blocker/next action, proposed release position, target date/window and destination. Distinguish confirmed dates from proposals and from not-scheduled work. Keep a concise complete pending list in each report, including when nothing changed.

Update saved task/status records only for material, evidenced changes. Preserve IDs and remaining acceptance criteria, and distinguish implemented, awaiting verification and completed. Keep private feedback and personal information out of public files/issues. Do not invent dates, release URLs, live analytics or progress.

Before any documentation commit, re-read main and Pages status. Wait until the previous latest commit has a successful deployment and no Pages run is active. Make at most one necessary documentation commit, preserve concurrent edits, and verify its deployment. When blocked, report the update as pending and retain the existing tracker. No automatic feature implementation, workflow cancellation, DNS change or hosting migration is part of this monitor.

Use live reports for the latest head/deployment status. Do not create a commit solely to record the monitor's own commit SHA, run number, check timestamp or an unchanged list; this prevents a self-generated documentation-update loop.
