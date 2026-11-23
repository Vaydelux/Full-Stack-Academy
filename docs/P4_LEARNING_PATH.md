# P4 Prisma + Supabase — Structured Learning Path

This learning path spans **eight complete eight-lesson draft modules** and connects them to a realistic multi-tenant ERP document workspace. It is an authoring and qualification map, not an unlocked published course.

| Stage | Module | What the learner should demonstrate |
|---|---|---|
| 1 | 13.01 Prisma Setup | Generate the Prisma ORM v7 client with PrismaPg and a reviewed local schema migration |
| 2 | 13.02 Reading & Writing Data | Build safe tenant-scoped CRUD/repositories, transactions and bounded pagination |
| 3 | 13.03 Advanced Persistence | Handle raw SQL safely, pooled connections, migration drift and typed repository boundaries |
| 4 | 13.04 Supabase Integration | Use least-privileged SQL roles and distinguish direct Prisma access from JWT-based RLS |
| 5 | 14.01 Supabase Architecture | Build isolated local environments; separate publishable and secret keys and Data API grants |
| 6 | 14.02 Auth & Identity | Implement verified sessions, SSR refresh, OAuth/PKCE, MFA and sign-out |
| 7 | 14.03 RLS & Authorization | Verify positive and negative role/tenant access using two real synthetic JWT identities |
| 8 | 14.04 Storage & Realtime | Secure document uploads, Storage policies, private Realtime and safe webhook processing |

## Integrated capstone acceptance contract

Create two disposable organizations **alpha** and **beta** with their own users, projects, tasks and private documents. A fully qualified project must meet all of these outcomes:

- A signed-in alpha user lists authorized tasks, cannot read beta's known task/document IDs, and cannot reassign tenant IDs in UPDATE/INSERT even with a crafted payload.
- A Prisma-backed NestJS endpoint enforces explicit server-verified membership independently of the Supabase Data API's RLS. A connected SQL owner/bypass role never becomes authorization by itself.
- A PDF upload is issued only after server membership and file limits are checked; the server derives an unpredictable/validated path. The metadata stays **PENDING** until bytes are independently validated and scanned; beta cannot download alpha's object. Failed flows are idempotently cleaned up.
- Realtime participants join private, policy-authorized topics; alpha cannot observe beta's Presence/Broadcast or Postgres Changes. Subscriptions are removed on logout/unmount.
- A webhook consumer verifies the specifically configured gateway's raw-body signature, rejects forged/out-of-window events, deduplicates event IDs and never trusts an independently supplied event object.

For every positive test, add its negative pair and record the actual test identity/role, request, observed response and database state. Do not use production credentials or data. A code scan and an IDE green check are not a substitute for running the test.

## Content and progress rules

The authored materials live in `drafts/p4/lessons` and `drafts/p4/labs`. The main academy course only exposes lessons from its published registry; `/learn/roadmap` reports manuscript stages and `/learn/dashboard` reports an individual's completions separately.

Keep these stages distinct: **unstarted** → **authored draft** → **runtime-qualified** → **review-approved** → **published**. Runtime qualification and approval are not implied by a source merge.

Run `npm run test:p4-source` for source parity and the pure upload intent tests; use the distinct real integration environment and human release gate described in `docs/ACADEMY_P4_COMPLETION_CHECKPOINT_20261123.md` before promotion.
