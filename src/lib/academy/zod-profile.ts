import * as z from 'zod';

// Shared by the browser-only practice and offline lab. No network calls.
export const ProfileSchema=z.strictObject({
 displayName:z.string().trim().min(2).max(80),
 email:z.email().transform(value=>value.toLowerCase()),
 age:z.coerce.number().int().min(18).max(120),
 contact:z.enum(['email','none']).default('email'),
 agreed:z.literal(true),
});
export type ProfileInput=z.input<typeof ProfileSchema>;
export type ProfileOutput=z.output<typeof ProfileSchema>;
export function validateProfile(input:unknown){return ProfileSchema.safeParse(input);}
