CREATE INDEX perf_profile_feed_idx ON perf_tasks(tenant_id,status,created_at DESC,id DESC);
EXPLAIN (ANALYZE,BUFFERS)
SELECT id,title FROM perf_tasks WHERE tenant_id='alpha' AND status='todo' ORDER BY created_at DESC,id DESC LIMIT 4;
