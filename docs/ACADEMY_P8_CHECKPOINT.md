# P8 qualification checkpoint

Baseline: P7 reports 889 authored, 338 published, 551 unpublished. No promotion in this change.

The advisory evaluator accepts canonical module IDs and editorial attestations. It checks completeness, commit identifier, digest format and positive/negative lab attestations. It does not verify the underlying digest, provenance, reviewer identity or execution logs and must never be used as authorization. Integrate with existing module-specific promotion tooling only after those checks exist.

Run isolated tests: node --test tests/p8-editorial-readiness.test.mjs

Qualification: direct clone failed DNS resolution; available Node is 22.16.0, not required 24.9+. No tests executed in this session. Keep PR draft until tested.

Next: run existing coordinator --plan-p1 and --run-p1 on clean Node 24 checkout; expand 09.02/09.03 lessons and real lab fixtures; bind evidence to actual source hashes and execution receipts; complete browser and manual accessibility reviews; promote modules atomically. Continue NestJS, PostgreSQL, Prisma/Supabase, security and platform batches in sequence. Deliver reference library and capstone using existing architecture, not duplicate registries. No workflow, lockfile, deployment or published content changes.

## P8 continuation: Forms and Remote State

All sixteen canonical topics in 09.02 and 09.03 now have distinct scenario-based knowledge checks and applied debugging clinics, synchronized in the preview manuscripts and release candidates (32 MDX files). No TSX code fences, live lesson registry, lab manifests or published metadata were changed. The new editorial parity test verifies the candidate/preview quiz and clinic match, four distinct answer choices, answer index, code fence parity and preview isolation. Full-checkout execution of this test remains outstanding.

The standalone examples/p8-conditional-write fixture uses real local HTTP with a narrow single-ETag conditional-write contract. Node v22.16.0 actually ran five tests: 5/5 passed. Deliberately removing the stale-version comparison in a disposable copy produced 3/5 passes and two expected assertion failures (stale write and concurrent writers). The exact green instructor files match Git blobs 273d03769c1f696c7559b0aa1d065752ba2e1e8b and 61567d7016bcc211f3c769f68724bc44adf73a9b. This does not qualify any React browser lab.

Run npm run test:p8-learning after a full checkout. The aggregate command is authored but not executed. Direct git ls-remote failed DNS in the current container; Node 24 unavailable. Existing browser tests, publication projection, MDX compile, source audits and human accessibility review are outstanding. The updated teaching material invalidates old human-review fingerprints; obtain fresh evidence rather than reusing old review receipts. Keep PR draft and do not publish until all required gates pass.

## P8 backend integrity continuation

Added a PostgreSQL transfer schema, executable SQL assertions and two-session lab instructions under examples/p8-backend-integrity. Added source-only Nest request pipeline and PostgreSQL concurrency reference pages under docs/p8-reference, aligned to canonical modules 11.02 and 12.03. No live registry or publication counts changed. PostgreSQL/psql are absent in the execution environment; SQL assertions and concurrency scenarios are authored but unexecuted. Nest reference is not an executable Nest application. Next: qualify SQL against a disposable PostgreSQL instance, implement a real Nest HTTP integration fixture, connect reference pages to the site after review, then expand remaining modules. Prior P1 qualification blockers remain.

## Reference integration continuation

Added twelve canonical authored reference drafts (six NestJS, six PostgreSQL) to the existing authored reference registry. Improved existing ReferenceExplorer token search; no parallel route or catalog. Snippets are illustrative, not independently executable or reviewed; minimal and production examples currently share syntax. Full build, reference audits and browser verification remain outstanding. The preceding Nest HTTP fixture under examples/p8-nest-integrity also requires genuine dependency lock and disposable PostgreSQL qualification. Next: verify reference IDs and related lessons, expand examples, execute full browser and database gates before publication.
