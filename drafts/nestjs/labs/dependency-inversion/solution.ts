import { Inject, Injectable } from '@nestjs/common';
export const TASK_STORE = Symbol('TASK_STORE');
export interface TaskStore { count(): number; }
@Injectable()
export class TasksService {
  constructor(@Inject(TASK_STORE) private readonly store: TaskStore) {}
  count() { return this.store.count(); }
}
