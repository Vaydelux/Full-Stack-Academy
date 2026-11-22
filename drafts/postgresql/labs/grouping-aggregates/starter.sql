CREATE TEMP VIEW lesson_result AS
SELECT p.id AS project_id, COUNT(*) AS task_count
FROM academy_projects p
LEFT JOIN academy_tasks t ON t.project_id = p.id
WHERE p.tenant_id = 'alpha'
GROUP BY p.id;
