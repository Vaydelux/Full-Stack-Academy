CREATE TEMP VIEW lesson_result AS
SELECT p.id AS project_id,
       COUNT(t.id) AS task_count,
       COALESCE(SUM(t.estimate_hours), 0) AS planned_hours
FROM academy_projects p
LEFT JOIN academy_tasks t
 ON t.project_id = p.id AND t.tenant_id = p.tenant_id
WHERE p.tenant_id = 'alpha'
GROUP BY p.id;
