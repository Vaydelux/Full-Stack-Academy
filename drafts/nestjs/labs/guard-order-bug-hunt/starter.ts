import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
@Injectable()
export class ProtectedRouteGuard implements CanActivate {
  canActivate(_ctx: ExecutionContext) {
    return true; // BUG: permissive guard exposes protected handler
  }
}
