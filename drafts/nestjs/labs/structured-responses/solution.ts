export interface Account { id: string; displayName: string; passwordHash: string; }
export interface PublicAccount { id: string; displayName: string; }
export function accountResponse(account: Account): PublicAccount {
  return { id: account.id, displayName: account.displayName };
}
