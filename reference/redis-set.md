# Reference — Redis `SET` with expiry

**Category:** Cache · **Status:** authored reference draft · **Canonical:** https://redis.io/docs/latest/commands/set/

## At a glance

Store a string value under a key. Use a time-to-live when caching data that should expire.

## Syntax

```redis
SET cache:user:123 "{\"name\":\"Mika\"}" EX 60
```

This stores a value that expires after 60 seconds. `GET cache:user:123` returns the value until expiration or deletion.

## Production rules

- Include tenant/scope identifiers in key namespaces where relevant.
- Do not use a shared cache for sensitive data without isolation and access controls.
- Set sensible TTLs and explicit invalidation strategy.
- Do not depend on Redis cache for durable application records.
- Never assume a cache hit means the original source remains authoritative.

**Related:** `GET`, `DEL`, `TTL`, eviction policy, cache stampede, BullMQ isolation, lesson 16.01.
