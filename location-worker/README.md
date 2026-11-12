# FinBridge location trial — configured; live retention verification pending

**Status checked 12 November 2026:** `location-config.js` points to the dedicated Worker, and `wrangler.jsonc` contains the D1 binding and daily 03:00 UTC cleanup schedule. The owner previously completed the dashboard setup. Local tests exercise recording, daily deduplication, deletion, aggregate tables and expiry cleanup using the actual SQL schema. The deployed Cloudflare version, runtime bindings, logs and cron execution were not independently inspected in this check. The feedback Worker remains separate.

## Collection modes and stored records

The normal automatic browser-permission check determines a German state locally. Precise trial upload is initiated by the separately described **Share my location** button, using the native browser permission control. The UI explains the 14-day storage before that action. Trial records contain:
- A randomly generated pseudonymous browser ID (stored in localStorage to reduce repeat counts);
- GPS/device latitude and longitude, accuracy radius, timestamp;
- The visitor's selected country and German state (if any);
- Cloudflare's **approximate IP-derived city, country code, and region**. These are not GPS-confirmed and could be wrong if the visitor is on a VPN, mobile network, or corporate network.

The database deliberately does not store IP address, name, account, browser fingerprint, or user agent. The Worker uses IP temporarily for rate limiting only. Cloudflare may process normal service/security request logs independently.

The source accepts one precise event per consenting browser every 24 hours, with 14-day expiry and a scheduled cleanup handler. The Privacy & backup clear-data action requests deletion using the browser's random identifier before clearing local records. No public database-reading endpoint is provided. **One browser is not one person**; coordinate proximity is not a visitor identifier. Separate tables count approximate network locations and manual selections without GPS coordinates or browser identifiers. The `finbridge_all_locations` view hides expired rows before cleanup runs.

## Provisioning reference
These steps describe setup/re-provisioning, not a claim that the configured service is still undeployed.

1. Keep local state detection and the explicit trial-sharing action clear in the UI and privacy notice. Keep the retention explanation beside the sharing action.
2. Verify the existing D1 database and its `DB` binding in Cloudflare; use the existing database rather than creating a duplicate.
3. Confirm that the database ID in `location-worker/wrangler.jsonc` matches the deployed binding.
4. From the `location-worker` directory, run `npx wrangler d1 execute finbridge-location-trial --remote --file=./schema.sql`, then `npx wrangler deploy`. Check the configured dedicated rate limiter binding and scheduled cron trigger.
5. With controlled test data, verify recording, deduplication, deletion and expiry in the deployed service. Check rate limiting and restricted D1 dashboard access. Browser CORS is not caller authentication.
6. Confirm that `location-config.js` matches the actual deployed Worker URL after any service change.
7. Review collected statistics via **private** Cloudflare D1 SQL/dashboard access, not a publicly readable API. Example query:

```sql
SELECT date(created_at, 'unixepoch') AS day, approx_cf_country AS country,
       approx_cf_region AS region, approx_city AS city,
       COUNT(*) AS submissions, COUNT(DISTINCT visitor_id) AS unique_browsers
FROM location_events
GROUP BY day, country, region, city
ORDER BY day DESC, unique_browsers DESC;
```

Location accuracy is not assured; IP-derived city and coordinate-based location can disagree. This feature cannot reliably identify individuals.

For owner-only aggregate checks without coordinates or browser identifiers, run [report.sql](report.sql) in the authenticated location D1 console. It includes expired-row counts for each table. Run source tests with `node --test tests/*.test.mjs` from the repository root. A GitHub source commit does not redeploy this Cloudflare Worker.

## Geographic data used for normal guidance

Regular FinBridge geolocation uses a generalized 16-state Germany boundary file bundled with the website and keeps raw coordinates locally in memory. It does not send GPS to the study backend unless the visitor explicitly opts in. Visitors outside mapped German states can select a country/state manually.
