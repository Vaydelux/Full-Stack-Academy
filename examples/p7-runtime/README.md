# F8.5 — Offline-first enterprise capstone vertical

Run from the repository root with Node 24.11.1 (24.x):

    npm run test:p7-runtime

No package install, network dependency, cloud account or production credential is required. Node's built-in SQLite API is experimental in this runtime. All test data are synthetic and temporary; the HTTP server binds only numeric loopback on an ephemeral port. The test worker is for synthetic fixtures only. Never expose this server publicly.

## Runtime behavior

- Device store: durable FIFO operations, account-scope binding (use a trusted unique account/tenant scope, not ambiguous concatenation in a real app), exact payload identity, explicit pending/conflict/ack states, bounded operation shape, stop on ambiguous transport or invalid acknowledgement, and no automatic conflict overwrite. A single device queue owner is assumed; OS keystore, encryption, compaction, conflict resolution UI and native lifecycle still need work.
- Server store: SQLite WAL, FULL synchronous writes, busy timeout before WAL initialization, parameterized tenant predicates, optimistic versions, explicit tombstones, operation fingerprint and receipt, transactionally committed mutation/receipt/audit. A replay must still pass current membership and entitlement checks. SQLite is a local teaching choice, not the production PostgreSQL architecture.
- Identity/admin: instructor-only provisioning, role checks, synthetic server-owned session claims including MFA, expiration and revocation. No actual SSO, JWT verification, WebAuthn or IdP claims are implemented.
- Billing: monotonic trusted event revision, duplicate versus conflicting event, stale revision rejection, paid-through entitlement with a teaching-specific policy (active or past_due before paidUntil). This is not payment-provider webhook signature verification, provider ordering semantics, or a real SaaS billing integration.
- Search: deterministic lexical title lookup with tenant predicates and tombstone filtering, not an AI/RAG or semantic search implementation.
- Audit: minimal mutation records, chained digests, verification against a separately retained expected head and actual SQLite online backup/restore with integrity check. A hash chain without an independently protected anchor is not tamper-proof. A local privileged writer can rewrite the whole chain. Admin reason is validated but deliberately not persisted as free text in this teaching fixture. Retention and deletion policies are separate.
- Native bridge: pure command/origin/window allowlist and validated arguments; trusted host must supply the context. No Capacitor/Tauri application, native plugin, OS security or device certification.
- HTTP: real loopback requests with bounded bodies and synthetic server-owned sessions, version conflicts and generic error boundaries. This is not deployable authentication or an internet-facing service.

## Actual verification

Nine tests passed under Node 24.11.1 in an isolated directory. The tests open real SQLite databases, use actual backup/restore, inspect audit tampering and truncation, issue real local HTTP requests, and spawn competing processes against one database file. The independent-process test initially exposed a database-is-locked initialization bug; after moving the busy timeout ahead of journal-mode initialization and avoiding needless WAL switches, ten additional consecutive runs passed.

## Curriculum mapping (partial shared evidence only)

| Module | Runtime coverage | Still required |
|---|---|---|
| 24.01 / 24.03 | Pure capability boundary | Actual Capacitor/Tauri build and device permissions |
| 24.02 | SQLite offline queue and versioned sync | Native lifecycle/network/merge UX |
| 24.04 | Real retry/restart and account isolation cases | Physical-device quality and accessibility |
| 25.02 | Tenant-scoped retrieval prerequisite | Embeddings, grounding, prompt-injection and real model qualification |
| 26.01 / 26.04 | Role and synthetic MFA/session checks, admin revocation | Real IdP and security audit |
| 26.02 | Durable revision-ordered entitlement | Provider signatures, payment lifecycle, sandbox evidence |
| 26.03 | Minimal audit and restore | Retention, legal hold, erasure and compliance review |
| 27.02–27.04 | Local API, data, sync and restore | Complete web/API/native workflow, observability, deployment |
| 25.01 / 25.03 / 25.04 / 27.01 / 27.05 | Not qualified by this vertical | Topic-specific analytics, maps, media/RTC, web and defense exercises |

No module or lesson is automatically promoted. The 136 P7 authored candidates remain unpublished. Full checkout offline/build, native, browser, provider, AI, geospatial and media gates are unexecuted in this milestone. The mandatory offline matrix requires the new test command; late-phase fingerprints include these files.

Next: finish the P7 analytics/RAG/geospatial/media exercises with actual local inputs, then implement guarded publication projections in curriculum order and obtain genuine runtime and human review evidence. Do not extend curriculum breadth or skip P1/P2 gates.
