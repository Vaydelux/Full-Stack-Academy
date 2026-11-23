const prisma = new PrismaClient({
  adapter,
  log: ["query", "info", "warn", "error"],
});
console.log("password and DATABASE_URL", process.env.DATABASE_URL);
