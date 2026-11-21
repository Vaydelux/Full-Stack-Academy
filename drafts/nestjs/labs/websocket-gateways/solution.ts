import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';
@WebSocketGateway()
export class TaskGateway implements OnGatewayConnection {
  @WebSocketServer() server!: Server;
  handleConnection(client: Socket) {
    const tenantId = client.data.tenantId as string | undefined; // set by verified handshake middleware
    if (!tenantId) { client.disconnect(true); return; }
    void client.join('tenant:' + tenantId);
  }
  @SubscribeMessage('task')
  publish(@ConnectedSocket() client: Socket, @MessageBody() body: { title: string }) {
    const tenantId = client.data.tenantId as string | undefined;
    if (!tenantId) return { error: 'UNAUTHORIZED' };
    const title = body.title?.trim();
    if (!title || title.length > 100) return { error: 'INVALID_TASK' };
    this.server.to('tenant:' + tenantId).emit('task', { title });
    return { accepted: true };
  }
}
