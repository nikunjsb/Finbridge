-- Run in the authenticated Cloudflare D1 console for finbridge-insights.
-- Read-only aggregates. Counts are opt-in events, not unique people.

-- Daily totals available inside the intended retention window.
SELECT day, source, topic, outcome, total
FROM insight_daily
WHERE day >= date('now', '-29 days')
ORDER BY day DESC, source, topic, outcome;

-- Topics receiving the most events in the latest seven UTC dates.
SELECT topic, SUM(total) AS events
FROM insight_daily
WHERE day >= date('now', '-6 days')
GROUP BY topic
ORDER BY events DESC, topic;

-- Search misses and AI errors, without any search or conversation text.
SELECT source, outcome, SUM(total) AS events
FROM insight_daily
WHERE day >= date('now', '-6 days')
  AND outcome IN ('unmatched', 'error')
GROUP BY source, outcome
ORDER BY events DESC, source;

-- Rows waiting for scheduled cleanup: this should return zero after cleanup.
SELECT COUNT(*) AS expired_rows
FROM insight_daily
WHERE day < date('now', '-29 days');
