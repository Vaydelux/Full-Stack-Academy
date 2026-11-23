export async function listProjectTasks(db: PrismaClient, projectId: number) {
  return db.task.findMany({ where: { projectId } });
}
