import * as z from 'zod';
export const User=z.object({id:z.string(),name:z.string(),role:z.string()});
export type UserData=z.infer<typeof User>;
