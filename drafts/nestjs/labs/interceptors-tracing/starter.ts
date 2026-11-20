import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { of } from 'rxjs';
@Injectable()
export class TraceInterceptor implements NestInterceptor {
  intercept(_ctx: ExecutionContext, _next: CallHandler) {
    return of({ ok: true }); // BUG: next.handle() never invoked
  }
}
