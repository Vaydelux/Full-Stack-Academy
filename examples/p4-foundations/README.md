# P4 Prisma ORM v7 + Supabase — complete source authoring

**All 64 P4 lesson manuscripts are staged, none published.** They span the following eight canonical eight-topic modules: 13.01 Prisma Setup, 13.02 Reading & Writing Data, 13.03 Advanced Persistence, 13.04 Supabase Integration, 14.01 Supabase Architecture, 14.02 Auth & Identity, 14.03 RLS & Authorization, and 14.04 Storage & Realtime.

Every lesson contains a red/broken starter file, matching green/instructor file, an `acceptance.md` specifying a positive and negative runtime test, JSON metadata, an official source reference, and a guided MDX tutorial. A missing, mismatched, prematurely published, or unqualified source must fail the read-only verifier.

## Source and independent, executable tests

```sh
npm run test:p4-source
npm run test:p4-upload-intent
npm run status:p4
npm run test:publication-phases
npm run test:course-roadmap
```

The source test checks canonical IDs, titles, prerequisites, mixed-language fence/source parity, complete teaching blocks, manual evidence status and 64 total drafts. It does **not** execute ORM, Supabase or Next.

The independent upload-intent regression suite imports `examples/p4-foundations/tests/upload-intent.mjs` and runs eight actual Node tests. It deliberately rejects forged ownership/path fields, traversal, malformed UUIDs, unsupported MIME/size, unauthorized actors and cross-user path collisions. **The function accepts only an actor supplied by already verified server Auth and does not validate JWTs or uploaded bytes.** It cannot be presented as a real signed URL, bucket RLS or malware-scanning qualification.

## Real integration qualification — pending

### Prisma (13.01–13.04)

Use a clean Node24 checkout and installed Prisma ORM v7 packages with a genuine lockfile, `PrismaPg` adapter and disposable PostgreSQL 17+ database. Execute schema validation/generation, inspect migration SQL, test actual transactions and connection-pool behavior, log redaction, query plans and tenant-restricted repository calls. Run negative BOLA tests under two test tenants and ensure migrations run with a separately reviewed direct connection. Never use production data or `NEXT_PUBLIC_DATABASE_URL`.

### Supabase (14.01–14.04)

Use an isolated local Supabase stack with Docker and two synthetic Auth users. Never run example red starters on customer resources. Run Data API grants **and** RLS allow/deny tests (SELECT and, where applicable, INSERT/UPDATE with `WITH CHECK`), verify service-role behavior separately, and test SSR cookie refresh, OAuth redirects, TOTP verification and logout. Test private Storage access, signed URL expiry, file type/size restrictions and independently verified bytes, Realtime join/send policies, Postgres Changes events, and idempotent webhook processing with an explicitly configured signature gateway.

Cross-system DB/Storage workflows require durable PENDING/READY states, idempotency, retries and cleanup. Neither an SDK success response nor source parity establishes this end-to-end correctness.

### Full academy release

Run the full Node24 `npm ci` and Next production build, browser/mobile/keyboard smoke tests, 200% zoom, reduced-motion and a named human screen-reader review. Keep the P1→P2→P3→P4 qualification/promotion order. Lesson promotion must be explicit and atomic after the actual checks pass. **Never bump published progress just because manuscripts are merged.**

## Status handoff

The snapshot and detailed evidence are in `docs/ACADEMY_P4_COMPLETION_CHECKPOINT_20261123.md`. The source-derived roadmap at `/learn/roadmap` reads the 64 new staged IDs from `drafts/p4/lessons`; the personal `/learn/dashboard` remains untouched. `vercel.json` continues to disable Git deployments and GitHub workflows remain manual-only.
