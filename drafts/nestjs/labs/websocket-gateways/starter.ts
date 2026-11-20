import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import type { Server } from 'socket.io';
@WebSocketGateway()
export class TaskGateway {
  @WebSocketServer() server!: Server;
  @SubscribeMessage('task')
  publish(body: { tenantId: string; title: string }) {
    this.server.emit('task', body); // BUG: all tenants receive it
  }
}
