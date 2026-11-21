import { Controller, Get, Injectable, Module } from '@nestjs/common';
@Injectable()
export class TasksService { count() { return 1; } }
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasks: TasksService) {}
  @Get('count') count() { return { count: this.tasks.count() }; }
}
@Module({ controllers: [TasksController], providers: [TasksService] })
export class TasksModule {}
