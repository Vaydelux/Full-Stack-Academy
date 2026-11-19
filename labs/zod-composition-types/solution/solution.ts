import * as z from 'zod';
const Identity=z.strictObject({id:z.string().min(1),name:z.string().trim().min(2)});
export const User=Identity.safeExtend({role:z.enum(['reader','editor'])});
export type UserData=z.infer<typeof User>;
