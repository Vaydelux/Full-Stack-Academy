const projects = await db.project.findMany({ where: { tenantId } });
for (const project of projects) {
  project.tasks = await db.task.findMany({
    where: { projectId: project.id },
  });
}
