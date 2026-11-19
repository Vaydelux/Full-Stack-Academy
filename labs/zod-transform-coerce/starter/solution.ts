import * as z from 'zod';
export const Contact=z.strictObject({email:z.email(),age:z.number()});
