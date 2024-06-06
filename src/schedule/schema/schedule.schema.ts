import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document,HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';

@Schema()
export class Schedule extends Document {
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true,})
    userId: string;
    @Prop({ type: mongoose.Schema.Types.String, required: true })
    title: string;
    @Prop({ type: mongoose.Schema.Types.String, required: true })
    location: string;
    @Prop({ type: mongoose.Schema.Types.Boolean, required: true })
    isAllDay: boolean;
    @Prop({ type: mongoose.Schema.Types.Date, required: true })
    startDateTime: Date;
    @Prop({ type: mongoose.Schema.Types.Date, required: true })
    endDateTime: Date;
    @Prop({ type: mongoose.Schema.Types.String, required: true })
    note: string;
    @Prop({ type: mongoose.Schema.Types.Boolean, required: true })
    isLoop: boolean;
}
export type ScheduleDocument = HydratedDocument<Schedule>;
export const ScheduleSchema = SchemaFactory.createForClass(Schedule);