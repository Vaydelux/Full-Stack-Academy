const limit = Math.min(Math.max(Number(pageSize) || 20, 1), 50);
if (afterId != null) {
  const cursorOwner = await db.task.findFirst({
    where: { id: afterId, tenantId },
    select: { id: true },
  });
  if (!cursorOwner) throw new Error("Invalid cursor");
}
return db.task.findMany({
  where: { tenantId },
  orderBy: { id: "asc" },
  cursor: afterId == null ? undefined : { id: afterId },
  skip: afterId == null ? 0 : 1,
  take: limit,
  select: { id: true, title: true },
});
