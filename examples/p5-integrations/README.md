# P5 integration teaching laboratory

Run `node --test examples/p5-integrations/labs.test.mjs` from the repository root. The **41 behavior tests** cover file signatures and tenant ownership, scoped upload HMACs, quarantine scanning state, opt-in marketing and idempotent outbox jobs, tenant-indexed relevance/pagination, and a raw-body HMAC webhook inbox.

Run `node --test examples/p5-integrations/verify-track.test.mjs` for **13 source-integrity mutation tests**. Run `node examples/p5-integrations/verify-track.mjs` only on the full Academy checkout to inspect canonical Track 18 MDX, specifications and publication isolation.

All classes and token signatures in `labs.mjs` exist solely for process-local teaching. `issueUploadToken` is **not** a cloud provider signed URL; MIME magic alone does **not** prove file safety; the in-memory search class does **not** execute PostgreSQL; `signWebhook` models an illustrative HMAC contract, not a real provider. The in-memory outbox does **not** deliver email or guarantee durability across crashes.

For production, bring independent tests for decoding/antivirus, private storage with authorization, real PostgreSQL FTS and indexes, SPF/DKIM/DMARC DNS, rate limits, provider-specific signature headers, rotated credentials, transaction-bound outbox/inbox persistence, browser accessibility and recovery under concurrency.
