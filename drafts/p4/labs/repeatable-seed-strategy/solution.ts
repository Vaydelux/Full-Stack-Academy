// Requires @@unique([tenantId,email]) in User.
// Use ONLY an explicitly designated local/dev demo database.
await prisma.user.upsert({
  where: { tenantId_email: {
    tenantId: "demo", email: "learner@example.test",
  }},
  create: { tenantId: "demo", email: "learner@example.test" },
  update: {},
});
