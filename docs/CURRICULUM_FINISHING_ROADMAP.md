> **Latest progression (2026-11-20):** Merge `ec518b41` reported green local Node24/Vite/React, 16 red/instructor/browser staged exercises, Next SSR hydration and full academy offline build. The release focus is now **atomic publication** of 09.02 and 09.03 after human screen-reader/keyboard/200% zoom review. New prepublication readiness audit and versioned build-artifact guard are documented in [Forms/Query Publication Readiness](FORMS_QUERY_PUBLICATION_READINESS.md). 338 published remains the source truth; 16 are staged and **not** live. Next catalog expansion (NestJS/Postgres/Prisma/Supabase) comes after these two verified modules.

> **Verified runtime progress (2026-11-20):** The Forms/Query education API, typed client, native event handlers and retry policy are now tested via **102/102 real Node test cases** in an exact GitHub-source-matched partial checkout. This closes the earlier real-socket uncertainty but does not certify React, npm lockfiles, full Next or native Chromium UI. The managed Chrome sandbox blocks loopback page navigation, and the new browser gate reports that restriction. [Acceptance evidence](FORMS_QUERY_REAL_NODE_ACCEPTANCE.md), [handoff](NEXT_TODO.md). 338 published lessons unchanged, 16 RHF/Query topic packs staged. Continue with real React/browser qualification before expanding publication counts.

> **Current reliability progress (2026-11-20):** Before promotion of 09.02/09.03, the standalone React reference has been hardened with real infinite queries, retry/status policy, reliable POST acknowledgement boundaries and serialized optimistic mutations. New Node tests and browser CDP gate are source-authored; **real Node sockets, React runtime, package lock and browser acceptance remain blockers**. The 16 lesson packs remain staged, and the total published count is 338. See [current QA acceptance](FORMS_QUERY_RESILIENCE_ACCEPTANCE.md). The milestone roadmap below remains the remaining-work plan, not a claim of completion.

# Full-Stack Academy — Curriculum Completion Roadmap

**Source state dated 2026-11-20.** This roadmap is intentionally grounded in canonical content counts, not promises of immediate completion or artificial publication.

## Baseline

| Metric | Canonical repository count |
|---|---:|
| Curriculum tracks | 28 |
| Curriculum modules | 111 |
| Canonical topics | 889 |
| Published unique lessons | 338 |
| Published MDX lesson / executable-lab manifests | 337 / 337 |
| Completed whole modules | 42 |
| Remaining unpublished topics | 551 |
| Incomplete modules (may be partly published) | 69 |
| Forms / Query prepublication drafts | 16 |
| Planned topics with no draft yet | 535 |

The module 09.02 and 09.03 work in `drafts/forms-query` consists of 16 real drafted articles and 16 red/green exercise source packs; it has **not** been moved into the production lesson registry and therefore leaves published counts unchanged.

## Definition of complete (same for every future batch)

A topic is **planned** when it exists only in `data/curriculum.json`. It becomes **staged** when it has a reviewed teaching draft and exercise source but still lacks production qualification. Only consider it **published** when the runtime dependencies are genuinely installed/locked, MDX compiles, the instructor tests pass, negative learner starters fail for the expected reason, metadata and registries agree, no secrets or unsafe browser code exist, and the parent academy passes local lint/typecheck/build and accessibility smoke. A **module** is complete only when every canonical topic in it is published.

This status separation is non-negotiable. An AI-authorized merge of source files does not prove a working user experience.

## Milestone batches after the current 16-source pass

### M1 — Qualify and publish React Hook Form 09.02, TanStack Query 09.03

- Use a Node 24 checkout with registry access to install actual compatible RHF, resolvers, TanStack Query and existing React/Zod dependencies, generating trusted npm integrity hashes and lockfiles.
- Run `npm run qualify:forms-query:source`, root `npm ci && npm run verify:offline`, nested React `npm ci && npm run typecheck && npm run build`. The `qualify:forms-query:full` script fails closed on missing nested lockfile.
- Add real React DOM/keyboard tests per topic, negative starter failures, form validation, resolver I/O types, field arrays, retries, error focus, Query cache isolation, infinite queries, optimistic rollback, SSR hydration, and 412/409 browser recovery.
- Promote each verified eight-topic module atomically, including lab manifests, scripts, MDX + meta registries, checkpoint and sitemap indexing.

### M2 — NestJS 11.01–11.04 (32 topics)

Use actual locked Nest DI, guards/interceptors/pipes and HTTP integration tests; teaching demos must not reuse unauthenticated Task API as if it were a production identity system. Publish in verified eight-topic modules.

### M3 — PostgreSQL 12.01–12.05 (40 topics)

Run a real isolated PostgreSQL service with migrations, rollback, transaction isolation, constraints, query plans and concurrent updates. Validate restore and denial cases, not only happy-path SQL.

### M4 — Prisma 13 and Supabase 14 (64 topics)

Use generated client code and real migrations, strict Auth, Storage, multi-tenant authorization and denial-first RLS tests. No fabricated database or pretend RLS success.

### M5 — Remaining Production, Quality, Specialization, and Capstone tracks

Batch modules according to their actual dependency order: backend/auth first, testing/security and deployment next, then integrations, mobile shells, AI and organizational operations. Use `npm run status:curriculum` to list every incomplete module and source staging status before selecting the next family. Each batch repeats the same release gates and maintains exact counts.

## Time, budget and quality constraints

- Local-first and free-tier-friendly: prefer real Node/Browser fixtures, free tools and small independently reproducible apps. Explicitly state when realistic Postgres, cloud auth or server-side resources are mandatory.
- No GitHub Actions or Vercel checks required for the authoring workflow. Local tests, security review and browser checks remain essential.
- Block public deployment of intentionally unauthenticated loopback practice servers.
- Keep source drafts outside `src/content/lessons/` and `labs/` until real-library and browser qualification is complete.
- Root TypeScript syntax transpilation is narrower than TS typechecking; manually reviewing generated JSX is not evidence of runtime behavior.
- Every handoff updates `AGENTS.md`, `docs/NEXT_TODO.md`, `docs/checkpoint.json`, and acceptance evidence. Old dated statements must be identified as historical.
- Review the existing dev-only dependency advisory exception before **2026-12-02 UTC**.

## Runbook

```bash
npm run status:curriculum             # all module coverage, including staging
npm run test:curriculum-readiness     # fail when checkpoint/source counts disagree
npm run test:forms-query-drafts       # 16 metadata + MDX + staged source contracts, no packages
npm run test:forms-query-draft-types  # TSX syntax only, TypeScript package required
npm run qualify:forms-query:source    # genuine local HTTP tests + staging audit
npm run qualify:forms-query:full      # strict Node24, root+nested locks and builds
```

**Browser and screen reader qualification remain explicit manual/automated acceptance gates not silently satisfied by these scripts.**
