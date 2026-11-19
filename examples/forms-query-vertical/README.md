# Forms and Server State — real loopback vertical slice

This is a **developer-only teaching capstone** for future canonical modules 09.02 (React Hook Form) and 09.03 (TanStack Query). It is not a production API and does not publish any academy lesson ID. The academy includes a project walkthrough at `/learn/projects/forms-query` explaining the local exercise, but that page does not host the API.

## What works without installing packages

Run from the repository root using Node.js 22+:

```bash
node examples/forms-query-vertical/task-api.mjs
```

Then visit http://127.0.0.1:3337/ . The browser sample works without React, bundling, accounts or network access. It demonstrates native accessible form controls, user input validation plus independent server validation, real HTTP requests, pagination, cancellation, retry with the same idempotency key, safe DOM text rendering and explicit errors. The browser is served from the same origin as the API under a restrictive Content Security Policy.

Run the repository-owned **network suites** on a complete checkout with:

```bash
node --test tests/forms-query-http.test.mjs
node --test tests/forms-query-workflow.test.mjs
node --test tests/forms-query-contract.test.mjs
node --test tests/forms-query-project-route.test.mjs
node --experimental-strip-types --test tests/forms-query-react-api.test.mjs tests/forms-query-policy.test.mjs
node --test tests/forms-query-react-wiring.test.mjs
node --test tests/forms-query-native-ui.test.mjs
```

The latest native event/HTTP interaction suite has nine new cases for uncertain POST recovery, explicit discard, terminal 422, confirmed-POST/read-failure isolation, cross-action locks and stale cursor pagination. These nine cases passed in an isolated exact-source DOM/request harness. A complete Node HTTP run and full Chromium UI gate are still required.

The earlier HTTP suite passed 22/22 on the preceding version. The new workflow suite covers revision races, status filtering and hostile request targets; rerun all suites on this exact branch before release. An isolated handler-level simulation of 29 workflow scenarios and 11 contract assertions passed during development, but this is not a replacement for the Node network run.

The test server uses an ephemeral loopback port (no privileged port). It is started and closed within tests. No GitHub Actions/Vercel is involved.

### HTTP contract

| Operation | Endpoint | Behavior |
|---|---|---|
| Health | GET /api/health | Education-only status |
| List | GET /api/tasks?limit=10&status=all&cursor=... | Max 25 results per page; status can be all/todo/doing/done; cursors bind to both revision and status filter |
| Create | POST /api/tasks | Strict title/priority JSON validation, required Idempotency-Key (8–96 safe characters), 8 KiB body maximum; creates todo revision 1 |
| Read | GET /api/tasks/:uuid | One task with strong revision ETag |
| Update | PATCH /api/tasks/:uuid | Only status todo/doing/done. Requires If-Match revision; 412 stale edit, 428 missing precondition |
| Delete | DELETE /api/tasks/:uuid | Returns 204, or 404 if absent |

- Problem responses use **application/problem+json** with status/title, without reflecting arbitrary user content.
- The local browser interface displays task lifecycle transitions, status filters and a bounded request journal (last 24 operations, metadata only; no task title or idempotency key).
- A network failure or retryable POST response retains the **same logical operation key and input** and blocks starting a different create. The learner can retry or explicitly discard the pending attempt with a clear duplicate-risk warning. Terminal 4xx responses (except 408/429) are not offered as ambiguous retries. The UI serializes create/status/delete actions and treats a confirmed POST separately from any later GET refresh failure.
- Create returns 201 with a Location header. Replays with the same normalized payload and key return the same task; a reused key with a changed payload returns 409.
- A successful state-changing write invalidates earlier pagination cursors; stale pagination returns 409 so clients restart rather than silently duplicating items. The cursor also encodes the selected status filter and refuses cross-filter reuse. A no-op status PATCH leaves the revision unchanged.
- Conditional status updates read the full request body, then compare the **current** revision immediately before the synchronous in-memory update; two competing edits with the same version cannot both commit.
- Capacity is 100 tasks; all data disappears at server restart. A maximum of 200 idempotency records are retained in memory, and older ones are evicted.
- The server binds to 127.0.0.1 or ::1 only, rejects spoofed Host and absolute HTTP request targets, and rejects mismatched Origin / cross-site Fetch Metadata. No wildcard CORS is issued. Vite's local proxy rewrites only its exact trusted dev Origin to the local API Origin.
- There are **no accounts, durable database, authorization, TLS, production rate limits or multi-user isolation**. Do not deploy to an internet-facing host.

