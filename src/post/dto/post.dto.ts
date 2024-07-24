import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsEnum, IsInt, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(1500)
  content: string;
}
export class UpdatePostDto {
  @IsString()
  @IsOptional()
  content: string;

  @IsString()
  @IsOptional()
  isShow: boolean;
}
export class deleteManyPostDto {

    @ApiProperty({
        description: 'post id ',
        example: ['64d123j231223221',
        '64d123j231223222',
        ]
    })
    @IsArray()
    @ArrayNotEmpty()
    @IsMongoId({ each: true })  
    postIds: string[];

}
export class PaginationDto {
  @ApiProperty({
    required: false,
    type: Number,
    description: 'Limit of items per page',
    default: 10,
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  @IsInt()
  limit?: number;

  @ApiProperty({
    required: false,
    type: Number,
    description: 'Page number',
    default: 1,
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  @IsInt()
  page?: number;
}
