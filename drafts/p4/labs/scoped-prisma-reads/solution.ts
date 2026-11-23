async function getTask(db: PrismaClient, tenantId: string, taskId: number) {
  if (!tenantId) throw new Error("Missing verified tenant");
  return db.task.findFirst({
    where: { id: taskId, tenantId },
    select: { id: true, title: true, status: true },
  });
}
