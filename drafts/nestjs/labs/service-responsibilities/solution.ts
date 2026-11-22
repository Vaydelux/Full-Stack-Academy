import { BadRequestException, Body, Controller, Injectable, Post } from '@nestjs/common';
@Injectable()
export class TasksService {
  private tasks: string[] = [];
  create(title: unknown) {
    if (typeof title !== 'string') throw new BadRequestException('Invalid title');
    const value = title.trim();
    if (value.length < 3 || value.length > 100) throw new BadRequestException('Invalid title');
    this.tasks.push(value);
    return { title: value };
  }
}
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasks: TasksService) {}
  @Post() create(@Body() body: unknown) {
    const title = body && typeof body === 'object' && !Array.isArray(body)
      ? (body as Record<string, unknown>).title : undefined;
    return this.tasks.create(title);
  }
}
