import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
type Cached = { tenantId: string; until: number; value: unknown };
@Injectable()
export class TasksCacheInterceptor implements NestInterceptor {
  private readonly cache = new Map<string, Cached>();
  intercept(ctx: ExecutionContext, next: CallHandler) {
    const req = ctx.switchToHttp().getRequest<{
      url: string; method: string; user?: { tenantId?: string; userId?: string };
    }>();
    const tenantId = req.user?.tenantId;
    if (typeof tenantId !== 'string' || !tenantId.trim()) return next.handle();
    if (req.method !== 'GET') {
      // Mutations invalidate only after a successful next emission, never on errors.
      return next.handle().pipe(tap(() => {
        for (const [key, entry] of this.cache) {
          if (entry.tenantId === tenantId) this.cache.delete(key);
        }
      }));
    }
    const userId = req.user?.userId;
    if (typeof userId !== 'string' || !userId.trim() ||
        typeof req.url !== 'string' || !req.url.startsWith('/')) return next.handle();
    // Include both identities: users within a tenant may have different permissions.
    const key = JSON.stringify([tenantId, userId, req.url]);
    const entry = this.cache.get(key);
    if (entry) {
      if (entry.until > Date.now()) return of(entry.value);
      this.cache.delete(key);
    }
    return next.handle().pipe(tap(value => {
      // Bounded cache: evict the oldest entry before admitting a new one.
      if (!this.cache.has(key) && this.cache.size >= 100) {
        const oldestKey = this.cache.keys().next().value;
        if (oldestKey !== undefined) this.cache.delete(oldestKey);
      }
      this.cache.set(key, { tenantId, value, until: Date.now() + 1000 });
    }));
  }
}
