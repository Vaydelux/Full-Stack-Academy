# Forms and Server State — real loopback vertical slice

This is a **developer-only teaching capstone** for future canonical modules 09.02 (React Hook Form) and 09.03 (TanStack Query). It is not a production API and does not publish any academy lesson ID.

## What works without installing packages

Run from the repository root using Node.js 22+:

```bash
node examples/forms-query-vertical/task-api.mjs
```

Then visit http://127.0.0.1:3337/ . The browser sample works without React, bundling, accounts or network access. It demonstrates native accessible form controls, user input validation plus independent server validation, real HTTP requests, pagination, cancellation, retry with the same idempotency key, safe DOM text rendering and explicit errors. The browser is served from the same origin as the API under a restrictive Content Security Policy.

Run the **real network tests** with:

```bash
node --test tests/forms-query-http.test.mjs
```

The test server uses an ephemeral loopback port (no privileged port). It is started and closed within tests. No GitHub Actions/Vercel is involved.

### HTTP contract

| Operation | Endpoint | Behavior |
|---|---|---|
| Health | GET /api/health | Education-only status |
| List | GET /api/tasks?limit=10&cursor=... | Max 25 results per page, revision-bound opaque cursor |
| Create | POST /api/tasks | Strict title/priority JSON validation, required Idempotency-Key (8–96 safe characters), 8 KiB body maximum |
| Delete | DELETE /api/tasks/:uuid | Returns 204, or 404 if absent |

- Problem responses use JSON with status/title, without reflecting arbitrary user content.
- Create returns 201 with a Location header. Replays with the same normalized payload and key return the same task; a reused key with a changed payload returns 409.
- A write invalidates all previously issued pagination cursors; stale pagination returns 409 so clients restart rather than silently duplicating items.
- Capacity is 100 tasks; all data disappears at server restart. A maximum of 200 idempotency records are retained in memory, and older ones are evicted.
- The server binds to 127.0.0.1 or ::1 only. Cross-origin request origins are rejected; no wildcard CORS is issued.
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
- cancelQueries, optimistic delete, snapshot rollback on error and invalidateQueries after settle;
- failure, loading, retry and empty states.

**Limitations:** the React view intentionally shows only the first page, and its optimistic snapshot rollback is safe only for a single in-flight delete. It disables concurrent deletes; optimistic concurrency collisions and infinite queries remain separate exercises. The full React runtime was not executable during this implementation because the npm registry was unreachable.

## Learning and implementation progression

See [WORKBOOK.md](WORKBOOK.md) for the 16 canonical topic exercises and acceptance requirements. See [docs/FORMS_QUERY_CAPSTONE_ACCEPTANCE.md](../../docs/FORMS_QUERY_CAPSTONE_ACCEPTANCE.md) for executed evidence, unverified checks and release requirements.

## Security & maintenance boundaries

- **Never** use the demo task API as your authorization system.
- Never place access tokens or server secrets in browser bundles or progress backups.
- Do not render tasks with innerHTML; the working browser sample uses textContent.
- Server validation is authoritative even when the form validates on the client.
- Idempotency is in-memory, not durable across restarts or independently shared across instances.
- Input cap, cross-origin guard and loopback binding are defense-in-depth for a teaching fixture, not full production security.
