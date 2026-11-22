CREATE TEMP VIEW lesson_result AS
SELECT id, tenant_id, title FROM modeling_tasks WHERE status='todo';
