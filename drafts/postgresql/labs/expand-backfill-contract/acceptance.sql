DO $check$ BEGIN
 IF EXISTS(SELECT 1 FROM ops_tasks WHERE priority IS NULL OR priority<1) OR (SELECT count(*) FROM ops_tasks WHERE state='open' AND priority=2)<>2 OR EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='ops_tasks' AND column_name='priority' AND is_nullable='YES') THEN RAISE EXCEPTION '12.05.03 migration backfill or NOT NULL invariant missing'; END IF;
END $check$;
