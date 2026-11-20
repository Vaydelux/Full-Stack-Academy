export interface Account { id: string; displayName: string; passwordHash: string; }
export function accountResponse(account: Account) {
  return account; // BUG: leaks passwordHash
}
