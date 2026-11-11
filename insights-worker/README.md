# FinBridge Insights (NOT DEPLOYED / NOT ACTIVE)

## Purpose
Track **opt-in category totals only**. No raw search terms, AI prompts, AI answers, histories, identity/session tokens, IP addresses, geographic data or free-text. Separate from FinBridge AI, feedback and location-trial Workers.

## Current safety gate
This repository contains only a server-side starter and D1 schema. The frontend endpoint stays **empty** and must remain empty until the privacy and consent UI is verified, the Cloudflare Worker/D1 are deployed, rate limiting is configured and an independent privacy/legal review is complete. There is no public statistics endpoint.

## Cloudflare setup
1. Create a **new** D1 database called `finbridge-insights` (do not reuse `finbridgelocationtrial`).
2. Run `schema.sql` using D1 Console/Execute SQL, then verify the table.
3. Create a separate Worker `finbridge-insights`, deploy `src/index.js`, bind D1 as `DB` and rate limiter as `RATE_LIMITER` (e.g. 30 per 60 seconds; unique namespace ID).
4. Never place credentials or account tokens in `index.html`, `app.js` or `insights-config.js`.
5. Add a daily database-retention job (30 days). The example SQL in `schema.sql` is **not** an automatic scheduled cleanup.
6. Validate only same-origin JSON POSTs, no extras/free-text, and D1 aggregate rows. **Origin alone is not authentication**; do not expose visitor/admin reports or trust counts as anti-abuse-proof.
7. Review tracking disclosures and opt-in/withdrawal. Only afterward set the frontend endpoint.
8. If FinBridge moves to a custom domain, adjust the exact allowed origin and retest CORS.

## Accepted payload (only three fixed enum strings)
`{"source":"overview_search","topic":"immigration","outcome":"matched"}`

Allowed sources: overview_search, library_search, ai_question.
Allowed topics: immigration, healthcare, salary, tax, budget, insurance, crossborder, moving, language, other.
Allowed outcomes: matched/unmatched (searches), success/error (AI).

Only summarized totals are suitable for the owner dashboard. The backend lacks a public GET endpoint intentionally.

## Testing checklist
- No data transmitted before opt-in or after withdrawal.
- No raw text, previous AI messages, financial entries or precise location anywhere in the request.
- Reject non-origin, GET, extra JSON keys, oversized JSON, invalid combinations, missing bindings.
- Check rate-limit abuse and D1 insert aggregation.
- Verify 30-day deletion job and Cloudflare logs settings.
- Interpret opt-in totals as a biased subset of users, not full traffic.
