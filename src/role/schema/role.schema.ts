import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document,HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';

@Schema()
export class Role extends Document {
  @Prop({ type: mongoose.Schema.Types.String, required: true,unique:true })
  name: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.Number, default: [] }] })
  permissionID: number[];
}
export type RoleDocument = HydratedDocument<Role>;
export const RoleSchema = SchemaFactory.createForClass(Role);