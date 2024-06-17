import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface CustomSocket extends Socket {
    user: { _id: string };
}

@WebSocketGateway({
    namespace: '/schedule',
})
export class ScheduleGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    afterInit(server: any) {
        console.log('WebSocket server initialized');
    }

    handleConnection(client: CustomSocket): void {
        console.log('Client đã kết nối:', client.id);
    }

    handleDisconnect(client: CustomSocket): void {
        console.log('Client đã ngắt kết nối:', client.id);
    }

    @SubscribeMessage('message')
    handleMessage(@MessageBody() message: string, @ConnectedSocket() client: CustomSocket): void {
        console.log(`Nhận tin nhắn từ user ${client.id}:`, message);
        this.server.emit('message', message); // Phát tin nhắn tới tất cả các client
    }

    notifyClient(userId: string, schedules: any[]): void {
        this.server.emit(`notify-${userId}`, schedules); // Phát thông báo đến các client có liên quan
    }
}