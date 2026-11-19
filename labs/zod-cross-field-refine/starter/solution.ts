import * as z from 'zod';
export const Passwords=z.strictObject({password:z.string().min(8),confirmPassword:z.string().min(8)});
