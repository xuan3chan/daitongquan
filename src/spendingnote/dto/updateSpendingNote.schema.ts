import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateSpendingNoteDto {

    @ApiProperty({
        description: 'Spending note id ',
        example: '64d123j231223221'
    })
    @IsMongoId()
    @IsNotEmpty()
    spendingNoteId: string

    @ApiProperty({
        description: 'Spending category id ',
        example: '64d123j231223221'
    })
    @IsMongoId()
    @IsOptional()
    spendingCateId: string

    @ApiProperty({
        description: 'Title of spending note ',
        example: 'Food'
    })
    @IsString()
    @IsOptional()
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
    @IsOptional()

    spendingDate: Date

    @ApiProperty({
        description: 'Payment method ',
        example: 'cash'
    })
    @IsString()
    @IsOptional()
    paymentMethod: string

    @ApiProperty({
        description: 'Amount of spending note ',
        example: 100
    })
    @IsNumber()
    @IsOptional()
    amount: number
}