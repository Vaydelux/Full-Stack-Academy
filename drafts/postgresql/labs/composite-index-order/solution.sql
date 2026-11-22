CREATE INDEX perf_tenant_feed_idx ON perf_tasks(tenant_id, created_at DESC, id DESC);
