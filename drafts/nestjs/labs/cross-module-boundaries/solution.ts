import { Injectable, Module } from '@nestjs/common';
@Injectable()
export class TasksService { count() { return 1; } }
@Module({ providers: [TasksService], exports: [TasksService] })
export class TasksModule {}
@Injectable()
export class ReportsService {
  constructor(private readonly tasks: TasksService) {}
  count() { return this.tasks.count(); }
}
@Module({ imports: [TasksModule], providers: [ReportsService] })
export class ReportsModule {}
