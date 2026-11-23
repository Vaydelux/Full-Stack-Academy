# 13.02.07: runtime qualification NOT EXECUTED

## Real positive check
Instrument actual Prisma query events or DB statistics on a disposable dataset with 1, 10 and 50 projects; inspect number of database round trips, result bytes and latency.

## Required negative regression
Test projects with zero tasks and cross-tenant tasks sharing project IDs. Assert no tenant leak and query counts remain approximately constant as projects increase.

## Limits
One large batch is not always optimal. Very large IN lists and relations may require chunking, filtering and a measured plan; do not claim a speedup without profiling.

Use the generated Prisma ORM v7 client, real driver adapter and dedicated two-tenant PostgreSQL test database. Inspect both request authorization and database state; do not treat a source match or a mocked method call as actual integration evidence.
