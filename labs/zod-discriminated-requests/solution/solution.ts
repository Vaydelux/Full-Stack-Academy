import * as z from 'zod';
export const Delivery=z.discriminatedUnion('channel',[
 z.strictObject({channel:z.literal('email'),address:z.email()}),
 z.strictObject({channel:z.literal('sms'),phone:z.string().regex(/^\+[1-9]\d{7,14}$/)}),
]);
