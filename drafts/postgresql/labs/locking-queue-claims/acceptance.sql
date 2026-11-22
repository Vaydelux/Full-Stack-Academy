DO $check$ BEGIN
 IF (SELECT count(*) FROM lesson_claim)<>1 OR (SELECT status FROM lesson_claim LIMIT 1)<>'running' OR (SELECT count(*) FROM training_jobs WHERE status='running')<>1 THEN RAISE EXCEPTION '12.03.02 claimed job was not locked and transitioned'; END IF;
END $check$;
