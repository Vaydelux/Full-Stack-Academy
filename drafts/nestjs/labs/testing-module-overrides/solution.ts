import { Test } from '@nestjs/testing';
import { Injectable } from '@nestjs/common';
@Injectable()
export class Mailer { async send(_to: string) {} }
@Injectable()
export class Notifications {
  constructor(private readonly mailer: Mailer) {}
  async notify(to: string) { await this.mailer.send(to); }
}
export async function buildTestModule(fake: { send(to: string): Promise<void> }) {
  return Test.createTestingModule({ providers: [Notifications, Mailer] })
    .overrideProvider(Mailer).useValue(fake).compile();
}
