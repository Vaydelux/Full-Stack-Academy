# P4 Prisma ORM 7 + Supabase — source-only lesson qualification

This directory contains a **read-only** authoring audit for 40 newly drafted lessons in five canonical modules. It never connects to PostgreSQL, Supabase, Prisma Cloud, Vercel or GitHub Actions.

```sh
npm run test:p4-source
npm run status:p4
```

The audit requires eight correct canonical IDs per module, exact MDX-to-starter/solution parity for TypeScript, Prisma schema language, SQL and shell blocks, correct prerequisites, official references, explicit manual acceptance criteria, and all draft-only statuses. It fails closed if a lesson is marked as published or its source diverges.

## Why real integration is deliberately separate

The `starter` files deliberately demonstrate mistakes (unscoped tenant reads, secret-key exposure, permissive RLS, unsafe redirects, missing migration guards). Do **not** run them on real customers’ accounts or schemas.

For Prisma 7:
- Use an isolated workspace with **pinned** `prisma`, `@prisma/client`, `@prisma/adapter-pg` and the PostgreSQL driver, plus an authentic lockfile.
- Confirm generated Client output and config names against the installed Prisma 7 CLI. Prisma 7.10+ project templates may use `prisma7.config.ts`; do not assume latest Prisma 8 commands are compatible.
- Run validation/generation, review migrations, test CRUD and rollbacks using a dedicated PostgreSQL test database.
- Enforce authorization in server code even when the connected database role bypasses RLS.

For Supabase:
- Use `supabase --help` and the current local-development docs before starting the Docker stack.
- Never use a live project or `service_role`/secret key for client lesson execution.
- Check Data API grants *and* RLS. Test actual Auth/JWT-backed sessions and two users. A successful administrator query does not qualify an RLS policy.
- Auth flows require real token verification, email callbacks, SSR refresh and MFA error-path testing. RLS changes require pgTAP/SQL policy tests and actual Supabase Data API requests.
- Do not deploy or promise a hosted interactive lab until the tests and accessibility review pass.

**Release fact:** 40 P4 manuscripts are authored, but `readyToPublish=false`, `runtimeQualification=not-run`. The live academy count remains 338/889.

Further detail: `docs/ACADEMY_P4_PROGRESS_CHECKPOINT_20261123.md`.
