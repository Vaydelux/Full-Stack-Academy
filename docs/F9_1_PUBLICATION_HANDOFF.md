# F9.1 — Ordered publication coordinator and SQL review projections

Baseline 7ade827462566c591c46e4fa2882f2f73f9e6403. The user-facing publication count stays 338/889; no production registry, metadata, lab manifest, checkpoint snapshot or deployment was changed.

## Commands

- npm run publish:academy -- --next
  Reconcile canonical curriculum, real MDX/interactive inventory, checkpoint, staged inventory and existing publication queue. Reject invalid or out-of-order module state. Report the earliest pending module and existing qualification/review commands. No commands are executed and publicationApproved is always false.
- npm run publish:academy -- --check-projections
  Build the two unpublished SQL review projections in memory, with the real source-bound persistence plan. No file writes. Already fully published modules are excluded.
- npm run publish:academy -- --project 12.01
- npm run publish:academy -- --project 12.02
  Export exactly one proposed module to a fresh temporary directory outside a clean Git checkout. The overlay contains 8 article/metadata pairs, 8 sets of five lab files (starter, solution, acceptance, manifest, actual Node test wrapper), and three integration files (lesson registry, metadata registry, package scripts), 59 files total. The manifest binds HEAD, original source fingerprint, projection fingerprint, each output and existing-file preimage, and order eligibility. The manifest is a checksum record, not a signature or runtime receipt.

## Boundaries

These are non-applicable review overlays only, not promotion patches. The live-shape metadata contains an explicit synthetic review fixture date 2000-01-01 to satisfy the schema during future isolated rehearsal; this is not actual reviewer evidence. Do not copy or merge these files. No apply or deploy command exists. They deliberately omit checkpoint changes. The runtime wrappers invoke the actual shared PostgreSQL semantic red/green runner and do not skip when psql/credentials are missing. Only 12.01 and 12.02 are supported: 12.03 needs separate concurrency evidence, 12.04/12.05 contain mixed manual contracts, and P4–P7 need topic-specific external or manual qualification. Their existing review packs remain usable.

## Tests

Six Node24.11.1 targeted fixture tests passed: first-module selection, invalid/out-of-order inventory, both 8-lesson projection shapes, byte-preserved SQL, registry and lab bindings, rejection of source drift, existing live targets, missing markers, unsupported runtime and altered code fences. Tests are included in test:persistence-release. CLI syntax checked. The actual full checkout projection, real PostgreSQL, root build, browser and human accessibility review have not been executed here.

## Next

Execute existing P1 qualification and guarded RHF/Query review on a complete Node24 checkout; publish 09.02 then 09.03 only after genuine review. P2 requires real Nest lock and runtime. Next implement detached-worktree rehearsal and guarded transactional apply for the first PostgreSQL modules, with actual SQL, root postflight, browser checks and a named reviewer replacing the synthetic date. Extend actual projections to remaining persistence and late-phase modules only when their runtime obligations have executable acceptance paths. Never treat source-only tests as permission to promote.
