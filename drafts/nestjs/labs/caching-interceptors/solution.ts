import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
@Injectable()
export class TasksCacheInterceptor implements NestInterceptor {
  private readonly cache = new Map<string, { until: number; value: unknown }>();
  intercept(ctx: ExecutionContext, next: CallHandler) {
    const req = ctx.switchToHttp().getRequest<{ url: string; method: string; user?: { tenantId: string } }>();
    if (req.method !== 'GET' || !req.user) return next.handle();
    const key = req.user.tenantId + ':' + req.url;
    const entry = this.cache.get(key);
    if (entry && entry.until > Date.now()) return of(entry.value);
    if (this.cache.size > 100) this.cache.clear();
    return next.handle().pipe(tap(value => this.cache.set(key, { value, until: Date.now() + 1000 })));
  }
}
