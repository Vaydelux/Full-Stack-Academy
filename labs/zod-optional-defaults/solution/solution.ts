import * as z from 'zod';
export const Prefs=z.strictObject({
 bio:z.string().nullable().optional(),
 optIn:z.boolean().default(false),
 locale:z.enum(['en','fil']).default('en'),
});
