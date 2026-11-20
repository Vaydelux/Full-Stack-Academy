> **Latest P1 release preparation (2026-11-20):** Full eight-lesson RHF 09.02 promotion candidates now exist outside published registries with real-browser-backed individual test implementations and an isolated dynamic-port test runner. Source bundles reviewed 8/8; no fresh Node24/Chromium run or manual accessibility evidence is available here; the real nested npm lock is already present. `status:forms-query-rhf-candidates` and `test:forms-query-rhf-candidates` are source gates, **not release approval**. Module published total remains zero, overall total 338. See [P1 handoff](P1_RHF_PROMOTION_CANDIDATE.md).

> **Candidate update — 2026-11-20:** Draft preview source previously in PR #36 has been consolidated into PR #38 alongside topic-specific guides for all 16 P1 lessons. This is **not** permission to publish or evidence of passing a new Next/Chromium/browser/a11y run. Current verified published total remains 338. See `docs/P1_CONTENT_PREVIEW_ACCEPTANCE.md` and `npm run status:forms-query-p1`.

# Full-Stack Academy — Complete the Existing 889 Topics First

**Program established:** 2026-11-20  
**Current canonical baseline:** 28 tracks · 111 modules · 889 topics · **338 published unique IDs** · 42 completed modules  
**Work remaining:** **551 unpublished topics across 69 incomplete modules**, including **16 staged** React Hook Form / TanStack Query lessons and **535 without drafts**.  
**Scope freeze:** Finish the existing curriculum before new tracks, product features or feature-heavy site redesigns. Security/reliability fixes that protect existing learning remain allowed.

The canonical content and the live published registry determine all numbers. The script below generates phase status from actual files; this document is a development contract, **not** proof that unverified lessons have been published.

## Phase sequence and acceptance targets

| Phase | Curriculum scope | Modules to finish | Remaining unpublished topics at baseline | Published total after completion |
|---|---|---:|---:|---:|
| **P1** | 09.02 React Hook Form + 09.03 TanStack Query | 2 | 16 | **354 / 889** |
| **P2** | 11.01–11.04 NestJS & Fastify | 4 | 32 | **386 / 889** |
| **P3** | 12.01–12.05 PostgreSQL | 5 | 40 | **426 / 889** |
| **P4** | 13.01–13.04 Prisma + 14.01–14.04 Supabase | 8 | 64 | **490 / 889** |
| **P5** | 15 Security, 16 Redis/BullMQ, 17 Realtime, 18 Integrations | 15 | **119** | **609 / 889** |
| **P6** | 19 Testing, 20 Delivery, 21 SRE, 22 Performance, 23 Architecture | 18 | 144 | **753 / 889** |
| **P7** | 24 Mobile/Desktop, 25 Advanced Data, 26 Enterprise, 27 Capstones | 17 | 136 | **889 / 889** |
| **TOTAL** | All remaining canonical lessons | **69** | **551** | **889 / 889** |

