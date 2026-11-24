# NestJS + PostgreSQL HTTP integrity lab

Source-authored, not runtime-qualified. Node 24, PostgreSQL and npm required. Use a fresh disposable database; never point this fixture at a real database. Apply ../p8-backend-integrity/schema.sql to the empty database first. Set ACADEMY_TEST_DATABASE_URL to its connection string. Run npm install to generate a genuine lockfile, then npm test. The test intentionally leaves rows in the disposable database; recreate it before rerunning.

The Nest pipe validates JSON before the controller invokes an injected service. The service uses parameterized SQL and maps expected SQLSTATE failures without returning database internals. The test exercises actual HTTP, replay, invalid input, conflicting payloads, overdraft and concurrent writers. The server listens only on loopback. No authentication or authorization is implemented; this is not a deployable banking service. The replay response indicates whether a write was applied, not a durable replay of the original HTTP response.

Exercise: remove the pipe, observe the invalid-input assertion fail; restore it. In a disposable database remove the balance predicate and constraint, observe the overdraft assertion fail; restore both. Explain why client validation alone cannot protect concurrent writes. Never remove constraints in a real database.

Next: qualify real dependencies, commit generated lockfile, run database tests, add authenticated guard and request tracing in a separate teaching fixture. No published registry changes.
