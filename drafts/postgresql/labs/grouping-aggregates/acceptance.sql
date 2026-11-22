DO $lesson$
BEGIN
 IF (SELECT count(*) FROM lesson_result) <> 3
    OR (SELECT task_count FROM lesson_result WHERE project_id = 10) <> 3
    OR (SELECT planned_hours FROM lesson_result WHERE project_id = 10) <> 9
    OR (SELECT task_count FROM lesson_result WHERE project_id = 11) <> 2
    OR (SELECT planned_hours FROM lesson_result WHERE project_id = 11) <> 2
    OR (SELECT task_count FROM lesson_result WHERE project_id = 12) <> 0
    OR (SELECT planned_hours FROM lesson_result WHERE project_id = 12) <> 0
 THEN RAISE EXCEPTION '12.01.04 wrong aggregate count or missing empty project'; END IF;
END $lesson$;
