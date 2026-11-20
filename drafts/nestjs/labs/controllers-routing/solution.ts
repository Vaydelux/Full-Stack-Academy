import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
@Controller('tasks')
export class TasksController {
  @Get(':id')
  find(@Param('id') id: string) {
    if (id !== 't1') throw new NotFoundException();
    return { id };
  }
}
