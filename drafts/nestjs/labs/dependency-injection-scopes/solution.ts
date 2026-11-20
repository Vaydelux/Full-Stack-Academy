import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
@Injectable({ scope: Scope.REQUEST })
export class RequestIdentity {
  constructor(@Inject(REQUEST) private readonly request: { headers: Record<string, string | undefined> }) {}
  current() { return this.request.headers['x-request-id'] ?? 'missing'; }
}
