import { Test } from '@nestjs/testing';
import { Injectable } from '@nestjs/common';
@Injectable()
export class Mailer { async send(_to: string) { /* external side effect */ } }
@Injectable()
export class Notifications { constructor(private readonly mailer: Mailer) {} }
export async function buildTestModule() {
  return Test.createTestingModule({ providers: [Notifications, Mailer] }).compile();
  // BUG: live Mailer is active
}
