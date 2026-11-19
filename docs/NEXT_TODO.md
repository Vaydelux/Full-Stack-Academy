# Full-Stack Academy — Current engineering handoff (2026-11-19)

## Completed source state

- Owner-directed PRs #20–#28 have merged into main before this feature. The curriculum source remains **338 published unique IDs, 337 MDX lessons/lab fixtures, 42 complete modules, 38 authored references, 303 indexed topics and 551 of 889 topics still planned**.
- This next feature prepares **09.02 React Hook Form** and **09.03 TanStack Query** through a real runnable educational backend, an accessible native-form practice page and isolated genuine React Query/RHF reference source. It DOES NOT publish 16 new lesson IDs.
- Fixed **16 planned topic reference URLs** to official RHF/resolver/TanStack docs rather than the incorrect blanket Zod link.
- Real HTTP capstone at examples/forms-query-vertical/ (Node built-ins only): validation, body/field caps, idempotency replay/conflict, strict loopback origin, cursor paging and conflict recovery, deletion, CSP-protected static teaching UI, no arbitrary HTML.
- Separate react-client/ has real React 19, RHF, @hookform/resolvers, TanStack Query 5 and Zod 4 imports and an interactive draft UI. The nested package manifest is **not installed, not locked and not imported into the main Next app**, so core app dependency graph is unchanged.
- Source workbook with **all 16 canonical topic goals, guided exercises and observable acceptance expectations**, not fabricated completed MDX lessons.
- 22/22 **real Node HTTP tests** passed in local sandbox; API source and test blobs match committed GitHub bytes. React TS/TSX syntax-only transpile passed with locally available TypeScript.

## Important release blockers

- [ ] Registry/GitHub clone access needs to work for a real full Node 24 checkout. Npm registry and github.com DNS could not resolve in this execution.
- [ ] Use npm on an actual Node 24 checkout to install real package versions, generate package-lock and execute root and nested npm ci, typecheck, builds.
- [ ] Test React form, Query cancellation, mutations, optimistic rollback, retry, responsiveness and keyboard using actual installed libraries in an isolated browser. Vite/react-client is currently **not runtime-qualified**.
- [ ] Complete 09.02.01–09.02.08 and 09.03.01–09.03.08 as 16 actual MDX/meta/instructor/starter/negative-test/rubric packages. Only then register and increment published counts.
- [ ] Run full existing 337+ lab and negative-starter suites, lint, TypeScript, content/checkpoint validation and Next build on the exact head.
- [ ] Chromium launch stalled locally; perform desktop/tablet/320px, reduced-motion, screen-reader and focus checks before release.
- [ ] Review historical dev-only Picomatch exception by **2026-12-02 UTC**.
- [ ] Teaching API has no durable persistence or authorization. Never publicly deploy it; auth/TLS/tenant isolation, rate limiting and audit are future production boundaries, not built features.

## Ordered next milestones

1. **P0 Qualification:** Node 24 npm ci + npm run verify:offline, exact SHA; nested React npm install/typecheck/build, local browser validation; correct failures. No hosted/Actions gates needed.
2. **P1 Publish RHF/Query 16-topic track:** complete all canonical lesson packs and real frontend tests using examples/forms-query-vertical as source scaffolding, keep red starters intentionally assertion failing.
3. **P2 NestJS 11.01–11.04:** 32 lessons with genuine packages, real DI and HTTP fixtures.
4. **P3 PostgreSQL 12.01–12.05:** 40 lessons with actual database, isolation, transactions, EXPLAIN and rollback.
5. **P4 Prisma + Supabase 13–14:** generated clients, actual schema migrations, denial-first RLS tests, Auth/Storage boundaries.

## Read first

- AGENTS.md
- docs/FORMS_QUERY_CAPSTONE_ACCEPTANCE.md
- examples/forms-query-vertical/README.md
- examples/forms-query-vertical/WORKBOOK.md
- docs/FORMS_QUERY_NEXT_MILESTONE.md
- docs/checkpoint.json

Never conflate source-authored, locally tested and production-qualified. No GitHub Actions or Vercel checks were used for this continuation.
