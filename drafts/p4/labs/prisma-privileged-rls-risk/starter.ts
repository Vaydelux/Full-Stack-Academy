// A server-side PostgreSQL connection may have BYPASSRLS privileges.
return prisma.task.findMany({ where: { status: "open" } });
