# NestJS + PostgreSQL HTTP integrity lab

Source-authored, not runtime-qualified. Node 24, PostgreSQL and npm required. Use a dedicated disposable database and a role allowed to create schemas. Set ACADEMY_ISOLATED_PG=YES and ACADEMY_TEST_DATABASE_URL to its connection string (without an options query parameter). Run npm install to generate a genuine lockfile, then npm test. The test creates a randomly named schema, installs the companion SQL automatically, scopes its connection pool to that schema, and attempts cleanup in finally. Never point the fixture at a real database. A killed process or failed cleanup may leave its disposable schema; inspect and remove it manually.

The Nest pipe validates JSON before the controller invokes an injected service. The service uses parameterized SQL and maps expected SQLSTATE failures without returning database internals. The test exercises actual HTTP, replay, invalid input, conflicting payloads, overdraft, concurrent writers, same-key concurrent replay and destination-overflow rollback. The server listens only on loopback. No authentication or authorization is implemented; this is not a deployable banking service. The replay response indicates whether a write was applied, not a durable replay of the original HTTP response.

Exercise: remove the pipe, observe the invalid-input assertion fail; restore it. In a disposable database remove the balance predicate and constraint, observe the overdraft assertion fail; restore both. Explain why client validation alone cannot protect concurrent writes. Never remove constraints in a real database.

Next: qualify real dependencies, commit generated lockfile, run database tests, add authenticated guard and request tracing in a separate teaching fixture. No published registry changes.
