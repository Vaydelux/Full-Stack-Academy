import { Controller, Get, Module } from '@nestjs/common';
@Controller('tasks')
export class TasksController { @Get() list() { return [{ id: 't1' }]; } }
// BUG: this feature module is never imported by the root.
@Module({ controllers: [TasksController] })
export class TasksModule {}
@Module({})
export class AppModule {}
