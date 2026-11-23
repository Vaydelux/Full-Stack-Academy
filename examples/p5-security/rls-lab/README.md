# P5 Security: RLS and curriculum qualification

This package extends the existing security lab with an **opt-in PostgreSQL row-level security (RLS) fixture** and a **32-topic source auditor**. Neither is wired into the public Academy reader.

## Offline checks (no external services)

From the repository root:

```bash
npm run test:p5-bundle
```

This runs the original policy and HTTP lab, the guarded SQL source checks, 10 RLS source/runner tests, and the 32-manuscript audit plus nine mutation regressions. The source auditor checks canonical IDs/titles, draft status, lesson steps, knowledge checks, references, and absence from the live published registry. It does **not** establish framework runtime compatibility or editorial correctness.

## Optional genuine PostgreSQL RLS checks

Use a **new disposable PostgreSQL 17+ cluster** under your control (not merely a pre-existing database in a production cluster). The script creates three cluster-wide NOLOGIN roles and one schema, inside a single transaction, then rolls back. The role commands need appropriate PostgreSQL CREATEROLE rights. An unhandled SQL error must fail the session and roll the transaction back.

Set an isolated connection to a lab database named `p5_lab_*`, and explicitly opt into temporary role creation.

PowerShell:

```powershell
$env:P5_LAB_DATABASE_URL = "postgresql://lab-user@127.0.0.1:5432/p5_lab_security"
$env:P5_LAB_CONFIRM = "DISPOSABLE_ONLY"
$env:P5_LAB_RLS_CONFIRM = "ALLOW_ROLES"
npm run qualify:p5:rls
```

Bash:

```bash
P5_LAB_DATABASE_URL='postgresql://lab-user@127.0.0.1:5432/p5_lab_security' P5_LAB_CONFIRM=DISPOSABLE_ONLY P5_LAB_RLS_CONFIRM=ALLOW_ROLES npm run qualify:p5:rls
```

The runner accepts only `127.0.0.1`, `localhost`, or `::1` and disposable `p5_lab_*` names. This is a safeguard, **not proof** that a port-forwarded loopback destination is disposable. Confirm server identity independently. Use synthetic records and never supply production credentials. Avoid passwords in command-line URLs where they could be visible to other users.

The 14 RLS assertions deliberately use `SET ROLE` to simulate database principals, query through actual PostgreSQL policies, attempt cross-tenant reads/writes/deletes, test read-only access and membership visibility, revoke a membership, and check that unrelated tenant data is unchanged.

## Security and verification boundaries

- This is **database-role RLS practice**, not a fully integrated Next/Nest/Postgres login system. `SET ROLE` is privileged; clients must not choose roles directly.
- An actual application using a single pooled connection role needs a separately designed trusted identity/tenant boundary and appropriate RLS policies. Untrusted custom session variables alone do not establish verified identity.
- HTTP tests still use an in-memory store; they do not exercise this RLS script.
- The RLS SQL has not been executed in a live PostgreSQL instance in the authoring environment. Only the offline Node tests and static source review have been executed.
- A full release still requires Node 24, Next/browser testing, independent security review, and named human accessibility checks, after the earlier P1–P4 gates.

**Published registry remains unchanged:** 338 published, 184 authored unpublished drafts, 367 remaining unauthored, 889 canonical.
