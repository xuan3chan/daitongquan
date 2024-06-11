import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class StatisticsSpendingDto {

  @ApiProperty({
    description: 'Filter by month or year',
    example: 'month'
  })
  @IsEnum(['month', 'year'])
  @IsNotEmpty()
  filterBy: string;

  @ApiProperty({
    description: 'Number of items',
    example: 6
  })
  @IsInt()
  @Type(() => Number) // Ensure the input is transformed to a number
  @IsNotEmpty()
  numberOfItem: number;

  @ApiProperty({
    description: 'Category ID',
    example: '60b4c5e5d1b7e30015c5f3d8',
    required: false // Make it clear in the documentation that this field is optional
  })
  @IsOptional()
  cateId?: string; // Use the optional property modifier
}
