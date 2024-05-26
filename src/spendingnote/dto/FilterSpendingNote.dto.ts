import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';

export class FilterSpendingNoteDto {
  @ApiProperty({
    description: 'Start date ',
    example: '2024-05-20'
  })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({
    description: 'End date ',
    example: '2024-05-28'
  })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsNotEmpty()
  endDate: Date;
}