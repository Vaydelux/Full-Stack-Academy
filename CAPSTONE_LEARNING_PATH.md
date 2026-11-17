# Progressive Engineering Capstone — CollabSpace

**Product:** A generic collaborative workspace (not ERP or inventory). Built to exercise Next.js/NestJS/Supabase/Prisma/Zod/Redis architecture without turning into a tutorial about a particular business domain.

**Goal:** Every feature milestone reinforces the concepts just learned. The final artifact includes deployed web pages, a secured backend, durable data, authorized resource access, background operations, tests and operations documentation.

## Milestone zero — Understand the product before coding

- **Learning areas:** client/server, requirements, Git, architecture diagrams.
- **Build:** draft a one-page problem statement, roles (member, manager, admin), 6 primary workflows and data ownership matrix; write first ADR for choosing modular monolith over microservices.
- **Deliverables:** `docs/product.md`, `docs/architecture/adr-001.md`, `docs/threat-model.md`, and an initial README with toolchain prerequisites.
- **Verify:** peer or self-review against scenario completeness; no ambiguous role-dependent behavior.
- **Break it:** write three contradictory requirements, then resolve them explicitly.

## Milestone 1 — Responsive public website

- **Learning areas:** HTML, CSS, accessibility, TypeScript, React, Next.js SSR/SEO.
- **Build:** public landing, features, docs, accessibility landmarks, metadata, responsive navigation, consistent theme tokens.
- **Verify:** keyboard-only navigation; visible focus; `pnpm typecheck`; no uncontrolled horizontal scrolling on mobile; metadata contains title and canonical URL; production build passes.
- **Bug hunt:** broken sticky header, missing `alt`, focus lost in a mobile drawer.
- **Security/performance:** never display private data on public cached pages; LCP, INP and CLS baseline report.

## Milestone 2 — Component system and advanced forms

- **Learning areas:** shadcn/ui, Radix, Zod 4, React Hook Form.
- **Build:** create a shared Button, Field, Dialog, Toast, EmptyState, LoadingSkeleton; build a validated create-workspace form.
- **Verify:** label associations and ARIA descriptions; invalid input reported without submitting; Zod schema matches client constraints; positive and negative form tests.
- **Bug hunt:** uncontrolled-to-controlled warnings and missing focus management.

## Milestone 3 — NestJS API and typed contracts

- **Learning areas:** Nest modules, Fastify, Zod pipes, OpenAPI and generated clients.
- **Build:** `/health` and `/v1/workspaces` routes with request/response schemas, stable error envelope, API documentation.
- **Verify:** generated TypeScript client compiles; controller/service separation; invalid payload returns a deliberate 4xx; OpenAPI reflects behavior; pino logs have request ID.
- **Bug hunt:** unvalidated route parameters and accidental data leakage in error responses.

## Milestone 4 — PostgreSQL and Prisma 7

- **Learning areas:** schema design, transactions, indexes, migrations, repository pattern.
- **Build:** Workspace, Membership, Project, Task, Comment, AuditEvent and IdempotencyRecord tables; tenant keys and foreign keys.
- **Verify:** migration applies from an empty database; round-trip data tests; unique and foreign-key constraints enforce invariants; query plan reviewed for paginated listings.
- **Bug hunt:** N+1 query, partial multi-write, missing composite index.
- **Security:** database connections use a server-only secret and least-privilege role.

## Milestone 5 — Authentication and object-level authorization

- **Learning areas:** Supabase Auth, Next SSR sessions, JWT verification, Nest guards, RLS considerations, policies.
- **Build:** signup/login/reset; API token verification; workspace owner/member permissions; invite flow; private routes.
- **Verify:** denied unauthenticated reads; cross-tenant reads/writes denied; expired token denied; user-supplied organization IDs don't grant membership; signed-in session survives a page refresh according to policy.
- **Bug hunt:** BOLA/IDOR on a task ID, privilege escalation through request payload, stale membership caching.

## Milestone 6 — Server state and optimistic UX

- **Learning areas:** TanStack Query, Zustand, caching, invalidation, URL state.
- **Build:** sortable and filterable tasks list, optimistic status updates, rollback on failed mutation, accessible loading/empty/error states.
- **Verify:** failed mutation restores correct UI; query keys tenant-scoped; refresh shows server data; server-side paging avoids loading all records.
- **Bug hunt:** optimistic update leaves cached wrong state or duplicates after refresh.

## Milestone 7 — Storage and background jobs

