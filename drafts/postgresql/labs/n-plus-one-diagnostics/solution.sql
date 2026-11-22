SELECT p.id,p.name,t.id AS task_id,t.title AS task_title
FROM perf_projects p
LEFT JOIN perf_tasks t ON t.project_id=p.id AND t.tenant_id=p.tenant_id
WHERE p.tenant_id='alpha'
ORDER BY p.id,t.id;
