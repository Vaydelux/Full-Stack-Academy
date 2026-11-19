# Larger-Scope Delivery Program — Full-Stack Academy

**Frozen planning baseline:** 2026-11-19. This file is a roadmap and handoff, **not a claim that future features have been built**.

## Operating model

Deliver in **vertical slices of two to eight coherent modules**: canonical lesson text + actual runnable source + intentionally broken learner fixture + correct instructor + explicit assertions + local browser/API integration where relevant + reference coverage + checkpoint. A single PR can contain the cohesive vertical slice, but the result stays draft if dependencies, compilation, or browser acceptance remain unexecuted.

These broad passes are longer in scope, not permission to skip runtime verification. The source should be chunked into reviewable commits and have a fresh snapshot after each module family.

## Backlog sequence and dependencies

| Increment | Canonical scope | Count | Actual required runtime/acceptance |
|---|---|---:|---|
| Node + REST | 10.01–10.02 | **16 authored source lessons** | Built-in Node 24, real HTTP loopback capstone (Node 22 smoke run; full Node 24 gate pending) |
| Backend security / OpenAPI | 10.03–10.04 | **16 planned** | Real HTTP negative tests, SSRF/limits/auth, OpenAPI 3.1 and generated client compatibility |
| NestJS production architecture | 11.01–11.04 | **32 planned** | Pinned NestJS packages, compile, local HTTP tests, DTO validation and request pipeline |
| PostgreSQL | 12.01–12.05 | **40 planned** | Real isolated Postgres, transaction races, query plans, backups and recovery |
| Prisma + Supabase | 13.01–14.04 | **64 planned** | Generated client and real migrations, RLS denial tests, Auth, storage and deployment boundary |
| Remaining tracks | 15+ and earlier gaps | Planned | Track-specific runtime dependencies and tested capstones |

### Blocking earlier module gap

**09.02 (React Hook Form) and 09.03 (TanStack Query)** are still planned even though 09.04 Zustand and 10.01–10.02 Node/HTTP are authored. Avoid false green checkboxes and fake APIs. First add compatible packages to the checked-in lockfile using a full local installation, then implement and exercise the real hooks, resolver, QueryClient and optimistic rollback.

### Delivery policy for every large pass

1. Verify latest `main` and predecessor PR heads, preserve user changes, and avoid force-updating unexpectedly diverged refs.
2. Implement complete lesson/lab pair for each canonical topic; do not add placeholder prose counted as published.
3. Prefer actual locally runnable standard-library and official library APIs, not mock functions sold as framework integration.
4. Maintain an exact unique lesson count including historical interactive/MDX overlaps. Recalculate MDX, manifests, completed modules and authored reference drafts from actual GitHub tree.
5. Add negative tests and assert real `ERR_ASSERTION`, not generic TAP `not ok` caused by import/transform problems.
6. Record exact runtime commands and what executed. Distinguish source inspection, local unit execution, real HTTP/Chromium and deployment in the evidence table.
7. Run `npm ci && npm run verify:offline` on a Node 24 checkout when available. Do not silently label drafts release-ready without this evidence.
8. Merge in dependency order, rebase the next stacked PR, and repeat tests on the exact new head; only then move further ahead.

### Current concurrency risk

PRs #20, #21, #22, #23 and the Node/HTTP candidate form a **five-layer stack**. The cost of additional stacked feature work grows faster than its benefit until build qualification and merge convergence resume. Next development should pair 10.03–10.04 completion with **reducing this stack**, not opening endless drafts. The owner has asked not to check Vercel or GitHub Actions: keep all verification local.

## Acceptance matrix

| Domain | Source audited | Node/lab executed | Browser/API integration | Production-ready |
|---|---|---|---|---|
| 10.01–10.02 new source | GitHub tree and metadata inspection | Not fully | REST capstone 1/1 on local Node 22; extra manual 4xx probes | No |
| React + Next + UI + Zod + Zustand stacked sources | Source structures recorded in predecessor PRs | Not fully | Browser smoke scripts authored, not executed | No |
| 09.02 / 09.03 | Not authored | No | No | No |
| 10.03 / 10.04 and beyond | Planned | No | No | No |

**Next concrete action:** qualify predecessor PR #20 with Node 24, then progress through stack while preparing dependency-pinned 09.02/09.03 and the 10.03–10.04 security/OpenAPI vertical slice.