- **Learning areas:** signed uploads, Supabase Storage, Redis/BullMQ, idempotency.
- **Build:** private attachment uploads, background thumbnail/metadata task, notification email queue and persisted job status record.
- **Verify:** cross-tenant download forbidden; excessive file size/type rejected; retries are bounded; duplicate job request doesn't create duplicate permanent side effect; queue outage doesn't silently lose a committed event.
- **Bug hunt:** signed URL exposed too broadly; worker repeats email after a crash; cache evicts queue keys.

## Milestone 8 — Search, realtime and audit

- **Learning areas:** PostgreSQL FTS, search UX, Supabase Realtime or SSE, audit trails.
- **Build:** search across authorized task titles, live comment notification, audit history showing actor/action/time.
- **Verify:** search never leaks records across organizations; duplicate live events don't double-insert; reconnect recovery works; audit events are generated for critical mutations.
- **Bug hunt:** reconnect duplicates; unauthorized Realtime subscription.

## Milestone 9 — Quality and security engineering

- **Learning areas:** Vitest, Playwright, integration tests, OWASP ASVS, contract tests.
- **Build:** complete acceptance suite covering public, member, manager and admin journeys; document threat model and the relevant security control evidence.
- **Verify:** clean CI runs lint, typecheck, unit/integration, API contract and E2E; tests explicitly include negative permissions; no secrets in built assets, logs or commits.
- **Bug hunt:** flaky test from non-deterministic time; hidden security bypass in a repository method.

## Milestone 10 — Deploy, observe and recover

- **Learning areas:** Docker, GitHub Actions, reverse proxy, deployment, Prisma migrations, OpenTelemetry and logs.
- **Build:** staging and production config, web and API deployment, separate worker, health endpoints, dashboards, structured logs, traces, alerts, operational runbook.
- **Verify:** deploy from a fresh environment; safe migration; rollback test; backup restore drill; meaningful trace from HTTP request through DB/worker; incident response drill.
- **Bug hunt:** worker loses a job on SIGTERM, Redis unavailable, database connection pool exhausted.

## Milestone 11 — Performance and cost review

- **Learning areas:** Core Web Vitals, k6, DB plans, caching and capacity.
- **Build:** a workload profile and synthetic user journeys; find top three latency and cost drivers; optimize with evidence.
- **Verify:** report machine and region, request mix, data size, p50/p95/p99, errors and budgets; compare before/after. No fabricated performance targets or arbitrary '10k users' claims.
- **Bug hunt:** overcaching private data; unnecessary N+1 queries; too many DB connections across API replicas.

## Milestone 12 — Enterprise readiness review

- **Learning areas:** documentation, privacy, governance, maintainability, advanced architecture.
- **Build:** architecture maps, API reference, backup policy, secrets inventory, dependency upgrade plan, privacy export/delete design, feature flags and maintenance playbook.
- **Verify:** independent review can deploy, operate, diagnose and recover the project using only the docs; each security control has a test/evidence path.
- **Bug hunt:** retroactive migration changes a public contract without a compatibility window.

## Optional elective capstones

- **Capacitor offline:** separate Vite/React mobile client, SQLite, local outbox, conflict-resolution UI and reconnect recovery.
- **Tauri desktop:** share React design tokens/contracts, secure desktop file actions, packaging and signing.
- **AI assistant:** source-cited help over project documentation with prompt-injection defenses, budget limits and evaluation fixtures.
- **Distributed systems:** extract worker/search subsystem only after measuring a genuine bottleneck; document failure modes and event-version strategy.
- **Enterprise identity:** design an organization SSO/SCIM integration with explicit permission mappings and simulated life-cycle tests.

## Final reviewer rubric

| Area | Requirement |
|---|---|
| Functionality | All major user journeys demonstrated and tested |
| Correctness | DB constraints, transactions, idempotency and regression tests |
| Security | Verified token claims; record-level authorization; cross-tenant negative tests; secret management |
| Quality | Type checks, lint, accessible UI, meaningful unit/integration/E2E evidence |
| Performance | Reproducible workload results and documented optimization decisions |
| Operations | Health, logs, traces, alerts, backups, restore and rollback proof |
| Portability | Well-defined provider adapters and migration strategy |
| Documentation | Setup, architecture, API reference, support procedures, known limitations |

**Grading philosophy:** A capstone is not 'enterprise grade' because it uses enterprise libraries. The student must produce reliable evidence that the system behaves correctly, safely, maintainably and recoverably.