## Real React Hook Form + TanStack Query source (UNQUALIFIED until npm install)

A separate Vite project lives in react-client/. It imports the **real** packages rather than fake teaching replicas. Its manifest declares React 19, RHF 7, @hookform/resolvers 7, TanStack Query 5 and Zod 4. The manifest is deliberately isolated from the root Next.js package so a missing library never breaks the academy site.

With npm registry access and from one terminal:

```bash
node examples/forms-query-vertical/task-api.mjs
```

Then in another terminal:

```bash
cd examples/forms-query-vertical/react-client
npm install
npm run typecheck
npm run build
npm run dev
```

Visit http://127.0.0.1:5173/ . Vite forwards /api to the loopback server; use no public reverse proxy. The nested project intentionally does **not** have a checked-in package-lock until npm can resolve the package registry; do not claim it is reproducible or CI-qualified yet. Review the resolved dependency tree, commit the actual npm-generated lockfile, then rerun the checks against that exact head before publishing as lessons.

The React source demonstrates:
- useForm and zodResolver, typed input/output, accessible field errors and submit gating;
- QueryClientProvider and useQuery, stable keys and AbortSignal propagation;
- useMutation for create with an idempotency key retained for retry;
- status-scoped query keys; typed status transitions using If-Match, with an optimistic cache snapshot/rollback;
- cancelQueries, optimistic delete, snapshot rollback on error and invalidateQueries after settle;
- failure, loading, retry and empty states.

**Current React reference:** the list uses a bounded ten-page `useInfiniteQuery`, filters each status into a separate query key, passes AbortSignal through to the real API client, and explicitly restarts from page one after a 409 stale cursor. A synchronous single-flight mutation guard prevents cross-type optimistic snapshot races. A successful POST clears its retry key before refreshing the query, so a later read failure cannot be mistaken for an unconfirmed create. Unknown POST outcomes retain the same key; terminal 4xx errors do not offer indefinite retries. **Limitations:** React package installation, real typecheck, browser interaction/a11y and SSR hydration remain unqualified. This in-memory API is not a production service. The full React runtime was not executable during this implementation because the npm registry was unreachable.

## Learning and implementation progression

See [WORKBOOK.md](WORKBOOK.md) for the 16 canonical topic exercises and acceptance requirements. [task-workflow.openapi.json](task-workflow.openapi.json) is the checked-in OpenAPI 3.1.1 contract. See [docs/FORMS_QUERY_NATIVE_UI_ACCEPTANCE.md](../../docs/FORMS_QUERY_NATIVE_UI_ACCEPTANCE.md) for the latest native interface milestone and verification limits; [docs/FORMS_QUERY_RESILIENCE_ACCEPTANCE.md](../../docs/FORMS_QUERY_RESILIENCE_ACCEPTANCE.md) describes the preceding React-client milestone.

## Security & maintenance boundaries

- **Never** use the demo task API as your authorization system.
- Never place access tokens or server secrets in browser bundles or progress backups.
- Do not render tasks with innerHTML; the working browser sample uses textContent.
- Server validation is authoritative even when the form validates on the client.
- Idempotency is in-memory, not durable across restarts or independently shared across instances.
- Input cap, cross-origin guard and loopback binding are defense-in-depth for a teaching fixture, not full production security.
