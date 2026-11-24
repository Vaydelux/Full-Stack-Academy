# P8 qualification checkpoint

Baseline: P7 reports 889 authored, 338 published, 551 unpublished. No promotion in this change.

The advisory evaluator accepts canonical module IDs and editorial attestations. It checks completeness, commit identifier, digest format and positive/negative lab attestations. It does not verify the underlying digest, provenance, reviewer identity or execution logs and must never be used as authorization. Integrate with existing module-specific promotion tooling only after those checks exist.

Run isolated tests: node --test tests/p8-editorial-readiness.test.mjs

Qualification: direct clone failed DNS resolution; available Node is 22.16.0, not required 24.9+. No tests executed in this session. Keep PR draft until tested.

Next: run existing coordinator --plan-p1 and --run-p1 on clean Node 24 checkout; expand 09.02/09.03 lessons and real lab fixtures; bind evidence to actual source hashes and execution receipts; complete browser and manual accessibility reviews; promote modules atomically. Continue NestJS, PostgreSQL, Prisma/Supabase, security and platform batches in sequence. Deliver reference library and capstone using existing architecture, not duplicate registries. No workflow, lockfile, deployment or published content changes.
