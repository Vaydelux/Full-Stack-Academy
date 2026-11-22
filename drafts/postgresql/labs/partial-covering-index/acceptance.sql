DO $check$ DECLARE def text; BEGIN
 SELECT indexdef INTO def FROM pg_indexes WHERE schemaname LIKE 'pg_temp_%' AND indexname='perf_active_feed_idx' LIMIT 1;
 IF def IS NULL OR position('INCLUDE (title)' in def)=0 OR position('WHERE (deleted_at IS NULL)' in def)=0 THEN RAISE EXCEPTION '12.04.03 partial predicate or covering field missing'; END IF;
END $check$;
