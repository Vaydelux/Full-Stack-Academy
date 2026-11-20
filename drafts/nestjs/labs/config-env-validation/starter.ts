export function parsePort(raw: string | undefined): number {
  return Number(raw ?? '3337'); // BUG: NaN, fractional and unsafe values pass through
}
export const apiPort = parsePort(process.env.PORT);
