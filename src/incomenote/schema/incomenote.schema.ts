import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document,HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';

@Schema({timestamps: true})
export class IncomeNote extends Document {

        @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
        cateId: string;
        
        @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
        userId: string;

        @Prop({ type: mongoose.Schema.Types.String, required: true })
        title: string;

        @Prop({ type: mongoose.Schema.Types.String})
        content: string;

        @Prop({ type: mongoose.Schema.Types.Date, required: true })
        incomeDate: Date;

        @Prop({ type: mongoose.Schema.Types.String,enum:['banking','cash'],defaut:'cash', required: true })
        method: string;

        @Prop({ type: mongoose.Schema.Types.Number })
        amount: number;
}
export type IncomeNoteDocument = HydratedDocument<IncomeNote>;
export const IncomeNoteSchema = SchemaFactory.createForClass(IncomeNote);
