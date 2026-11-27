# P4 session and migration checkpoint

Candidate source only. No curriculum promotion or production changes.

- Prisma 13.03.03 and 13.03.08: the existing runner audits the exact SHA-256 of each checked-out migration against the disposable database history after deploy and again after repeat deploy. Reject missing, unexpected, duplicate, unfinished and rolled-back rows. This is a migration-history check, not comprehensive schema drift detection or an expand-contract exercise.
- Supabase 14.02.06–14.02.08: add an independent SDK session suite using three clients and one synthetic user. Require identity confirmation, refresh rotation, local sign-out, revoked-refresh rejection with a narrow Auth error code, and successful refresh of a separate session. No token values are emitted. Access JWT expiry remains a separate concern. Run only on a fresh disposable local stack configured for independent sessions and rotating refresh tokens.
- Use the existing evidence CLI's plan/collect/check commands with supabase-session. Receipts remain supplemental, not lesson-level approval.
- Three migration-history and four injected-client session tests passed on Node 22. Live Prisma, Auth, complete offline and browser checks have not been run. Prisma still needs a genuine tracked lockfile, Node 24 and isolated PostgreSQL. Supabase needs the local stack and pinned SDK workspace dependencies.

Next: actual local integration qualification, explicit schema drift comparison against a disposable schema, relation loading, SSR cookie integration, OAuth/MFA, Postgres Changes and Presence. P1 human review and mixed PostgreSQL publication gates remain unchanged.

References:
- https://www.prisma.io/docs/cli/v7/migrate/status
- https://www.prisma.io/docs/cli/v7/migrate/deploy
- https://supabase.com/docs/guides/auth/sessions
- https://supabase.com/docs/guides/auth/signout
