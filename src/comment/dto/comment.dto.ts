import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsOptional,
  IsDate,
  IsDateString,
  IsBoolean,
  MaxLength,
} from 'class-validator';

export class CreateCommentDto {
    @ApiProperty({ example: 'asdjksopkdoasodo', description: ' content comment for post' })
    @IsString()
    @IsNotEmpty()
    content: string;
    
    @ApiProperty({ example: '112233', description: 'key for encrypt' })
    @IsString()
    @IsNotEmpty()
    postId: string;
}
export class UpdateCommentDto {
    @ApiProperty({ example: 'asdjksopkdoasodo', description: ' content comment for post' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    content: string;
}
export class ReplyCommentDto {
    @ApiProperty({ example: 'asdjksopkdoasodo', description: ' content comment for post' })
    @IsString()
    @IsNotEmpty()
    content: string;
}