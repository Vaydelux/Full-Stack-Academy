# 13.01.03 — qualification plan, NOT executed

## Expected positive behavior
On a clean Node-supported checkout with a pinned Prisma 7 toolchain, run prisma validate, prisma generate, and TypeScript typecheck. Do not claim a valid client based on source text alone.

## Required negative test
Delete the generated output on a disposable checkout and run typecheck without generating. The import should fail; then generate and confirm the correct client path is available.

## Trust boundary
Do not commit generated clients from a developer's machine as a substitute for reproducible builds; pin versions and commit an authentic lockfile.

Pin the exact Prisma ORM 7 CLI, generated client, driver adapter, and PostgreSQL versions. Capture commands and sanitized output from a disposable database; do not claim that code-block parity proves real ORM runtime success. Keep secrets outside Git.
