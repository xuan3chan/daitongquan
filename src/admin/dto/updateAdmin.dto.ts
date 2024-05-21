import { ApiProperty } from '@nestjs/swagger';
import {
  MinLength,
  IsEmail,
  IsString,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class UpdateAdminDto {
@ApiProperty({
    description: 'Id of the admin',
    example: '60e1d0b5d8f1f40015e4e8b0',
    })
    @IsString()
    id:string;
  @ApiProperty({
    description: 'Name of the admin',
    example: 'Admin1',
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(30)
  fullname: string;

  @ApiProperty({
    description: 'Email of the admin',
    example: 'admin1@gmail.com',
  })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({
    description: 'Password of the admin',
    example: 'Admin@123',
  })
  @IsString()
  @IsOptional()
  @MinLength(6)
  @MaxLength(30)
  password: string;

  @ApiProperty({
    description: 'Role of the admin',
    example: ['66445e3ad052f97add5912c1', '66445e3ad052f97add5912c1'],
  })
  @IsOptional()
  roleId: string[];
}
