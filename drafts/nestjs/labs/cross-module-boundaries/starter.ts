import { Injectable, Module } from '@nestjs/common';
@Injectable()
export class TasksService { count() { return 1; } }
@Module({ providers: [TasksService] }) // BUG: missing exports
export class TasksModule {}
@Injectable()
export class ReportsService { constructor(private readonly tasks: TasksService) {} }
@Module({ imports: [TasksModule], providers: [ReportsService] })
export class ReportsModule {}
