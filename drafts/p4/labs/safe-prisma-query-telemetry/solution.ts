// Keep production observability bounded and secret-free.
const prisma = new PrismaClient({
  adapter,
  log: [{ level: "warn", emit: "event" },
        { level: "error", emit: "event" }],
});
prisma.$on("error", () => {
  metrics.increment("database.error.count");
});
prisma.$on("warn", () => {
  metrics.increment("database.warning.count");
});
