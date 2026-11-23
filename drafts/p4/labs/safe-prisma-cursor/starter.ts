return db.task.findMany({
  where: { tenantId }, take: 20, skip: page * 20,
  orderBy: { createdAt: "desc" },
});
