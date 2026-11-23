async function listTasks(db: PrismaClient, tenantId: string) {
  return db.task.findMany({
    where: { tenantId },
    select: {
      id: true, title: true,
      owner: { select: { id: true, displayName: true } },
    },
    take: 20,
    orderBy: { id: "asc" },
  });
}
