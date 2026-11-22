SELECT id,name FROM perf_projects WHERE tenant_id='alpha';
SELECT id,title FROM perf_tasks WHERE tenant_id='alpha' AND project_id=10;
SELECT id,title FROM perf_tasks WHERE tenant_id='alpha' AND project_id=11;
