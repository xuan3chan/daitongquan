import { ApiProperty } from "@nestjs/swagger";
import { IsDate,MinLength, IsEmail, IsNotEmpty, IsString, MaxLength,Matches, IsNumber, ArrayNotEmpty, IsArray, ArrayMinSize, IsEnum, IsOptional } from "class-validator";

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
    @IsString()
    @IsNotEmpty()
    @IsEnum(['income', 'spend'])
    type: string;
    @ApiProperty({
        description: 'Description of spending category ',
        example: 'Food or drink or salary or rent or ...'
    })
    @IsString()
    @IsOptional()
    description: string;
    @ApiProperty({
        description: 'Icon of spending category ',
        example: 'Food'
    })
    icon: string;

    @ApiProperty({
        description: 'Color of spending category ',
        example: 'red'
    })
    @IsString()
    @IsNotEmpty()
    color: string;

    @ApiProperty({
        description: 'Status of spending category ',
        example: 'show or hidden'
    })
    @IsString()
    @IsNotEmpty()
    @IsEnum(['show', 'hidden'])
    status:string

}