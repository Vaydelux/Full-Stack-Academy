DO $lesson$
BEGIN
 IF (SELECT count(*) FROM lesson_result) <> 3
    OR (SELECT owner FROM lesson_result WHERE project_id = 10) IS DISTINCT FROM 'Ana'
    OR (SELECT owner FROM lesson_result WHERE project_id = 11) IS DISTINCT FROM 'Bo'
    OR (SELECT owner FROM lesson_result WHERE project_id = 12) IS DISTINCT FROM 'Ana'
    OR EXISTS (SELECT 1 FROM lesson_result WHERE project_id = 20)
 THEN RAISE EXCEPTION '12.01.03 wrong foreign-key join or cross-tenant exposure'; END IF;
END $lesson$;
