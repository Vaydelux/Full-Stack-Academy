import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';
@WebSocketGateway()
export class TaskGateway implements OnGatewayConnection {
  @WebSocketServer() server!: Server;
  handleConnection(client: Socket) {
    const tenantId: unknown = client.data.tenantId; // assigned by authenticated handshake middleware
    if (typeof tenantId !== 'string' || !tenantId.trim()) {
      client.disconnect(true);
      return;
    }
    void client.join('tenant:' + tenantId);
  }
  @SubscribeMessage('task')
  publish(@ConnectedSocket() client: Socket, @MessageBody() body: unknown) {
    const tenantId: unknown = client.data.tenantId;
    if (typeof tenantId !== 'string' || !tenantId.trim()) return { error: 'UNAUTHORIZED' };
    if (!body || typeof body !== 'object' || Array.isArray(body)) return { error: 'INVALID_TASK' };
    const title: unknown = (body as Record<string, unknown>).title;
    if (typeof title !== 'string') return { error: 'INVALID_TASK' };
    const trimmed = title.trim();
    if (!trimmed || trimmed.length > 100) return { error: 'INVALID_TASK' };
    this.server.to('tenant:' + tenantId).emit('task', { title: trimmed });
    return { accepted: true };
  }
}
