import { Controller, Get, Injectable, ServiceUnavailableException } from '@nestjs/common';
@Injectable()
export class Dependencies { ready = false; }
@Controller('health')
export class HealthController {
  constructor(private readonly deps: Dependencies) {}
  @Get('live') live() { return { status: 'alive' }; }
  @Get('ready') ready() {
    if (!this.deps.ready) throw new ServiceUnavailableException('Unavailable');
    return { status: 'ready' };
  }
}
