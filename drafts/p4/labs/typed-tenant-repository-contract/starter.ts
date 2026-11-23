// Any controller can perform unscoped reads.
export function tasksRepo(db: PrismaClient) {
  return db.task;
}
