export async function listProjectTasks(
  db: PrismaClient, trustedTenantId: string, projectId: number,
) {
  if (!trustedTenantId || !Number.isSafeInteger(projectId))
    throw new Error("Invalid request context");
  const project = await db.project.findFirst({
    where: { id: projectId, tenantId: trustedTenantId },
    select: { id: true },
  });
  if (!project) return [];
  return db.task.findMany({
    where: { projectId, tenantId: trustedTenantId },
    select: { id: true, title: true, status: true },
    orderBy: { id: "asc" }, take: 100,
  });
}
