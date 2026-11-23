// Unsafe: global unscoped list and accidental oversharing.
const rows = await prisma.task.findMany();
