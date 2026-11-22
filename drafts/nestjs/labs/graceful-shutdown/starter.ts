import { Injectable } from '@nestjs/common';
export class Connection { close() {} }
@Injectable()
export class Worker {
  constructor(private readonly connection: Connection) {}
  // BUG: no lifecycle contract, connection never closed
}
