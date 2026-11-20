import { Controller, Get, Module } from '@nestjs/common';
@Controller('tasks')
export class TasksController { @Get() list() { return [{ id: 't1' }]; } }
@Module({ controllers: [TasksController] })
export class TasksModule {}
@Module({ imports: [TasksModule] })
export class AppModule {}
