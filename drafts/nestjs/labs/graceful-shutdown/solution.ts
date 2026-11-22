import { Injectable, OnApplicationShutdown } from '@nestjs/common';
export class Connection { close() {} }
@Injectable()
export class Worker implements OnApplicationShutdown {
  private stopped = false;
  constructor(private readonly connection: Connection) {}
  onApplicationShutdown() {
    if (this.stopped) return;
    this.stopped = true;
    this.connection.close();
  }
}
