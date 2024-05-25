import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsMongoId, ArrayNotEmpty } from "class-validator";

export class DeleteSpendingNoteDto {
    @ApiProperty({
        description: 'Spending note id ',
        example: ['64d123j231223221']
    })
    @IsArray()
    @ArrayNotEmpty()
    @IsMongoId({ each: true })
    spendingNoteId: string[]
}