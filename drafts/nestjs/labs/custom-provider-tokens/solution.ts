import { Inject, Injectable } from '@nestjs/common';
export const STORAGE = Symbol('STORAGE');
export interface StoragePort { read(): string; }
@Injectable()
export class Reader {
  constructor(@Inject(STORAGE) private readonly storage: StoragePort) {}
  read() { return this.storage.read(); }
}
