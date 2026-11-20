export type Account = { id: string; displayName: string; passwordHash: string; internalRole: string };
export function accountDto(entity: Account) {
  return { ...entity }; // BUG: spreads private properties
}
