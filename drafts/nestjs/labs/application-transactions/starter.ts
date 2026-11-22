export interface PgClient { query(sql: string, values?: unknown[]): Promise<unknown>; }
export async function transfer(db: PgClient, from: string, to: string) {
  await db.query('UPDATE wallets SET balance=balance-1 WHERE id=$1', [from]);
  await db.query('UPDATE wallets SET balance=balance+1 WHERE id=$1', [to]);
  // BUG: no BEGIN/COMMIT/ROLLBACK; a partial transfer may persist
}
