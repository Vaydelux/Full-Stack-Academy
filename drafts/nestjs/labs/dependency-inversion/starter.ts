import { Injectable } from '@nestjs/common';
export class PostgresTaskStore { count() { return 0; } }
@Injectable()
export class TasksService {
  private store = new PostgresTaskStore(); // BUG: hard-coded implementation
  count() { return this.store.count(); }
}
