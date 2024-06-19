import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Comment extends Document {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    userId: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true })
    postId: string;

    @Prop({ type: mongoose.Schema.Types.String, required: true })
    content: string;  
    
@Prop({
    type: [{
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        content: { type: mongoose.Schema.Types.String, required: true },
        createdAt: { type: mongoose.Schema.Types.Date, required: true }
    }],
    default: []
})
repliesComment: {
    _id: string;
    userId: string;
    content: string;
    createdAt: Date;
}[];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
