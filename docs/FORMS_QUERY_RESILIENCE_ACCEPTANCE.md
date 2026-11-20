> **LATEST SOURCE-EXECUTION UPDATE (2026-11-20):** The 20 typed React API client scenarios previously validated only with mocked handler transport have now passed **20/20 against real Node HTTP sockets** in a Git blob-matched partial checkout. Combined six-suite result 102/102 passes, including browser-navigation classification; Chromium itself remains blocked by managed policy and React/Next builds are unqualified. See [new accepted evidence](FORMS_QUERY_REAL_NODE_ACCEPTANCE.md). Historical test-status details below refer to the earlier PR #32 development session.

# Forms / Query Resilience — acceptance and release status

**Development checkpoint:** 2026-11-20 (Asia/Manila)
**Branch:** `feat/forms-query-resilience-real-contract-tests-20261120`
**Scope:** Correctness fixes, real-HTTP test source, deterministic policy tests, optional native-browser qualification and truthful release gates.

## Source implemented

### Standalone React client (not yet package-qualified)

- The typed API client at `examples/forms-query-vertical/react-client/src/api.ts` now supports opaque status-scoped pagination cursors and bounded page sizes. It guards task IDs, HTTP status errors, revisions and idempotency keys and can be imported by Node >=22 with `--experimental-strip-types` for network integration tests without RHF or Query packages.
- `src/workspace.tsx` now uses TanStack Query 5 `useInfiniteQuery` instead of a first-page-only list. Ten pages of ten tasks cover the demo's 100-task memory bound. The user can load more, and 409 stale-cursor failures offer an explicit restart.
- One synchronous client mutation guard serializes create, status updates and delete, preventing optimistic snapshots of different mutation types from trampling each other. Every loaded infinite-query page is included in the rollback snapshot.
- A confirmed POST is separated from its subsequent query refresh. If refreshing fails, the UI **does not** pretend the create was unconfirmed. Transient network / 5xx / 429 ambiguity retains the same payload and idempotency key; terminal 4xx responses cannot create an infinite retry prompt.
- `src/policy.ts` is a pure, tested module for state-machine transitions, query identities, terminal-versus-ambiguous failures and bounded retry budgets.
- Staged instructor examples 09.02.05, 09.03.05 and 09.03.08 were synchronized with these policies; the actual MDX snippets were updated to exactly match the corresponding instructor source files. All 16 topics remain staged.

### Local quality infrastructure

- `tests/forms-query-react-api.test.mjs`: **20 real Node HTTP test cases authored**, using the exact TypeScript API module and an ephemeral real local task server. Scenarios include strict input validation, replaying one idempotency key after simulated response loss, status-filtered pagination, stale cursors, competing 412 edits, proper DELETE behavior and capacity boundaries.
- `tests/forms-query-policy.test.mjs`: 12 Node cases for pure retry/query/transition behavior.
- `tests/forms-query-react-wiring.test.mjs`: 11 explicit structural checks for the real React wiring, accessible controls, rollback, pagination and safe retry UX. These do **not** substitute for mounted React DOM tests.
- `scripts/verify-forms-query-draft-types.mjs`: extended TypeScript parser/transpilation source gate for all 34 staged TSX assets plus the standalone React TS/TSX client and Vite configuration (40 source files expected). It verifies syntax, not library type resolution.
- `scripts/verify-forms-query-browser.mjs`: optional **real Chromium/Chrome/Edge** CDP-based end-to-end native browser gate on loopback only, no npm browser dependency. It checks real DOM form validation, POST→PATCH→DELETE, status filter, >10-item pagination, 320px/tablet/desktop overflow and focus navigation. Its randomized remote-debugging port binds to loopback; temporary profile is removed after qualification.
- `scripts/qualify-forms-query.mjs --source` includes real typed-client HTTP tests, policy and wiring checks. `--full` additionally requires Node 24, genuine root+nested npm-generated locks, full offline suite, Vite React typecheck/build and the native Chromium browser qualification.
- The academy project page and runbook include the new verification commands.

## Checks executed in this development session

| Check | Observed result | Scope and limitation |
|---|---|---|
| Typed-client HTTP test scenarios against actual server/client logic | **20/20 pass** | Executed in an isolated mocked request/response harness, **not Node sockets**. A first harness run showed 19/20 because the harness omitted the fixture's custom capacity; fixing that harness input yielded 20/20 on unchanged server/client source. |
| Retry/cache policy source behavior | **12/12 pass** | Executed the exact GitHub policy source in a JS type-stripped evaluator with the equivalent HTTP error class. Not a real imported TS module test. |
| React wiring/integration contract | **11/11 pass** | Exact-GitHub-source structural assertion execution. Does not mount React or Query. |
| Revised lesson MDX source parity | **3/3 pass** | Directly compared the revised 09.02.05, 09.03.05, 09.03.08 instructor snippets and source files. |
| Native Chromium DevTools capability | **CDP handshake and evaluation pass** | Locally launched Chromium 144 and evaluated JavaScript using Node 22 built-in WebSocket. Initial disposable-profile cleanup failed in the probe; the committed browser runner waits for exit and retries cleanup. **The browser runner has NOT been executed on this repo's UI.** |
| Node 22 TypeScript stripping capability | **Minimal sample passed** | Confirmed Node v22.16.0 can strip a type-only import and explicit class field declaration. No claim that the full React API network test file has run via Node in the model's runtime. |
| Local npm/Git connectivity | **Unavailable** | `git ls-remote` could not resolve github.com; `npm ping` returned EAI_AGAIN. No npm-installed RHF, resolver, TanStack Query or Next build can be qualified here. |

## Still blocking promotion or production claims

1. **Real Node sockets:** On a full checkout, run the existing API suites plus `npm run test:forms-query-react-api`, `npm run test:forms-query-policy` and `npm run qualify:forms-query:source`. All failures must be fixed on the exact branch head.
2. **Real native browser:** Run `npm run qualify:forms-query:browser` with Chrome/Edge/Chromium, validate screenshots and manual keyboard / a11y interpretation in addition to automated focus/overflow checks.
3. **Actual library resolution:** On Node 24 with registry access, install real compatible React Hook Form, `@hookform/resolvers`, TanStack Query and Zod; generate the nested package-lock with npm, never invented integrity hashes. Then `npm ci`, nested React typecheck/build.
4. **Actual React DOM tests:** Mount the full RHF/Query client with real dependencies. Exercise input errors, serial optimistic updates, server conflict, infinite page cursor handling, hydration boundaries, keyboard/320px/200% zoom, and a screen reader.
5. **Full academy gates:** 337+ instructor labs and negative starters, all source/content/checkpoint tests, root lint/typecheck/Next build. Review historical dev-only dependency advisory by 2026-12-02 UTC.
6. **Module promotion:** Complete real positive and intentionally failing negative tests for each of 16 staged topics, then promote only a verified eight-topic module into `src/content/lessons`, `labs` and registries. No blanket publication by file count.

## Local commands

```bash
# Native task API, typed client and structural source checks (Node 22+)
npm run qualify:forms-query:source

# Actual local Chromium and dependency-free native practice UI
npm run qualify:forms-query:browser

# Staged source syntax and 16-pack content checks (root TypeScript install required)
npm run test:forms-query-drafts
npm run test:forms-query-draft-types

# Full Node 24 with actual root + nested npm lockfiles and browser
npm run qualify:forms-query:full
```

**Publication remains unchanged:** 338 unique lesson IDs, 337 authored MDX/lab manifests, 42 complete modules; the 16 RHF/Query packs are still staged, not verified or published. No GitHub Actions or Vercel checks were invoked.
