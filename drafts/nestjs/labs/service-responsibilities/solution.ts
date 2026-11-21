import { BadRequestException, Body, Controller, Injectable, Post } from '@nestjs/common';
@Injectable()
export class TasksService {
  private tasks: string[] = [];
  create(title: string) {
    if (title.trim().length < 3) throw new BadRequestException('Invalid title');
    const value = title.trim(); this.tasks.push(value); return { title: value };
  }
}
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasks: TasksService) {}
  @Post() create(@Body() body: { title: string }) { return this.tasks.create(body.title); }
}
