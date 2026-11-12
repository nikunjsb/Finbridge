# Operations and verification checkpoint

Checked: 12 November 2026. Domain/hosting changes are deferred until 22 November. The existing GitHub Pages URL remains the tester entry point.

## Completed
- Reconciled README/roadmap/location setup notes with the configured endpoint files and implemented flows. Marked the 6 November proposal as historical.
- Verified connected GitHub read access to the private feedback repository. Private submissions are not reproduced in this public review.
- Added private-feedback review to the daily Release QA task at its existing 08:30 Europe/Berlin schedule, through the original feedback-review end date of 19 December. The corrected standalone feedback task remains paused because five scheduled tasks are already active.
- Added the previous-deployment interlock to the news-writing automation. It must stop with a publication-pending digest if a safe release cannot proceed.
- Added read-only aggregate SQL reports for the separate Insights and location D1 databases. They expose no coordinates or browser identifiers.
- Added local service tests using actual SQLite schemas and mocked external requests. All 24 tests pass, including the six existing money-guidance tests.

## Verification scope
The new tests cover browser topic-analytics opt-in/withdrawal, strict payloads, origin/method/size/rate rejection, event aggregation, storage errors, 30 UTC-date retention, location consent/deduplication/deletion, 14-day expiry, aggregate location tables/view, owner SQL reports and feedback anti-spam/storage failures. They submit no live feedback and modify no Cloudflare records.

The Insights schema's example cleanup comment now matches the implemented `-29 days` cutoff, which retains today plus the preceding 29 UTC dates. Runtime Worker behavior was not changed.

## Still pending
- Authenticated Cloudflare checks of deployed versions, binding/log settings, cron execution history and actual expired-row counts.
- Protected analytics dashboard and a server-side owner-authenticated reporting path. SQL console reports are an interim owner tool, not a completed web dashboard.
- Operator-specific public identity/contact decisions needed to complete the privacy/operator notices; no private address has been inferred or published.
- Independent financial-calculator reference cases, wider accessibility checks and deeper Germany–India account/residency tools.
- Hosting/domain planning from 22 November, including existing-link continuity and user backup/export handling.

## Reproduce local checks
Use Node with built-in `node:sqlite` support (verified with Node 24.22.1): `node --test tests/*.test.mjs`. Tests run against in-memory databases. Retain the deployment check before a repository commit, and verify its Pages result before another commit.
