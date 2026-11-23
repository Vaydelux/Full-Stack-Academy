# Full-Stack Academy P5 — Encrypted Durable Webhook Inbox Qualification

**2026-11-23 · Source-only, local-first instructor capstone · No publication/deployment**

## Actual implementation

A new **opt-in** adapter `examples/p5-integrations/durable-inbox.mjs` adds durable-on-local-disk synthetic webhook processing alongside the existing in-memory labs. Real HTTP route semantics are unchanged for default users. The gateway accepts an optional `webhookInbox` interface, and forwards a lease token when the instructor acknowledges a claimed persistent delivery.

Key exercised behaviors:
- AES-256-GCM encryption of synthetic event bodies with authenticated ID binding; no raw event bodies or provider signing secrets written to the JSON snapshot.
- Safe load/reopen validation: wrong decryption key, malformed JSON, modified ciphertext, wrong metadata ID, symlinked data files and permissive directory/file modes fail closed.
- HMAC v2 over synthetic provider, event ID, timestamp and raw bytes; duplicate deliveries remain de-duplicated after service restart and same-ID/different-body deliveries fail with HTTP 409.
- Atomic same-directory snapshot replacement, file and directory `fsync`, and rollback-on-error attempts; separate loaded instances reject detectable stale snapshots.
- Lease-fenced claims, crash/reopen payload recovery, expiry reclamation, stale acknowledgements rejected, bounded retries and dead-letter terminal status.
- No new npm dependency, no production route, no migration, no Vercel/workflow change and **no publication registry changes**.

## Executed local test evidence

Actual Node 22.16.0 test execution from the reconstructed local teaching checkout, using source files whose SHA-1 Git object IDs matched the GitHub-uploaded blobs:

| Test group | Passing |
|---|---:|
| Real loopback HTTP gateway baseline | 81 |
| Synthetic webhook cryptographic identity | 15 |
| Encrypted durable inbox | 33 |
| Gateway HTTP restart + durable processing | 5 |
| PostgreSQL runner/source guards (NOT real SQL) | 20 |
| Offline release matrix including new suites | 14 |
| **Total** | **168/168** |

Run locally: `node --test examples/p5-integrations/http.test.mjs examples/p5-integrations/webhook-integrity.test.mjs examples/p5-integrations/durable-inbox.test.mjs examples/p5-integrations/durable-http.test.mjs examples/p5-integrations/postgres-search/qualify.test.mjs tests/offline-contract.test.mjs`.

Blob IDs of the modified/new tested implementation:
- `durable-inbox.mjs` — `5699435a0e92258c95ebec44ff4d5370e8d79d74`
- `durable-inbox.test.mjs` — `889f82bf29f865dd40d5124e2efab6b984b03241`
- `durable-http.test.mjs` — `38234c60bd28b901681b720eb3cc9f9fa165c90a`
- `http.mjs` — `16a8e19f9401cd798a10f63e09c1663a84a631d7`
- `scripts/offline-contract.mjs` — `d451efd7a8d44e023b52846ff3889798c3bf1439`
- `tests/offline-contract.test.mjs` — `d24f04267e72864ca366cf137734161603c4384e`

## Remaining qualification and nonclaims

This is **not a production-ready durable system**. Despite an AES-256-GCM body and stale snapshot guard, no atomic multi-process serialization or distributed consensus is provided, so concurrent separate workers can race. In particular, a stale loaded instance detects sequential changes but not simultaneous read-check-write processes. Credentials and encryption keys need production rotation and KMS/secret manager handling; snapshot writes may have ambiguous durability on unusual filesystem failure.

Actual PostgreSQL SQL execution, PostgreSQL-backed durable inbox, provider-specific signatures, live mail/storage calls, Node24 complete `npm ci && npm run verify:offline`, full Next production build, browser and human accessibility reviews are **not run**. No PostgreSQL, Docker or Node24 executable exists in this sandbox, and direct GitHub/npm DNS access is disabled. Therefore **none of these release blockers are marked passed**.

## Continuation

1. On a full clean checkout with real Node24 and reproducible npm locks, run `npm ci && npm run test:release-gate-coverage && npm run test:p5-bundle && npm run verify:offline`.
2. Execute the existing PostgreSQL 17+ 15-assertion rollback fixture in a confirmed disposable loopback DB. Then implement a genuinely transaction-bound inbox/outbox with concurrent consumer negative tests.
3. Add provider-native signature fixtures, key rotation/recovery exercises, manual browser keyboard/screen-reader/zoom verification and earlier P1–P4 gates before publishing new modules.

**Academy inventory unchanged:** 889 canonical, 338 published, 272 unpublished draft manuscripts, 279 not authored. Git deployment remains disabled.
