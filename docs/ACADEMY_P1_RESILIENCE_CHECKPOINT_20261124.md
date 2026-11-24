# P1 real HTTP resilience and learner workbook

**2026-11-24 | Local runtime regression milestone; source-only merge, no publication**

## Changes
- Preserve accepted idempotency receipts for the lifetime of the disposable server instance. Default 200-key hard cap, configurable lower for tests; refuse new keys rather than evict accepted receipts. Exact normalized replay returns historical 201 and original Location; does not resurrect deleted data. Rejected creates do not consume ledger slots.
- Strict UTF-8 decode, reject non-identity content encoding, bounded chunked request 413 with connection close, safe integer cursor parsing. Preserve existing task capacity, optimistic revision and list-revision behavior.
- Distinguish intentional read AbortError from retriable transient failure, retaining ambiguous create attempt keys.
- Add 16-topic practice companion, updated OpenAPI, mandatory offline regression step and both P1 qualification profiles.

## Executed evidence
Node v22.16.0, isolated reconstruction of exact GitHub source. Original `task-api.mjs` blob bc06be5dbc97ec7ac2140b4e66365630d0c4c527, original policy.ts blob 4717fcc8e90d91099d2ea3e9f03d81011dae35d8, typed API blob 463b33fc97462e8c55bfecdee6b69aa0b0b7196c. Local hashes matched remote.
- Real HTTP original: 10/20 passed, 10 failed. Repaired: 20/20 passed. Tests include 200 actual create/delete pairs, concurrent same-key and distinct-key calls, competing revisions, malformed byte/encoding and real chunked body requests.
- Retry policy original: 3/5 passed, 2 failed. Repaired: 5/5 passed.
- Total: 25/25 passing after repair, 12 original failures reproduced.

Exact tested and uploaded Git blob IDs:
- task-api.mjs: 211ebbca6c96898624f672f53d37b21240ca8446
- tests/forms-query-resilience.test.mjs: 844beb979022647ab5f32ccf2947206d11032f03
- policy.ts: b48e7e27c25a13971dc4a5af44447f239abb1aca
- tests/forms-query-cancellation.test.mjs: 10d19fdd26f3adf4d348b1fe78e9cbcd8cc3b11f

Run `npm run test:forms-query-resilience` on a checkout. The full-checkout offline matrix, existing regressions, installed RHF/Query, Next build, actual browser acceptance and human review were not executed here. Direct clone DNS and Node24 are unavailable. The new workbook's individual browser exercises are instructions, not completed tests. Reference/runtime dependencies are unchanged.

## Next
Run the independent P1 qualification profile on a clean stable Node24.9+ workstation, review actual browser/SSR/accessibility results and address failures. The review fingerprints and evidence must correspond to the current candidate. Only then promote 09.02 and 09.03 using established module-atomic review and publication rules. The source catalog remains 889/889 authored, 338 published and 551 unpublished; Vercel stays frozen.
