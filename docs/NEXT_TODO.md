# Full-Stack Academy — Current Verified Engineering Handoff (2026-11-20)

## Current status and source of truth

- Most recent prior merge: **PR #33** (`b8b466d7e380b02eaf60e12eabea30eb17f89172`). This branch `feat/forms-query-real-node-92-browser-diagnostics-20261120` establishes actual Node socket evidence and fail-fast browser navigation diagnostics.
- **28 tracks / 111 modules / 889 topics / 338 published unique lessons / 337 published MDX+lab manifests / 42 completed modules.** **551 topics unpublished**, 16 React Hook Form 09.02 + TanStack Query 09.03 topics staged with MDX/metadata/red+instructor assets, 535 unstaged.
- **No RHF/Query staged lesson has been promoted or published.** No Actions or Vercel checks used. The task API is intentionally unauthenticated, memory-only and bound to local loopback; do not publicly deploy it.

## P0 — Concrete qualification evidence just completed

- [x] Reconstructed a **partial local checkout** with the original GitHub source blobs, verifying source files and test suites against their exact Git blob SHAs. Node 22.16.0, real ephemeral localhost HTTP listener, no npm/browser testing package.
- [x] **22/22** repository-owned `forms-query-http` Node HTTP tests, including static serving/CSP, validation, idempotency, pagination and host security.
- [x] **29/29** `forms-query-workflow` real Node HTTP tests including Host spoofing via `http.request`, malicious HTTP targets, conditional PATCH revision races, filtering, cursor invalidation.
- [x] **20/20** `forms-query-react-api` tests using the actual TypeScript API client stripped by Node, with real sockets. **No React DOM was run.**
- [x] **9/9** `forms-query-native-ui` simulated DOM event tests connected to the **real** Node HTTP service; write locking, uncertain POST replay/discard, 422/409 and pagination.
- [x] **12/12** `forms-query-policy` retry, query identity and transition tests using real imported TypeScript policy source.
- [x] **10/10** new `forms-query-browser-navigation` classifier tests for managed policy blocks, error pages, legitimate local pages, malformed signals and privacy of page text.
- [x] **102/102 pass, 0 fail/skipped/cancelled**, all six suites executed in one Node test process on the exact source; see `docs/FORMS_QUERY_REAL_NODE_ACCEPTANCE.md`. These are actual Node tests, not mocked HTTP, except that native DOM actions simulate the browser.
- [x] Launched local Chromium 144 through CDP. The Node server returned HTTP 200 for `/api/health` and native HTML `/`. **Chrome itself blocked viewing `127.0.0.1` due to organization policy** and navigated to `chrome-error://chromewebdata/`. No browser UI was qualified.
- [x] Add a pure browser-page classifier and 10 Node tests; the browser gate now checks the actual document state, reports policy errors clearly, and independently verifies the served HTML before declaring readiness. Never bypass enterprise/browser policy.
- [x] Register diagnostic tests in `package.json`, `verify:offline` and Forms/Query source qualification; preserve previous 15 native Chromium UI checks as a separate future gate.

## Next unfinished release gates (do not mark complete)

1. **Real browser on a permitted local machine:** run `npm run qualify:forms-query:browser` and fix the actual native UI failures if any. Inspect responsive 320px/tablet/desktop, keyboard/zoom/focus and screen-reader expectations. The managed browser here blocked the site—this is NOT a UI success.
2. **Full Node24 source checkout:** run `npm run qualify:forms-query:source`, `npm ci`, all offline scripts, all 337 published lab manifests/negative starters, lint/typecheck/Next production build. The 102-case run is a partial test checkout and does not prove the full academy.
3. **React library install:** npm-resolve actual compatible React Hook Form, `@hookform/resolvers`, TanStack Query, React and Zod; commit trusted npm-generated nested lockfile, run nested `npm ci`, `typecheck`, `build` and mounted React DOM tests; verify correct Vite proxy and Next SSR hydration.
4. **Promote staged eight-topic modules:** demonstrate real successful instructor tests and intentionally failing negative starters for each of 16 topics, accessible control/error states, proper HTTP 409/412 recovery and browser verification. Publish one full module at a time, updating registries, metadata and checkpoint together.
5. **Next dependency-respecting curriculum batches:** NestJS track 11 (32 topics), PostgreSQL track 12 (40 topics), Prisma track 13 and Supabase track 14 (64 topics), then remaining specializations/capstones based on `npm run status:curriculum`.
6. Address historical dev-only dependency/security exception **before 2026-12-02 UTC**.

## Reproduction commands

```bash
# Node 22+ real HTTP suite and all source contracts on a complete checkout:
npm run qualify:forms-query:source

# The new dependency-free page-classifier suite alone:
npm run test:forms-query-browser-navigation

# Native UI in an approved local Chromium/Chrome/Edge (blocked here):
npm run qualify:forms-query:browser

# Full Node24/npm/root+nested application qualification:
npm run qualify:forms-query:full
```

The `--source` gate runs additional content, OpenAPI, route, wiring and staged metadata checks beyond the 102 directly verified tests; **do not claim the full gate ran** simply because the 102 pass.

## Read these before writing more code

- `docs/FORMS_QUERY_REAL_NODE_ACCEPTANCE.md` — exact new runtime evidence and managed-browser blocker
- `docs/FORMS_QUERY_NATIVE_UI_ACCEPTANCE.md` — prior behavior and browser-gate scenarios
- `docs/FORMS_QUERY_16_STAGING_ACCEPTANCE.md` — staged lesson authorship and promotion blockers
- `docs/CURRICULUM_FINISHING_ROADMAP.md` — all remaining curriculum milestones
- `examples/forms-query-vertical/README.md`, `AGENTS.md`, `docs/checkpoint.json`

**Source-authored ≠ real Node-tested ≠ real React-tested ≠ Chrome/UI-qualified ≠ production-released.**
