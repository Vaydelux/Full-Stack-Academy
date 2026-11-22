DO $check$ BEGIN
 IF (SELECT count(*) FROM lesson_page)<>2 OR (SELECT min(id) FROM lesson_page)<>6 OR (SELECT max(id) FROM lesson_page)<>7 OR EXISTS(SELECT 1 FROM lesson_page WHERE tenant_id<>'alpha') THEN RAISE EXCEPTION '12.04.04 keyset cursor returned wrong page'; END IF;
END $check$;
