# P4 Prisma lock bootstrap

The isolated Prisma workspace pins Prisma 7.6.0 and pg 8.16.3 but has no genuine committed npm lockfile. The dedicated hosted workflow generates a lock from the exact package manifest using the public npm registry, verifies the lock root, exact direct pins, registry-only tarball locations and SHA-512 integrity fields, then performs a clean npm ci with lifecycle scripts disabled. It retains only the package, lock and receipt, with the source commit and file digests. It never modifies the repository or accesses databases. The receipt does not imply runtime qualification, migration success or lesson approval.

Review the retained lock (including transitive dependency and vulnerability checks), verify its digest and exact package source against the current candidate, and commit it explicitly before attempting the existing Prisma live suite. If legitimate registry dependencies do not satisfy the strict lock policy, inspect them instead of silently weakening the validator. Supabase runtime still needs a separate disposable local stack and synthetic users; no connected project is used.

Local unit test: node --test scripts/p4-prisma-lock.test.mjs. Node 24.11.1 and registry access are required for the actual hosted generation/install. The workflow is prepared on a detached candidate until the currently queued P2 rehearsal is protected from displacement.
