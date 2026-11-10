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
