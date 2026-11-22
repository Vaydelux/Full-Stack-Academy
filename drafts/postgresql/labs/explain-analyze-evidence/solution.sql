EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT id,title FROM perf_tasks WHERE tenant_id='alpha' AND status='todo';
