import { Injectable } from '@nestjs/common';
export class LiveStorage { read() { return 'production'; } }
@Injectable()
export class Reader {
  private storage = new LiveStorage(); // BUG: cannot override in tests
  read() { return this.storage.read(); }
}
