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
import { StoryService } from './story/story.service';
import { MessageService } from './message/message.service';
import { BadRequestException } from '@nestjs/common';
import { Readable } from 'stream';
import { UsersService } from './users/users.service';
import { EncryptionService } from './encryption/encryption.service';

@WebSocketGateway({ cors: true })
export class EventGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private clients: Map<string, { socket: Socket; lastSchedules: any }> =
    new Map();

  constructor(
    private readonly authService: AuthService,
    private readonly scheduleService: ScheduleService,
    private readonly storyService: StoryService,
    private readonly messageService: MessageService,
    private readonly usersService: UsersService,
    private readonly encryptionService: EncryptionService,
  ) {
    this.startConditionCheck();
    this.startConditionStoryCheck();
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

  startConditionCheck() {
    setInterval(async () => {
      try {
        await this.checkConditionAndNotifyClients();
      } catch (error) {
        console.error('Error checking condition:', error);
      }
    }, 5000);
  }

  startConditionStoryCheck() {
    setInterval(async () => {
      try {
        await this.storyService.checkExpiredStoryService();
      } catch (error) {
        console.error('Error checking condition:', error);
      }
    }, 3600000);
  }

  @SubscribeMessage('chat')
  async handleChat(
    @ConnectedSocket() socket: Socket,
    @MessageBody()
    data: {
      receiverId: string;
      content: string;
      file?: string;
      fileName?: string;
      fileType?: string;
    },
  ): Promise<void> {
    const senderId = socket.data?._id;
    if (!senderId) {
      console.error('User ID is undefined');
      throw new BadRequestException('User ID is undefined.');
    }

    try {
      let file: Express.Multer.File | undefined = undefined;
      if (data.file && data.fileName && data.fileType) {
        file = await this.processFile({
          file: data.file,
          fileName: data.fileName,
          fileType: data.fileType,
        });
      }

      const message = await this.messageService.saveMessage(
        senderId,
        data.receiverId,
        data.content,
        file,
      );
      const [detailsSender, detailsReceiver] = await Promise.all([
        this.usersService.findOneUserForMessageService(senderId),
        this.usersService.findOneUserForMessageService(data.receiverId),
      ]);

      const messageToSend = {
        _id: message._id,
        senderId: senderId,
        receiverId: message.receiverId,
        senderDetails: detailsSender,
        receiverDetails: detailsReceiver,
        content: message.content
          ? this.encryptionService.rsaDecrypt(message.content)
          : null,
        image: message.image
          ? this.encryptionService.rsaDecrypt(message.image)
          : null,
        createdAt: message.createdAt,
      };

      this.server.to(data.receiverId).emit('chat', messageToSend);
      this.server.to(senderId).emit('chat', messageToSend);
    } catch (error) {
      console.error('Error saving message:', error);
      throw new BadRequestException('Failed to save message.');
    }
  }

  private async processFile(data: {
    file: string;
    fileName: string;
    fileType: string;
  }): Promise<Express.Multer.File> {
    const base64Data = data.file.split(',')[1];
    const fileBuffer = Buffer.from(base64Data, 'base64');

    const readableInstanceStream = new Readable();
    readableInstanceStream.push(fileBuffer);
    readableInstanceStream.push(null); // No more data

    return {
      buffer: fileBuffer,
      originalname: data.fileName,
      mimetype: data.fileType,
      fieldname: '',
      encoding: '',
      size: fileBuffer.length,
      stream: readableInstanceStream,
      destination: '',
      filename: '',
      path: '',
    };
  }

  async checkConditionAndNotifyClients() {
    for (const [socketId, client] of this.clients.entries()) {
      const userId = client.socket.data?._id;
      if (userId) {
        try {
          const schedules =
            await this.scheduleService.notifyScheduleService(userId);
          if (
            JSON.stringify(schedules) !== JSON.stringify(client.lastSchedules)
          ) {
            console.log('Schedules updated for user:', userId);
            this.server.to(userId).emit('schedules', schedules);
            client.lastSchedules = schedules;
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
