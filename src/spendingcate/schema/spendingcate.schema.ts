import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {ISpendingCategory} from '../interface/spendingcate.interface';
import * as mongoose from 'mongoose';



@Schema({ collection: 'spendingcate'})
export class SpendingCate extends Document implements ISpendingCategory{
    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: mongoose.Schema.Types.String, required: false })
    description: string;

    @Prop({ type: mongoose.Schema.Types.String, required: true })
    icon: string;
    
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
    userId: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, required: false,default:null })
    spendingLimitId: string;
}


export const SpendingCateSchema = SchemaFactory.createForClass(SpendingCate);
