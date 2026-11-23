// Server-only Prisma composition root for an approved test/production role.
import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
const directOrPooled = process.env.DATABASE_POOL_URL;
if (!directOrPooled) throw new Error("Missing server DB URL");
const adapter = new PrismaPg({ connectionString: directOrPooled, max: 5 });
// Pass adapter to the version-pinned generated PrismaClient.
