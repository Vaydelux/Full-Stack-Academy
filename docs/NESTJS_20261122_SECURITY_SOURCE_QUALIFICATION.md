# NestJS P2 — November 22, 2026 security and source qualification

**Scope:** Draft PR #39, branch `feat/p2-nestjs-32-authoring-20261120`. No lesson publication, dependency installation, Vercel deployment or merge is authorized by this report.

## Actual defects corrected

### 11.04.03 — authenticated WebSocket gateway

The previous instructor example used `body.title?.trim()` on an assumed request shape. A malformed Socket.IO body such as `null` or `{ title: 42 }` could throw instead of returning the educational `INVALID_TASK` result.

The instructor now accepts `unknown`, rejects null, arrays, missing/incorrect title types and whitespace-only/oversized titles, and refuses absent or invalid tenant identity. Only an authenticated server-assigned tenant room may receive a validated event. Updated the lesson MDX, real-client integration source and the unit-contract test.

**Boundary:** The integration harness uses a test-only token-to-tenant mapper. The lesson does **not** implement production authentication, session revocation, authorization or rate limits; no public Socket.IO deployment is approved.

### 11.04.06 — authenticated response cache

The previous example used only `tenantId:url` as its key. Different authorized users within one tenant may have different permissions, so such a cache could return another user's personalized response.

The instructor now refuses cached GETs without both verified `tenantId` and `userId`, keys by the tuple `[tenantId, userId, url]`, invalidates a tenant's entries on **successful** mutation emissions, retains a one-second TTL and evicts the oldest entry before exceeding 100 entries. Anonymous and unverified-identity reads bypass the cache.

**Boundary:** This is a process-local educational cache. A production implementation additionally needs authorization-version invalidation, permission-based cache partitioning, response-size budgets, storage eviction, safe HTTP cache headers, and distributed invalidation where applicable.

### 11.03.01 — domain service input validation

The previous example called `title.trim()` on a value typed as string but received through HTTP JSON. Invalid runtime input could throw an uncontrolled `TypeError`. The instructor and controller now accept `unknown` and reject arrays, null, non-object request bodies, non-string titles and titles outside 3–100 characters after trimming, using `BadRequestException`. Extended its behavioral test and updated MDX in lockstep.

## Evidence actually collected

1. **Source identity:** The exact GitHub instructor blobs were reconstructed and verified with `git hash-object`: WebSocket `febb70dd05fd7244a32114d267c2142139ff9f53`, cache `64d2141c897dfc29efa1b082a9cecc64aea57bdd`, domain service `c22a5e1e83ca38764542b65db005547a0684f941`.
2. **Local logic checks:** The exact verified TypeScript sources were transpiled with local TypeScript 5.8 and executed on Node 22.16 with minimal **mock** Nest decorator and RxJS implementations. Observed checks: **11 WebSocket**, **12 cache**, **15 domain service** assertions, all passing after correcting the local BadRequestException stub to set its name as Nest does. This is a mocked unit-level observation, **not** real Nest/TypeScript6 certification.
3. **Code-fence parity:** Independently fetched the canonical instructor `solution.ts` and lesson MDX for **all 32 IDs (11.01.01–11.04.08)**. Every lesson contains exactly two TypeScript code fences, and every second/instructor fence matched its checked-in solution source, **32/32**.
4. **Test-source checks:** The modified eight-topic `advanced.test.mjs` and `domain-modules.test.mjs`, plus the real Socket.IO integration test, passed nonexecuting JavaScript syntax parsing. Real framework tests were **not** run.

## Verified versus blocked

| Gate | Status | Evidence |
| --- | --- | --- |
| Instructor MDX/source parity | **32/32 checked** | Exact fetched source/code-fence comparison |
| WebSocket/cache/domain mocked logic | **38 local assertions passed** | Verified Git blobs, TS5.8 transpilation, mock framework only |
| Nested Node24.9+ and genuine npm lock | **Blocked** | Local runtime is Node22.16; no npm/GitHub DNS |
| Actual TypeScript6 build and Nest12 HTTP/DI | **Not executed** | Dependencies unavailable |
| PostgreSQL rollback / authenticated two-client Socket.IO | **Not executed** | Real services unavailable |
| Full root Next build and browser flows | **Not executed this session** | No complete checked-out dependency environment |
| Human keyboard, screen-reader, 200% zoom review | **Not completed** | Must be performed and signed by a real reviewer |

**Release rule:** Neither tests authored nor source-level passes increase the number of published lessons. Continue with **338/889 published** and PR #39 **draft/unmerged**; the Vercel Git deployment freeze remains enabled.

## Next exact qualification

On a trusted clean Node 24 checkout:

```sh
npm ci
npm run test:nestjs-drafts
npm run verify:offline
cd examples/nestjs-vertical
npm install --package-lock-only
npm run qualify
# Use ONLY an isolated disposable PostgreSQL database:
# ACADEMY_ISOLATED_PG=YES
# PG_TEST_URL=postgres://.../academy_test
npm run qualify:release
```

Commit the **real npm-generated lockfile**, fix any **observed** compiler/integration failures, and collect legitimate human accessibility evidence. Keep P1 (RHF 09.02 then Query 09.03) ahead of any P2 publication. Do not run with production database credentials or claim complete release qualification from the mocked checks here.
