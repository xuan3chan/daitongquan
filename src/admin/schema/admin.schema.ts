import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';
import { RoleDocument } from 'src/role/schema/role.schema';


@Schema({timestamps: true})
export class Admin extends Document {
  @Prop({ type: mongoose.Schema.Types.String, required: true })
  fullname: string;

  @Prop({ type: mongoose.Schema.Types.String, required: true })
  email: string;

  @Prop({ type: mongoose.Schema.Types.String, required: true })
  password: string;

  @Prop({ type: mongoose.Schema.Types.Boolean, default: false })
  isBlock: boolean;

  @Prop({ type: mongoose.Schema.Types.Array, ref: 'roles' }) // Changed type to ObjectId and ref to 'Role'
  role: RoleDocument[];

  @Prop({ type: mongoose.Schema.Types.String,default: null })
  refreshToken: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);