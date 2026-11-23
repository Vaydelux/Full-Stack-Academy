# P5 PostgreSQL authorization qualification

This optional executable lab covers 14 assertions against real PostgreSQL using ephemeral TEMP tables in a transaction, then ROLLBACK. It does not add any dependencies or touch the production application.

A real local PostgreSQL 17+ server and psql CLI are required. Create a **new disposable local database** called p5_lab_security and a throwaway user with sufficient TEMP privileges. Verify the actual server identity; a forwarded loopback port could still target a remote production system.

Set P5_LAB_DATABASE_URL to a URL such as postgresql://testuser:password@127.0.0.1:5432/p5_lab_security, set P5_LAB_CONFIRM to DISPOSABLE_ONLY and execute npm run qualify:p5:postgresql.

On PowerShell:
    $env:P5_LAB_DATABASE_URL = "postgresql://testuser:password@127.0.0.1:5432/p5_lab_security"
    $env:P5_LAB_CONFIRM = "DISPOSABLE_ONLY"
    npm run qualify:p5:postgresql

Offline guard tests: npm run test:p5-postgresql-source.

The SQL function receives a trusted server-derived user ID in a production design. This fixture does not check actual HTTP authentication, PostgreSQL RLS, OIDC claims, transaction concurrency, upload bytes or production privileges. Passing 14 assertions is not production compliance proof. Run only against a fresh synthetic database and do not expose its credentials.
