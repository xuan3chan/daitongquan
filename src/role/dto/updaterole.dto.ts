import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  MinLength,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  Matches,
  IsNumber,
  ArrayNotEmpty,
  IsArray,
  ArrayMinSize,
  IsOptional,
} from 'class-validator';

export class UpdateRoleDto {
  @ApiProperty({
    description: 'Id of role ',
    example: '60e1d0b5d8f1f40015e4e8b0',
  })
  @IsString()
  @IsOptional()
  @MaxLength(40)
  _id: string;
  @ApiProperty({
    description: 'Name of role ',
    example: 'admin',
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Permission of role ',
    example: [0, 1, 2],
  })
  @IsNotEmpty()
  @IsArray()
  @IsOptional()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  permissionID: number[];
}
