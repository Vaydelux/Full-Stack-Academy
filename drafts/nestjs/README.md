# NestJS 12 draft curriculum — 32 authored lessons

Modules `11.01` through `11.04` each contain eight canonical NestJS lessons, including substantial MDX teaching, metadata, and distinct starter/instructor TypeScript exercises. This is source authoring, **not publication** or validated executable labs.

Run `npm run status:nestjs-drafts` from the academy root to inspect all 32. Actual Nest 12 tests must run in `examples/nestjs-vertical` with a genuine npm-generated lock before the module gates can pass; see `docs/NESTJS_32_AUTHORING_CHECKPOINT.md`.

An intentionally broken starter should fail a specific *behavioral* assertion after compiling, never because dependencies were absent. The example API must stay bound to loopback, and auth, tenancy and PostgreSQL transactions must be verified at the server/persistence layer. Source-only audit success must never be mistaken for an independent runtime result.
