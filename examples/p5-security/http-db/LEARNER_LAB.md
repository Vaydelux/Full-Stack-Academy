# Lab: Secure a multi-tenant document API

**Status:** unpublished P5 capstone worksheet. Use only disposable test data. The demonstration is not an identity provider, a production API, a deployable pooled PostgreSQL client or a real file-storage service.

## Outcomes

By the end of this lab, a learner can distinguish authentication, SQL permissions and row-level security; demonstrate an IDOR denial over HTTP; prove that revocation is evaluated for each request; and verify that application queries run under a separate, restricted PostgreSQL role.

## Architecture

1. A synthetic signed test session identifies Alice (tenant alpha), Bob (tenant beta), the alpha viewer, or a suspended user. These identities are issued only inside tests.
2. The Node HTTP router resolves identity server-side and never trusts a caller's tenant header, role field or storage key.
3. A test-only `psql` adapter sets the transaction-local `p5.actor` value from that verified synthetic principal.
4. It then executes `SET LOCAL ROLE` for a generated `p5r_<random>` **NOLOGIN/NOBYPASSRLS** role, separate from the schema-owning fixture administrator.
5. PostgreSQL enforces table permissions and RLS for reads, modifications and deletes. The admin-only fixture revocation uses a separate script outside the HTTP route.
6. A privilege probe must show document access is allowed but membership/user writes and schema creation are denied **before** the HTTP acceptance tests start.

## Practical sequence

### 1 — Review trust boundaries

Draw a path from HTTP request, cookie, session verification, actor, database connection, transaction, role, RLS policy and document. Label every value controlled by the caller. Explain why a bare `x-tenant-id` header or changing a document ID must not grant authority.

### 2 — Reproduce the layout regression

Run `npm run test:p5-container-source` from the **repository root**, not from a rearranged copy of the test files. The test must load `http-db/cleanup.sql` and `http-db/qualify.mjs` from their actual relative paths. A file-not-found error blocks qualification.

### 3 — Test the HTTP contract

Run `npm run test:p5-httpdb-source`. Confirm positive and negative cases for read/write/delete, forged tenant headers, synthetic logout/replay, invalid JSON, oversized input, suspended accounts, locked/deleted documents and upload-intent denial. Do not equate a stubbed repository test with SQL acceptance.

### 4 — Inspect least privilege

In `setup.sql`, find the generated NOLOGIN runtime role and explicit grants. In `query.sql`, identify the order: `BEGIN`, `SET LOCAL p5.actor`, `SET LOCAL ROLE`, operation, `COMMIT`. In `privileges.sql`, identify the five checked privilege properties. Explain which administrator operations must remain unavailable to the runtime role.

### 5 — Qualify the real PostgreSQL behavior

On a **fresh isolated PostgreSQL 17+ cluster** with Docker Compose available, run `npm run qualify:p5:container`. Save the actual command output, image digests, tool versions, and commit SHA. The runner must pass the P5 source bundle, SQL authorization assertions, database-role RLS assertions, and HTTP-to-PostgreSQL integration. A missing Docker binary or SQL error is a blocked/failed result, never a pass.

### 6 — Verify revocation and concurrency

Retain the same synthetic session while disabling Alice's membership through the fixture-admin operation. The next read/write attempt must fail. Verify that Bob can still access beta records. Run parallel synthetic reads and test that unauthorized mutations have no effects.

### 7 — Record evidence and limitations

Report four statuses separately: source checks, Node 24 environment, actual PostgreSQL/HTTP integration, and browser/human accessibility. Do not publish P5 as verified if any mandatory category is missing. Explain why a custom PostgreSQL GUC is **not** a secure identity proof for direct SQL clients: a client with access to the database session may set it independently.

## Knowledge check

1. What does an SQL GRANT protect that RLS alone cannot?
2. Why must the application derive the actor from an authenticated session instead of a header?
3. Why is `SET LOCAL ROLE` safer than running every query as a table owner?
4. Why does a passing mocked-repository test not prove SQL permissions or policy enforcement?
5. Which access changes immediately after a membership is revoked, and what tests demonstrate it?
6. What still needs a production-grade implementation beyond this lab (OIDC, pooling, uploads, cookies and accessibility)?

**Instructor acceptance rubric:** show at least one permitted tenant request and one cross-tenant denial, revoked membership denial, successful runtime-privilege probe, a complete database qualification log for the exact commit, no cleanup failure, and a written statement of remaining unverified production boundaries. Do not award a database qualification based only on source inspection.

Official references: [PostgreSQL 17 SET ROLE](https://www.postgresql.org/docs/17/sql-set-role.html), [PostgreSQL 17 RLS](https://www.postgresql.org/docs/17/ddl-rowsecurity.html), and [PostgreSQL 17 GRANT](https://www.postgresql.org/docs/17/sql-grant.html).