**Existing lesson exception:** \`15.02.04\` is already published as an authored interactive lesson even though module 15.02 is incomplete. Phase P5 adds the *other seven* topics in 15.02, not a duplicate \`15.02.04\`. This explains why P5 requires 119, not 120, new unique publications.

## Small, repeatable shipping unit

**One eight-topic module is the normal publication unit**, not a whole 100-topic mega-merge. A phase is a track-group milestone; release candidates are modules. Each of the 69 incomplete modules has its own branch/PR, acceptance report and checkpoint. For the partially published identity module, the unit is the seven missing canonical topics plus compatibility qualification for its existing published lesson.

A module passes in this order:

1. **Curriculum:** Eight canonical IDs and titles, ordered prerequisites, clear learning objectives, real official references and current major versions.
2. **Teaching:** Eight substantial MDX lessons, real explanations, prediction, guided red/green source, bug hunts, misconception correction, knowledge checks, security limits and references. No filler and no duplicated generic articles.
3. **Executable practice:** Every topic has an isolated learner starter that fails a *specific semantic assertion*, an instructor implementation that passes, and a checked-in lab manifest. Use actual Nest/PG/Prisma/RHF/TanStack/Redis packages when the topic teaches those APIs; never substitute mocked source searches as a runtime pass.
4. **Trust boundaries:** Validate server inputs, auth/RLS and tenant isolation in real backend tests. Use no service-role credentials in public frontend code. The Forms/Query Task API remains loopback-only, unauthenticated and educational; it cannot be treated as production authorization.
5. **Quality gates:** Dependency locks created with real npm; test starter failures against expected assertion codes, instructor tests, lint/typecheck, dependency/runtime smoke, negative cases and a real local browser when the topic has UI.
6. **Accessibility:** Verify keyboard interaction, focus and status/error announcements, contrast and 200% zoom; complete a named screen-reader review for UI modules. Never invent a human-reviewed record.
7. **Atomic publication:** Import all eight MDX and metadata entries into both registries, add all eight lab manifests and test scripts, reconcile the staging validator and update the checkpoint only when every lesson in the module is qualified. Partial/ambiguous publication must fail the local gate.
8. **Release evidence:** Record exact local commands, Node/runtime versions, test counts and real blockers. Code inspection or previous-branch checks do not certify a new candidate. Never rely on GitHub Actions/Vercel to infer local test success.

## Current work: P1 — Forms/Query

The source-staged 16-pack has a genuine npm-generated nested React lockfile and historical local Node24/Vite/Chrome/SSR qualification from prior committed work. **PR #36** adds *no-index in-academy previews* and draft quiz-progress isolation, but is not merged because its new MDX imports require a full Next.js compilation and Playwright check.

Ship P1 in this dependency order:

- **09.02**: Publish the eight RHF lessons, with published metadata/MDX, locked library and resolver, eight runnable red/green labs and the real browser error/submit/focus tests; complete manual screen-reader and zoom review. Target: **346** published unique IDs, **43** complete modules.
- **09.03**: Publish eight TanStack Query lessons, including query-key/filtered cache isolation, staleTime/gcTime, mutations, safe idempotency, optimistic rollback, bounded infinite queries, AbortSignal, Next SSR hydrate and final remote-task capstone. Target: **354** published, **44** complete modules.
- For both: keep the learner-visible staged preview honest until formal promotion. No automatic published progress on draft pages. Do not add new features during release qualification.

**Do not** try to cross a gate by changing a lesson's status flag, checkpoint counts, or a mock test outcome without the corresponding runtime evidence.

## P2–P7 implementation order

- **P2 Nest:** real dependency injection container, module/guard/pipe/interceptor behavior and HTTP integration with isolated Fastify/Nest service ports. Four complete eight-topic modules.
- **P3 PostgreSQL:** isolated PostgreSQL instance for DDL, constraints, transactions/concurrency, plans/indexing, backup/recovery; no pretend SQL string tests.
- **P4 Persistence:** Prisma migrations, transactional integrity, proper Supabase Auth/RLS/Storage isolation; test negative RLS access with two independent user sessions.
- **P5 Security/services:** identity/MFA/RBAC, Redis key TTL/eviction, BullMQ retry/dead-letter/idempotency, realtime tenant-scoped subscriptions, file/email/webhooks. Real local integrations, explicit unavailable-external-service blockers.
- **P6 Engineering:** frontend/backend/DB performance and testing, Docker/CI/CD reproducibility, instrumentation and fault injection, SRE runbooks and architecture alternatives with measured tradeoffs. GitHub Actions remain optional/disabled for this user's workflow.
- **P7 Graduation:** Capacitor/offline reconciliation, Tauri security, geospatial/AI/RAG privacy, billing/regulatory boundaries and progressive capstones ending in an evidence-backed review/defense.

## Live status and reproducible checks

Run locally from the repo root on Node 22+ for the dependency-free phase status, and Node 24 for the full release gates:

\`\`\`bash
# Entire plan, always calculated from actual publication files:
npm run status:publication-phases

# See a single phase and the exact missing canonical topic IDs:
node scripts/curriculum-phase-program.mjs --phase P1 --json

# Ensure no module is omitted or double-scheduled:
npm run test:publication-phases

# Existing staged publication/React/full academy verification:
npm run test:forms-query-promotion
npm run qualify:forms-query:source
npm run qualify:forms-query:full
npm run verify:offline
\`\`\`

The phase script is **read-only**. It never publishes, writes metadata, alters status, enables cloud CI or changes the 889-topic canonical syllabus. Its calculations remain correct when a module moves from staged to published. The checks are included in \`verify:offline\` and are designed to fail if topic/module identities or checkpoint totals diverge.

## Exit criteria before product expansion

Declare **curriculum complete** only when the source-derived report shows **889 / 889 published, 111 / 111 modules complete, zero planned/unstaged topics**, every published lab manifest and negative test passes, the root Next production app builds, and real browser/accessibility release evidence is available. Then freeze the curriculum content and begin feature expansion as a **separate** initiative with its own priorities.

For current unfinished implementation detail see \`docs/NEXT_TODO.md\`, \`docs/FORMS_QUERY_PUBLICATION_READINESS.md\`, \`docs/FORMS_QUERY_DRAFT_PREVIEW_ACCEPTANCE.md\` and \`AGENTS.md\`.
