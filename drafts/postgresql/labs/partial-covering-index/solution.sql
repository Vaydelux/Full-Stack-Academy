CREATE INDEX perf_active_feed_idx ON perf_tasks(tenant_id,created_at DESC) INCLUDE(title) WHERE deleted_at IS NULL;
