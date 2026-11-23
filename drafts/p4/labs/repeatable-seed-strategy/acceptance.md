# 13.01.07 — qualification plan, NOT executed

## Expected positive behavior
On an isolated database run prisma migrate dev, prisma generate and prisma db seed twice; assert the demo tenant row count and contents, with no extra user data.

## Required negative test
Run the seed twice and verify the second execution does not grow the row count. Refuse to seed production unless a separate reviewed maintenance process authorizes it.

## Trust boundary
An idempotent upsert can still overwrite sensitive production data if the connection URL is wrong. Environment isolation is mandatory.

Pin the exact Prisma ORM 7 CLI, generated client, driver adapter, and PostgreSQL versions. Capture commands and sanitized output from a disposable database; do not claim that code-block parity proves real ORM runtime success. Keep secrets outside Git.
