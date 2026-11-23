if (!verifiedActor.tenantId || !verifiedActor.userId)
  throw new Error("Unauthenticated");
const allowedProjects = await authorizeProjectsForActor(verifiedActor);
return prisma.task.findMany({
  where: {
    tenantId: verifiedActor.tenantId,
    projectId: { in: allowedProjects },
    status: "open",
  },
  select: { id: true, title: true, projectId: true },
  take: 50,
});
