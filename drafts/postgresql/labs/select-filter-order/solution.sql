CREATE TEMP VIEW lesson_result AS
SELECT id, title, estimate_hours
FROM academy_tasks
WHERE tenant_id = 'alpha' AND status = 'todo'
ORDER BY id ASC;
