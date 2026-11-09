# FinBridge opt-in location trial — prepared, not deployed

**Status:** The location-trial backend is only in GitHub source code. It is not deployed to Cloudflare and cannot store coordinates yet. `location-config.js` deliberately has an empty URL, so the location-sharing button is disabled. **Do not paste a guessed Worker URL into the config.** The existing feedback Worker is separate and must not be reused.

## What records would contain

For people who separately check the trial opt-in checkbox and press **Share location for trial**:
- A randomly generated pseudonymous browser ID (stored in localStorage to reduce repeat counts);
- GPS/device latitude and longitude, accuracy radius, timestamp;
- The visitor's selected country and German state (if any);
- Cloudflare's **approximate IP-derived city, country code, and region**. These are not GPS-confirmed and could be wrong if the visitor is on a VPN, mobile network, or corporate network.

The database deliberately does not store IP address, name, account, browser fingerprint, or user agent. The Worker uses IP temporarily for rate limiting only. Cloudflare may process normal service/security request logs independently.

The source accepts one event per consenting browser every 24 hours, with automatic 14-day purge by a Cloudflare scheduled Worker. The location page has a **Delete my trial records** control which uses the browser's random identifier to remove records. No public database-reading endpoint is provided. **One browser is not one person**; coordinate proximity is not a visitor identifier. Trial records are not stored in the feedback GitHub repository or public GitHub Pages and do not appear in Web Analytics.

## Activation checklist

1. Confirm your legal basis, GDPR notice and retention schedule for server-side **precise** geolocation. The browser's geolocation prompt authorizes access by the page, *not* consent to submit/store the location. The page therefore requires a **separate explicit opt-in checkbox** and action.
2. In the existing Cloudflare account, create a **D1** database named `finbridge-location-trial`.
3. Replace `REPLACE_WITH_YOUR_CLOUDFLARE_D1_DATABASE_ID` in `location-worker/wrangler.jsonc` with the actual ID from Cloudflare.
4. From the `location-worker` directory, run `npx wrangler d1 execute finbridge-location-trial --remote --file=./schema.sql`, then `npx wrangler deploy`. Check the configured dedicated rate limiter binding and scheduled cron trigger.
5. Verify that records from authenticated test requests are created, duplicate events within a day are not added, deletion works, and old records expire. Configure appropriate WAF/bot protection and restricted D1 dashboard access. Note that browser CORS is not security authentication and a direct caller could forge an opt-in payload.
6. Set the **exact actual deployed Worker URL** in `location-config.js`. Redeploy FinBridge after testing, making the trial button available.
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

## Geographic data used for normal guidance

Regular FinBridge geolocation uses a generalized 16-state Germany boundary file bundled with the website and keeps raw coordinates locally in memory. It does not send GPS to the study backend unless the visitor explicitly opts in. Visitors outside mapped German states can select a country/state manually.
