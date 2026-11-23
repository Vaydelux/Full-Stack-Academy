# P5 Track 18 — Transactional PostgreSQL Webhook Inbox (Instructor Lab)

**Scope:** Opt-in, disposable local PostgreSQL 17+ exercise. This is a **source-authored engineering exercise, not a production webhook service, published lesson, or database migration**. Nothing automatically connects to Supabase, the main Academy application, Vercel, or live providers.

## Why this exists

The prior encrypted file-backed inbox handles one local filesystem with an exclusive directory lock but cannot coordinate multiple hosts, processes sharing separate disks, or true database transactions. This lab demonstrates a PostgreSQL alternative: one authoritative durable event table, tenant-scoped transactions, fixed parameterized SQL, AES-256-GCM encrypted bodies, atomic queue claims using `SELECT ... FOR UPDATE SKIP LOCKED`, lease-token fencing, bounded retries, and idempotent provider delivery IDs.

| Layer | Responsibility | Explicit boundary |
|---|---|---|
| `schema.sql` | Composite delivery identity, lease constraints, queue indexes, FORCE RLS and tenant policies | Local disposable test schema only; no public database clients |
| `adapter.mjs` | Injected pg-compatible pool, identity-scoped transaction, cryptographic verification/encryption, claim and settle | `tenantId` comes from a trusted server binding, **not** an HTTP header |
| `adapter.test.mjs` | Fast Node fake-pool tests for validation, rollback, encryption, stale leases and SQL shape | **Not a real SQL or concurrency qualification** |
| `qualification.sql` | Sixteen rollback-only PostgreSQL assertions on RLS, constraints, indexes and lease states | Transaction rolled back even on success; not a concurrent live-client test |
| `qualify.mjs` | Guarded `psql` CLI for SQL assertions | Requires PostgreSQL 17+, explicit disposable DB and two confirmations |
| `live.mjs` | Optional real-pg adapter smoke with two competing consumers | Requires optional `pg`; temporarily **creates and drops** a schema in a confirmed disposable DB |

## Always-available local source tests

```bash
npm run test:p5-postgres-inbox-source
npm run test:release-gate-coverage
```

The Node 22 suite has no database dependency and covers signature scope, encryption, duplicate IDs, tenant model, transaction rollback, pooled-connection disposal and scheduling. A fake pool can establish that our JavaScript behaves as expected; it **cannot** certify actual SQL semantics, row locks, RLS permissions, or PostgreSQL isolation.

## Optional real SQL qualification — rollback only

Provision an isolated local **PostgreSQL 17+** database with a name beginning `p5_lab_inbox_` and a **non-superuser/non-BYPASSRLS** role having CREATE privilege in that database. Never grant database credentials to the browser. Use local `psql` authentication or `PGPASSFILE` (not credentials in Git).

On macOS/Linux:

```bash
export P5_INBOX_HOST=127.0.0.1
export P5_INBOX_PORT=5432
export P5_INBOX_DB=p5_lab_inbox_training
export P5_INBOX_USER=p5_student
export P5_INBOX_CONFIRM=I_UNDERSTAND_DISPOSABLE_DB
export P5_INBOX_CONFIRM_DB=p5_lab_inbox_training
npm run qualify:p5:inbox-sql
```

On PowerShell, use `$env:P5_INBOX_HOST = '127.0.0.1'` (and the corresponding variables above), then run `npm run qualify:p5:inbox-sql`. The CLI **will not run** without exact confirmation and `--run` (already included in its npm script), rejects non-loopback hosts and privileged PG roles, and requires the exact SQL completion marker. Its SQL script wraps all schema/fixture modifications in `BEGIN`/`ROLLBACK`.

## Optional real adapter and competing-worker smoke — temporary schema

This is a **separate** qualification that really creates and later drops `p5_inbox_lab` in the disposable DB so independently pooled PostgreSQL connections can see it. Requires an *additional* explicit consent variable:

```bash
# In the disposable local practice environment ONLY:
# Install a compatible 'pg' driver in the executing Node workspace.
export P5_INBOX_LIVE_CONFIRM=ALLOW_TEMPORARY_SCHEMA
npm run qualify:p5:inbox-live
```

The live script refuses a preexisting `p5_inbox_lab` schema and will not silently delete it. It checks the target database, server version, role privileges and primary status. After successful setup it checks real adapter acceptance, duplicate deliveries, tenant isolation, same-ID/different-body conflicts, two competing consumer claims, decrypted content, settlement, stale lease refusal and dead-lettering, then tries to **drop its own temporary schema** in `finally`. If the process crashes or disconnects after schema creation, an operator must inspect the disposable DB before cleanup. It is not a long-lived or production workload. The only live test reported as complete is one you run and capture yourself against a real PostgreSQL daemon.

**Do not add `pg` to the main Next application solely for this exercise.** The optional live path imports the driver dynamically; root npm builds and release gate tests remain dependency-free.

## Security, correctness and operational limitations

- The synthetic HMAC v2 envelope is *not* a real vendor signature protocol; implement provider-specific verification for Stripe, Resend, GitHub or other actual integrations. The secret map and trusted tenant binding are constructor-owned; never populate them from untrusted request fields.
- RLS with a user-settable GUC is a **defense in depth** boundary only. Any actor with direct SQL access to the runtime credential can set `p5.tenant_id`. Restrict connection/network access, use separate DBA migration and server runtime roles, prefer read/insert/update least privilege and record actual RLS denial tests before production.
- AES-256-GCM authenticates ciphertext with tenant+provider+event AAD; raw payload bodies are not stored in plaintext. Encryption-key rotation, key custody/KMS, transport security, PII retention and secure deletion are **not** addressed here.
- `FOR UPDATE SKIP LOCKED` prevents two overlapping transactions from claiming the same row while holding the row lock. Lease expiry allows retries after crashes; a crashed worker may have performed an external side effect before acknowledgements. Every external action must still be idempotent. This design is **at least once, not exactly once**.
- A lost COMMIT acknowledgement causes `db-commit-uncertain` and discards the pool client; a failed rollback likewise discards it. Inspect by trusted provider/event identity rather than blindly resending side effects.
- Lease extension/heartbeats, multi-region recovery, dead-letter operator UX, rate limits, backpressure, table partitioning, retention/purge, migrations, observability, row-lock load tests and cross-host fault injection are future work.

## Publication gate

Do not register or publish Track 18 lessons merely because these files or mocked tests exist. Before promotion: complete the full Node 24 checkout and Next build, run both real PostgreSQL qualifications with a least-privileged role, observe actual concurrent worker outcomes, validate a real provider and browser accessibility, and reconcile the existing curriculum gate. Source-only merge must not re-enable the Vercel Git deployment trigger.
