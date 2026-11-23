const tenantId = verifiedTenantIdFromRequest; // must be server-verified
if (!tenantId) throw new Error("Missing verified tenant");
const rows = await prisma.task.findMany({
  where: { tenantId },
  select: { id: true, title: true },
  orderBy: { id: "asc" },
  take: 20,
});
