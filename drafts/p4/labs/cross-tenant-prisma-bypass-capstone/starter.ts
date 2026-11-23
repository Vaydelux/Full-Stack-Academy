// Prisma may connect with RLS-bypassing role. This query leaks data.
async function getDocument(db: PrismaClient, id: number) {
  return db.document.findUnique({ where: { id } });
}
