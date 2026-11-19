import * as z from 'zod';
export const Prefs=z.strictObject({bio:z.string().optional(),optIn:z.boolean().optional(),locale:z.string().optional()});
