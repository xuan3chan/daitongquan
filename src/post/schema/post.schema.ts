import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import e from 'express';
import { Document } from 'mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Post extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: string;
  @Prop({ type: mongoose.Schema.Types.String, required: true })
  content: string;
  @Prop({ type: mongoose.Schema.Types.String })
  postImage: string;
  @Prop({ type: mongoose.Schema.Types.Number, default: 0 })
  likes: number;
  @Prop({ type: mongoose.Schema.Types.Number, default: 0 })
  comments: number;
  @Prop({
    type: mongoose.Schema.Types.String,
    default: 'active',
    enum: ['active', 'inactive', 'unApproved', 'blocked', 'deleted'],
  })
  status: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);

