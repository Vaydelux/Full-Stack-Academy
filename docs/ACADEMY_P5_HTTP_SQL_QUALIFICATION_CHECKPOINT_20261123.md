# P5 Track 18 — Real HTTP Qualification and Guarded PostgreSQL Search

**2026-11-23 | Source and disposable instructor exercises only.** Published course registries, production routes and linked Vercel deployments have not changed.

## Implementation

- A **real Node HTTP loopback-only** practice gateway at `examples/p5-integrations/http.mjs`, reusing the previously-authored Track 18 lab primitives instead of inventing a public API. No HTTP session-issuing or scan-override routes exist; instructor methods create synthetic actor sessions and scan verdicts.
- Actor identity, tenant and role are derived from a server-signed synthetic session; clients cannot select a tenant. Exposes read-only health, own scoped search, guarded document writes, one-time short-lived private upload intent, quarantined file metadata, consent-aware mail outbox and an illustrative raw HMAC signed incoming webhook.
- Mutating actor requests require matching loopback Origin; Host and request-target are checked; binary/JSON bodies are bounded, no secrets or actual files are exposed by HTTP.
- Signed pagination cursors bind user and tenant and reject modifications. Upload intents are one-time, owner/tenant-scoped, time-limited, and bounded; filename, type and byte signatures must agree before quarantine. Scanning only advances by a separately controlled instructor method.
- Email tasks use consent checks, stable idempotency keys, retry budget and dead-letter states without delivery. Provider-owned webhook binding picks tenant from a trusted configuration, not a request header, and rejects reused signed event IDs with changed bytes.
- A **15-assertion PostgreSQL 17+ SQL qualification** teaches `tsvector`/weighted FTS, `pg_trgm`, GIN indexing, tenant and owner RLS with FORCE, same-actor/private access, stale revisions and hidden-document denial in one rollback-only transaction.
- Fail-closed SQL CLI refuses non-loopback, non-disposable database names, unsafe role names, missing two-step confirmations and preflight roles that are superuser or BYPASSRLS. Calls `psql` with a fixed file and no shell.

## Executed tests and exact evidence

- In a local **Node.js 22.16.0** checkout reconstructed with GitHub's exact Track 18 `labs.mjs` blob: **78/78 real HTTP network tests passed** using ephemeral TCP servers and Web Fetch, including raw Host/target tests.
- The SQL runner/source tests passed **20/20** without starting PostgreSQL; they exercise missing confirmations, bad database names, remote hosts, injection-shaped inputs, missing success markers, non-safe psql preflight responses, and the source's numbered contracts.
- Joint run: **98/98 passing tests**, zero skips/failures. New test/source SHA-1 Git blob checks:
  - `http.mjs`: `29c331318b0e9fd5bf67d49c65cbd07c0d0e39fb`
  - `http.test.mjs`: `61a13a53fb516f027b6867adaec5b7838f783ce6`
  - `postgres-search/qualification.sql`: `21cc020550a7908f844dff89bf6561d98809c5f4`
  - `postgres-search/qualify.mjs`: `f7650834b160656302ebbaf44009e4c7ae3e60d0`
  - `postgres-search/qualify.test.mjs`: `5c6af68d6bb88ac7eccb15ab985022285c133785`
- Original prerequisite lab `labs.mjs`: `7100b79b2b76333160944a980c0793126882420a`. All hashes were matched to GitHub-created blobs.

**Not tested:** No `psql`, PostgreSQL daemon or Docker is installed in this sandbox. There is NO passing evidence for real PostgreSQL SQL semantics, real external provider operations, persistence across restart, multiple-process consistency, Node24/Next `npm ci`/build or human accessibility. The HTTP gateway is a synthetic process-memory teaching fixture, never a public production service. SQL verification requires real non-BYPASSRLS role and database privileges to create a schema and trusted extension.

## Commands

```bash
npm run test:p5-integrations-http
npm run test:p5-postgres-search-source
npm run test:p5-bundle
```

For **opt-in real PostgreSQL** evaluation, provision an isolated local PostgreSQL 17+ instance and disposable database with a name beginning `p5_lab_search_`. Use a non-superuser, non-BYPASSRLS role that has CREATE privilege on the disposable DB. Never use a production database.

```bash
export P5_SEARCH_DB=p5_lab_search_practice
export P5_SEARCH_HOST=127.0.0.1
export P5_SEARCH_PORT=5432
export P5_SEARCH_USER=p5_student
export P5_SEARCH_CONFIRM=I_UNDERSTAND_DISPOSABLE_DB
export P5_SEARCH_CONFIRM_DB=p5_lab_search_practice
npm run qualify:p5:postgres-search
```

Credentials are supplied via your usual local `psql` authentication mechanism; this runner does not prompt interactively. SQL is wrapped in `BEGIN` / `ROLLBACK` and is not a database migration. This is a test, not an access-control design for production: a directly connected SQL actor who can set `app.tenant_id` could impersonate claims. Production tenancy must obtain claims from an authenticated server and use restricted database roles/protocol boundaries.

## Next gates

1. Full real Node24 installation and `verify:offline` / Next production build, no GitHub Actions or Vercel deployment required.
2. Dedicated disposable PostgreSQL run of **all 15 actual SQL assertions**, resolve real errors before publication.
3. Provider-specific signed storage, malware/decoder, real email DNS and callback, and durable webhook inbox acceptance.
4. Browser keyboard, screen reader, zoom and mobile viewport review, followed by prior-phase P1–P4 release qualification.

Curriculum count is unchanged: **889 canonical / 338 published / 272 unpublished staged / 279 still unauthored**.
