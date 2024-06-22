import { ApiProperty } from "@nestjs/swagger";

export class DeleteManyIncomeDto {
  @ApiProperty({
    description: 'Array of ids to delete',
    example: ['id1', 'id2'],
  })
  incomeNoteIds: string[];
}