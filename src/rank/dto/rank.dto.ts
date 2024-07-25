import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateRankDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  @MinLength(1)
  rankName: string;

  @IsNotEmpty()
  @IsNumber()
  @MinLength(1)
  attendanceScore: number;

  @IsNotEmpty()
  @IsNumber()
  @MinLength(1)
  numberOfComment: number;

  @IsNotEmpty()
  @IsNumber()
  @MinLength(1)
  numberOfBlog: number;

  @IsNotEmpty()
  @IsNumber()
  @MinLength(1)
  numberOfLike: number;
}
