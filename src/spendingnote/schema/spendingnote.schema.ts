import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document,HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';

@Schema({timestamps: true})
export class SpendingNote extends Document {

        @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
        spendingCateId: string;
        
        @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
        userId: string;

        @Prop({ type: mongoose.Schema.Types.String, required: true })
        title: string;

        @Prop({ type: mongoose.Schema.Types.String})
        content: string;

        @Prop({ type: mongoose.Schema.Types.Date, required: true })
        spendingDate: Date;

        @Prop({ type: mongoose.Schema.Types.String,enum:['banking','cash'],defaut:'cash', required: true })
        paymentMethod: string;

        @Prop({ type: mongoose.Schema.Types.Number })
        amount: number;
}
export type SpendingNoteDocument = HydratedDocument<SpendingNote>;
export const SpendingNoteSchema = SchemaFactory.createForClass(SpendingNote);
