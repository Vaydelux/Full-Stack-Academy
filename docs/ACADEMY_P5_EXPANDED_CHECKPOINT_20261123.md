# P5 Expanded Source Checkpoint — 2026-11-23

Merged base: `e2c3b0503d9269835d5f4027b461b9757d26eeb4`.

## Accomplished

- Authored 24 additional canonical P5 lessons, 15.02.01–15.04.08, with unique scenarios, vulnerable design, correct design, practice acceptance and knowledge checks.
- Total P5 manuscripts: **32/32** across 15.01–15.04; all are `draft-unverified`.
- Added a standalone dependency-free Node policy lab for RBAC, ABAC-like locked resource conditions, tenant isolation, membership revocation, safe log projection and static outbound-host matching.
- No dependencies, GitHub Actions, Vercel settings, published lessons or learner progress changed.

## Curriculum accounting

**889 canonical = 338 published + 184 authored/unpublished + 367 not yet authored.** Neither the public reader nor its completion registry has been changed.

## Evidence and limits

All new material is source-authored; no production Node24, Next, real OIDC/SAML/SCIM, browser, accessibility or PostgreSQL/Supabase integration verification is represented by this change. Before publication, execute `node --test examples/p5-security/policy.test.mjs` and repository checks on an actual Node24 checkout, and manually review official references and security claims.

## Next TODO

1. Execute Node24 `npm ci`, P5 lab tests, `npm run test:publication-phases`, `npm run test:p4-source`, `npm run verify:offline`, `npm run build`; save genuine outputs.
2. Add actual authenticated HTTP + DB integration against two tenants, including known-ID cross-tenant read/write/delete, revoked membership, and unauthorized signed upload intents.
3. Convert P5 scenarios to paired red-green starter/instructor code and add safety-limited runtime tests (CSRF/XSS, SQL injection, redirect/IP-rebinding SSRF checks, file scanning lifecycle).
4. Review ASVS controls and named editorial/a11y acceptance; do not claim compliance from example tests.
5. Keep release gates sequential and Vercel Git deploy frozen. Only publish individually verified lessons.
