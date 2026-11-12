# FinBridge pending work and release plan

Baseline: 12 November 2026. This is a readiness-based plan. The order below is proposed; feature release dates have not yet been agreed. The confirmed hosting milestone is a discussion/review on 22 November, not an automatic migration.

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
| TAX-A | Guided tax opportunity finder, work expenses and calculation reference cases (TS01–TS03) | Planned; verify year-specific rules and independent examples | Next proposed visitor-feature release | Not scheduled | Existing public website |
| TAX-B | Relocation/double households, parent-support screening and household-services checker (TS04–TS06) | Planned extensions of existing guides; requires sourced eligibility/calculation cases | Following tax-tools release | Not scheduled | Existing public website |
| TAX-C | Insurance/special expenses, family/student paths, Germany–India relief, receipt exports and tax-effect estimates (TS07–TS10) | Planned; maintain local data handling and model assumptions | Later tax-tools release; may be split | Not scheduled | Existing public website |
| OPS-LIVE | Verify deployed Cloudflare versions, bindings/log settings, cron history and retained-row counts | Awaiting authenticated owner checks; local service tests already pass | Operational verification, before relying on live reports | Not scheduled | Existing Cloudflare services |
| OWNER | Protected analytics dashboard | Planned; owner authentication and protected reporting path needed. Read-only D1 console queries are ready | Separate private-service release | Not scheduled | Private reporting service; endpoint to be agreed |
| PRIVACY | Complete operator-specific public identity/contact notices | Awaiting the owner's chosen public operator/contact details and review | Public information update once supplied | Not scheduled | Existing public website |
| QA | Wider financial-reference, accessibility and performance checks | Ongoing backlog; money-guidance browser checks and local service tests are complete | Required checks accompany relevant releases | Not scheduled | Repository checks and public website fixes |
| CONTENT | Deeper Germany–India residence/account scenarios, transfer-cost worksheet and wider immigration/healthcare source review | Planned/ongoing; distinguish existing implemented guides from remaining case coverage | Following visitor-feature releases | Not scheduled | Existing public website |
| HOSTING | Revisit AtlasEveryday/domain/hosting and tester-link continuity | Deferred; reminder set | Planning review only | 22 November 2026 — confirmed review | Hosting/domain choice remains to be agreed |

Tax details and individual completion criteria: [tax-saving roadmap](TAX_SAVINGS_ROADMAP.md) and [issue #6](https://github.com/nikunjsb/Finbridge/issues/6). The monitor must retain the incomplete TS IDs when a tax group is partly finished.

Related work: [privacy/release QA #2](https://github.com/nikunjsb/Finbridge/issues/2), [Insights verification #3](https://github.com/nikunjsb/Finbridge/issues/3), [private dashboard #4](https://github.com/nikunjsb/Finbridge/issues/4), [content/calculator/accessibility work #5](https://github.com/nikunjsb/Finbridge/issues/5), and [immigration guidance #1](https://github.com/nikunjsb/Finbridge/issues/1).

## Completion baseline

- Money self-check, detailed payslip explainer, family-support preparation and double-household/departure evidence checklists are implemented; they should not reappear as wholly unbuilt tasks.
- The service/money-guidance suite has 24 passing local tests. Those tests do not prove that a deployed Cloudflare cron ran.
- Private feedback review is included in daily Release QA through 19 December 2026. The older standalone feedback task stays paused within the five-active-task limit.
- The tax-saving roadmap is planned work. Creating a plan or a GitHub issue does not mean its calculators have shipped.

## Daily monitor rules

The **FinBridge Pending & Releases** automation reviews this file, ROADMAP.md, TAX_SAVINGS_ROADMAP.md, existing issues, recent source changes and actual deployment evidence. It reports around 09:30 Europe/Berlin, with the original content-gap review retained on Mondays.

For each item, report status, blocker/next action, proposed release position, target date/window and destination. Distinguish confirmed dates from proposals and from not-scheduled work. Keep a concise complete pending list in each report, including when nothing changed.

Update saved task/status records only for material, evidenced changes. Preserve IDs and remaining acceptance criteria, and distinguish implemented, awaiting verification and completed. Keep private feedback and personal information out of public files/issues. Do not invent dates, release URLs, live analytics or progress.

Before any documentation commit, re-read main and Pages status. Wait until the previous latest commit has a successful deployment and no Pages run is active. Make at most one necessary documentation commit, preserve concurrent edits, and verify its deployment. When blocked, report the update as pending and retain the existing tracker. No automatic feature implementation, workflow cancellation, DNS change or hosting migration is part of this monitor.

Use live reports for the latest head/deployment status. Do not create a commit solely to record the monitor's own commit SHA, run number, check timestamp or an unchanged list; this prevents a self-generated documentation-update loop.
