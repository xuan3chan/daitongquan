import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
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

  @ApiProperty({ description: 'Calendars of schedule', example: 'calendar1' })
  calendars: string;

  @ApiProperty({ description: 'URL of schedule', example: 'https://example.com' })
  url: string;
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

  @ApiProperty({ description: 'Calendars of schedule', example: 'calendar1' })
  @IsString()
  @IsOptional()
  calendars: string;

  @ApiProperty({ description: 'URL of schedule', example: 'https://example.com' })
  @IsString()
  @IsOptional()
  url: string;
}

export class DeleteManyDto {
  @ApiProperty({ description: 'List of schedule ids', example: ['60f0c5d0b5f5e3f2c8f7c4b7', '60f0c5d0b5f5e3f2c8f7c4b8'] })
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  scheduleIds: string[];
}
export class ViewScheduleDto {
  @ApiProperty({ description: 'Title of schedule', example: ['type 1','type 2'] })
  @IsArray()
  @ArrayNotEmpty()
  @Transform(({ value }) => Array.isArray(value) ? value : [value], { toClassOnly: true })
  calendars: string[];
}

export class statusScheduleDto {
  @ApiProperty({ description: 'Status of schedule', example: 'readed or unread' })
  @IsString()
  @IsNotEmpty()
  status: string;
}
