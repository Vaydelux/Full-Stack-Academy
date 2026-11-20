import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { of } from 'rxjs';
@Injectable()
export class TasksCacheInterceptor implements NestInterceptor {
  private readonly cache = new Map<string, unknown>();
  intercept(ctx: ExecutionContext, next: CallHandler) {
    const req = ctx.switchToHttp().getRequest<{ url: string }>();
    const cached = this.cache.get(req.url);
    return cached === undefined ? next.handle() : of(cached); // BUG: path-only key
  }
}
