import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRankDto {
  @IsNotEmpty()
  @IsString()
  rankName: string;

  @IsNotEmpty()
  @IsNumber()
  attendanceScore: number;

  @IsNotEmpty()
  @IsNumber()
  numberOfComment: number;

  @IsNotEmpty()
  @IsNumber()
  numberOfBlog: number;

  @IsNotEmpty()
  @IsNumber()
  numberOfLike: number;
}