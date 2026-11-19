# Loopback Notes API — OpenAPI 3.1.1 and limited generated SDK

This is a **local teaching fixture**, not a production system or standalone public service. It uses a restricted generator instead of an arbitrary external SDK generation framework.

- `task-api.openapi.json`: canonical OpenAPI **3.1.1** contract with public `GET /health`, bearer-protected `GET /api/notes` and bearer-protected `POST /api/notes`. Defines JSON responses, RFC 9457 problem envelopes, bearer scheme and JSON Schema 2020-12-shaped components.
- `generate-client.mjs`: emits executable ECMAScript from **trusted** static GET/POST paths and safe unique operation IDs; injects bearer tokens only at runtime. Rejects non-3.1 documents, unknown dynamic paths, unsafe IDs and malformed operation responses.
- `load-spec.mjs`: reads the exact checked-in JSON with `node:fs/promises`.
- `../../labs/security-insecure-endpoint/solution/solution.mjs`: local Node server with an opaque demo token and bounded JSON, used by the SDK capstone.

## Local acceptance

```bash
node --test labs/security-insecure-endpoint/solution.test.mjs
node --test labs/openapi-generated-client-capstone/solution.test.mjs
ACADEMY_LAB_TARGET=starter node --test labs/openapi-generated-client-capstone/solution.test.mjs
```

The final command **must fail** with `ERR_ASSERTION`. Run from the repository root. The exact source files from GitHub passed the two instructor tests locally using Node 22.16; the target Node 24 has not been checked.

**Non-goals:** URL path parameter expansion, OAuth, generalized OpenAPI/JSON Schema validation, spec-to-TypeScript typing, response schema runtime validation, public auth, durable storage, multi-tenant access, distributed replay protection, production TLS and deployment. Use a maintained compiler, schema validator, security audit and real integration environment if extending to a commercial SDK.
