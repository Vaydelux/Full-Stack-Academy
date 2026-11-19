import * as z from 'zod';
export const Delivery=z.union([
 z.object({channel:z.string(),address:z.string()}),
 z.object({channel:z.string(),phone:z.string()}),
]);
