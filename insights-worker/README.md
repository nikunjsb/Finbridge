# FinBridge Insights (deployed; optional opt-in telemetry)

## Purpose
Track **opt-in category totals only**. No raw search terms, AI prompts, AI answers, histories, identity/session tokens, IP addresses, geographic data or free-text. Separate from FinBridge AI, feedback and location-trial Workers.

## Current safety gate
The separate Worker and D1 database have been deployed, a test event was successfully written and removed, and a daily 03:00 UTC cleanup trigger has been configured. The public frontend endpoint is now set, **but tracking is still off for every visitor by default**. The visitor must explicitly opt in using the Privacy & backup page. Review legal disclosures and verify operation and retention before broad promotion. There is no public statistics endpoint.

## Cloudflare setup
1. Create a **new** D1 database called `finbridge-insights` (do not reuse `finbridgelocationtrial`).
2. Run `schema.sql` using D1 Console/Execute SQL, then verify the table.
3. Create a separate Worker `finbridge-insights`, deploy `src/index.js`, bind D1 as `DB` and rate limiter as `RATE_LIMITER` (e.g. 30 per 60 seconds; unique namespace ID).
4. Never place credentials or account tokens in `index.html`, `app.js` or `insights-config.js`.
5. A daily 03:00 UTC Cron Trigger has been configured in Cloudflare. The `scheduled()` Worker handler removes days older than the most recent 30 UTC dates. Test the cron execution before relying on automatic deletion.
6. Validate only same-origin JSON POSTs, no extras/free-text, and D1 aggregate rows. **Origin alone is not authentication**; do not expose visitor/admin reports or trust counts as anti-abuse-proof.
7. Review tracking disclosures and opt-in/withdrawal. The frontend endpoint is configured; do not bypass the opt-in switch.
8. If FinBridge moves to a custom domain, adjust the exact allowed origin and retest CORS.

## Accepted payload (only three fixed enum strings)
`{"source":"overview_search","topic":"immigration","outcome":"matched"}`

Allowed sources: overview_search, library_search, ai_question.
Allowed topics: immigration, healthcare, salary, tax, budget, insurance, crossborder, moving, language, other.
Allowed outcomes: matched/unmatched (searches), success/error (AI).

Only summarized totals are suitable for the owner dashboard. The backend lacks a public GET endpoint intentionally.

Read-only owner queries are available in [report.sql](report.sql) for the authenticated Insights D1 console. They summarize daily topics, unmatched searches, AI errors and rows awaiting cleanup, without returning question text or visitor records. The protected dashboard itself remains planned.

## Source verification — 12 November 2026
The repository test suite exercises browser opt-in/withdrawal, strict event fields, origin/method/size/rate checks, SQLite aggregation, failed writes and the 30-date retention boundary. External service calls are mocked. These results do not establish that the deployed Cloudflare cron ran, that its bindings/log settings match the repository, or that all live provider settings were reviewed. Verify those separately through authenticated owner access. A GitHub source commit does not redeploy this Worker.

## Testing checklist
- No data transmitted before opt-in or after withdrawal.
- No raw text, previous AI messages, financial entries or precise location anywhere in the request.
- Reject non-origin, GET, extra JSON keys, oversized JSON, invalid combinations, missing bindings.
- Check rate-limit abuse and D1 insert aggregation.
- Verify 30-day deletion job and Cloudflare logs settings.
- Interpret opt-in totals as a biased subset of users, not full traffic.
