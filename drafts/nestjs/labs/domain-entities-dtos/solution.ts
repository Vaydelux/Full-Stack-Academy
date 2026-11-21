export type Account = { id: string; displayName: string; passwordHash: string; internalRole: string };
export type AccountDto = { id: string; displayName: string };
export function accountDto(entity: Account): AccountDto {
  return { id: entity.id, displayName: entity.displayName };
}
