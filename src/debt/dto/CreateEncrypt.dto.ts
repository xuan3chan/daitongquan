import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsOptional,
  IsDate,
  IsDateString,
  IsBoolean,
} from 'class-validator';

export class EnableEncryptDto {
  @ApiProperty({ example: '112233', description: 'key for encrypt' })
  @IsString()
    @IsNotEmpty()
    encryptKey: string;


}
