-- Authored initial migration for the isolated Prisma teaching workspace only.
CREATE TABLE "Membership" (
 "tenantId" TEXT NOT NULL,
 "actorId" TEXT NOT NULL,
 "role" TEXT NOT NULL CHECK ("role" IN ('reader','editor')),
 CONSTRAINT "Membership_pkey" PRIMARY KEY ("tenantId","actorId")
);
CREATE TABLE "Task" (
 "tenantId" TEXT NOT NULL,
 "id" TEXT NOT NULL,
 "title" TEXT NOT NULL CHECK (length(trim("title")) > 0),
 "version" INTEGER NOT NULL DEFAULT 1 CHECK ("version" > 0),
 CONSTRAINT "Task_pkey" PRIMARY KEY ("tenantId","id")
);
CREATE INDEX "Task_tenantId_version_idx" ON "Task"("tenantId","version");
