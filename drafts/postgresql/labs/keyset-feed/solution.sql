CREATE TEMP VIEW lesson_page AS
SELECT id,tenant_id,created_at FROM perf_tasks
WHERE tenant_id='alpha' AND (created_at,id) < ('2026-01-08 00:00:00+00'::timestamptz,8)
ORDER BY created_at DESC,id DESC LIMIT 2;
