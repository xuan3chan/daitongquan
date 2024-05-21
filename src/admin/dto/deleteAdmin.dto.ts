import { ApiProperty } from '@nestjs/swagger';
import {
  MinLength,
  IsEmail,
  IsString,
  MaxLength,
  IsOptional,
  IsMongoId,
} from 'class-validator';

export class DeleteAdminDto {
  @ApiProperty({
    description: 'Id of the admin',
    example: '60e1d0b5d8f1f40015e4e8b0',
  })
  @IsString()
  @IsMongoId()
  id: string;
}
