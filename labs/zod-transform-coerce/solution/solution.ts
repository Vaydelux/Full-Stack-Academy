import * as z from 'zod';
export const Contact=z.strictObject({
 email:z.email().transform(email=>email.toLowerCase()),
 age:z.coerce.number().int().min(18).max(120),
});
