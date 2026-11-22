import { EventEmitter } from 'node:events';
export interface Writer { save(title: string): Promise<void>; }
export class TaskCommands {
  constructor(private readonly writer: Writer, private readonly events: EventEmitter) {}
  async create(title: string) {
    await this.writer.save(title);
    this.events.emit('task.created', { title });
  }
}
