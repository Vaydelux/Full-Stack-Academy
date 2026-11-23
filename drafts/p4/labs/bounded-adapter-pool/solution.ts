// Composition root: initialize once per process, not per HTTP request.
const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("Missing database URL");
const adapter = new PrismaPg({
  connectionString,
  max: 5,
  connectionTimeoutMillis: 3000,
});
export const prisma = new PrismaClient({ adapter });
// Deployment config must budget max * server processes + reserves.
