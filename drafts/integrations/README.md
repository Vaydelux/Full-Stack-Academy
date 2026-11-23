# Track 18 — Files, Email, Search & Integrations

**Status: 32/32 source-authored, 0/32 published by this milestone.** All manuscripts are explicitly `draft-unverified`, and no live curriculum registry or learner progress is changed.

| Module | Focus | Local teaching boundary |
| --- | --- | --- |
| 18.01 File Processing | type/size, signed intents, quarantine, private access, image/scanning jobs | signature checks, HMAC scoped intent and read-gate state machine |
| 18.02 Email & Messaging | transactional/marketing consent, provider adapters, bounces, DNS auth, idempotency | in-memory outbox, opt-out, bounded retry and dead-letter |
| 18.03 Search Architecture | PostgreSQL FTS/trigram, ranking, filters, indexing and engines | in-memory tenant scoped scorer, revisions, pagination and tombstones |
| 18.04 Third-party Integrations | credentials, signed callbacks, adapters, retries, scopes and compatibility | HMAC inbox, freshness guard, delivery deduplication and replay |

Canonical metadata comes from `data/curriculum.json`. Scenario-level expected behavior is indexed in `topics.json`. The auditor refuses missing/duplicated lesson IDs, incomplete modules, publication flags, missing test links and registry leakage.

```bash
npm run test:p5-integrations-labs
npm run test:p5-integrations-source
```

**Do not mistake the fixtures for cloud products.** No real mail is sent, no objects are stored, no antivirus/decoder runs, no PostgreSQL FTS executes, and no vendor webhook signature semantics have been confirmed. These require independent qualification, followed by the existing Node 24 / Next/browser / accessibility and P1–P5 publication gates.
