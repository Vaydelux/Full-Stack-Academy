CREATE TEMP VIEW lesson_result AS
WITH task_counts AS (
 SELECT t.project_id, COUNT(*) AS task_count
 FROM academy_tasks t
 WHERE t.tenant_id = 'alpha'
 GROUP BY t.project_id
)
SELECT p.id AS project_id, c.task_count
FROM academy_projects p
JOIN task_counts c ON c.project_id = p.id
WHERE p.tenant_id = 'alpha' AND c.task_count >= 2;
