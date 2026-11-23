async function renameTask(
  db: PrismaClient, tenantId: string, taskId: number, title: string,
) {
  if (!tenantId || title.trim().length < 3 || title.length > 100)
    throw new Error("Invalid input");
  const result = await db.task.updateMany({
    where: { id: taskId, tenantId },
    data: { title: title.trim() },
  });
  if (result.count !== 1) throw new Error("Task not found");
  return { updated: true };
}
