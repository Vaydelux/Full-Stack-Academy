async function renameTask(db: PrismaClient, taskId: number, title: string) {
  return db.task.update({ where: { id: taskId }, data: { title } });
}
