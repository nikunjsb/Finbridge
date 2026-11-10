CREATE TABLE IF NOT EXISTS location_events (
 id TEXT PRIMARY KEY,
 visitor_id TEXT NOT NULL,
 lat REAL NOT NULL,
 lon REAL NOT NULL,
 accuracy_m REAL NOT NULL,
 country TEXT NOT NULL DEFAULT '',
 state TEXT NOT NULL DEFAULT '',
 approx_city TEXT NOT NULL DEFAULT '',
 approx_cf_country TEXT NOT NULL DEFAULT '',
 approx_cf_region TEXT NOT NULL DEFAULT '',
 created_at INTEGER NOT NULL,
 expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS location_events_time_idx ON location_events(created_at);
CREATE INDEX IF NOT EXISTS location_events_visitor_idx ON location_events(visitor_id);
CREATE INDEX IF NOT EXISTS location_events_expiry_idx ON location_events(expires_at);

-- Aggregate approximate city/region/country analytics without device GPS or browser identifiers.
CREATE TABLE IF NOT EXISTS location_approx_daily (
 day TEXT NOT NULL,
 country TEXT NOT NULL,
 region TEXT NOT NULL DEFAULT '',
 city TEXT NOT NULL DEFAULT '',
 visits INTEGER NOT NULL DEFAULT 0,
 expires_at INTEGER NOT NULL,
 PRIMARY KEY(day,country,region,city)
);
CREATE INDEX IF NOT EXISTS location_approx_daily_expiry_idx ON location_approx_daily(expires_at);

-- Aggregated manual selections, without any persistent visitor identifier.
CREATE TABLE IF NOT EXISTS location_manual_daily (
 day TEXT NOT NULL,
 selected_country TEXT NOT NULL,
 selected_state TEXT NOT NULL DEFAULT '',
 network_country TEXT NOT NULL DEFAULT '',
 network_region TEXT NOT NULL DEFAULT '',
 network_city TEXT NOT NULL DEFAULT '',
 saves INTEGER NOT NULL DEFAULT 0,
 expires_at INTEGER NOT NULL,
 PRIMARY KEY(day,selected_country,selected_state,network_country,network_region,network_city)
);
CREATE INDEX IF NOT EXISTS location_manual_daily_expiry_idx ON location_manual_daily(expires_at);

-- Unified read-only list across all three collection methods.
-- Expired entries are hidden even before the daily retention cleanup runs.
CREATE VIEW IF NOT EXISTS finbridge_all_locations AS
SELECT
 datetime(created_at,'unixepoch') AS recorded_at_utc,
 'GPS allowed' AS method,
 country AS selected_country,
 state AS selected_state,
 approx_cf_country AS network_country,
 approx_cf_region AS network_region,
 approx_city AS network_city,
 lat AS latitude,
 lon AS longitude,
 accuracy_m AS accuracy_meters,
 1 AS entries,
 datetime(expires_at,'unixepoch') AS deletes_after_utc
FROM location_events
WHERE expires_at > unixepoch()
UNION ALL
SELECT
 day AS recorded_at_utc,
 'GPS denied / approximate' AS method,
 '' AS selected_country,
 '' AS selected_state,
 country AS network_country,
 region AS network_region,
 city AS network_city,
 NULL AS latitude,
 NULL AS longitude,
 NULL AS accuracy_meters,
 visits AS entries,
 datetime(expires_at,'unixepoch') AS deletes_after_utc
FROM location_approx_daily
WHERE expires_at > unixepoch()
UNION ALL
SELECT
 day AS recorded_at_utc,
 'Manual selection' AS method,
 selected_country,
 selected_state,
 network_country,
 network_region,
 network_city,
 NULL AS latitude,
 NULL AS longitude,
 NULL AS accuracy_meters,
 saves AS entries,
 datetime(expires_at,'unixepoch') AS deletes_after_utc
FROM location_manual_daily
WHERE expires_at > unixepoch();
