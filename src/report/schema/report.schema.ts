import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Report extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ type: mongoose.Schema.Types.String, required: true })
  reportType: string;

  @Prop({ type: mongoose.Schema.Types.String, required: true })
  reportContent: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true })
  postId: string;

  @Prop({type: mongoose.Schema.Types.String, default: 'pending', enum: ['pending', 'Processed', 'rejected']})
  status: string;
}
export const ReportSchema = SchemaFactory.createForClass(Report);


