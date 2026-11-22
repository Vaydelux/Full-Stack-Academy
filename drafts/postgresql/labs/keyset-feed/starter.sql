CREATE TEMP VIEW lesson_page AS
SELECT id,tenant_id,created_at FROM perf_tasks
WHERE tenant_id='alpha'
ORDER BY created_at DESC,id DESC LIMIT 2 OFFSET 2;
