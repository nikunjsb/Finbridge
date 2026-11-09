CREATE TABLE IF NOT EXISTS location_events (
 id TEXT PRIMARY KEY,
 visitor_id TEXT NOT NULL,
 lat REAL NOT NULL,
 lon REAL NOT NULL,
 accuracy_m REAL NOT NULL,
 country TEXT NOT NULL DEFAULT '',
 state TEXT NOT NULL DEFAULT '',
 created_at INTEGER NOT NULL,
 expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS location_events_time_idx ON location_events(created_at);
CREATE INDEX IF NOT EXISTS location_events_visitor_idx ON location_events(visitor_id);
CREATE INDEX IF NOT EXISTS location_events_expiry_idx ON location_events(expires_at);
