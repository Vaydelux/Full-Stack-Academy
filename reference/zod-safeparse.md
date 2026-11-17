# Reference — Zod 4 `schema.safeParse()`

**Category:** Runtime validation · **Status:** authored reference draft · **Major version:** Zod 4 · **Canonical:** https://zod.dev/basics

## At a glance

Validate an unknown value without throwing on ordinary validation failure. The return value describes either validated typed data or a Zod error.

## Syntax

```ts
const result = schema.safeParse(input);
```

**Parameters:** `input: unknown` — any value to validate against `schema`.

**Returns:** discriminated result with `success: true` and `data`, or `success: false` and `error`.

## Minimal example

```ts
import * as z from 'zod';
const AgeSchema = z.number().int().nonnegative();
const result = AgeSchema.safeParse('25');
console.log(result.success); // false — input is a string
```

## Production-style example

```ts
const BodySchema = z.object({
  name: z.string().min(1),
  email: z.email(),
});

const result = BodySchema.safeParse(body);
if (!result.success) {
  return { ok: false as const, errors: z.flattenError(result.error) };
}
return { ok: true as const, value: result.data };
```

This demonstrates validation; a real API should map issues into a stable error contract and avoid exposing sensitive values.

## Common mistakes

- Using `as SomeType` as a substitute for runtime validation.
- Assuming HTML number inputs produce numbers rather than strings.
- Assuming `safeParse` throws on normal schema failure—it returns a failure result.
- Repeating separately defined TS types that drift from the schema.

**Related:** `z.object`, `z.infer`, `z.coerce.number`, `z.refine`, lesson 09.01.02. Verify commands against a pinned package version before release.
