> **Progress checkpoint, 2026-11-20:** All 16 canonical RHF/Query articles and draft lab source packs are staged outside production lesson and lab directories. Course source now has per-topic conceptual teaching, red starter, instructor solution and assessment contract. Real npm package resolution, lockfile, TypeScript, positive/negative library tests, Next/Vite browser acceptance, and verified promotion remain REQUIRED. Do not claim the 16 module lessons published. Start from `docs/FORMS_QUERY_16_STAGING_ACCEPTANCE.md` and `drafts/forms-query/README.md`. This older planning document follows for historical architectural scope.

> **2026-11-19 progress note:** The Node loopback task API, browser-native practice app, separate actual RHF/TanStack React source, 22 real local HTTP integration tests and 16-topic workbook are now authored in source. Registry DNS still blocks trusted npm lockfile generation and real React typecheck/build/browser qualification. The 16 canonical topic entries remain PLANNED. See docs/FORMS_QUERY_CAPSTONE_ACCEPTANCE.md and examples/forms-query-vertical/README.md; this document is the remaining acceptance plan, not a claim that the modules are published.

# Next large development milestone — 09.02 Forms + 09.03 Async Server State

**Status:** PLANNED, not published. Current dashboard study-planner work is a dependency-free platform improvement, NOT the completion of the React Hook Form and TanStack Query track.

## Objective

Teach a continuous form-to-HTTP-to-server-cache workflow, keeping three kinds of state intentionally separate: input/form state, remote data/cache state, and local interface preferences. Finish both eight-topic canonical modules with actual compatible runtime dependencies, runnable learner/instructor implementations, negative tests, and an interactive browser lab.

## Release-blocking dependency setup

1. On a full local checkout with the repository's chosen Node.js 24 runtime, inspect the existing Next/React/Zod versions, ensure the package registry is reachable, and install actual compatible react-hook-form, @hookform/resolvers, and @tanstack/react-query packages using npm.
2. Let npm resolve and write package-lock.json. **Do not invent package integrity strings or hand-author dummy packages.**
3. Run npm ci from the checked-in lock, plus full lint, TypeScript, source tests and Next build. Ensure client-only providers are correctly isolated from Server Components.
4. Use only a loopback HTTP fixture or a deliberately trusted same-origin demo API. Never embed secrets, hardcode real credentials, or claim an in-memory notes API is production multi-tenant auth.

## Planned 09.02 lesson family (8 topics)

- 09.02.01: register(), controlled/uncontrolled fields and validation mode; accessible labels and native constraints.
- 09.02.02: formState errors, dirty/touched behavior and reset semantics.
- 09.02.03: zodResolver and validated input/output inference without unsafe casts.
- 09.02.04: nested/conditional fields; field arrays with stable keys and correct unregistration policy.
- 09.02.05: async submit + abort-safe effects; duplicate submission prevention, pending and error feedback.
- 09.02.06: progressive UX, keyboard interactions, focus restoration and error summaries.
- 09.02.07: file inputs, browser limits, server-side revalidation and disclosure of upload trust boundaries.
- 09.02.08: real form-to-local-HTTP capstone with error and recovery scenarios.

## Planned 09.03 lesson family (8 topics)

- 09.03.01: QueryClient boundary, useQuery and stable structured query keys.
- 09.03.02: staleTime vs gcTime, refetch triggers, cache lifetime and avoiding duplicate Zustand server state.
- 09.03.03: HTTP errors, retries, backoff policy and disabled/offline state.
- 09.03.04: queryFn signal cancellation, abort handling and latest-response wins.
- 09.03.05: useMutation, invalidation and idempotency boundary with a real POST request.
- 09.03.06: optimistic updates with prior snapshot, rollback and concurrent mutation race scenarios.
- 09.03.07: cursor pagination, data limits and memory considerations.
- 09.03.08: integrated form/query capstone: validate, submit, refresh, roll back, and recover.

**Naming and canonical order require confirmation against data/curriculum.json before authoring individual MDX files.** These are *teaching goals*, not substitutes for catalog metadata.

## Per-topic acceptance

Each lesson must include canonical ID and title, meta JSON, MDX with at least three worked steps, prediction, misconception, debug/bug hunt, quiz, official docs, complete starter/instructor sources, lab.json, executable positive and genuinely assertion-failing negative tests, runtime/version declaration and a self-assessment rubric.

For real browser capstones verify:

- wrong/empty inputs cannot be submitted; screen reader receives errors and focus is moved appropriately;
- fast double submit creates one intended mutation or a documented idempotency-safe replay;
- expired/unauthorized server responses are surfaced, never shown as success;
- abort and component unmount do not corrupt the client cache;
- optimistic failures revert precisely to the previous relevant snapshot; concurrent invalidation order remains deterministic;
- actual HTTP errors, 429/5xx and stale responses are recoverable;
- no local tokens or secret payloads are cached, logged or exposed in source files;
- 320px and keyboard use are supported; no horizontal overflow on forms, code blocks or errors.

## Publication and checkpoint protocol

Until packages and source tests genuinely run: keep 09.02 and 09.03 marked planned/noindex and absent from src/lib/academy/published.ts. When fully authored, update lesson registries, content schema, scripts, checkpoint counts, browser smoke and AGENTS.md together. The GitHub branch source diff is not an executable release gate.

## Delivery policy

One cohesive feature branch/PR after lock resolution, reviewable commits per module, locally executable verification, explicit limitations. Do not rely on GitHub Actions or Vercel checks for qualification; do not skip real Node/browser checks merely because the assistant wrote the code.

> **Updated release engineering (2026-11-20, P1 Query):** All eight Query 09.03 candidate packages are now checked in outside the live lesson registry, with source parity and SSR hydration provider files. An isolated real-browser runner supports each named Query exercise and Next SSR hydration. The SSR qualification fixture now rewrites its temporary server-side prefetch URL to the actual ephemeral loopback API port, instead of falsely requiring fixed port 3337. A guarded `promote:forms-query:query -- --plan|--simulate|--apply` command prepares all 54 files, but **refuses apply until RHF 09.02 is actually published and all genuine Node 24, Chromium, Next SSR, keyboard, zoom and screen-reader gates have passed**. Live count remains 338, not 354.
