import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './schema/message.schema';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { EncryptionModule } from 'src/encryption/encryption.module';
import { RedisCacheModule } from 'src/redis/redis.module';

@Module({
  imports:[
    EncryptionModule,
    CloudinaryModule,
    RedisCacheModule,
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
  ],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
