# P5 Authenticated HTTP + PostgreSQL Capstone (unpublished)

This is an isolated, dependency-free teaching laboratory under `examples/p5-security/http-db/`, not production authentication, storage, or a deployed Academy API.

## Components and learner flow

- `server.mjs`: synthetic signed sessions, localhost HTTP exercise, document GET/PATCH/DELETE, origin checks on mutations, and private PDF upload-intent simulation.
- `connection.mjs`: `psql` process adapter with explicit SQL-file allowlist, strict loopback/disposable DB validation, safely quoted psql variables, subprocess timeout and a new random schema per run.
- `setup.sql`: three synthetic users (Alice, Bob, viewer), two tenants, PostgreSQL RLS with forced document policies, and permissions for read/write/delete.
- `query.sql`: transaction-local authenticated test actor, SQL parameterization and RLS enforcement.
- `preflight.sql` / `cleanup.sql`: reject the wrong database or a superuser/BYPASSRLS connection; remove the new schema.
- `source.test.mjs`: 23 real Node test cases for HTTP routes, fake-repository tenant isolation, sessions, unsafe input and database invocation safeguards. These are not real PostgreSQL tests.
- `qualify.mjs`: **opt-in** 25-check end-to-end HTTP-to-PostgreSQL test with revocation and cleanup.
- `starter.mjs`: incomplete student entry point; compare with the instructor implementation only after writing the failing tests.

## Verification without a database

Run from the repository root on Node 22+:

    npm run test:p5-httpdb-source

This command is also included in `npm run test:p5-bundle`. All 23 source/HTTP checks passed on a Node 22 local fixture, verified against the exact committed Git blobs. The Academy's full production release gate still requires Node 24.

## Optional real database qualification

Use a **fresh, isolated PostgreSQL 17+ cluster**, a disposable database named `p5_lab_security`, and a nonsuperuser role with no BYPASSRLS privileges. It must be able to create tables/schemas in the disposable database. Verify the cluster identity yourself; a forwarded loopback connection could secretly point to another server.

PowerShell:

    $env:P5_LAB_DATABASE_URL = 'postgresql://lab_user:throwaway_password@127.0.0.1:5432/p5_lab_security'
    $env:P5_LAB_CONFIRM = 'DISPOSABLE_ONLY'
    $env:P5_HTTP_DB_CONFIRM = 'ISOLATED_CLUSTER'
    npm run qualify:p5:http-db

Bash:

    P5_LAB_DATABASE_URL='postgresql://lab_user:throwaway_password@127.0.0.1:5432/p5_lab_security' P5_LAB_CONFIRM=DISPOSABLE_ONLY P5_HTTP_DB_CONFIRM=ISOLATED_CLUSTER npm run qualify:p5:http-db

The integration program **does not run on install, push, build or publication**. It creates a unique `p5h_<random>` schema in a confirmed disposable DB, starts an ephemeral loopback HTTP server, exercises 25 acceptance assertions and removes only its own schema. It exits nonzero on setup, test or cleanup failures. The database preflight checks the actual DB name and rejects privileged superuser or BYPASSRLS roles. A standalone `psql` executable is required.

## Threat model and limitations

This lab uses custom HMAC **test-only sessions**, not genuine JWT, OIDC, MFA, browser cookie issuance or Supabase Auth. The database role derives its transaction-local `p5.actor` value from an authenticated **synthetic** server principal. Direct database clients with the ability to set that value could impersonate users; never expose this role to them. `psql` is launched per request for pedagogical clarity, **not production throughput**; production requires a maintained pooled client with a genuine lockfile and independently tested privilege boundaries.

The upload-intent endpoint constructs a private-looking path but does not issue a real signed URL or accept/scan bytes. Strict origin checks alone do not implement full CSRF defenses. Security claims are limited to the synthetic fixture. **No actual PostgreSQL execution was possible in the authoring environment**, and no P5 lesson is ready for publication. Earlier P1–P4 releases, Node24, real provider authentication, storage integration and browser accessibility remain separate gates.

## Additional P5 hardening exercises (2026-11-23)

The source hardening exercise now includes:

- A synthetic server-side logout route (`POST /sessions/logout`) that invalidates the existing signed test session. It requires the lab's expected `Origin`, and neither the cookie nor the account name is accepted as the source of tenant authority.
- A separate **fixture-administrator-only** `revokeForQualification(userId)` method and `revoke.sql`, replacing the earlier generic `action('revoke')` pathway. No HTTP route exposes this method.
- Suspended and deleted-record fixtures; the upload query now independently checks the principal's active account, active membership, eligible role, and non-deleted/unlocked document.
- A stricter preflight that requires PostgreSQL 17+, the expected database, `row_security=on`, and a connection role that is neither superuser nor `BYPASSRLS`.
- 16 additional negative/administrative tests in `hardening.test.mjs`, plus updates to the original 23-test source suite.
- A larger, still unexecuted real PostgreSQL acceptance program that verifies logout, suspension, deleted documents, and fixture revocation alongside tenant isolation.

Run the **source and synthetic HTTP** qualification on Node 22+:

```bash
node --test examples/p5-security/http-db/source.test.mjs examples/p5-security/http-db/hardening.test.mjs
```

Run the genuine **disposable local PostgreSQL** acceptance only after verifying the instance and setting the two opt-in environment variables documented above:

```bash
npm run qualify:p5:http-db
```

**Scope warning:** these are intentionally synthetic sessions and a teaching-only per-request `psql` adapter. Session cookies are not issued by a real IdP, uploads are only intent metadata (no file bytes or malware scanning), and a database actor GUC is trusted only because the pedagogical HTTP server sets it from a verified synthetic principal. This is not a reusable production security architecture. Do not enable the Academy's publication or deployment based on source tests.
