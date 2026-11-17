# 15.02.04 — The authorization bug that slips past login

*NestJS · Supabase Auth · Prisma 7 · 45 minutes editorial estimate · Advanced · Sample authored lesson (conceptual snippets, later integrated lab verification)*

## The problem we're solving

A user signs in and requests `GET /projects/prj_123`. The token is valid; the API returns the project. Now the user changes the URL to `prj_456`. If that belongs to another organization, should a valid login be enough? **Absolutely not.** Login proves identity. It doesn't prove the right to read a particular record.

This is a form of **Broken Object Level Authorization (BOLA/IDOR)**.

## What you'll learn

1. Separate authentication from per-record authorization.
2. Explain why a NestJS auth guard is necessary but insufficient.
3. Apply tenant and ownership predicates to a Prisma query.
4. Test a denied cross-tenant request as a negative security case.

## The mental model

```text
JWT verified?   ── no ──→ 401 Unauthorized
     │ yes
     ↓
Can this user access THIS record? ── no ──→ 403 or 404 by policy
     │ yes
     ↓
Tenant-scoped query + minimized response
```

## Step 1 — Recognize the unsafe query

This is **intentionally wrong**:

```ts
const project = await prisma.project.findUnique({
  where: { id: projectId },
});
```

Even with a valid JWT, the lookup ignores the user's organization and permissions. Any authenticated person who guesses a valid ID might read data they should not see.

## Step 2 — Define a resource authorization policy

Before querying, the backend must derive the authenticated principal from a verified token. Do not trust `organizationId` submitted by the browser as proof of membership. It may be used as a requested scope, but membership and permissions must be verified server-side.

A simplified service query (assuming verified principal and a membership check completed by the service) can scope the lookup:

```ts
const project = await prisma.project.findFirst({
  where: {
    id: projectId,
    organizationId: authorizedOrganizationId,
  },
  select: { id: true, title: true },
});

if (!project) {
  throw new NotFoundException('Project not found');
}
```

This is a defense-in-depth predicate; the surrounding service **must** verify that the principal has permission in that organization. A filter alone does not grant permission safely.

## Step 3 — Add a negative test

Create two organizations and two test users with separate memberships. After authenticating as User A:

- Request a project from Organization A → permitted.
- Request a project from Organization B → denied (403 or 404 according to documented policy).
- Attempt a write to Organization B → denied.
- Attempt to submit Organization B's ID in the request body → still denied.

Expected: none of the cross-tenant requests return protected data, even when the resource ID is real.

## Important Supabase + Prisma caveat

Supabase's Prisma integration may use elevated database roles that bypass Postgres RLS. Do not assume that signing in with Supabase Auth automatically constrains every query made by your NestJS Prisma server. Explicitly design the database roles, RLS boundaries and backend authorization; test them separately.

## Knowledge check

**A route verifies JWT signatures but loads resources by arbitrary ID. What's missing?**

A. A faster ORM.  
B. A CSS security policy.  
C. Object-level authorization that checks identity against the requested resource.  
D. More logging only.

**Correct: C.** Logging helps detection but cannot replace prevention.

## Bug Hunt Arena

A test passes `GET /projects/a` with User A and returns 200. The engineer calls it secure. Write the missing test: User A requests User B's project. Show how the defective query incorrectly returns it and why adding verified tenant scope fixes it.

## Capstone task

Protect read, update and delete operations on a project, including file attachment URLs. Write one positive and three negative integration tests. Document whether the API reveals existence of unauthorized resources using 403 or 404.

**Proof it works:** Verify cross-tenant requests fail in actual integration tests, including when the ID exists.

**Official references:** [OWASP API Security Top 10](https://owasp.org/API-Security/) · [NestJS Guards](https://docs.nestjs.com/guards) · [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).
