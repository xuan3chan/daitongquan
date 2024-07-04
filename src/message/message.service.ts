import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './schema/message.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { EncryptionService } from 'src/encryption/encryption.service';


@Injectable()
export class MessageService {
    constructor(
        @InjectModel(Message.name) 
        private messageModel: Model<MessageDocument>,
        private cloudinaryService: CloudinaryService,
        private encryptionService: EncryptionService,
    ) {}

    async saveMessage(senderId: string, receiverId: string, content?: string, file?: Express.Multer.File): Promise<Message> {
      try {
        // Log the message save operation for debugging purposes
        console.log(`Saving message from ${senderId} to ${receiverId}`);
        let image: string | undefined;
        if (file) {
          const imageFile = await this.cloudinaryService.uploadImageService(file);
          image = this.encryptionService.rsaEncrypt(imageFile.url);
          
        }

        if (!content && !image) {
          throw new BadRequestException('Message content or image must be provided.');
        }
        const messageData: any = { senderId, receiverId };
        if (content) messageData.content = this.encryptionService.rsaEncrypt(content);
        if (image) messageData.image = image;
    
        const message = new this.messageModel(messageData);
        return message.save(); // Save the message without unnecessary await
      } catch (error) {
        // Log the error for debugging purposes
        console.error("Error saving message:", error);
        throw new BadRequestException(error.message);
      }
    }

      async getMessagesForUser(userId: string): Promise<Message[]> {
        try {
          const messages = await this.messageModel.find({ $or: [{ senderId: userId }, { receiverId: userId }] });
          return messages.map(message => {
            if (message.content) message.content = this.encryptionService.rsaDecrypt(message.content);
            if (message.image) message.image = this.encryptionService.rsaDecrypt(message.image);
            return message;
          });
        } catch (error) {
          console.error("Error getting messages:", error);
          throw new BadRequestException(error.message);
        }
       
      }

      async deleteMessage(messageId: string, userId: string): Promise<Message> {
        try {
        const message = await this.messageModel.findOneAndDelete({ _id: messageId, $or: [{ senderId: userId }, { receiverId: userId }] });
        if (message.image) await this.cloudinaryService.deleteImageService(message.image);       
        return message;
        }catch (error) {
          console.error("Error deleting message:", error);
          throw new BadRequestException(error.message);
        }
      }

}
