import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import mongoose from 'mongoose';

export type MessageDocument = Message & Document;

@Schema()
export class Message extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  senderId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  receiverId: string;

  @Prop({ type: mongoose.Schema.Types.String,  })
  content: string;

  @Prop({ type: mongoose.Schema.Types.String,  })
  image:string

  @Prop({ type: mongoose.Schema.Types.Date, required: true,default: Date.now})
  createdAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);