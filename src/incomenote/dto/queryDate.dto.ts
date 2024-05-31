import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class QueryDateDto {
  //date
  @ApiProperty({
    description: 'start date ',
    example: '2024-01-12',
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;
  //date
  @ApiProperty({
    description: 'end date ',
    example: '2024-08-12',
  })
  @IsDateString()
  @IsNotEmpty()
  endDate: Date;
}
