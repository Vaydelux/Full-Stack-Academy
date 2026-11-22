CREATE TEMP VIEW lesson_result AS
SELECT id, tenant_id, title FROM modeling_tasks
WHERE tenant_id='alpha' AND status='todo';
