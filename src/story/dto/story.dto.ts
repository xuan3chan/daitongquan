import { ApiProperty } from "@nestjs/swagger";
import {  IsOptional, MaxLength } from "class-validator";

export class StoryDto {
    @ApiProperty({
        type: String,
        required: true,
        description: 'The title of the story',
    })
    @IsOptional()
    @MaxLength(100)
    title: string;
   
}