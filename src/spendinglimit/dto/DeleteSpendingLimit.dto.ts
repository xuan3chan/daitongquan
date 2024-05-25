import { ApiProperty } from "@nestjs/swagger";
import { IsDate,MinLength, IsEmail, IsNotEmpty, IsString, MaxLength,Matches, IsNumber, ArrayNotEmpty, IsArray, ArrayMinSize, IsMongoId } from "class-validator";

export class DeleteSpendingLimitDto {
    @ApiProperty({
        description: 'Spending category id ',
        example: '64d123j231223221'
    })
    @IsMongoId()
    @IsString()
    @IsNotEmpty()
    spendingLimitId: string;
}