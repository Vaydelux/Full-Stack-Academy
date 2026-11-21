import { Injectable, OnModuleInit } from '@nestjs/common';
@Injectable()
export class Poller implements OnModuleInit {
  private timer?: ReturnType<typeof setInterval>;
  onModuleInit() { this.timer = setInterval(() => {}, 1000); }
  // BUG: timer is never released.
}
