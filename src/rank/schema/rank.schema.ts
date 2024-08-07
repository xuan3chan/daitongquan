import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';

@Schema()
export class Rank extends Document {
  @Prop({ type: mongoose.Schema.Types.String, required: true })
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
  rankIcon: string;

  @Prop({ type: [mongoose.Schema.Types.String] })
  action: string[];

}

export const RankSchema = SchemaFactory.createForClass(Rank);
