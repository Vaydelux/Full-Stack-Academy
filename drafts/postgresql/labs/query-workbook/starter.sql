CREATE TEMP VIEW lesson_result AS
SELECT u.id AS user_id, u.display_name,
 COUNT(t.id) AS open_tasks
FROM academy_users u
JOIN academy_projects p ON p.owner_id = u.id
JOIN academy_tasks t ON t.project_id = p.id
GROUP BY u.id, u.display_name;
