# PostgreSQL integrity laboratory

Unqualified instructor source for module 12.03. Use a fresh disposable database, never a production database. Requires PostgreSQL and psql.

```sh
createdb academy_integrity
psql -X -v ON_ERROR_STOP=1 -d academy_integrity -f examples/p8-backend-integrity/schema.sql
psql -X -v ON_ERROR_STOP=1 -d academy_integrity -f examples/p8-backend-integrity/assertions.sql
```

Amounts are integer minor units. The transfer function locks accounts in ascending ID order, records a unique request key and changes both balances in one transaction. Failed writes roll back the request record too. Identical replay returns false; mismatched replay raises an error.

## Two-session exercise

Seed two accounts with 100 units each. In session A begin a transaction and transfer 80 from account 1 to 2, leaving the transaction open. In session B attempt a different request transferring 80 from account 1 to 2. Predict blocking and then rejection after A commits. Inspect pg_stat_activity from a third session. Repeat with A rolling back; B should now succeed. Use distinct request UUIDs. Record balances and request count.

## Red-green exercise

In a disposable copy remove the unique request protection and replay handling, then run the assertions. Restore the protection and rerun. Separately reverse lock ordering in an experimental function and investigate deadlock handling with two sessions. Do not claim a deadlock was observed unless it actually occurs.

This is not a banking system: no authentication, authorization, ledger audit, external settlement or durable API response replay. Default READ COMMITTED is the intended exercise isolation; higher isolation may require whole-transaction retries. No runtime results are claimed.
