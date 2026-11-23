# P5 expanded HTTP lab checkpoint — 2026-11-23

Added a standalone authenticated Node HTTP demonstration under examples/p5-security/http-lab. It includes a starter, a complete instructor solution and 15 live loopback tests for signed test sessions, cross-tenant GET/PATCH/DELETE denials, revoked membership, origin checks, storage path derivation and error responses. No production runtime, dependency, data store, deploy setting or published registry is changed.

Canonical topics 889; published 338; authored unpublished 184; not yet authored 367.

Pending: exact Node24 checkout run, real Postgres/Supabase RLS integration and authenticated two-user tests, real upload bytes/scan/expiry tests, browser and human accessibility review; earlier P1–P4 publication gates must be completed first. Passing these in-memory HTTP lab tests alone does not establish production security.
