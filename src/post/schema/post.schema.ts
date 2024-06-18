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
    default: 'inactive',
    enum: ['active', 'inactive', 'blocked'],
  })
  status: string;
@Prop({ type: mongoose.Schema.Types.Boolean, default: false })
  isApproved: boolean;
}
export const PostSchema = SchemaFactory.createForClass(Post);
PostSchema.index({ content: 'text' });

