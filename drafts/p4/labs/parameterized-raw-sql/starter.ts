// Vulnerable: interpolated SQL and no tenant boundary.
const tasks = await prisma.$queryRawUnsafe(
  "SELECT id, title FROM tasks WHERE title ILIKE '%" + search + "%'"
);
