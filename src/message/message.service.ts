import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './schema/message.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { EncryptionService } from 'src/encryption/encryption.service';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) 
    private messageModel: Model<MessageDocument>,
    private cloudinaryService: CloudinaryService,
    private encryptionService: EncryptionService,
    private redisService: RedisService,
  ) {}

  private async deleteCache(key: string) {
    await this.redisService.delJSON(key, '$');
  }

  private async setCache(key: string, data: any) {
    await this.redisService.setJSON(key, '$', JSON.stringify(data));
  }

  async saveMessage(senderId: string, receiverId: string, content?: string, file?: Express.Multer.File): Promise<Message> {
    try {
      // Log the message save operation for debugging purposes
      console.log(`Saving message from ${senderId} to ${receiverId}`);
      let image: string | undefined;
      if (file) {
        const imageFile = await this.cloudinaryService.uploadImageService(senderId.toString(), file);
        image = this.encryptionService.rsaEncrypt(imageFile.uploadResult.url);
      }

      if (!content && !image) {
        throw new BadRequestException('Message content or image must be provided.');
      }
      const messageData: any = { senderId, receiverId };
      if (content) messageData.content = this.encryptionService.rsaEncrypt(content);
      if (image) messageData.image = image;

      const message = new this.messageModel(messageData);
      const savedMessage = await message.save(); // Save the message and wait for the result

      await this.deleteCache(`messages:${senderId}`);
      await this.deleteCache(`messages:${receiverId}`);

      return savedMessage;
    } catch (error) {
      // Log the error for debugging purposes
      console.error("Error saving message:", error);
      throw new BadRequestException(error.message);
    }
  }
  async getMessagesForUser(userId: string): Promise<any> {
    try {
      const cacheKey = `messages:${userId}`;
      const cachedMessages = await this.redisService.getJSON(cacheKey, '$');
      if (cachedMessages) {
        console.log('Messages fetched from cache successfully.');
        return JSON.parse(cachedMessages as string);
      }
  
      const messages = await this.messageModel
        .find({ $or: [{ senderId: userId }, { receiverId: userId }] })
        .populate('senderId', 'avatar firstname lastname') // Populate sender details
        .populate('receiverId', 'avatar firstname lastname'); // Populate receiver details
  
      const decryptedMessages = messages.map(message => {
        if (message.content) message.content = this.encryptionService.rsaDecrypt(message.content);
        if (message.image) message.image = this.encryptionService.rsaDecrypt(message.image);
        return message;
      });
  
      // Group messages by receiverId
      const groupedMessages = decryptedMessages.reduce((acc, message) => {
        const receiverId = message.receiverId.toString();
        if (!acc[receiverId]) {
          acc[receiverId] = {
            receiver: message.receiverId,
            messages: [],
          };
        }
        acc[receiverId].messages.push(message);
        return acc;
      }, {});
  
      await this.setCache(cacheKey, groupedMessages);
      return groupedMessages;
    } catch (error) {
      console.error("Error getting messages:", error);
      throw new BadRequestException(error.message);
    }
  }
  


  async deleteMessage(messageId: string, userId: string): Promise<Message> {
    try {
      const message = await this.messageModel.findOneAndDelete({ _id: messageId, $or: [{ senderId: userId }, { receiverId: userId }] });
      if (message.image) await this.cloudinaryService.deleteMediaService(message.image);

      await this.deleteCache(`messages:${message.senderId}`);
      await this.deleteCache(`messages:${message.receiverId}`);

      return message;
    } catch (error) {
      console.error("Error deleting message:", error);
      throw new BadRequestException(error.message);
    }
  }
}
