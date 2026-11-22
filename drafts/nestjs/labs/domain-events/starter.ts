import { EventEmitter } from 'node:events';
export interface Writer { save(title: string): Promise<void>; }
export class TaskCommands {
  constructor(private readonly writer: Writer, private readonly events: EventEmitter) {}
  async create(title: string) {
    this.events.emit('task.created', { title }); // BUG: event before success
    await this.writer.save(title);
  }
}
