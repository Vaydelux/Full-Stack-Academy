DO $lesson$
BEGIN
 IF (SELECT count(*) FROM lesson_result) <> 2
    OR NOT EXISTS (SELECT 1 FROM lesson_result WHERE id = 101)
    OR NOT EXISTS (SELECT 1 FROM lesson_result WHERE id = 104)
    OR EXISTS (SELECT 1 FROM lesson_result WHERE id = 103)
 THEN RAISE EXCEPTION '12.01.06 NULL predicate excludes valid rows'; END IF;
END $lesson$;
