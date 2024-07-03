import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document,HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';

@Schema({timestamps: true})
export class Story extends Document {

    @Prop({ type: mongoose.Schema.Types.String, required: true })
    title: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'})
    userId:string

    @Prop({ type: mongoose.Schema.Types.String, required: false,default:'https://i.pinimg.com/originals/b5/b4/1f/b5b41f6906dff7cb81a654ee63885eb3.jpg' })
    mediaUrl: string;

    @Prop({ type: mongoose.Schema.Types.String, required: false, default: 'active'})
    status: string;
}
export type StoryDocument = HydratedDocument<Story>;
export const StorySchema = SchemaFactory.createForClass(Story);
