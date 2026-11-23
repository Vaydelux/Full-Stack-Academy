// Repeated execution creates duplicate rows or fails unique constraints.
await prisma.user.create({
  data: { tenantId: "demo", email: "learner@example.test" },
});
