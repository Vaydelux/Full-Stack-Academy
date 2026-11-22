export interface QueryClient { query(sql: string): Promise<unknown>; }
export class TaskRepository {
  constructor(private readonly db: QueryClient) {}
  findTitle(title: string) {
    return this.db.query("SELECT * FROM tasks WHERE title = '" + title + "'"); // BUG
  }
}
