export interface PgResult { rowCount: number | null; }
export interface PgClient {
  // Must be a single checked-out PostgreSQL client for the entire transaction.
  query(sql: string, values?: readonly unknown[]): Promise<PgResult>;
}
export async function transfer(db: PgClient, from: string, to: string) {
  if (!from || !to || from === to) throw new Error('Distinct wallet IDs are required');
  await db.query('BEGIN');
  try {
    const debited = await db.query(
      'UPDATE wallets SET balance=balance-1 WHERE id=$1 AND balance>=1 RETURNING id', [from],
    );
    if (debited.rowCount !== 1) throw new Error('Source wallet missing or insufficient balance');
    const credited = await db.query(
      'UPDATE wallets SET balance=balance+1 WHERE id=$1 RETURNING id', [to],
    );
    if (credited.rowCount !== 1) throw new Error('Destination wallet missing');
    await db.query('COMMIT');
  } catch (error) {
    try {
      await db.query('ROLLBACK');
    } catch (rollbackError) {
      throw new AggregateError([error, rollbackError], 'Transfer failed and rollback also failed');
    }
    throw error;
  }
}
