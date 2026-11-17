# Reference — Prisma 7 `$transaction()`

**Category:** Database transactions · **Status:** authored reference draft · **Major version:** Prisma 7 · **Canonical:** https://www.prisma.io/docs/orm/prisma-client/queries/transactions

## At a glance

Group database operations that must commit or roll back as one unit. A transaction is not a replacement for domain invariants, isolation analysis or retry policies.

## Syntax

```ts
await prisma.$transaction(async (tx) => {
  await tx.account.update({ /* ... */ });
  await tx.ledgerEntry.create({ /* ... */ });
});
```

## Main forms

- **Interactive transaction:** `prisma.$transaction(async tx => { ... })`, for dependent logic.
- **Sequential operations:** `prisma.$transaction([operation1, operation2])`, where suitable.

## Pitfalls

- Avoid long transactions and arbitrary external network calls while locks are held.
- Concurrency can still cause transaction conflicts; understand isolation and implement bounded retry for documented retryable errors.
- A transaction touching several rows does not magically enforce cross-tenant permissions.
- For side effects such as email, use a transactional outbox instead of sending external email inside a DB transaction.

**Related:** PostgreSQL isolation, Prisma `findMany`, idempotency, outbox pattern, lesson 13.02 and lesson 23.03.
