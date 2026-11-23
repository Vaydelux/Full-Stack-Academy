# P5 authenticated HTTP lab

Run from repo root: node --test examples/p5-security/http-lab/solution.test.mjs

This isolated Node 22+ lab has a deliberately incomplete starter, a working instructor solution and fifteen network-level tests using an ephemeral loopback server. Study modules 15.01–15.04 first, then implement server-owned principal resolution, expiring signed sessions, object authorization, tenant isolation, membership revocation, mutation origin checks, and private upload-intent path derivation. Compare with the instructor solution after writing your tests.

Limits: this is NOT real JWT/OIDC or PostgreSQL/Supabase RLS; sessions, data and authorization are in memory. The origin check demonstrates only one CSRF layer, not full cookie/CSRF protection. No upload bytes are accepted or scanned, no real signed storage URL is issued, and the fixture has no production timeout/rate limit hardening. No production security or accessibility claim follows from passing these tests. Run on synthetic local data only; never deploy teaching code.
