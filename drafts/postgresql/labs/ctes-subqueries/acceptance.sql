DO $lesson$
BEGIN
 IF (SELECT count(*) FROM lesson_result) <> 2
    OR (SELECT task_count FROM lesson_result WHERE project_id = 10) <> 3
    OR (SELECT task_count FROM lesson_result WHERE project_id = 11) <> 2
    OR EXISTS (SELECT 1 FROM lesson_result WHERE project_id = 20)
 THEN RAISE EXCEPTION '12.01.07 CTE returns wrong grouping or other tenant'; END IF;
END $lesson$;
