import { Controller, Get, Injectable, Module } from '@nestjs/common';
export const PROJECT_STORE = Symbol('PROJECT_STORE');
export interface ProjectStore { list(): { id: string }[]; }
@Injectable()
export class ProjectsService {
  constructor(@InjectProjectStore() private readonly store: ProjectStore) {}
  list() { return this.store.list(); }
}
// Explicit token decorator keeps the module's dependency boundary clear.
import { Inject } from '@nestjs/common';
function InjectProjectStore(): ParameterDecorator { return Inject(PROJECT_STORE); }
@Controller('projects')
export class ProjectsController {
  constructor(private readonly service: ProjectsService) {}
  @Get() list() { return this.service.list(); }
}
@Module({
  providers: [ProjectsService, { provide: PROJECT_STORE, useValue: { list: () => [{ id: 'p1' }] } }],
  controllers: [ProjectsController],
  exports: [ProjectsService]
})
export class ProjectsModule {}
