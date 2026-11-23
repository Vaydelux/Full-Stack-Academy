async function listTasks(db: PrismaClient, tenantId: string) {
  return db.task.findMany({
    where: { tenantId },
    include: { owner: true },
  });
}
