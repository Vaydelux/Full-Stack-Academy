import { Controller, Get } from '@nestjs/common';
export class Readiness { ready = false; }
@Controller('health')
export class HealthController {
  constructor(private readonly readiness: Readiness) {}
  @Get() status() { return { status: 'up' }; } // BUG: never consult readiness
}
