import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

function requiredUrl() {
  const value = process.env.DATABASE_URL;
  if (!value) throw new Error("DATABASE_URL is required");
  return value;
}
const adapter = new PrismaPg({ connectionString: requiredUrl() });
export const prisma = new PrismaClient({ adapter });
