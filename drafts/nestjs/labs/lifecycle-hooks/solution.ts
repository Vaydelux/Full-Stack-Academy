import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
@Injectable()
export class Poller implements OnModuleInit, OnModuleDestroy {
  private timer?: ReturnType<typeof setInterval>;
  onModuleInit() { this.timer = setInterval(() => {}, 1000); }
  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer);
    this.timer = undefined;
  }
}
