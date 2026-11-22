DO $lesson$
BEGIN
 IF (SELECT count(*) FROM lesson_result) <> 2
    OR (SELECT min(id) FROM lesson_result) <> 101
    OR (SELECT max(id) FROM lesson_result) <> 104
    OR EXISTS (SELECT 1 FROM lesson_result WHERE id = 103)
 THEN RAISE EXCEPTION '12.01.02 filter does not isolate alpha open work'; END IF;
END $lesson$;
