import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class Schedule {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.String, required: true })
  title: string;

  @Prop({ type: mongoose.Schema.Types.String, required: false })
  location: string;

  @Prop({ type: mongoose.Schema.Types.Boolean, required: false, default: false })
  isAllDay: boolean;

  @Prop({
    type: mongoose.Schema.Types.Date,
    required: true,
    default: () => new Date()
  })
  startDateTime: Date;

  @Prop({
    type: mongoose.Schema.Types.Date,
    required: true,
    default: () => new Date()
  })
  endDateTime: Date;

  @Prop({ type: mongoose.Schema.Types.String, required: false })
  note: string;

  @Prop({ type: mongoose.Schema.Types.Boolean, required: false, default: false })
  isLoop: boolean;
  
  @Prop({ type: mongoose.Schema.Types.Boolean, required: false })
  isEncrypted: boolean;
}

export type ScheduleDocument = HydratedDocument<Schedule>;
export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
