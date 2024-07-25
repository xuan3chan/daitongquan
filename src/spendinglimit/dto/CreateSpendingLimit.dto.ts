import { ApiProperty } from "@nestjs/swagger";
import {  IsNotEmpty, IsString, IsNumber, IsMongoId } from "class-validator";

export class CreateSpendingLimitDto {
    @ApiProperty({
        description: 'Spending category id ',
        example: '64d123j231223221'
    })
    @IsMongoId()
    @IsString()
    @IsNotEmpty()
    spendingCateId: string;
    
    @ApiProperty({
        description: 'Budget of spending category ',
        example: '1000'
    })
    @IsNumber()
    budget: number;
}