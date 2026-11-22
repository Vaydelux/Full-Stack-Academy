DO $lesson$
BEGIN
 IF (SELECT count(*) FROM lesson_result) <> 3
    OR EXISTS (SELECT 1 FROM lesson_result WHERE id = 3)
    OR (SELECT display_name FROM lesson_result WHERE id = 1) IS DISTINCT FROM 'Ana'
    OR (SELECT active FROM lesson_result WHERE id = 4) IS DISTINCT FROM false
 THEN RAISE EXCEPTION '12.01.01 wrong column or tenant projection'; END IF;
END $lesson$;
