import { Injectable } from '@nestjs/common';
@Injectable() // BUG: singleton used for request-private context
export class RequestIdentity {
  private lastId = '';
  set(id: string) { this.lastId = id; }
  current() { return this.lastId; }
}
