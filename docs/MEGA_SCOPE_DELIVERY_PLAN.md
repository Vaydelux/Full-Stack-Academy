# Full-Stack Academy — Seven-Wave Large-Scope Delivery Plan

**As of November 19, 2026.** This plan is generated from the academy's canonical **889-topic** catalog, not invented lesson counts. The active React/Next feature branch holds **259 unique authored IDs** (257 MDX lessons plus 4 existing interactive models, with two overlaps). **598 unique topic IDs remain un-authored.**

## Why 7 large waves rather than dozens of tiny PRs

Work in **whole tracks and complete modules**, typically 80–104 canonical topics per wave. Each wave must produce working instructor and intentionally failing starter exercises, applied references, tests, security review, one capstone per module, and a persistent checkpoint. This reduces repetitive integration overhead without reducing depth or hiding unverified lessons.

| Wave | Tracks | Modules | Canonical topics | Already authored | Remaining |
|---|---|---:|---:|---:|---:|
| W01 | 08–09–10 | 12 | 96 | 33 | 63 |
| W02 | 11–12–13 | 13 | 104 | 0 | 104 |
| W03 | 14–15–16 | 12 | 96 | 1 | 95 |
| W04 | 17–18–19 | 11 | 88 | 0 | 88 |
| W05 | 20–21–22 | 10 | 80 | 0 | 80 |
| W06 | 23–24–25 | 12 | 96 | 0 | 96 |
| W07 | 26–27 | 9 | 72 | 0 | 72 |
| **Total** | 08–27 | **79** | **632** | **34** | **598** |

## Scope and architectural intent

### W01 — Professional frontend, forms & HTTP services (UI track authored; forms & HTTP next)

Design system, client data and server-side HTTP API core. Exact tracks **08, 09, 10**, with 95 unauthored topic IDs and 12 canonical modules. Complete topic-level hands-on labs and a module capstone without claiming real cloud or database integration unless it was executed.

### W02 — Backend architecture & relational persistence

NestJS modules, PostgreSQL correctness, Prisma/Supabase persistence. Exact tracks **11, 12, 13**, with 104 unauthored topic IDs and 13 canonical modules. Complete topic-level hands-on labs and a module capstone without claiming real cloud or database integration unless it was executed.

### W03 — Identity, authorization & async reliability

Supabase RLS and authorization, app security, Redis and job queues. Exact tracks **14, 15, 16**, with 95 unauthored topic IDs and 12 canonical modules. Complete topic-level hands-on labs and a module capstone without claiming real cloud or database integration unless it was executed.

### W04 — Realtime, integrations & quality engineering

Realtime collaboration, search/media/email integration and full testing pyramid. Exact tracks **17, 18, 19**, with 88 unauthored topic IDs and 11 canonical modules. Complete topic-level hands-on labs and a module capstone without claiming real cloud or database integration unless it was executed.

### W05 — Delivery, operations & performance

Containers and CD, observability/SRE, frontend/API capacity and optimization. Exact tracks **20, 21, 22**, with 80 unauthored topic IDs and 10 canonical modules. Complete topic-level hands-on labs and a module capstone without claiming real cloud or database integration unless it was executed.

### W06 — Architecture, native platforms & specialized systems

System design, Capacitor/Tauri, AI/data, geospatial and RTC foundations. Exact tracks **23, 24, 25**, with 96 unauthored topic IDs and 12 canonical modules. Complete topic-level hands-on labs and a module capstone without claiming real cloud or database integration unless it was executed.

### W07 — Enterprise SaaS & defendable full-stack capstone

Billing, RBAC/SSO/privacy/platform controls and integrated production capstone. Exact tracks **26, 27**, with 72 unauthored topic IDs and 9 canonical modules. Complete topic-level hands-on labs and a module capstone without claiming real cloud or database integration unless it was executed.

## Mandatory acceptance conditions for **every** wave

1. **Product and curriculum definition:** Use `data/curriculum.json` IDs/titles/levels verbatim, with at least three distinct pedagogical steps per topic, tested instructor examples, deliberately failing student starters and official reference sources. Never generate empty generic stubs merely to mark a topic complete.
2. **Local verification:** Test the pure contracts, runtime code and browser interactions in an isolated local environment. For database tracks, use disposable PostgreSQL; for auth, run deny-by-default and tenant isolation tests; for jobs, test idempotency/retries; for deployments, use local containers first.
3. **Cross-cutting quality:** Confirm keyboard/focus, accessible names, secure serialization, no secret leakage, stable metadata, compatible TypeScript, lint and production compilation. A static/SSR test alone does not establish interactive behavior or an authorized backend.
4. **Change management:** Keep a checkpoint JSON, `docs/NEXT_TODO.md`, issue/risk register, sample fixtures, and precise evidence of tests actually run. Separate authored, structurally audited, locally tested, browser-verified and deployed statuses.
5. **Resource control:** Do **not** call or monitor GitHub Actions or Vercel while the user's hold stands. Do not create a feature PR if the repository starts paid CI/preview builds on pull requests. Commit to feature branches with `[skip ci]` and only merge when explicitly authorized.
6. **Review before continuation:** Resolve blockers at the end of each wave rather than passing technical debt forward. Review top security concerns, dependency advisories and schema migrations before release.

## Continuation contract for other agents

Read `docs/PROJECT_CHECKPOINT.md`, `docs/checkpoint.json`, `docs/NEXT_TODO.md`, `docs/REACT_NEXT_OFFLINE_ACCEPTANCE.md`, `docs/delivery-waves.json` and `data/curriculum.json` before editing. Record the exact feature branch head, the specific modules authored, tests run/not run and outstanding blockers. Never confuse a source-only milestone with a published website.

**Current priority:** finish **local quality qualification of React/Next tracks 06–07** before beginning W01 (tracks 08 Tailwind/shadcn, 09 Zod/RHF/TanStack/Zustand, 10 Node & HTTP). No cloud or configuration is needed to author and review those topics. The live site still serves the older deployment.

## Current W01 continuation

Track 08 has 32 source-authored lessons but awaits local tests. Tracks 09 and 10 still contain **63 unauthored IDs** (32 + 32 topic slots less one pre-authored interactive Zod example). No module in 09/10 should be marked complete until its own graded labs and tests exist.
