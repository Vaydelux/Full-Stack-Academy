# 14.01.03 — separate, not-yet-executed integration verification

## Positive integration test
Run a Next.js build locally and inspect emitted client assets; verify anon/authenticated Data API behavior with an intentionally forbidden row.

## Negative unauthorized or unsafe case
Search the built frontend JS and source-controlled environment files for secret/service_role key material. Attempt unauthorized SELECT/UPDATE using a publishable key and expect RLS denial.

## Privilege and environment boundary
Don't assume a key alone determines access. Database Grants and RLS are both required; a service role can bypass RLS and must never be reused to repair a client permission failure.

Use a dedicated Supabase local stack and two synthetic users. Do not execute the examples on live projects, use production keys, or claim source audit results establish RLS protection. Confirm current CLI versions and run independent data API tests.
