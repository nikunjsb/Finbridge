-- Separate D1 database for opt-in FinBridge Insights.
-- Aggregate-only: no raw question/search, IP, visitor ID, session ID or user agent.
CREATE TABLE IF NOT EXISTS insight_daily (
  day TEXT NOT NULL,
  source TEXT NOT NULL CHECK(source IN ('overview_search','library_search','ai_question')),
  topic TEXT NOT NULL CHECK(topic IN ('immigration','healthcare','salary','tax','budget','insurance','crossborder','moving','language','other')),
  outcome TEXT NOT NULL CHECK(outcome IN ('matched','unmatched','success','error')),
  total INTEGER NOT NULL DEFAULT 0 CHECK(total>=0),
  PRIMARY KEY(day,source,topic,outcome)
);
CREATE INDEX IF NOT EXISTS insight_daily_date ON insight_daily(day);
-- Run daily via D1 scheduled cleanup or a separate protected cron handler.
-- DELETE FROM insight_daily WHERE day < date('now','-30 day');
