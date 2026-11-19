import * as z from 'zod';
export const AccountSchema=z.strictObject({
 displayName:z.string().trim().min(2).max(80),
 role:z.enum(['reader','editor']),
 active:z.boolean(),
});
