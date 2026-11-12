-- Run in the authenticated Cloudflare D1 console for the location trial.
-- Read-only aggregate results. No coordinates or browser identifiers returned.
-- Entries mean GPS submissions, approximate visits or manual saves by method;
-- they are not a count of distinct people and should not be summed as such.

SELECT date(recorded_at_utc) AS day, method,
       selected_country, selected_state, network_country,
       SUM(entries) AS entries
FROM finbridge_all_locations
GROUP BY day, method, selected_country, selected_state, network_country
ORDER BY day DESC, method, entries DESC;

-- The view hides expired rows even before the cleanup job removes them.
SELECT method, SUM(entries) AS current_entries
FROM finbridge_all_locations
GROUP BY method
ORDER BY method;

-- Check cleanup separately for all three storage tables.
SELECT 'precise' AS storage, COUNT(*) AS expired_rows
FROM location_events WHERE expires_at <= unixepoch()
UNION ALL
SELECT 'approximate', COUNT(*)
FROM location_approx_daily WHERE expires_at <= unixepoch()
UNION ALL
SELECT 'manual', COUNT(*)
FROM location_manual_daily WHERE expires_at <= unixepoch();
