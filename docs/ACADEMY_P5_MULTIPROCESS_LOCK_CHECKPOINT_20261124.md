# P5 Local Multi-process Inbox Safety & Crash-Consistency Qualification

**2026-11-24 · Source-only, isolated Node22 verification · No publication/deployment**

## Why this milestone exists

The prior durable inbox tested sequential stale-snapshot conflicts but did **not** make its read/compare/replace transaction atomic across two Node processes. Two processes could read the same checksum before either wrote, then both replace the file; the second would silently lose the first delivery or lease claim. A second failure existed in exhausted-lease transitions: on persistence failure, the in-memory dead-letter mutation was not rolled back. And an error after the on-disk rename could leave memory rolled back while disk contained the committed event.

## Changes

- `DurableWebhookInbox` now uses `mkdirSync(<store>.lock,0700)` as an atomic, private, exclusive writer lock on a supported local filesystem. The source checksum is compared **inside** the lock, before writing. A losing writer receives `inbox-busy` or `stale-inbox-snapshot`, not a last-writer-wins commit.
- `inspect`, `accept`, `claim`, and `settle` now reject stale in-memory views. Operators must reopen a fresh instance and retry according to the request's idempotency design.
- Dead-letter transition rolls back its in-memory mutation when persistence fails (consistent with the other commit paths).
- If a fault occurs after atomic rename but before directory durability confirmation, the instance rejects future calls with `inbox-reopen-required`; a fresh open must reconcile the durable snapshot. An instructor-only `afterRename` fault hook simulates this transition.
- A child-process worker fixture and **eight** tests exercise six different two-process event-accept races, six claim races, lock collision, crash-orphan behavior, stale-read refusal, dead-letter rollback, and ambiguous-commit recovery.
- `test:p5-multiprocess-inbox` added to the P5 bundle; the static release-matrix test now requires **19** P5 groups and includes a negative test to catch missing multiprocess coverage.
- No new dependencies, migrations, public route, authentication system, registry, Vercel deployment trigger or GitHub Actions.

## Executed validation

On a reconstructed partial checkout with **Node 22.16.0** and the existing exact `durable-inbox.test.mjs` fixture:

| Suite | Tests | Result |
|---|---:|---|
| Existing encrypted inbox behavior, security, lease and recovery | 35 | Pass |
| New multi-process races and crash-consistency failures | 8 | Pass |
| Release matrix source/mutation coverage | 15 | Pass |
| **Targeted total** | **58** | **58 passed / 0 failed** |

The **modified durable source** and **new worker, race tests, release matrix source/tests** were uploaded as GitHub blobs, and their SHA-1 Git object hashes were checked against the executed local files:

- `durable-inbox.mjs`: `c28a8e1d18559294fd5ea50821bfc820bbc8e615`
- `inbox-race-worker.mjs`: `09310548e860f29e6cca30d31800949574e272c4`
- `multi-process-inbox.test.mjs`: `98e77b2a950e46db5ce4359ed5d6ffc5918236b9`
- `scripts/offline-contract.mjs`: `2f48e4f42031329383210ddebe584403ff8c5dfa`
- `tests/offline-contract.test.mjs`: `7576738cc6a1d26b540a40c34270e8613c7dee97`

The tested partial checkout used an equivalent **test-only `labs.mjs` with the exact synthetic HMAC-v2 signing contract** because a full GitHub repository checkout is not available in this container. No test-only helper was committed. This milestone did not re-run the full HTTP, curriculum or Node24 suite.

## Known limits and future work

- A `mkdir` lock and rename on **one local filesystem** is **not** a distributed lock, multi-host lease, consensus, transactional database or exactly-once external side effect. NFS/SMB and container-mounted shared volumes are unqualified.
- A process crash while holding the lock leaves a **fail-closed orphan lock**, requiring an operator to stop all writers and independently verify process termination before manually removing `<store>.lock`. Never auto-reclaim based solely on elapsed time.
- If the commit is uncertain, do not retry blindly or delete snapshots. Close the faulted instance, reopen the private store, reconcile the event ID, and then retry an idempotent action.
- Node24 `npm ci && npm run verify:offline`, PostgreSQL 17+ SQL qualification, vendor-native signatures, persistent DB inbox/outbox with row-level atomic claims, full Next build, web accessibility and deployed verification **were not executed** and remain release blockers.
- **No content promotion:** 889 canonical / 338 published / 272 unpublished authored drafts / 279 unauthored. `vercel.json` stays frozen.

## Suggested next gate

On a full clean **Node24** checkout run:

```bash
npm ci
npm run test:p5-multiprocess-inbox
npm run test:release-gate-coverage
npm run test:p5-bundle
npm run verify:offline
```

Then execute the **real 15-assertion PostgreSQL 17+** fixture in a disposable, least-privileged loopback database. A production-ready inbox should use a transactionally claimed PostgreSQL queue with independent workers and provider-specific idempotency. Do not publish Track 18 based solely on the local lock.
