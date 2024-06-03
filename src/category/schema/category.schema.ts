import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {ICategory} from '../interface/category.interface';
import * as mongoose from 'mongoose';



@Schema({ collection: 'spendingcate'})
export class Category extends Document implements ICategory{
    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: mongoose.Schema.Types.String, required: false })
    description: string;

   @Prop({ type: mongoose.Schema.Types.String, enum: ['income', 'spend'], required: true })
    type: string;

    @Prop({ type: mongoose.Schema.Types.String, required: true })
    icon: string;
    
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
    userId: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, required: false})
    spendingLimitId: string;
}


export const CategorySchema = SchemaFactory.createForClass(Category);