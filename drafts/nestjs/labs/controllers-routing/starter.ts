import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
@Controller('tasks')
export class TasksController {
  @Get(':id')
  find(@Param('taskId') id: string) { // BUG: route declares :id, not :taskId
    if (id !== 't1') throw new NotFoundException();
    return { id };
  }
}
