import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Debt extends Document {
  @Prop({ type: mongoose.Schema.Types.String, required: true })
  debtor: string;

  @Prop({ type: mongoose.Schema.Types.String, required: true })
  creditor: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  userId: string;

  @Prop({ type: mongoose.Schema.Types.Number, required: true })
  amount: number;

  @Prop({ type: mongoose.Schema.Types.String, enum: ['lending_debt', 'borrowing_debt'], required: true })
  type: string;

  @Prop({ type: mongoose.Schema.Types.String, required: false })
  description: string;

  @Prop({ type: mongoose.Schema.Types.String, required: true, enum: ['active', 'paid', 'overdue'] })
  status: string;

  @Prop({ type: mongoose.Schema.Types.Date, required: false })
  dueDate: Date;

  @Prop({ type: mongoose.Schema.Types.Boolean, required: false })
  isEncrypted : boolean;


}

export type DebtDocument = HydratedDocument<Debt>;
export const DebtSchema = SchemaFactory.createForClass(Debt);
