import { randomUUID } from 'node:crypto';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map } from 'rxjs/operators';
@Injectable()
export class TraceInterceptor implements NestInterceptor {
  intercept(_ctx: ExecutionContext, next: CallHandler) {
    const traceId = randomUUID();
    return next.handle().pipe(map(data => ({ data, traceId })));
  }
}
