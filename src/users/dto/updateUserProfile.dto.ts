import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  MinLength,
  IsEmail,
  IsString,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class UpdateUserProfileDto {
  @ApiProperty({
    description: 'firstname of user',
    example: 'Nguyên Lê Minh',
  })
  @IsString()
  @IsOptional()
  firstname: string;

  @ApiProperty({
    description: 'Full name of user ',
    example: 'Xuân',
  })
  @IsString()
  @IsOptional()
  lastname: string;

  @ApiProperty({
    description: 'Email of user ',
    example: 'xuancudai2km@gmail.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Date of birth of user ',
    example: '1999-12-31',
  })
  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  dateOfBirth?: Date;

  @ApiProperty({
    description: 'Email of user ',
    example: 'Duong Quan Ham, Phuong 5, Quan 6, TP.HCM',
  })
  @IsString()
  @MaxLength(150)
  @IsOptional()
  address?: string;

  @ApiProperty({
    description: 'male or female or other',
    example: 'male',
  })
  @IsOptional()
  gender?: string;

  @ApiProperty({
    description: 'Phone number  user ',
    example: '0123456789',
  })
  @IsString()
  @IsOptional()
  phone: string;

    @ApiProperty({
        description: 'Nickname of user ',
        example: 'Xuân',
    })
    @IsString()
    @IsOptional()
    nickname: string;

  @ApiProperty({
    description: 'Description of user ',
    example: 'I am a student',
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description: string;

  @ApiProperty({
    description: 'Hyperlink of user ',
    example: '["www.facebook.com","www.instagram.com"," www.twitter.com"]',
  })
  hyperlink: string[];
}
