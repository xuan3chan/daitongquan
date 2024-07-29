import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateIncomeNoteDto {

    @ApiProperty({
        description: 'category id ',
        example: '64d123j231223221'
    })
    @IsMongoId()
    @IsNotEmpty()
    cateId: string

    @ApiProperty({
        description: 'Title of income note ',
        example: 'salary'
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
    date: Date

    @ApiProperty({
        description: 'Payment method ',
        example: 'cash'
    })
    @IsString()
    @IsNotEmpty()
    method: string

    @ApiProperty({
        description: 'Amount of spending note ',
        example: 100
    })
    @IsNumber()
    @IsNotEmpty()
    amount: number
}