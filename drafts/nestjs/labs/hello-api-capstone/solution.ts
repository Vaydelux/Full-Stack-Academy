import { Controller, Get, Injectable, Module, ServiceUnavailableException } from '@nestjs/common';
@Injectable()
export class Readiness { ready = false; }
@Controller('health')
export class HealthController {
  constructor(private readonly readiness: Readiness) {}
  @Get() status() {
    if (!this.readiness.ready) throw new ServiceUnavailableException('Not ready');
    return { status: 'up' };
  }
}
@Module({ providers: [Readiness], controllers: [HealthController] })
export class HealthModule {}
