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

  constructor(
    private readonly authService: AuthService,
    private readonly scheduleService: ScheduleService,
  ) {}

  handleDisconnect(socket: Socket) {
    console.log(
      'Socket disconnected',
      'Socket ID:',
      socket.id,
      'User ID:',
      socket.data?._id,
    );
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
  @SubscribeMessage('getSchedule')
  async getSchedule(@ConnectedSocket() socket: Socket): Promise<void> {
    const userId = socket.data?._id;
    if (userId) {
      try {
        const schedules =
          await this.scheduleService.notifyScheduleService(userId);
        console.log('Schedules:', schedules);
        this.server.to(userId).emit('schedules', schedules);
      } catch (error) {
        console.error('Error getting schedules:', error);
      }
    } else {
      console.error('User ID is undefined');
    }
  }

  afterInit(server: Server) {
    console.log('Socket server initialized');
  }
}
