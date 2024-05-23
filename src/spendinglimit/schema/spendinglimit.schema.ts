import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document,HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';

@Schema({timestamps: true})
export class SpendingLimit extends Document {
    @Prop({ type: mongoose.Schema.Types.Number, required: true })
    budget: number;
}
export type SpendingLimitDocument = HydratedDocument<SpendingLimit>;
export const SpendingLimitSchema = SchemaFactory.createForClass(SpendingLimit);