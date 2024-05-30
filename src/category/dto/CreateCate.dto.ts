import { ApiProperty } from "@nestjs/swagger";
import { IsDate,MinLength, IsEmail, IsNotEmpty, IsString, MaxLength,Matches, IsNumber, ArrayNotEmpty, IsArray, ArrayMinSize } from "class-validator";

export class CreateCateDto {

    @ApiProperty({
        description: 'Name of spending category ',
        example: 'Food'
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Type of spending category ',
        example: 'income or spend'
    })
    type: string;
    @ApiProperty({
        description: 'Description of spending category ',
        example: 'Food or drink or salary or rent or ...'
    })
    @IsString()
    description: string;
    @ApiProperty({
        description: 'Icon of spending category ',
        example: 'Food'
    })
    icon: string;
}