async function getDocument(
  db: PrismaClient, actor: VerifiedActor, id: number
) {
  if (!actor.userId || !actor.tenantId) throw new Error("Unauthenticated");
  const allowed = await db.membership.findFirst({
    where: { tenantId: actor.tenantId, userId: actor.userId },
    select: { userId: true },
  });
  if (!allowed) throw new Error("Forbidden");
  return db.document.findFirst({
    where: { id, tenantId: actor.tenantId },
    select: { id: true, title: true },
  });
}
