// Prisma 7: tagged query values are bound, not pasted into SQL.
const pattern = "%" + search + "%";
const tasks = await prisma.$queryRaw<
  Array<{ id: number; title: string }>
>(
  Prisma.sql`SELECT id, title FROM tasks
    WHERE tenant_id = ${trustedTenantId}
      AND title ILIKE ${pattern}
    ORDER BY id DESC LIMIT 50`
);
