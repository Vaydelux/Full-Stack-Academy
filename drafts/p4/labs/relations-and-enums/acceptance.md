# 13.01.02 — qualification plan, NOT executed

## Expected positive behavior
Generate and inspect the PostgreSQL migration; verify an actual composite FOREIGN KEY. Test both a same-tenant owner insert and a cross-tenant owner rejection in a disposable database.

## Required negative test
Try inserting a task with tenant alpha and the ID of a beta owner. The database should reject the relationship, regardless of what a frontend form permits.

## Trust boundary
Prisma's @relation is a data relationship, not an actor authorization decision. A valid same-tenant owner can still be unauthorized for a particular user.

Pin the exact Prisma ORM 7 CLI, generated client, driver adapter, and PostgreSQL versions. Capture commands and sanitized output from a disposable database; do not claim that code-block parity proves real ORM runtime success. Keep secrets outside Git.
