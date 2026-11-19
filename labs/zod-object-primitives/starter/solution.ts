import * as z from 'zod';
export const AccountSchema=z.object({displayName:z.string(),role:z.string(),active:z.boolean()});
