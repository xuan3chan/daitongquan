import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNumber, IsString } from 'class-validator';
import { Document } from 'mongoose';
import mongoose from 'mongoose';

@Schema()
export class Rank extends Document {
  @Prop({ type: mongoose.Schema.Types.String, required: true })
  @IsString()
  rankName: string;
  @Prop({ type: mongoose.Schema.Types.Number, required: true })
  rankScoreGoal: number;

  @Prop({
    type: {
      attendanceScore: Number,
      numberOfComment: Number,
      numberOfBlog: Number,
      numberOfLike: Number,
    },
    required: true,
  })
  score: {
    attendanceScore: number;
    numberOfComment: number;
    numberOfBlog: number;
    numberOfLike: number;
  };
  @Prop({ type: mongoose.Schema.Types.String, required: true })
  @IsString()
  rankIcon: string;

}

export const RankSchema = SchemaFactory.createForClass(Rank);
