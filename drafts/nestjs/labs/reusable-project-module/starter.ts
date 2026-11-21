import { Controller, Get, Module } from '@nestjs/common';
export class ProjectsService { list() { return [{ id: 'p1' }]; } }
@Controller('projects')
export class ProjectsController {
  private service = new ProjectsService(); // BUG: bypasses DI
  @Get() list() { return this.service.list(); }
}
@Module({ controllers: [ProjectsController] })
export class ProjectsModule {}
