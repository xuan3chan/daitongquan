import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {ISpendingCategory} from '../interface/seed.interface';


@Schema({ collection: 'spendingCate'})
export class Seed extends Document implements ISpendingCategory{
    @Prop({ type: String, required: true })
    name: string;
    @Prop({ type: String, required: false })
    description: string;
    @Prop({ type: String, required: true })
    userId: string;
}

export const SeedSchema = SchemaFactory.createForClass(Seed);
