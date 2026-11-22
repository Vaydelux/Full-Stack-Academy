CREATE TEMP VIEW lesson_result AS
SELECT id, title, estimate_hours
FROM academy_tasks ORDER BY estimate_hours DESC;
