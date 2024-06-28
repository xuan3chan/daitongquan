import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from './auth/auth.service';
import { ScheduleService } from './schedule/schedule.service';

@WebSocketGateway({ cors: true })
export class EventGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private clients: Map<string, { socket: Socket; lastSchedules: any }> = new Map();

  constructor(
    private readonly authService: AuthService,
    private readonly scheduleService: ScheduleService,
  ) {
    // Khởi động kiểm tra điều kiện
    this.startConditionCheck();
  }

  handleDisconnect(socket: Socket) {
    console.log(
      'Socket disconnected',
      'Socket ID:',
      socket.id,
      'User ID:',
      socket.data?._id,
    );
    this.clients.delete(socket.id);
  }

  async handleConnection(socket: Socket): Promise<void> {
    const authHeader = socket.handshake.headers.authorization;
    if (authHeader && typeof authHeader === 'string') {
      const token = authHeader.split(' ')[1];
      if (token) {
        try {
          const userId = await this.authService.handleVerifyTokenService(token);
          if (userId) {
            socket.data = { _id: userId };
            console.log(
              'Socket connected',
              'Socket ID:',
              socket.id,
              'User ID:',
              userId,
            );
            socket.join(userId);
            this.clients.set(socket.id, { socket, lastSchedules: null });
          } else {
            console.log('Authentication failed - disconnecting socket');
            socket.disconnect();
          }
        } catch (err) {
          console.error('Error during connection handling:', err);
          socket.disconnect();
        }
      } else {
        console.log('No token provided - disconnecting socket');
        socket.disconnect();
      }
    } else {
      console.log('No authorization header - disconnecting socket');
      socket.disconnect();
    }
  }

  afterInit(server: Server) {
    console.log('Socket server initialized');
  }

  // Hàm khởi động kiểm tra điều kiện
  startConditionCheck() {
    setInterval(async () => {
      try {
        await this.checkConditionAndNotifyClients();
      } catch (error) {
        console.error('Error checking condition:', error);
      }
    }, 5000); // Kiểm tra mỗi 5 giây
  }
  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: any,
  ): void {
    console.log('Message received:', data);
    const userId = socket.data?._id;
    if (userId) {
      this.server.to(userId).emit('message', 'Hello from the server!');
    } else {
      console.error('User ID is undefined');
    }
  }
  // Hàm kiểm tra điều kiện và thông báo cho các client nếu có thay đổi
  async checkConditionAndNotifyClients() {
    for (const [socketId, client] of this.clients.entries()) {
      const userId = client.socket.data?._id;
      if (userId) {
        try {
          const schedules = await this.scheduleService.notifyScheduleService(userId);
          if (JSON.stringify(schedules) !== JSON.stringify(client.lastSchedules)) {
            console.log('Schedules updated for user:', userId);
            this.server.to(userId).emit('schedules', schedules);
            client.lastSchedules = schedules; // Cập nhật trạng thái schedules
          } else {
            console.log('Schedules not changed for user', userId);
          }
        } catch (error) {
          console.error('Error getting schedules for user', userId, ':', error);
        }
      } else {
        console.error('User ID is undefined for socket ID:', socketId);
      }
    }
  }
}
