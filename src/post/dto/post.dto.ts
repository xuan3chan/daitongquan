import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {

    @IsNotEmpty()
    @IsString()
    content: string;
}
export class UpdatePostDto {
    
        @IsString()
        @IsOptional()
        content: string;
    }