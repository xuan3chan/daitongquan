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
  commentCount: number;
  @Prop({ type: mongoose.Schema.Types.Number, default: 0 })
  reactionCount: number;
  @Prop({type:[
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      reaction: { type: mongoose.Schema.Types.String, required: true, enum: ['like', 'dislike'] },
    }
  ],
  })
  userReaction: {
    reaction: string;
    userId: string;
  }
  @Prop({
    type: mongoose.Schema.Types.String,
    default: 'inactive',
    enum: ['active', 'inactive', 'blocked'],
  })
  status: string;

  @Prop({ type: mongoose.Schema.Types.Boolean, default: true })
  isShow: boolean;
@Prop({ type: mongoose.Schema.Types.Boolean, default: false })
  isApproved: boolean;
}
export const PostSchema = SchemaFactory.createForClass(Post);
PostSchema.index({ content: 'text' });

