import { ApiProperty } from "@nestjs/swagger";
import { IsDate,MinLength, IsEmail, IsNotEmpty, IsString, MaxLength,Matches, IsNumber, ArrayNotEmpty, IsArray, ArrayMinSize } from "class-validator";

export class CreateSpendingCateDto {

    @ApiProperty({
        description: 'Name of spending category ',
        example: 'Food'
    })
    @IsString()
    @IsNotEmpty()
    name: string;
    @ApiProperty({
        description: 'Description of spending category ',
        example: 'Food'
    })
    @IsString()
    description: string;
    @ApiProperty({
        description: 'Icon of spending category ',
        example: 'Food'
    })
    icon: string;
}