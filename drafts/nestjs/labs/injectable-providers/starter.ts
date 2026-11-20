import { Controller, Get, Module } from '@nestjs/common';
export class TasksService { count() { return 1; } }
@Controller('tasks')
export class TasksController {
  private readonly tasks = new TasksService(); // BUG: skips container
  @Get('count') count() { return { count: this.tasks.count() }; }
}
@Module({ controllers: [TasksController] })
export class TasksModule {}
