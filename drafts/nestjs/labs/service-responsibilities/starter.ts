import { Body, Controller, Post } from '@nestjs/common';
@Controller('tasks')
export class TasksController {
  private tasks: string[] = [];
  @Post() create(@Body() body: { title: string }) {
    this.tasks.push(body.title); // BUG: no invariant and business logic in transport
    return { title: body.title };
  }
}
