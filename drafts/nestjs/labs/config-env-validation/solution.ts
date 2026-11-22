import { z } from 'zod';
const PortSchema = z.coerce.number().int().min(1024).max(65535);
export function parsePort(raw: string | undefined): number {
  return PortSchema.parse(raw ?? '3337');
}
export const apiPort = parsePort(process.env.PORT);
