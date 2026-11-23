type TenantContext = Readonly<{ verifiedTenantId: string }>;
type TaskDTO = Readonly<{ id: number; title: string }>;
interface TaskReader {
  list(ctx: TenantContext): Promise<TaskDTO[]>;
}
function createTaskReader(db: PrismaClient): TaskReader {
  return {
    async list({ verifiedTenantId }) {
      if (!verifiedTenantId) throw new Error("Unauthorized tenant");
      return db.task.findMany({
        where: { tenantId: verifiedTenantId },
        select: { id: true, title: true }, take: 50,
        orderBy: { id: "asc" },
      });
    },
  };
}
