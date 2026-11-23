# P5 disposable Node 24 + PostgreSQL 17 qualification

Run from the Full-Stack Academy repository root:

```bash
npm run qualify:p5:container
```

**Requires:** Docker Desktop (Linux containers) or Docker Engine with Compose v2 and permission to build/download container images. Network access is needed the first time to pull the images and install the PostgreSQL client. The task is not invoked by `npm install`, normal builds, deployments or GitHub Actions.

## What happens

The runner creates a **randomly named Compose project** (printed before startup), starts an isolated PostgreSQL 17 database and a Node 24 qualification container, and runs:

```bash
npm run test:p5-bundle
npm run qualify:p5:postgresql
npm run qualify:p5:rls
npm run qualify:p5:http-db
```

The Node 24 image installs a compatible `psql` client and checks its own runtime major version. The SQL tests execute against a **fresh lab-only database**, not a caller-supplied database. The PostgreSQL service has **no published host ports** and stores its data on a **temporary in-memory filesystem**. The qualifier shares only the database service's private network namespace; its source tree is mounted **read-only**. The runtime runs as the unprivileged `node` account.

The initialization script creates a disposable nonsuperuser account with `CREATEROLE` only because the separate RLS teaching lab creates temporary roles. That privilege must **never** be copied to a production application role. All passwords in this Compose file are **public lab-only fixtures**, not actual secrets. Never change these files to point at production/staging data.

Success requires zero exit codes from all four commands. The wrapper runs `docker compose down --volumes --remove-orphans` for **only its unique project**, whether the tests succeed or fail; incomplete cleanup is reported as a failure. Images use supported major-version tags, **not immutable digest pins**: record `docker image inspect` digests when generating release evidence.

The PostgreSQL 17 container is the server under test. The Node 24 container uses a Debian-packaged `psql` client compatible with that server; the client major is not necessarily 17.

## Without Docker

Source guard tests use only Node's built-ins:

```bash
npm run test:p5-container-source
```

These tests check the runner's cleanup/failure logic and static isolation settings. They **do not execute PostgreSQL or prove Compose can build**.

If interrupted or forcibly killed, the wrapper may not complete cleanup. Recover only the project identifier printed at startup:

```bash
docker compose -f examples/p5-security/container/compose.yaml -p academy-p5-<printed-eight-hex> down --volumes --remove-orphans
```

Never use a blanket Docker prune command for this qualification.

## What passing does and does not prove

A successful container run would qualify the **synthetic teaching fixtures**: DB-role checks, policy tests, one HTTP-to-database integration, membership revocation, transaction-scoped actor, and concurrency exercises. It **does not** prove security of the production Academy, OIDC/SSO identity, pooled connection safety, third-party services, real PDF content scanning, cookie attributes, or human accessibility. The database adapter is deliberately `psql`-per-request and not a deployable pooled database client.

The separate **full Next.js release gate** (`npm ci`, `npm run verify:offline`, production build, browser accessibility, human/security review) remains mandatory. P5 lessons stay unpublished until earlier P1–P4 phases and all applicable release checks pass.

This capability was authored and its Node guard tests were executed on Node 22; **Docker, Node 24 container build, and PostgreSQL runtime execution could not be performed in the authoring environment**. Do not mark those checks passed until genuine Compose logs exist.

## Verified repository layout

The source test uses paths relative to `container/run-container.test.mjs`, which must resolve to `../http-db/cleanup.sql` and `../http-db/qualify.mjs`. The previous test source accidentally used `../cleanup.sql` and `../qualify.mjs`, paths that existed only in a rearranged local fixture. It failed when checked against the actual repository structure. This path defect was reproduced and corrected; execute the tests from the repository root to avoid false passes.

The HTTP-to-PostgreSQL qualifier now also creates a temporary, non-login runtime role; its real PostgreSQL privilege checks remain **unverified** until Docker runs against an isolated PostgreSQL 17+ instance.

## Commit-bound qualification evidence (2026-11-23)

The Compose qualifier now invokes `evidence.mjs` after checking the Node 24 environment. Rather than trusting an isolated `PASS` message, it requires:

- An actual clean tracked Git checkout and its exact 40-character commit SHA.
- Node 24 running **inside** the qualifier.
- An actual PostgreSQL server reporting version 17 or newer, reached through loopback with the disposable confirmation flags.
- Four ordered commands exiting with status zero: the P5 source bundle, SQL authorization checks, role-based RLS checks and HTTP-to-PostgreSQL acceptance. Each DB command must emit its **distinct real success marker**.
- A SHA-256 of each stage's captured process output, plus the check result and completion timestamp. The report stores **no passwords, connection URLs or raw command logs**.

On successful or failed execution, the qualifier prints one base64url record prefixed `P5_QUALIFICATION_EVIDENCE=`. The validator rejects a failed, missing, duplicated, stale (over 24 hours), wrong-commit, wrong-Node, wrong-PostgreSQL, incomplete or marker-less record.

To capture real evidence on macOS/Linux in the exact checkout:

```bash
npm run qualify:p5:container > p5-qualification.log 2>&1
node examples/p5-security/container/verify-evidence.mjs p5-qualification.log "$(git rev-parse HEAD)"
```

On Windows PowerShell:

```powershell
npm run qualify:p5:container *> p5-qualification.log
$sha = git rev-parse HEAD
node examples/p5-security/container/verify-evidence.mjs p5-qualification.log $sha
```

**Important:** Docker may emit diagnostic content in its full captured log. Inspect and redact any unexpected sensitive lines before sharing that log. The structured evidence record does not include raw stdout/stderr. The log hashes are integrity identifiers, **not cryptographic attestations**; a fabricated or edited local log is not independently trusted release evidence.

Run the new source tests without Docker:

```bash
npm run test:p5-evidence-source
```

The source-only tests use an injected mock subprocess executor to exercise fail-closed behavior. They do **not** provide real Node24/PostgreSQL runtime evidence. Keep published lessons and production deployment frozen pending the actual database run, full Next.js build, identity/storage qualification and browser/human accessibility review.
