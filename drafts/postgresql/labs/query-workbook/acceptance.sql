DO $lesson$
BEGIN
 IF (SELECT count(*) FROM lesson_result) <> 2
    OR (SELECT open_tasks FROM lesson_result WHERE user_id = 1) <> 1
    OR (SELECT open_tasks FROM lesson_result WHERE user_id = 2) <> 1
    OR EXISTS (SELECT 1 FROM lesson_result WHERE user_id IN (3,4))
 THEN RAISE EXCEPTION '12.01.08 workbook violates owner, status, or tenant contract'; END IF;
END $lesson$;
