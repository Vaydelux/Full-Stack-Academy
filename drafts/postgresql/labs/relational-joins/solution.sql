CREATE TEMP VIEW lesson_result AS
SELECT p.id AS project_id, u.display_name AS owner, p.title AS project
FROM academy_projects p
JOIN academy_users u
  ON u.id = p.owner_id AND u.tenant_id = p.tenant_id
WHERE p.tenant_id = 'alpha';
