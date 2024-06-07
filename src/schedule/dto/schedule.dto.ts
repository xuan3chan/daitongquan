import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString, ArrayNotEmpty, IsMongoId } from 'class-validator';

export class CreateScheduleDto {
  @ApiProperty({ description: 'Title of schedule', example: 'Meeting' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Location of schedule', example: 'Room 1' })
  @IsString()
  location: string;

  @ApiProperty({ description: 'Is all day schedule', example: true })
  @IsBoolean()
  isAllDay: boolean;

  @ApiProperty({ description: 'Start date time of schedule', example: '2021-07-16T00:00:00.000Z' })
  @IsDateString()
  startDateTime: Date;

  @ApiProperty({ description: 'End date time of schedule', example: '2021-07-16T23:59:59.000Z' })
  @IsDateString()
  endDateTime: Date;

  @ApiProperty({ description: 'Note of schedule', example: 'Please bring your laptop' })
  @IsString()
  note: string;

  @ApiProperty({ description: 'Is loop schedule', example: false })
  @IsBoolean()
  isLoop: boolean;
}

export class UpdateScheduleDto {
  @ApiProperty({ description: 'Title of schedule', example: 'Meeting' })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({ description: 'Location of schedule', example: 'Room 1' })
  @IsString()
  @IsOptional()
  location: string;

  @ApiProperty({ description: 'Is all day schedule', example: true })
  @IsBoolean()
  @IsOptional()
  isAllDay: boolean;

  @ApiProperty({ description: 'Start date time of schedule', example: '2021-07-16T00:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  startDateTime: Date;

  @ApiProperty({ description: 'End date time of schedule', example: '2021-07-16T23:59:59.000Z' })
  @IsDateString()
  @IsOptional()
  endDateTime: Date;

  @ApiProperty({ description: 'Note of schedule', example: 'Please bring your laptop' })
  @IsString()
  @IsOptional()
  note: string;

  @ApiProperty({ description: 'Is loop schedule', example: false })
  @IsBoolean()
  @IsOptional()
  isLoop: boolean;
}

export class DeleteManyDto {
  @ApiProperty({ description: 'List of schedule ids', example: ['60f0c5d0b5f5e3f2c8f7c4b7', '60f0c5d0b5f5e3f2c8f7c4b8'] })
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  scheduleIds: string[];
}
