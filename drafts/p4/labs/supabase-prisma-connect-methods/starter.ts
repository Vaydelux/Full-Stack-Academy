// Unsafe assumption: a Prisma database URL is browser-safe.
const clientUrl = process.env.NEXT_PUBLIC_DATABASE_URL;
const connection = new PrismaPg({ connectionString: clientUrl! });
