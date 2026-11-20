import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
@Injectable()
export class ProtectedRouteGuard implements CanActivate {
  canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest<{ user?: { permissions: string[] } }>();
    return req.user?.permissions.includes('tasks:read') === true;
  }
}
