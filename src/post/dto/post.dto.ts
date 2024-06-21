import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
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