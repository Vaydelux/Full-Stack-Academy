# P5 Disposable PostgreSQL Checkpoint — 2026-11-23

Added 14 rollback-only SQL security assertions, a fail-closed local-only PostgreSQL runner, and six guard/source tests. Tests model tenant-scoped reads, cross-tenant read/update/delete denial, viewer restrictions, locked records, suspension, atomic SQL predicate, and revoked membership.

Evidence limitation: the current environment has Node 22 but no psql/PostgreSQL server. The DB test MUST be run against a genuine disposable PostgreSQL instance; no database pass is claimed. No production database, Vercel deployment setting, workflow, curriculum publication or learner progress is modified.

Next: execute Node24 repository tests and the guarded SQL test on PostgreSQL 17+, add authenticated HTTP-to-real-DB integration and RLS role isolation, and complete outstanding P1–P4 qualification before publishing. Curriculum remains 338 published / 184 drafts / 367 unauthored / 889 canonical.
