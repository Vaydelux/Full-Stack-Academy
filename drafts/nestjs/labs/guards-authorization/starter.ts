import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
@Injectable()
export class AccessGuard implements CanActivate {
  canActivate(_context: ExecutionContext) { return true; } // BUG: fail open
}
