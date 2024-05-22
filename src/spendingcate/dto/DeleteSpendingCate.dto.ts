import { ApiProperty } from "@nestjs/swagger";
import { IsDate,MinLength, IsEmail, IsNotEmpty, IsString, MaxLength,Matches, IsNumber, ArrayNotEmpty, IsArray, ArrayMinSize } from "class-validator";

export class DeleteSpendingCateDto {
    @ApiProperty({
        description: 'Spending category id ',
        example: '664daae343b870d4b192c660'
    })
    @IsString()
    @IsNotEmpty()
    spendingCateId: string;
}