DO $check$ DECLARE def text; BEGIN
 SELECT indexdef INTO def FROM pg_indexes WHERE schemaname LIKE 'pg_temp_%' AND indexname='perf_tenant_feed_idx' LIMIT 1;
 IF def IS NULL OR position('(tenant_id, created_at DESC, id DESC)' in def)=0 THEN RAISE EXCEPTION '12.04.02 tenant-leading composite index missing'; END IF;
END $check$;
