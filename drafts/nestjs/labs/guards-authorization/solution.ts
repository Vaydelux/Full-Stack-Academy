import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
@Injectable()
export class AccessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<{ headers: { authorization?: string } }>();
    return req.headers.authorization === 'Bearer teaching-only';
  }
}
