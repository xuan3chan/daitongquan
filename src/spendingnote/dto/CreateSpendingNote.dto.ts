import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateSpendingNoteDto {

    @ApiProperty({
        description: 'Spending category id ',
        example: '64d123j231223221'
    })
    @IsMongoId()
    @IsNotEmpty()
    spendingCateId: string

    @ApiProperty({
        description: 'Title of spending note ',
        example: 'Food'
    })
    @IsString()
    @IsNotEmpty()
    title: string

    @ApiProperty({
        description: 'Content of spending note ',
        example: 'Food'
    })
    @IsString()
    @IsOptional()
    content: string
    
    @ApiProperty({
        description: 'Spending date ',
        example: '2021-08-12'
    })
    @IsDateString()
    @IsNotEmpty()
    spendingDate: Date

    @ApiProperty({
        description: 'Payment method ',
        example: 'cash'
    })
    @IsString()
    @IsNotEmpty()
    paymentMethod: string

    @ApiProperty({
        description: 'Amount of spending note ',
        example: 100
    })
    @IsNumber()
    @IsNotEmpty()
    amount: number
}