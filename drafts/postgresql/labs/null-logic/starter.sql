CREATE TEMP VIEW lesson_result AS
SELECT id, title FROM academy_tasks
WHERE tenant_id = 'alpha' AND due_on = NULL;
