import { Injectable, NestMiddleware } from '@nestjs/common';
@Injectable()
export class CorrelationMiddleware implements NestMiddleware {
  use(req: { correlationId?: string }, _res: unknown, next: () => void) {
    req.correlationId = 'fixed-id';
    // BUG: request never reaches its handler.
  }
}
