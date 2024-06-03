import { ApiProperty } from "@nestjs/swagger";
import { IsDate,MinLength, IsEmail, IsNotEmpty, IsString, MaxLength,Matches, IsNumber, ArrayNotEmpty, IsArray, ArrayMinSize, IsOptional } from "class-validator";

export class UpdateCateDto {

    @ApiProperty({
        description: 'Spending category id ',
        example: 'Food'
    })
    @IsString()
    @IsNotEmpty()
    CateId: string;
    
    @ApiProperty({
        description: 'Name of spending category ',
        example: 'Food'
    })
    @IsString()
    @IsOptional()
    name: string;
 
    @ApiProperty({
        description: 'Description of spending category ',
        example: 'Food'
    })
    @IsString()
    @IsOptional()
    description: string;
    
    @ApiProperty({
        description: 'Icon of spending category ',
        example: 'Food'
    })
    @IsOptional()
    icon: string;
}