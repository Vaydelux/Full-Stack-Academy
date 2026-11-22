CREATE TEMP VIEW lesson_result AS
SELECT u.id AS user_id, u.display_name,
 COUNT(t.id) FILTER (WHERE t.status = 'todo') AS open_tasks
FROM academy_users u
LEFT JOIN academy_projects p
 ON p.owner_id = u.id AND p.tenant_id = u.tenant_id
LEFT JOIN academy_tasks t
 ON t.project_id = p.id AND t.tenant_id = u.tenant_id
WHERE u.tenant_id = 'alpha' AND u.active = true
GROUP BY u.id, u.display_name;
