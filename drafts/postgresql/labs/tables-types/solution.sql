CREATE TEMP VIEW lesson_result AS
SELECT id, display_name, active
FROM academy_users WHERE tenant_id = 'alpha';
