# 09.01.02 — Why TypeScript cannot validate an API response

*Zod 4 · 35 minutes editorial estimate · Beginner/Intermediate · Sample authored lesson (code not yet tested in a published lab runner)*

**The problem we're solving:** Your API says a user has a `name`, `email`, and `age`. TypeScript believes the type you wrote. But a request over the network can contain anything—even a missing `age`, a string where a number belongs, or maliciously shaped data. Let's stop trusting strangers' JSON.

## What you'll learn

1. Explain why TypeScript disappears at runtime and why `as User` is not validation.
2. Create a Zod schema that checks an unknown value.
3. Inspect `safeParse` success/failure without throwing.
4. Return an appropriate error when external data is invalid.

## The mental model

```text
Untrusted JSON from network
          ↓
      unknown value          TypeScript type alone cannot verify it
          ↓
      Zod.safeParse
        ↙      ↘
    valid      invalid
      ↓           ↓
typed data    issues and error response
```

**Predict first:** If the server returns `{ "age": "twenty" }`, can a TypeScript interface force the browser to convert it into a number? **No.** It is a compile-time promise, not a runtime check.

## Step 1 — Create a small TypeScript project

From the exercise repository root, in PowerShell:

```powershell
New-Item -ItemType Directory -Force -Path .\zod-boundary
Set-Location .\zod-boundary
pnpm init
pnpm add zod
pnpm add -D typescript tsx @types/node
```

**Expected result:** `package.json` includes `zod`, and `pnpm-lock.yaml` is created. If `pnpm` is unavailable, complete the toolchain lesson first.

## Step 2 — Define the schema

Create `src/index.ts`:

```ts
import * as z from 'zod';

const UserSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  age: z.number().int().min(0),
});

type User = z.infer<typeof UserSchema>;

const payload: unknown = {
  name: 'Mika',
  email: 'mika@example.com',
  age: 'twenty', // intentionally wrong
};

const result = UserSchema.safeParse(payload);

if (!result.success) {
  console.log('Invalid API data');
  console.log(z.treeifyError(result.error));
} else {
  const user: User = result.data;
  console.log(`Welcome ${user.name}, age ${user.age}`);
}
```

Run:

```powershell
pnpm exec tsx src/index.ts
```

**Expected:** `Invalid API data` and a tree describing an invalid type at `age`. This is intentional: the lesson has passed its negative-case test when the invalid payload is **rejected**.

**What happened?** The value was declared `unknown`, so the program must narrow it. `safeParse` gives a discriminated result: success has `.data`, failure has `.error`.

## Step 3 — Make the response valid

Change the last field to `age: 20`, then run the script again.

**Expected:** `Welcome Mika, age 20`.

Notice the TypeScript `User` type is inferred from the schema. You are not maintaining two slightly different definitions.

## Step 4 — Try to break it

Test each of these one at a time:

- Remove `email`: missing required field.
- Change `name` to `''`: minimum-length failure.
- Change `age` to `-4`: minimum-value failure.
- Change `age` to `20.5`: integer failure.

Keep `payload: unknown`. Don't write `payload as User`; that bypasses the uncertainty without runtime proof.

## Common misconception

> “We already use TypeScript, so bad data can't reach the UI.”

False. TypeScript checks source code, not external JSON. Validate at trust boundaries: HTTP request body, API response, webhook, stored untrusted JSON and environment configuration.

## Worked example — An HTTP request boundary

The following is framework-neutral pseudocode for a handler concept—not a complete NestJS controller:

```ts
const parsed = UserSchema.safeParse(requestBody);
if (!parsed.success) {
  return { status: 400, body: { code: 'INVALID_INPUT' } };
}
return { status: 201, body: { name: parsed.data.name } };
```

In production, avoid returning raw internal error details or leaking the original payload; map errors to the intended API error contract.

## Knowledge check

**Why is this unsafe?**

```ts
const user = (await response.json()) as User;
```

A. `fetch` cannot return JSON.  
B. `as User` changes the runtime value.  
C. `as User` only tells TypeScript what to assume; it does not validate.  
D. JSON cannot represent numbers.

**Correct: C.** The others are incorrect: `fetch` can decode JSON; a type assertion does not change a value; JSON supports numbers.

## Guided lab — Build a safe API parser

**Starter:** add a `ProductSchema` with `id` (nonempty string), `price` (nonnegative number), and `tags` (array of strings). Write:

```ts
function parseProduct(input: unknown) {
  return ProductSchema.safeParse(input);
}
```

**Accept:** One valid fixture succeeds; missing `id` fails; negative price fails; an `undefined` tags field fails. Add assertions using Vitest in a later testing track, or log and inspect all four results now.

**Hint ladder:** (1) See `z.object`. (2) Use `.min(1)`, `.nonnegative()`, and `z.array(z.string())`. (3) Define schema first, then infer the `Product` type.

**Model answer:**

```ts
const ProductSchema = z.object({
  id: z.string().min(1),
  price: z.number().nonnegative(),
  tags: z.array(z.string()),
});
```

## Bug Hunt Arena

A teammate writes `z.number()` and expects a form's `<input type="number">` value to pass automatically. The API receives `'12'` as a string.

**Diagnosis:** Browser form values are generally strings. **Fix options:** use `z.coerce.number()` with explicit empty-input handling, or parse the form value before validation. Don't coerce blindly at every API boundary: silent coercion can hide errors.

## Reflect

When would you use `parse()` instead of `safeParse()`? What changes when invalid input should throw versus when it should return a controlled validation result?

## Proof it works

- [ ] Invalid payload produces `success: false`.
- [ ] Valid payload produces typed data.
- [ ] You can explain why `unknown` is preferable to `any` at network boundaries.
- [ ] You completed a nonnegative-price test.

**Reference:** [Zod 4 documentation](https://zod.dev/basics) · [Zod API](https://zod.dev/api). Verify code against the project's pinned version before publishing.
