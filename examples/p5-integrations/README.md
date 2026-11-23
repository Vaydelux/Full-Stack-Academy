# P5 integration teaching laboratory

Run `node --test examples/p5-integrations/labs.test.mjs` from the repository root. The **41 behavior tests** cover file signatures and tenant ownership, scoped upload HMACs, quarantine scanning state, opt-in marketing and idempotent outbox jobs, tenant-indexed relevance/pagination, and a raw-body HMAC webhook inbox.

Run `node --test examples/p5-integrations/verify-track.test.mjs` for **13 source-integrity mutation tests**. Run `node examples/p5-integrations/verify-track.mjs` only on the full Academy checkout to inspect canonical Track 18 MDX, specifications and publication isolation.

All classes and token signatures in `labs.mjs` exist solely for process-local teaching. `issueUploadToken` is **not** a cloud provider signed URL; MIME magic alone does **not** prove file safety; the in-memory search class does **not** execute PostgreSQL; `signWebhook` models an illustrative HMAC contract, not a real provider. The in-memory outbox does **not** deliver email or guarantee durability across crashes.

For production, bring independent tests for decoding/antivirus, private storage with authorization, real PostgreSQL FTS and indexes, SPF/DKIM/DMARC DNS, rate limits, provider-specific signature headers, rotated credentials, transaction-bound outbox/inbox persistence, browser accessibility and recovery under concurrency.

## Real HTTP + PostgreSQL qualification expansion (2026-11-23)

`node --test examples/p5-integrations/http.test.mjs` runs 78 real loopback HTTP cases. No network access outside 127.0.0.1 is needed, no production secrets are consumed, and no actual mail, object storage or scan integration occurs.

`node --test examples/p5-integrations/postgres-search/qualify.test.mjs` runs 20 **offline guard/source** cases. A real PostgreSQL17+ SQL suite with 15 numbered assertions is available **only** through an explicitly confirmed disposable `p5_lab_search_*` loopback database and `npm run qualify:p5:postgres-search` (see docs checkpoint). Source tests are never real SQL proof.

## Authenticated webhook envelope and offline release protection

The synthetic lab's **v2** HMAC contract signs `['p5-webhook-v2', provider, eventId, timestamp, base64(rawBody)]`. Provider and event ID headers cannot be changed after the signature is created, even when two synthetic bindings share the same secret. A reused authenticated delivery ID with different bytes fails closed. Actual external providers use different signature formats: do not reuse this protocol in a production provider adapter.

Run:

```bash
npm run test:p5-integrations-http
npm run test:p5-webhook-integrity
npm run test:release-gate-coverage
```

The release gate's static matrix audit now rejects skipped P5 coverage. The gate itself still requires a full Node24 checkout and independently verified infrastructure, not just these local source tests.

## Optional encrypted durable inbox teaching capstone (P5 continuation)

The default HTTP teaching gateway remains ephemeral. For an **instructor-owned local disposable directory**, the new `DurableWebhookInbox` is an opt-in adapter for `createInstructorGateway({ webhookInbox })`. It persists verified webhook delivery IDs and encrypted payloads using AES-256-GCM, verifies bytes on re-open, prevents simple stale instance overwrites, and recovers abandoned claims after a bounded lease.

```js
import {mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {randomBytes} from 'node:crypto';
import {DurableWebhookInbox} from './durable-inbox.mjs';
// This is disposable and not production storage or persistent key management.
const folder=mkdtempSync(join(tmpdir(),'p5-inbox-'));
const encryptionKey=randomBytes(32);
const inbox=new DurableWebhookInbox({filePath:join(folder,'events.json'),encryptionKey});
```

Pass `webhookInbox: inbox` to `createInstructorGateway` alongside trusted synthetic actors and provider bindings. A claimed event returns an opaque `leaseToken`, required to settle the event. The same encryption key must be retained securely across restarts; a wrong key or corrupted ciphertext fails closed. The fixture stores **no real mail or cloud provider credentials**.

```bash
npm run test:p5-durable-inbox
npm run test:p5-durable-http
npm run test:release-gate-coverage
```

**Important limits:** Snapshot writes are single-process teaching primitives, not a distributed lock or PostgreSQL transaction. Multiple workers acting concurrently may still race; single-process stale detection is only a guard, not a complete concurrency solution. The encrypted file snapshot is bounded, no encryption-key rotation is implemented, and a real provider must have its own documented signature protocol. Use real PostgreSQL + transactional outbox/inbox and authentic vendor adapters before any production or curriculum-publication claim.
