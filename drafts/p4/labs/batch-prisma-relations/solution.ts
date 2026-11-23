const projects = await db.project.findMany({
  where: { tenantId }, select: { id: true, name: true },
  take: 50, orderBy: { id: "asc" },
});
const ids = projects.map(p => p.id);
const tasks = await db.task.findMany({
  where: { tenantId, projectId: { in: ids } },
  select: { id: true, title: true, projectId: true },
});
const byProject = new Map(ids.map(id => [id, [] as typeof tasks]));
for (const task of tasks) byProject.get(task.projectId)?.push(task);
return projects.map(p => ({ ...p, tasks: byProject.get(p.id) ?? [] }));
