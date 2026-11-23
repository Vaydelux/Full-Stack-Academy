async function getTask(db: PrismaClient, taskId: number) {
  return db.task.findUnique({ where: { id: taskId } });
}
