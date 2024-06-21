import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateReportDto {
  @ApiProperty({
    example: '60f4b3b3b3b3b3b3b3b3b3b3',
    description: 'type report',
  })
  @IsString()
  @IsNotEmpty()
  reportType: string;
  @ApiProperty({
    example: 'nội  dung khiếm nhã',
    description: 'content report',
  })
  @IsString()
  @IsNotEmpty()
  reportContent: string;
}
