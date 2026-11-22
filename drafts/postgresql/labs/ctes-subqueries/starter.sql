CREATE TEMP VIEW lesson_result AS
WITH task_counts AS (
 SELECT project_id, COUNT(*) AS task_count
 FROM academy_tasks GROUP BY project_id
)
SELECT project_id, task_count
FROM task_counts WHERE task_count >= 1;
