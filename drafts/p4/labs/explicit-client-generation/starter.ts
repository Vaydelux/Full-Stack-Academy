// Source-only illustration of an old package-location assumption.
import { PrismaClient } from "@prisma/client";
export const db = new PrismaClient();
