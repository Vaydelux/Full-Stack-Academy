# 14.03.04 — RLS and authorization qualification (NOT EXECUTED)

**Boundary:** Real Supabase Auth, Data API roles, Storage permissions and PostgreSQL RLS are not reproduced by parsing lesson text.

## Allowed role test
Inspect the real Prisma connection role's BYPASSRLS/table owner properties; test the API with two authenticated users and deliberately forbidden projects.

## Explicit denied test
With a privileged test connection and two tenants, attempt a cross-tenant read through the API. Assert the server code rejects it even when the database role would otherwise see the row.

## Security and operational cautions
Filtering by tenant alone is not sufficient when membership is per project. Do not claim Prisma automatically forwards a Supabase browser JWT to the database connection.

Test anon and two authenticated synthetic users in a dedicated local Supabase stack with table grants and RLS enabled. Do not use a service-role connection to assert end-user data isolation. Do not modify live projects or copy JWT secrets into Git. Obtain human security review before publication.
