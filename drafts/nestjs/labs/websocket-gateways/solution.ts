import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';
@WebSocketGateway()
export class TaskGateway {
  @WebSocketServer() server!: Server;
  @SubscribeMessage('task')
  publish(@ConnectedSocket() client: Socket, @MessageBody() body: { title: string }) {
    const tenantId = client.data.tenantId as string | undefined; // set by verified handshake
    if (!tenantId) return { error: 'UNAUTHORIZED' };
    this.server.to('tenant:' + tenantId).emit('task', { title: body.title });
    return { accepted: true };
  }
}
